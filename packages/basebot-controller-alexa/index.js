import { core } from 'botkit'
import express from 'express'
import bodyParser from 'body-parser'
import AlexaResponse from 'alexa-response'
import AlexaRequest from 'alexa-req'

const AlexaBot = (configuration) => {
  // Create a core botkit bot
  const alexaBot = core(configuration || {})

  // customize the bot definition, which will be used when new connections
  // spawn!
  alexaBot.defineBot((botkit, config) => {
    const bot = {
      type: 'alexa',
      botkit,
      config: config || {},
      utterances: botkit.utterances
    }

    bot.startConversation = (message, cb) => {
      botkit.startConversation(this, message, cb)
    }

    bot.createConversation = (message, cb) => {
      botkit.createConversation(this, message, cb)
    }

    bot.findConversation = (message, cb) => {
      botkit.debug('CUSTOM FIND CONVO', message.user, message.channel)
      /* eslint-disable no-plusplus */
      for (let t = 0; t < botkit.tasks.length; t++) {
        for (let c = 0; c < botkit.tasks[t].convos.length; c++) {
          const con = botkit.tasks[t].convos[c]
          if (con.isActive() && con.source_message.user === message.user) {
            botkit.debug('FOUND EXISTING CONVO!')
            cb(botkit.tasks[t].convos[c])
            return
          }
        }
      /* eslint-enable */
      }
      cb()
    }

    bot.send = (message) => {
      const { resp } = message
      const isString = typeof resp === 'string'
      message.src.response.send((isString && AlexaResponse.say(resp) || resp).build())
    }

    bot.reply = (src, resp, cb) => {
      const msg = { src, resp }

      bot.say(msg, cb)
    }

    return bot
  })

  // set up a web route for receiving incoming requests from alexa
  alexaBot.createWebhookEndpoints = (webserver, bot) => {
    // notify the user that the webhook is running
    alexaBot.log(`** Serving webhook endpoint for Alexa Platform at: http://${alexaBot.config.hostname}:${alexaBot.config.port}/alexa/receive`)
    webserver.post('/alexa/receive', (req, res) => {
      alexaBot.debug('GOT A MESSAGE HOOK')

      // parse the request from alexa
      const alexa = new AlexaRequest(req.body)
      const message = {
        text: alexa.getIntentName(),
        user: alexa.getUserId(),
        channel: alexa.getUserId(),
        timestamp: alexa.getTimeStamp(),
        response: res,
        alexa }

      // notify botkit we received a message
      alexaBot.receiveMessage(bot, message)
    })

    return alexaBot
  }

  alexaBot.setupWebserver = (port, cb) => {
    if (!port) {
      throw new Error('Cannot start webserver without a port')
    }

    alexaBot.config.port = port

    alexaBot.webserver = express()
    alexaBot.webserver.use(bodyParser.json())
    alexaBot.webserver.use(bodyParser.urlencoded({ extended: true }))

    alexaBot.webserver.listen(alexaBot.config.port, alexaBot.config.hostname, () => {
      alexaBot.log(`** Starting Alexa webserver on port ${alexaBot.config.port}`)
      if (cb) { cb(null, alexaBot.webserver) }
    })

    return alexaBot
  }

  return alexaBot
}

export default AlexaBot
