import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'

export default ({ channels, middleware, logger, skills }) => {

  const info = logger('main', 'info')
  // activate middleware
  const groupedMiddleware = {
    hear: middleware.filter(mw => mw.hear).map(mw => ({
      handler: mw.hear,
      triggers: mw.triggers || [],
      channels: mw.channels
    }))
  } 
  const types = ['receive', 'send', 'heard', 'capture']
  types.forEach(applyMiddleware)

  function applyMiddleware(type) {
    groupedMiddleware[type] = []
    middleware.forEach(mw => {
      if (mw[type]) {
        groupedMiddleware[type].push({
          handler: mw[type],
          triggers: mw.triggers || [],
          channels: mw.channels
        })
      }
    })
    forEach(channels, ({ controller, name }) => {
      groupedMiddleware[type]
        .filter(item => !item.channels || item.channels.includes(name))
        .forEach(item => controller.middleware[type].use(item.handler))
    })
  }
  // activate the bots skills
  info('Setting up skills')
  forEach(skills, definitions => definitions.forEach(applySkill))

  info('done')
  // default response
  forEach(channels, ({ controller }) => {
    controller.hears('.*', 'message_received', defaultResponse)
  })

  function defaultResponse(bot, message) {
    bot.reply(message, "Sorry, didn't catch that")
  }

  function applySkill(skill) {
    forEach(channels, skill.event ? mapEvents : mapHears)
    function mapHears({ controller, name }) {
      const trigger = skill.intent || skill.pattern
      const hearMiddleware = groupedMiddleware.hear || []
      const filteredHandlers = hearMiddleware.filter(filterHandlers(name, skill.intent ? 'intent' : 'pattern'))
      controller.hears(
        trigger,
        'message_received',
        ...filteredHandlers.map(({ handler }) => handler),
        (bot, message) => skill.handler(bot, message, controller)
      )
    }

    function mapEvents({ controller, name }) {
      const trigger = skill.event
      controller.on(trigger, (bot, message) => skill.handler(bot, message, controller))
    }
  }
  function filterHandlers(channelName, type) {
    return handler => {
      const channelValid = !handler.channels || handler.channels.includes(channelName)
      const typeValid = !handler.triggers || handler.triggers.includes(type)
      return channelValid && typeValid
    }
  }
}
