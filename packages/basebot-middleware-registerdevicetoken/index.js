const cachedTokens = {}

export default (logger, storage) => async function(bot, message, next) {
  if (message.pushToken && message.user && message.pushToken !== cachedTokens[message.user]) {
    debug('Saving push token for user: ', message.user)
    const userId = message.user
    const pushToken = message.pushToken
    cachedTokens[userId] = pushToken
    controller.storage.users.save({ id: userId, pushToken })
  }
  next()
}
