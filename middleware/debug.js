import Debug from 'debug'

const debug = Debug('basebot:debug')

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
