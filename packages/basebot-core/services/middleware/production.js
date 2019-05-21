/*********************************************************
 * Use any botkit compatible middleware here.
 *******************************************************/
import logger from '../logger'
import storage from '../storage'
import lex from 'basebot-middleware-lex'
import { heard as alexaMiddleware } from 'basebot-controller-alexa'

export default [

  {
    type: 'receive',
    handler: lex(logger).receive
  },
  {
    type: 'heard',
    handler: lex(logger).heard
  },
  {
    type: 'heard',
    handler: alexaMiddleware(storage)
  }

]
