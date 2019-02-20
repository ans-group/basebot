import ns from 'node-schedule'
import { messaging, getSingle } from './firebase'
import logger from './logger'

const debug = logger('outgoing', 'debug')
const error = logger('outgoing', 'error')

/**
 * notify
 * @param {Object} OutgoingMessage {uid: String, text: String}
 */
const notify = async function(params) {
    debug(`sending notification: ${params}`)
    const { uid, text, trigger } = params
    const user = await getSingle('users', uid)
    const deviceToken = user.pushToken
    if (!deviceToken) return
    const notification = {
        notification: {
            body: text
        },
        data: {
            text,
            trigger,
            click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        token: deviceToken
    }
    try {
        const status = messaging.send(notification)
        debug(`Notification sent: ${status}`)
    } catch (err) {
        error(err)
    }
}

const schedule = (at, message) => {
    ns.scheduleJob(at, () => notify(message))
}

export { schedule, notify }
