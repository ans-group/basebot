import logger from '../services/logger'

const debug = logger('messages', 'debug')

export default controller => {
    controller.middleware.receive.use(async function(bot, message, next) {
        debug(message)
        next()
    })
    controller.middleware.send.use(async function(bot, message, next) {
        debug(message)
        next()
    })
}
