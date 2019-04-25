/****************************************
 * Handles setting up the bot webserver
 * including localtunnel when applicable
 ***************************************/
import forEach from 'lodash/forEach'
import express from 'express'
import register from 'basebot-util-signup'
import { storage, logger, channels, auth } from '../'

const error = logger('webserver', 'error')
const info = logger('webserver', 'info')

const webserver = express()

/* set up various express things */
webserver
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(express.static(path.join(__dirname, 'public')))

/* set up a /register endpoints for UUID generation */
webserver.get('/register', register(storage))

/* register controller webhook endpoints */
forEach(channels, ({ controller, registerEndpoints }) => {
  controller.webserver = webserver
  controller.listen()
})

/* register auth endpoints */
forEach(auth, handler => {
  handler.registerEndpoints(webserver, storage)
})

webserver.on('error', onError)
webserver.on('listening', onListening)

export default webserver

/**
  * Event listener for HTTP server "error" event.
*/
function onError (err) {
  if (err.syscall !== 'listen') {
    throw err
  }
  const port = process.env.PORT || 3000

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (err.code) {
    case 'EACCES':
      error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw err
  }
}

/**
 * Event listener for HTTP server "listening" event.
*/
function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`
  info(`Listening on ${bind}`)
}
