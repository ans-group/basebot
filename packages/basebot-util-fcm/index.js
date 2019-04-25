import ns from 'node-schedule'
import messaging from './firebase'

const notify = async function({ userId, storage, payload }) {
  try {
    if (!storage) return console.warn('Storage is required')
    const user = await storage.users.get(userId)
    if (user && user.pushToken) {
      const notification = {
        notification: {
          body: payload.text
        },
        data: payload,
        token: user.pushToken
      }
      const status = messaging.send(notification)
      return true
    } else {
      return console.warn(`Can't send notification to user ${uid}: no user or push token found`)
    }
  } catch (err) {
    console.error(err)
  }
}

const schedule = (at, notification) => {
  ns.scheduleJob(at, () => notify(notification))
}

export { schedule, notify }
