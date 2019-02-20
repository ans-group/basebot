import './config'
import logger from './services/logger'
import Botkit from 'botkit'
import luis from 'botkit-middleware-luis'
import webserver from './services/webserver'
import http from './services/http'
import storage from './services/storage/azureTables'
import * as skills from './skills/*'
import * as middleware from './middleware/*'

const info = logger('main', 'info')
const error = logger('main', 'error')

const botOptions = {
// debug: !!process.env.DEBUG,
    storage }

const luisOptions = {
    serviceUri: process.env.LUIS_URI,
    minThreshold: 0.1
}

// Create the Botkit controller
const controller = Botkit.botframeworkbot(botOptions)
const bot = controller.spawn({
    appId: process.env.MS_APP_ID,
    appPassword: process.env.MS_APP_PASSWORD,
    require_delivery: false
})
// create the webserver
webserver(controller, bot)
    .then(app => http(app, controller))
    .catch(err => error(err))

// Start the bot
controller.startTicking()

// activate middleware
Object.values(middleware).forEach(fn => fn(controller))
// add LUIS middleware
controller.middleware.receive.use(luis.middleware.receive(luisOptions))

// activate the bots skills
Object.values(skills).forEach(definitions => {
    definitions.forEach(skill => {
        if (skill.hears) {
            if (skill.bypassLuis) {
                controller.hears(skill.hears, 'message_received', (bot, message) => skill.response(bot, message, controller))
            } else {
                controller.hears(skill.hears, 'message_received', luis.middleware.hereIntent(), (bot, message) => skill.response(bot, message, controller))
            }
        } else if (skill.on) {
            controller.on(skill.on, (bot, message) => skill.response(bot, message, controller))
        }
    })
})

// default response
controller.hears('.*', 'message_received', (bot, message) => {
    bot.reply(message, `Didn't catch that, sorry`)
})

info('bot online')
