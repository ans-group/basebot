import { LexRuntime } from 'aws-sdk'

const lex = new LexRuntime({
  region: process.env.AWS_REGION
})

export default (logger) => {
  const error = logger('middleware:lex', 'error')
  const debug = logger('middleware:lex', 'debug')

  if (!process.env.AWS_REGION || !process.env.BOT_NAME) {
    error('AWS_REGION and BOT_NAME must be set')
  }

  return {
    receive,
    heard
  }

  function receive(bot, message, next) {
    if (!message.text) {
      next()
      return
    }

    if (message.is_echo || message.type === 'self_message' || message.alexa) {
      next()
      return
    }
    debug(`userId: ${message.user}`)
    var params = {
      botAlias: process.env.BOT_NAME || 'Basebot',
      botName: process.env.BOT_NAME || 'Basebot',
      inputText: message.text,
      // FIXME - alexa provides a UID with > 200 characters - this will be massively truncated as a result and could even lead to unintentional session hijacking
      userId: message.user && message.user.substr(0, 100),
      requestAttributes: message.requestAttributes,
      sessionAttributes: message.sessionAttributes
    }
    if (message.text) {
      var request = lex.postText(params, function (err, data) {
        if (err) {
          next(err)
        } else {
          message.lex = {
            intent: data.intentName,
            slots: data.slots,
            session: data.sessionAttributes,
            response: data.message,
            dialogState: data.dialogState,
            slotToElicit: data.slotToElicit
          }
          debug('response received from Lex:', message.lex)
          if (data.intentName) {
            //TODO implement a custom hears function  instead of replacing the text prop
            message.text = data.intentName
            message.intent === data.intentName
          }
          next()
        }
      })
    } else {
      next()
    }
  }

  function heard(bot, message, next) {
    if (message.lex && message.lex.dialogState === 'Fulfilled' && message.lex.intentName !== null) {
      return bot.reply(message, { text: message.lex.response, intent: message.lex.intent })
    }
    next()
  }
}
