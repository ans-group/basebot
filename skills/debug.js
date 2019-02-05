import { notify } from '../services/outgoing'
import Debug from 'debug'

const error = Debug('basebot:skills:debug:error')

export default [
    {
        hears: 'debug:attachments',
        bypassLuis: true,
        response(bot, message) {
            bot.reply(message, {
                text: 'here are some attachments',
                attachments: [
                    {
                        title: 'Gluten free Potato Cheese Sauce',
                        thumb: 'https://dummyimage.com/75x75/0074c6/ffffff.png&text=Feb%2006',
                        text: 'This is a delicious sauce for any occasion.',
                        color: '#ff8817',
                        image: 'https://www.edamam.com/web-img/86f/86fe08fb473e457428e529d580036f57',
                        buttons: [{
                            text: 'View Recipe',
                            url: 'http://healthiersteps.com/gluten-free-potato-cheese-sauce/'
                        }, {
                            text: 'Another Button',
                            url: 'http://healthiersteps.com/gluten-free-potato-cheese-sauce/'
                        }],
                        values: [{ type: 'icon', key: 'timer', value: '20 mins' }, { type: 'icon', key: 'people', value: 'Serves 4' }] }
                ]
            })
        }
    },
    {
        hears: 'debug:typing',
        bypassLuis: true,
        response: async function(bot, message) {
            bot.startConversation(message, (err, convo) => {
                if (err) return error(err)
                convo.say({
                    text: 'Hmm lemme just think for a second',
                    typing: true
                })
                convo.say({
                    text: "Okay, I'm done!",
                    delay: 5000
                })
            })
        }
    },
    {
        hears: 'debug:intro',
        bypassLuis: true,
        response: async function(bot, message, controller) {
            controller.trigger('introduce', [bot, message, controller])
        }
    },
    {
        hears: 'debug:notify',
        bypassLuis: true,
        response: async function(bot, message) {
            bot.startConversation(message, (err, convo) => {
                if (err) return error(err)
                convo.say({
                    text: 'Close your app now'
                })
                setTimeout(() => {
                    notify({ uid: message.user, text: "Hey, it's me!", trigger: 'debug:triggerFromNotification' })
                }, 5000)
            })
        }
    },
    {
        on: 'debug:triggerFromNotification',
        response(bot, message) {
            bot.reply(message, "Hey, it's me!")
        }
    },
    {
        hears: 'debug:suggestions',
        bypassLuis: true,
        response(bot, message) {
            bot.reply(message, {
                text: "Here's some suggestions",
                quick_replies: [
                    {
                        title: 'Hello',
                        payload: 'Hello'
                    },
                    {
                        title: 'Test',
                        payload: 'Test'
                    },
                    {
                        title: 'Card',
                        payload: 'Card'
                    },
                    {
                        title: 'It is time to go now',
                        payload: 'Time to go'
                    },
                    {
                        title: 'Goodbye',
                        payload: 'Adios'
                    }
                ]
            })
        }
    }
]
