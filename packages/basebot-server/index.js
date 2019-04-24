import './loadEnv'
import Botkit from 'botkit'
// import storage from './services/storage/azureTables'
import startBot from './bot'
import alexa from 'alexa-botkit'

const botOptions = { }

// Create the Botkit controller
// const controller = Botkit.botframeworkbot(botOptions)
const controller = alexa({})

startBot(controller)
