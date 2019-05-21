import '@babel/polyfill'
import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'
import { logger, channels, middleware, server } from './services'
import * as skills from './skills'

const info = logger('main', 'info')
// start server
server.listen(process.env.PORT || 3000)

// handle intents
forEach(channels, ({ controller }) => {
  controller.middleware.receive.use(handleIntents)
})

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

info('bot online')

function defaultResponse (bot, message) {
  bot.reply(message, "Sorry, didn't catch that")
}

function applySkill (skill) {
  forEach(channels, skill.event ? mapEvents : mapHears)
  function mapHears ({ controller }, channelName) {
    const trigger = skill.intent || skill.pattern
    const hearMiddleware = groupedMiddleware.hear || []
    const filteredHandlers = hearMiddleware.filter(filterHandlers(channelName))
    controller.hears(
      trigger,
      'message_received',
      ...filteredHandlers,
      (bot, message) => skill.handler(bot, message, controller)
    )
  }

  function mapEvents ({ controller }, channelName) {
    const trigger = skill.event
    controller.on(trigger, (bot, message) => skill.handler(bot, message, controller))
  }
}

function applyMiddleware (type) {
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

function filterHandlers (channelName) {
  return handler => {
    const channelValid = !handler.channels || handler.channels.includes(channelName)
    const typeValid = !handler.triggers || handler.channels.includes(channelName)
    return channelValid && typeValid
  }
}

function handleIntents (bot, message, next) {
  if (message.intent) {
    message.text = typeof message.intent === 'string'
      ? message.intent
      : message.intent.name
  }
  if (message.entities) {
    for (var e = 0; e < message.entities.length; e++) {
      convo.setVar(message.entities[e].name, message.entities[e].value)
    }
  }
  next()
}
