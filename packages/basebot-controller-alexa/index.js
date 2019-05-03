import { core } from 'botkit'
import request from 'request'
import AlexaResponse from 'alexa-response'

const AlexaBot = (configuration) => {
  // Create a core botkit bot
  const alexaBot = core(configuration || {})

  alexaBot.on('sessionStart', (bot, message) => {
    bot.send({
      text: configuration.welcomeMessage || 'Hi, how can I help?',
      user: message.user,
      channel: message.channel,
      to: message.user,
      send: message.raw_message.send,
      question: true
    })
  })

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
      const { text, question, progressive, send, typing } = message
      if (progressive || typing) {
        request({
          method: 'POST',
          url: `${message.alexa.apiEndpoint}/v1/directives`,
          auth: {
            bearer: message.alexa.apiAccessToken
          },
          json: true,
          body: {
            header: {
              requestId: message.channel
            },
            directive: {
              type: 'VoicePlayer.Speak',
              speech: text
            }
          }
        })
      } else {
        const reply = question
          ? AlexaResponse.ask(text)
          : AlexaResponse.say(text)
        send(reply.build())
      }
    }

    bot.reply = (src, resp, cb) => {
      const message = typeof (resp) == 'string'
        ? { text: resp }
        : resp

      message.user = src.user
      message.channel = src.channel
      message.to = src.user
      message.send = src.send
      message.alexa = src.alexa

      bot.send(message, cb)
    }

    return bot
  })

  // set up a web route for receiving incoming requests from alexa
  alexaBot.createWebhookEndpoints = (webserver, bot) => {
    // notify the user that the webhook is running
    alexaBot.log(`** Serving webhook endpoint for Alexa Platform at: http://${alexaBot.config.hostname}:${alexaBot.config.port}/alexa/receive`)
    webserver.post('/alexa/receive', ({ body }, res) => {
      alexaBot.debug('GOT A MESSAGE HOOK')

      const normalizeTypes = {
        LaunchRequest: 'sessionStart',
        IntentRequest: 'message_received',
        SessionEndedRequest: 'conversationEnded'
      }

      // parse the request from alexa
      const { session, request, context } = body
      let payload = {
        text: request.intent ? request.intent.name : '',
        type: normalizeTypes[request.type] || request.type,
        intent: request.intent,
        slots: request.intent && request.intent.slots,
        user: session && session.user && session.user.userId,
        channel: request && request.requestId,
        timestamp: request.timestamp,
        platform: 'alexa',
        alexa: context && context.System,
        send: (...args) => res.send(...args)
      }
      // notify botkit we received an event
      alexaBot.ingest(bot, payload, res)
    })

    return alexaBot
  }

  return alexaBot
}

export default AlexaBot
