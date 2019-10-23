/****************************************
 * Handles setting up the bot webserver
 * including localtunnel when applicable
 ***************************************/
import forEach from 'lodash/forEach'
import path from 'path'
import http from 'http'
import express from 'express'

export default ({ logger }) => {
  const error = logger('webserver', 'error')
  const info = logger('webserver', 'info')

  const app = express()
  const server = http.createServer(app)

  /* set up various express things */
  app
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(express.static(path.join(__dirname, '../../public')))

  /* health check endpoint */
  app.get('/status', (req, res) => {
    res.sendStatus(200)
  })

  app.on('error', onError)
  app.on('listening', onListening)

  return { server, app }

  /**
    * Event listener for HTTP server "error" event.
  */
  function onError(err) {
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
  function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`
    info(`Listening on ${bind}`)
  }
}


