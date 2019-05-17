import startCase from 'lodash/startCase'

export default [
  {
    intent: 'Social.Greeting',
    handler: async function(bot, message, controller) {
      controller.trigger('conversationUpdate', [bot, message, controller])
    }
  },
  {
    pattern: 'Nice to meet you!',
    handler(bot, message) {
      bot.reply(message, 'Thanks 😁 you too!')
    }
  },
  {
    pattern: ['what is my name', 'who am i'],
    handler: async function(bot, message, controller) {
      const user = await controller.storage.users.get(message.user)
      if (user && user.name) {
        bot.reply(message, `You're ${user.name}! I'd never forget you 😁`)
      } else {
        bot.reply(message, 'Not sure.. just say "Call me ..." to tell me your name')
      }
    }
  },
  {
    pattern: ['my name is ([A-Za-z\\s]*)', 'call me ([A-Za-z\\s]*)'],
    handler(bot, message, controller) {
      const name = startCase(message.match[1])
      debug(`User told me their name is ${name}`)
      controller.storage.users.save({ id: message.user, name }).catch(err => error(err))
      if (name) {
        bot.reply(message, `Great, I'll call you ${name} from now on 😊`)
      }
    }
  }
]
