import { LexRuntime } from 'aws-sdk'

const lex = new LexRuntime({
  region: process.env.AWS_REGION
})

export default (logger) => {
  const error = logger('middleware:lex', 'error')
  const debug = logger('middleware:lex', 'debug')

  if (!process.env.AWS_REGION || !process.env.LEX_BOT_NAME || !process.env.LEX_BOT_ALIAS) {
    error('AWS_REGION, LEX_BOT_NAME and LEX_BOT_ALIAS must be set')
  }

  return {
    receive,
  heard}

  function receive (bot, message, next) {
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
      botAlias: process.env.LEX_BOT_ALIAS,
      botName: process.env.LEX_BOT_NAME,
      inputText: message.text,
      // FIXME - alexa provides a UID with > 200 characters - this will be massively truncated as a result and could even lead to unintentional session hijacking
      userId: message.user.substr(0, 100),
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
            message.intent === data.intentName
          }
          next()
        }
      })
    } else {
      next()
    }
  }

  function heard (bot, message, next) {
    console.log('----------------------')
    console.log(bot)
    console.log('----------------------')
    if (message.lex && message.lex.dialogState === 'Fulfilled' && message.lex.intentName !== null) {
      return bot.reply(message, message.lex.response)
    }
    console.log('****')
    next()
  }
}
