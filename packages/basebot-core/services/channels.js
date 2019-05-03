/*********************************************************
 * Customise your channels below, you can use any basebot.
 * or botkit compatible controller.
 * Some useful controllers available from Botkit (below):
 * * botframeworkbot - MS Bot Framework
 * * slackbot - Slack
 * * teamsbot - MS Teams
 * * facebookbot - Facebook Messenger
 * * twiliosmsbot - SMS (via Twilio)
 * * anywhere - Web, Apps etc
 *******************************************************/
import { anywhere } from 'botkit'
import storage from './storage'
import logger from './logger'
import alexabot from 'basebot-controller-alexa'

const info = logger('channels', 'info')

const botOptions = { storage}

const channels = {
  web: {
    controller: anywhere(botOptions),
    options: {},
    listen(controller) {
      controller.openSocketServer(controller.webserver)
      controller.startTicking()
      info('Web bot online')
    }
  },
  alexa: {
    controller: alexabot(botOptions),
    options: {},
    listen(controller) {
      const bot = controller.spawn({})
      controller.createWebhookEndpoints(controller.webserver, bot)
      controller.startTicking()
      info('Alexa bot online')
    }
  }
}

export default channels
