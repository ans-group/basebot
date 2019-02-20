import Debug from 'debug'
import _ from 'lodash'

const log = Debug('basebot:skills:onboarding:log')
const error = Debug('basebot:skills:onboarding:error')

export default [
    {
        on: 'conversationUpdate',
        response: async function(bot, message, controller) {
            const user = await controller.storage.users.get(message.user)
            log(`User = `, user)
            if (user && user.name) {
                bot.reply(message, { text: `Hey ${user.name} 👋` })
                setTimeout(() => controller.trigger('askAboutWeight', [bot, message, controller]), 1000)
            } else {
                controller.trigger('introduce', [bot, message, controller])
            }
        }
    },
    {
        on: 'introduce',
        response(bot, message, controller) {
            bot.startConversation(message, (err, convo) => {
                if (err) return error(err)
                convo.say({ text: `Hey there! 👋 \n\nI'm ${process.env.BOT_NAME || 'Basebot'}.`, typing: true })
                convo.ask(`What's your name?'`, (response, convo) => {
                    const name = _.startCase(response.text)
                    convo.setVar('name', name)
                    controller.storage.users.save({ id: message.user, name }).catch(err => error(err))
                    convo.say({ text: `Nice to meet you {{vars.name}}!` })
                    convo.next()
                })
                convo.next()
                convo.addMessage(`Didn't catch that. If you ever want to tell me again just say "my name is ..." or "call me ..." 👍`, 'on_timeout')
            })
        }
    },
    {
        hears: ['my name is ([A-Za-z\\s]*)', 'call me ([A-Za-z\\s]*)'],
        bypassLuis: true,
        response(bot, message, controller) {
            const name = _.startCase(message.match[1])
            log(`User told me their name is ${name}`)
            controller.storage.users.save({ id: message.user, name }).catch(err => error(err))
            if (name) {
                bot.reply(message, `Great, I'll call you ${name} from now on 😊`)
            }
        }
    }
]
