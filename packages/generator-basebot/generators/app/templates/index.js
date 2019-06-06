import '@babel/polyfill'
import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'
import { logger, channels, middleware, server } from './services'
import * as skills from './skills'

const info = logger('main', 'info')
// start server
if (process.env.NODE_ENV !== 'test') {
  server.listen(process.env.PORT || 3000)
}

// activate middleware
const groupedMiddleware = groupBy(middleware, 'type')
const types = ['receive', 'send', 'heard', 'capture']
types.forEach(applyMiddleware)

// activate the bots skills
info('Setting up skills')
forEach(skills, definitions => definitions.forEach(applySkill))

// default response
forEach(channels, ({ controller }) => {
  controller.hears('.*', 'message_received', defaultResponse)
})

export default channels

function defaultResponse(bot, message) {
  bot.reply(message, "Sorry, didn't catch that")
}

function applySkill(skill) {
  forEach(channels, skill.event ? mapEvents : mapHears)
  function mapHears({ controller }, channelName) {
    const trigger = skill.intent || skill.pattern
    const hearMiddleware = groupedMiddleware.hear || []
    const filteredHandlers = hearMiddleware.filter(filterHandlers(channelName, skill.intent ? 'intent' : 'pattern'))
    controller.hears(
      trigger,
      'message_received',
      ...filteredHandlers.map(({ handler }) => handler),
      (bot, message) => skill.handler(bot, message, controller)
    )
  }

  function mapEvents({ controller }, channelName) {
    const trigger = skill.event
    controller.on(trigger, (bot, message) => skill.handler(bot, message, controller))
  }
}

function applyMiddleware(type) {
  if (
    !groupedMiddleware[type] ||
    !['receive', 'send', 'heard', 'capture'].includes(type)
  ) return
  forEach(channels, ({ controller }, channelName) => {
    groupedMiddleware[type]
      .filter(item => !item.channels || item.channels.includes(channelName))
      .forEach(item => controller.middleware[type].use(item.handler))
  })
}

function filterHandlers(channelName, type) {
  return handler => {
    const channelValid = !handler.channels || handler.channels.includes(channelName)
    const typeValid = !handler.triggers || handler.triggers.includes(type)
    return channelValid && typeValid
  }
}
