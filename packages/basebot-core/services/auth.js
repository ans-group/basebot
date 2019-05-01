import mapValues from 'lodash/mapValues'
import logger from './logger'
/*********************************************************
 * Register any basebot compatible auth handlers here.
 * For example, we are using the microsoft auth handler below
 *******************************************************/

const handlers = { }

export default mapValues(handlers, handler => handler(logger))
