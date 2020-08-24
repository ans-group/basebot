import { promisify } from 'util'
import Botkit from 'botkit/lib/CoreBot'
import WebSocket from 'ws'

function WebBot(configuration) {
  const controller = Botkit(configuration || {})
  const error = configuration.logger
    ? configuration.logger('controller:web', 'error')
    : console.error
  const debug = configuration.logger
    ? configuration.logger('controller:web', 'debug')
    : console.log

  if (controller.config.typingDelayFactor === undefined) {
    controller.config.typingDelayFactor = 1
  }

  controller.excludeFromConversations(['hello', 'welcome_back', 'reconnect', 'rating_received'])

  controller.openSocketServer = (server, wsconfig = {}) => {
    // create the socket server along side the existing webserver.
    const wss = new WebSocket.Server({
      server,
      ...wsconfig,
      clientTracking: true
    })

    // Expose the web socket server object to the controller so it can be used later.
    controller.wss = wss

    function noop() { }

    function heartbeat() {
      this.isAlive = true
    }

    wss.on('connection', function connection(ws) {
      console.log('connected')
      // search through all the convos, if a bot matches, update its ws
      const bot = controller.spawn()
      bot.ws = ws
      bot.connected = true
      ws.isAlive = true
      ws.on('pong', heartbeat.bind(ws))

      ws.on('message', async function incoming(message) {
        if (message === 'ping') {
          return ws.send(JSON.stringify({ type: 'heartbeat', event: 'pong' }))
        }
        try {
          const parsedMessage = JSON.parse(message)
          controller.ingest(bot, parsedMessage, ws)
        } catch (e) {
          const alert = [
            'Error parsing incoming message from websocket.',
            'Message must be JSON, and should be in the format documented here:',
            'https://botkit.ai/docs/readme-web.html#message-objects'
          ]
          error(alert.join('\n'))
          error(e)
        }
      })

      ws.on('error', (err) => error('Websocket Error: ', err))

      ws.on('close', () => {
        bot.connected = false
      })
    })

    const interval = setInterval(() => {
      wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate()

        ws.isAlive = false
        ws.ping(noop)
      })
    }, 30000)
  }

  controller.middleware.ingest.use((bot, message, reply_channel, next) => {
    /*
     * this could be a message from the WebSocket
     * or it might be coming from a webhook.
     * configure the bot appropriately so the reply goes to the right place!
     */
    if (!bot.ws) {
      bot.http_response = reply_channel
    }

    /*
     * look for an existing conversation for this user/channel combo
     * why not just pass in message? because we only care if there is a conversation  ongoing
     * and we might be dealing with "silent" message that would not otherwise match a conversation
     */
    bot.findConversation({
      user: message.user,
      channel: message.channel
    }, convo => {
      if (convo) {
        if (bot.ws) {
          // replace the websocket connection
          convo.task.bot.ws = bot.ws
          convo.task.bot.connected = true
          if (message.type == 'hello' || message.type == 'welcome_back') {
            message.type = 'reconnect'
          }
        } else {
          /*
           * replace the reply channel in the active conversation
           * this is the one that gets used to send the actual reply
           */
          convo.task.bot.http_response = bot.http_response
        }
      }
      next()
    })
  })

  controller.middleware.categorize.use((bot, message, next) => {
    if (message.type == 'message') {
      message.type = 'message_received'
    }

    next()
  })

  // simple message clone because its already in the right format!
  controller.middleware.format.use((bot, message, platform_message, next) => {
    for (const key in message) {
      platform_message[key] = message[key]
    }
    if (!platform_message.type) {
      platform_message.type = 'message'
    }
    next()
  })

  controller.defineBot((botkit, config) => {
    const bot = {
      type: 'socket',
      botkit,
      config: config || {},
      utterances: botkit.utterances
    }

    bot.startConversation = function(message, cb) {
      botkit.startConversation(this, message, cb)
    }

    bot.createConversation = function(message, cb) {
      botkit.createConversation(this, message, cb)
    }

    bot.send = (message, cb) => {
      if (bot.connected || !bot.ws) {
        if (bot.ws) {
          try {
            if (bot.ws && bot.ws.readyState === WebSocket.OPEN) {
              bot.ws.send(JSON.stringify(message), err => {
                if (cb) {
                  return cb(err, message)
                }
              })
            } else {
              error('Cannot send message to closed socket')
            }
          } catch (err) {
            return cb(err)
          }
        } else {
          try {
            bot.http_response.json(message)
            if (cb) {
              cb(null, message)
            }
          } catch (err) {
            if (cb) {
              return cb(err, message)
            } else {
              error('ERROR SENDING', err)
            }
          }
        }
      } else {
        setTimeout(() => {
          bot.send(message, cb)
        }, 3000)
      }
    }

    bot.startTyping = () => {
      if (bot.connected) {
        try {
          if (bot.ws && bot.ws.readyState === WebSocket.OPEN) {
            bot.ws.send(JSON.stringify({
              type: 'typing'
            }), err => {
              if (err) {
                error(`startTyping failed: ${err.message}`)
              }
            })
          } else {
            error('Socket closed! Cannot send message')
          }
        } catch (err) {
          error('startTyping failed: ', err)
        }
      }
    }

    bot.typingDelay = ({ typingDelay, text }) => new Promise(resolve => {
      let typingLength = 0
      if (typingDelay) {
        typingLength = typingDelay
      } else {
        let textLength
        if (text) {
          textLength = text.length
        } else {
          textLength = 80 // default attachment text length
        }

        const avgWPM = 150
        const avgCPM = avgWPM * 7

        typingLength = Math.min(Math.floor(textLength / (avgCPM / 60)) * 1000, 2000) * controller.config.typingDelayFactor
      }

      setTimeout(() => {
        resolve()
      }, typingLength)
    })

    bot.replyWithTyping = ({ user, channel }, resp, cb) => {
      bot.startTyping()
      bot.typingDelay(resp).then(() => {
        if (typeof (resp) === 'string') {
          resp = {
            text: resp
          }
        }

        resp.user = user
        resp.channel = channel
        resp.to = user

        bot.say(resp, cb)
      })
    }

    bot.reply = (src, resp, cb) => {
      if (typeof (resp) === 'string') {
        resp = {
          text: resp
        }
      }
      if(('NODE_ENV' in process.env) && process.env.NODE_ENV === 'development'){
        console.log('RESPONSE IS')
        console.log(resp)
      }

      resp.user = src.user
      resp.channel = src.channel
      resp.to = src.user

      if (resp.typing || resp.typingDelay || controller.config.replyWithTyping) {
        bot.replyWithTyping(src, resp, cb)
      } else {
        bot.say(resp, cb)
      }
    }

    bot.findConversation = ({ user, channel, type }, cb) => {
      botkit.debug('CUSTOM FIND CONVO', user, channel)
      for (let t = 0; t < botkit.tasks.length; t++) {
        for (let c = 0; c < botkit.tasks[t].convos.length; c++) {
          if (
            botkit.tasks[t].convos[c].isActive() &&
            botkit.tasks[t].convos[c].source_message.user == user &&
            !botkit.excludedEvents.includes(type) // this type of message should not be included
          ) {
            botkit.debug('FOUND EXISTING CONVO!')
            cb(botkit.tasks[t].convos[c])
            return
          }
        }
      }

      cb()
    }

    /*
     * return info about the specific instance of this bot
     * including identity information, and any other info that is relevant
     */
    bot.getInstanceInfo = cb => new Promise(resolve => {
      const instance = {
        identity: {},
        team: {}
      }

      if (bot.identity) {
        instance.identity.name = bot.identity.name
        instance.identity.id = bot.identity.id

        instance.team.name = bot.identity.name
        instance.team.url = bot.identity.root_url
        instance.team.id = bot.identity.name
      } else {
        instance.identity.name = 'Botkit Web'
        instance.identity.id = 'web'
      }

      if (cb) cb(null, instance)
      resolve(instance)
    })

    bot.getMessageUser = (message, cb) => new Promise(resolve => {
      // normalize this into what botkit wants to see
      controller.storage.users.get(message.user, (err, user) => {
        if (!user) {
          user = {
            id: message.user,
            name: 'Unknown',
            attributes: {}
          }
        }

        const profile = {
          id: user.id,
          username: user.name,
          first_name: user.attributes.first_name || '',
          last_name: user.attributes.last_name || '',
          full_name: user.attributes.full_name || '',
          email: user.attributes.email, // may be blank
          gender: user.attributes.gender, // no source for this info
          timezone_offset: user.attributes.timezone_offset,
          timezone: user.attributes.timezone
        }

        if (cb) {
          cb(null, profile)
        }
        resolve(profile)
      })
    })

    return bot
  })

  controller.handleWebhookPayload = ({ body }, res) => {
    const payload = body
    controller.ingest(controller.spawn({}), payload, res)
  }

  // change the speed of typing a reply in a conversation
  controller.setTypingDelayFactor = delayFactor => {
    controller.config.typingDelayFactor = delayFactor
  }

  // Substantially shorten the delay for processing messages in conversations
  controller.setTickDelay(10)

  return controller
}

export default ({ storage, logger }) => {
  const controller = WebBot({ storage })
  const info = logger('channels:web', 'info')
  return {
    controller,
    name: 'web',
    start({ server }) {
      controller.openSocketServer(server, { path: '/socket' })
      controller.startTicking()
      info('Web bot online')
    }
  }
}
