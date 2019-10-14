import uuid from 'uuid/v1'
import ua from 'universal-analytics'

const gaID = process.env.GOOGLE_ANALYTICS_ACCOUNT_ID

export const models = {
  ratings: {
    hash: 'userId',
    secondary: 'intentName'
  },
  ratings_daily_aggregation: {
    hash: 'intentName',
    secondary: 'date'
  },
  ratings_weekly_aggregation: {
    hash: 'intentName',
    secondary: 'date'
  },
  ratings_monthly_aggregation: {
    hash: 'intentName',
    secondary: 'date'
  },
  ratings_yearly_aggregation: {
    hash: 'intentName',
    secondary: 'date'
  }
}

export const ratingFlagMiddleware = ({ logger, storage }) => async(bot, message, next) => {
  logger = logger || (() => console.log)
  const error = logger('middleware:ratings', 'error')
  if (message.intent) {
    storage.responses.get(message.intent)
      .then(response => {
        if (response && !response.nonFunctional) {
          message.rateMe = message.intent
        }
        next()
      })
      .catch(err => {
        error(err)
        next()
      })
  } else {
    next()
  }
}

export default ({ logger, storage }) => async(bot, message, next) => {
  logger = logger || (() => console.log)
  const debug = logger('middleware:ratings', 'debug')

  debug('sending intent trigger event')
  if (gaID) {
    ua(accountId, message.user).event({
      ec: 'Rating',
      ea: message.intent,
      ev: message.value === 'positive' ? 1 : -1
    }).send()
  }

  storage.ratings.save({
    _id: uuid(),
    userId: message.user,
    value: message.value,
    date: Date.now(),
    intentName: message.intent
  })

  // roll up ratings
  aggregateRatings(storage, message)

  next()
}

async function aggregateRatings(storage, message) {
  const periods = [
    { table: storage.ratings_daily_aggregation, date: new Date().setHours(0, 0, 0, 0) },
    { table: storage.ratings_weekly_aggregation, date: getStartOfWeek() },
    { table: storage.ratings_monthly_aggregation, date: getStartOfMonth() },
    { table: storage.ratings_yearly_aggregation, date: getStartOfYear() }
  ]
  periods.forEach(period => handleAggregation(period.table, period.date, message))
}

async function handleAggregation(table, date, message) {
  const currentItem = await table.get(message.intent, date)
  const currentPositive = currentItem ? currentItem.positive : 0
  const currentNegative = currentItem ? currentItem.negative : 0
  table.save({
    date,
    intentName: message.intent,
    total: currentItem ? currentItem.total + 1 : 1,
    positive: message.value === 'positive' ? currentPositive + 1 : currentPositive,
    negative: message.value === 'negative' ? currentNegative + 1 : currentNegative
  })
}

function getStartOfWeek(d = new Date()) {
  d = new Date(d)
  var day = d.getDay()
  var diff = d.getDate() - day + (day == 0 ? -6 : 1)
  return new Date(d.setDate(diff)).setHours(0, 0, 0, 0)
}

function getStartOfMonth(d = new Date()) {
  return new Date(d.setDate(1)).setHours(0, 0, 0, 0)
}

function getStartOfYear(d = new Date()) {
  return new Date(d.setMonth(0, 1)).setHours(0, 0, 0, 0)
}
