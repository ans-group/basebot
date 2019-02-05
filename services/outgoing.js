import ns from 'node-schedule'
import { messaging, getSingle } from './firebase'
import Debug from 'debug'

const error = Debug('basebot:outgoing:error')

/**
 * notify
 * @param {Object} OutgoingMessage {uid: String, text: String}
 */
const notify = async function({ uid, text, trigger }) {
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

    messaging.send(notification).catch(err => error(err))
}

const schedule = (at, message) => {
    ns.scheduleJob(at, () => notify(message))
}

export { schedule, notify }
