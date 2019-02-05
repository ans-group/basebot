import Debug from 'debug'

const debug = Debug('basebot:middleware:registerPushTokens:debug')

// cache tokens in-mem to save needless duplicate db writes
const cachedTokens = {}

// FIXME: we have the potential for a race condition here as this middleware
// depends on the auth middleware being run first - which is purley based on
// alphabetical loading currently and thus, is quire unintuitive/brittle
export default controller => {
    controller.middleware.receive.use(async function(bot, message, next) {
        if (message.pushToken && message.user && message.pushToken !== cachedTokens[message.user]) {
            debug('Saving push token for user: ', message.user)
            const uid = message.user
            const pushToken = message.pushToken
            cachedTokens[uid] = pushToken
            controller.storage.users.save({ id: uid, pushToken })
        }
        next()
    })
}
