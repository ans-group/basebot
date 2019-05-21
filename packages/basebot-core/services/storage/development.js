/*********************************************************
 * Use any basebot/botkit compatible storage here.
 * Just change 'basebot-storage-firestore' to the package name
 * (e.g. basebot-storage-azuretables)
 *******************************************************/

import storage from 'basebot-storage-dynamodb'
import logger from '../logger'

export default storage(logger)
