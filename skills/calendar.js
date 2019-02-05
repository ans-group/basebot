import { getEvents } from '../services/microsoft/calendar'
import { getUserToken } from '../services/microsoft/auth'

export default [
    {
        hears: 'Calendar.Next', // LUIS Intent
        response: async function(bot, message, controller) {
            bot.reply(message, {
                text: 'Hang on a sec...',
                typing: true
            })
            const credentials = await getUserToken(message.user, controller)
            if (!credentials.userExists) {
                return bot.reply(message, 'Something went wrong, sorry 🙁')
            }
            if (!credentials.tokenExists) {
                return controller.trigger('login', [bot, message, controller])
            }
            const events = await getEvents(credentials.token)
            if (events.success) {
                if (events.attachments.length) {
                    bot.reply(message, {
                        text: "Here's your next event:",
                        attachments: events.attachments
                    })
                } else {
                    bot.reply(message, 'You have no upcoming events')
                }
            }
        }
    }
]
