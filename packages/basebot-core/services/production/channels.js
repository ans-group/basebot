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
import alexabot from 'alexa-botkit'
import { storage, logger } from '../'

const info = logger('channels', 'info')

const botOptions = { storage}

const web = {
  controller: anywhere(botOptions),
  options: {},
  listen() {
    this.controller.openSocketServer(this.controller.webserver)
    this.controller.startTicking()
    info('Web bot online')
  }
}
const alexa = {
  controller: alexabot(botOptions),
  options: {},
  listen() {
    const bot = this.controller.spawn({})
    controller.createWebhookEndpoints(this.controller.webserver, bot)
    this.controller.startTicking()
    info('Alexa bot online')
  }
}

export { web, alexa }
