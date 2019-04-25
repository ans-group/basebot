import './loadEnv'
import 'source-map-support/register'
import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'
import { logger, channels, middleware, server } from './services'
import * as skills from './skills/*'

const info = logger('main', 'info')

// start server
server.listen(process.env.PORT || 3000)

// activate middleware
const groupedMiddleware = groupBy(middleware, 'type')
const types = ['receive', 'send', 'heard', 'capture']
types.forEach(applyMiddleware)

// activate the bots skills
info('Setting up skills')
forEach(skills, definitions => definitions.forEach(applySkill))

// default response
controller.hears('.*', 'message_received', defaultResponse)

info('bot online')

/*
  Webpack hot module reloading
*/
if (typeof (module.hot) !== 'undefined') {
  module.hot.accept() // eslint-disable-line no-undef
}

function defaultResponse(bot, message) {
  bot.reply(message, "Sorry, didn't catch that")
}

function applySkill(skill) {
  const trigger = skill.intent || skill.event || skill.pattern
  const hearMiddleware = groupedMiddleware.hear || []
  forEach((channels, channelName), ({ controller }) => {
    const filteredHandlers = hearMiddleware.filter(filterHandlers(channelName))
    controller.hears(
      trigger,
      'message_received',
      ...filteredHandlers,
      (bot, message) => skill.handler(bot, message, controller)
    )
  })
}

function applyMiddleware(type) {
  if (
    !groupedMiddleware['type'] ||
    !['receive', 'send', 'heard', 'capture'].includes(type)
  ) return
  forEach(channels, (channel, channelName) => {
    groupedMiddleware['type']
      .filter(item => !item.channels || item.channels.includes(channelName))
      .forEach(item => controller.middleware['type'].use(item.handler))
  })
}

function filterHandlers(channelName) {
  return handler => {
    const channelValid = !handler.channels || handler.channels.includes(channelName)
    const typeValid = !handler.triggers || handler.channels.includes(channelName)
    return channelValid && typeValid
  }
}
