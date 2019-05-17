import { LexRuntime } from 'aws-sdk'

const lex = new LexRuntime({
  region: process.env.AWS_REGION
})

export default (logger) => {
  if (!process.env.AWS_REGION || !process.env.LEX_BOT_NAME || !process.env.LEX_BOT_ALIAS) throw new Error('AWS_REGION, LEX_BOT_NAME and LEX_BOT_ALIAS must be set')
  const debug = logger('middleware:lex', 'debug')
  return {
    receive,
  heard}

  function receive (bot, message, next) {
    if (!message.text) {
      next()
      return
    }

    if (message.is_echo || message.type === 'self_message') {
      next()
      return
    }
    var params = {
      botAlias: process.env.LEX_BOT_ALIAS,
      botName: process.env.LEX_BOT_NAME,
      inputText: message.text,
      userId: message.user,
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
            message.intent === intentName
          }
          next()
        }
      })
    } else {
      next()
    }
  }

  function heard (bot, message, next) {
    if (message.lex && message.lex.dialogState === 'Fulfilled' && message.lex.intentName !== null) {
      return bot.reply(message, message.lex.message)
    }
    next()
  }
}
