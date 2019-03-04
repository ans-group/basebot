import './config'
import Botkit from 'botkit'
import storage from './services/storage/azureTables'
import startBot from './bot'

const botOptions = { storage }

// Create the Botkit controller
const controller = Botkit.botframeworkbot(botOptions)

startBot(controller)
