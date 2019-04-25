import productionMiddleware from '../production/middleware'
import { logger } from '../'

const logMiddleware = logger => async function(bot, message, next) {
  const debug = logger('messages', 'debug')
  debug(message)
  next()
}

export default [
  {
    type: 'receive',
    handler: logMiddleware(logger)
  },
  {
    type: 'send',
    handler: logMiddleware(logger)
  }
].concat(productionMiddleware)
