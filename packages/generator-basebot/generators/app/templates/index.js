import '@babel/polyfill'
import { init } from 'basebot-core'
import config from './basebot.config'
import * as skills from './skills'

// start the app
init({
  config,
  skills
})
