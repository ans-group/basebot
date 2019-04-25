import mapValues from 'lodash/mapValues'
import { logger } from '../'
/*********************************************************
 * Register any basebot compatible auth handlers here.
 * For example, we are using the microsoft auth handler below
 *******************************************************/

import microsoft from 'basebot-auth-microsoft'

const handlers = { microsoft }

export default mapValues(handlers, handler => handler(logger))
