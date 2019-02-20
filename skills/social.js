export default [
    {
        hears: 'Social.Greeting',
        response: async function(bot, message, controller) {
            controller.trigger('conversationUpdate', [bot, message, controller])
        }
    },
    {
        hears: 'Nice to meet you!',
        bypassLuis: true,
        response(bot, message) {
            bot.reply(message, 'Thanks 😁 you too!')
        }
    },
    {
        hears: ['what is my name', 'who am i'],
        bypassLuis: true,
        response: async function(bot, message, controller) {
            const user = await controller.storage.users.get(message.user)
            if (user && user.name) {
                bot.reply(message, `You're ${user.name}! I'd never forget you 😁`)
            } else {
                bot.reply(message, 'Not sure.. just say "Call me ..." to tell me your name')
            }
        }
    }
]
