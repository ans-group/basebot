import startCase from 'lodash/startCase'
import { logger } from '../services'

const debug = logger('skills:onboarding', 'debug')
const error = logger('skills:onboarding', 'error')

export default [
  {
    event: 'conversationUpdate',
    handler: async function(bot, message, controller) {
      const user = await controller.storage.users.get(message.user)
      debug(`User = `, user)
      if (user && user.name) {
        bot.reply(message, { text: `Hey ${user.name} 👋` })
      } else {
        controller.trigger('introduce', [bot, message, controller])
      }
    }
  },
  {
    event: 'introduce',
    handler(bot, message, controller) {
      bot.startConversation(message, (err, convo) => {
        if (err) return error(err)
        convo.say({ text: `Hey there! 👋 \n\nI'm ${process.env.BOT_NAME || 'Basebot'}.`, typing: true })
        convo.ask(`What's your name?'`, (response, convo) => {
          const name = startCase(response.text)
          convo.setVar('name', name)
          controller.storage.users.save({ id: message.user, name }).catch(err => error(err))
          convo.say({ text: `Nice to meet you {{vars.name}}!` })
          convo.next()
        })
        convo.next()
        convo.addMessage(`Didn't catch that. If you ever want to tell me again just say "my name is ..." or "call me ..." 👍`, 'on_timeout')
      })
    }
  }
]
