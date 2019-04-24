import ns from 'node-schedule'
import { messaging } from './firebase'
import logger from './logger'

const debug = logger('outgoing', 'debug')
const error = logger('outgoing', 'error')

/**
 * notify
 * @param {Object} OutgoingMessage {uid: String, text: String, controller: botkitController, trigger: botkitTrigger}
 */
const notify = async function (params) {
  try {
    debug(`sending notification:`, params)
    const { uid, text, trigger, controller } = params
    if (!controller) return warn('Please provide a controller')
    const user = await controller.storage.users.get(uid)
    if (user && user.pushToken) {
      const notification = {
        notification: {
          body: text
        },
        data: {
          text,
          trigger,
          click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        token: user.pushToken
      }
      const status = messaging.send(notification)
      return debug(`Notification sent: `, status)
    } else {
      return error(`Can't send notification to user ${uid}: no user or push token found`)
    }
  } catch (err) {
    error(err)
  }
}

const schedule = (at, message) => {
  ns.scheduleJob(at, () => notify(message))
}

export { schedule, notify }
