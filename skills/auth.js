import { getAuthUrl } from '../services/microsoft/auth'
// import Debug from 'debug'

// const error = Debug('basebot:skills:auth:error')

export default [
    {
        hears: 'login',
        bypassLuis: true,
        response(bot, message, controller) {
            controller.trigger('login', [bot, message, controller])
        }
    },
    {
        on: 'login',
        response(bot, message, controller) {
            const url = getAuthUrl(message.user)
            bot.reply(message, {
                text: 'Please log in',
                attachments: [
                    {
                        buttons: [{
                            text: 'Login', url }
                        ]
                    }
                ]
            })
        }
    },
    {
        on: 'loginSuccessful',
        response(bot, message, controller) {
            bot.reply(message, "Great!, you're now logged in 😊")
        }
    },
    {
        on: 'loginUnsuccessful',
        response(bot, message, controller) {
            bot.reply(message, 'Oh no!\n\nLooks like something went wrong 🙁\n\nTry again in a few minutes')
        }
    }
]
