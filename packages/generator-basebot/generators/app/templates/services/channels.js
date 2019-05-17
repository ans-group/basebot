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
import botkit from 'botkit'
import storage from './storage'
import logger from './logger'
<% imports.forEach(function(value) { -%>
import <%- value.designation; %> from '<%- value.packageName; -%>'
<% }); %>

const info = logger('channels', 'info')
const error = logger('channels', 'error')

const botOptions = { storage }

const channels = {
  <% if (channels.includes('Direct (Web, Apps etc)')) { %>
  direct: {
    controller: botkit.anywhere(botOptions),
    listen(controller) {
      controller.httpserver = controller.webserver
      controller.webserver.post('/botkit/receive', function (req, res) {
        res.status(200)
        controller.handleWebhookPayload(req, res)
      })
      controller.openSocketServer(controller.webserver, {
        clientTracking: true,
        port: process.env.WS_PORT || 3001
      })
      controller.startTicking()
      info('Web bot online')
    }
  },
  <% }; %>
  <% if (channels.includes('Microsoft Bot Service')) { %>
  botservice: {
    controller: botkit.botframeworkbot(botOptions),
    listen(controller) {
      [
        'MS_APP_ID',
        'MS_APP_PASSWORD'
      ].forEach(envVar => {
        if (!process.env[envVar]) {
            throw new Error(`${envVar} is required`)
        }
      })
      controller.spawn({
        appId: process.env.MS_APP_ID,
        appPassword: process.env.MS_APP_PASSWORD,
        require_delivery: false
      })
      controller.startTicking()
      info('Botservice bot online')
    }
  },
  <% }; %>
  <% if (channels.includes('Slack')) { %>
  slack: {
    controller: botkit.slackbot({ storage }),
    listen(controller) {
      [
        'SLACK_CLIENT_ID',
        'SLACK_CLIENT_SECRET',
        'SLACK_REDIRECT_URI',
        'SLACK_SCOPES'
      ].forEach(envVar => {
        if (!process.env[envVar]) {
            throw new Error(`${ envVar } is required`)
        }
      })
      controller
        .configureSlackApp({
          clientId: process.env.SLACK_CLIENT_ID,
          clientSecret: process.env.SLACK_CLIENT_SECRET,
          redirectUri: process.env.SLACK_REDIRECT_URI,
          scopes: process.env.SLACK_SCOPES.split(',')
        })
        .createHomepageEndpoint(controller.webserver)
        .createOauthEndpoints(controller.webserver, err => error(err))
        .createWebhookEndpoints(controller.webserver)
      info('Slack bot online')
    }
  },
  <% }; %>
  <% if (channels.includes('Facebook Messenger')) { %>
  messenger: {
    controller: botkit.facebookbot(botOptions),
    listen(controller) {
      [
        'MESSENGER_ACCESS_TOKEN',
        'MESSENGER_VERIFY_TOKEN'
      ].forEach(envVar => {
        if (!process.env[envVar]) {
            throw new Error(`${ envVar } is required`)
        }
      })
      const bot = controller.spawn({
        access_token: process.env.MESSENGER_ACCESS_TOKEN,
        verify_token: process.env.MESSENGER_VERIFY_TOKEN
      })
      controller.createWebhookEndpoints(controller.webserver, bot, err => {
        if (err) return error(err)
        info('Messenger bot online')
      })
    }
  },
  <% }; %>
  <% if (channels.includes('SMS (using Twilio)')) { %>
  sms: {
    controller: botkit.twiliosmsbot(botOptions),
    listen(controller) {
      [
        'TWILIO_ACCOUNT_SID',
        'TWILIO_AUTH_TOKEN',
        'TWILIO_NUMBER'
      ].forEach(envVar => {
        if (!process.env[envVar]) {
            throw new Error(`${ envVar } is required`)
        }
      })
      const bot = controller.spawn({
        account_sid: process.env.TWILIO_ACCOUNT_SID,
        auth_token: process.env.TWILIO_AUTH_TOKEN,
        twilio_number: process.env.TWILIO_NUMBER
      })
      controller.createWebhookEndpoints(controller.webserver, bot, err => {
        if (err) return error(err)
        info('Twilio SMS bot online')
      })
    }
  },
  <% }; %>
  <% if (channels.includes('Amazon Alexa (voice)')) { %>
  alexa: {
    controller: alexabot(botOptions),
    options: {},
    listen(controller) {
      const bot = controller.spawn({})
      controller.createWebhookEndpoints(controller.webserver, bot)
      controller.startTicking()
      info('Alexa bot online')
    }
  },
  <% }; %>
}

export default channels
