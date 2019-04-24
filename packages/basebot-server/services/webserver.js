/****************************************
 * Handles setting up the bot webserver
 * including localtunnel when applicable
 ***************************************/

import logger from './logger'
import localtunnel from 'localtunnel'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpack from 'webpack'
import config from '../webpack.config'

const compiler = webpack(config)

const error = logger('webserver', 'error')
const info = logger('webserver', 'info')

const startTunnel = () => {
  if (!process.env.USE_LT_SUBDOMAIN) return
  const tunnel = localtunnel(process.env.PORT || 3000, { subdomain: process.env.USE_LT_SUBDOMAIN }, (err, tunnel) => {
    if (err) {
      throw err
    }
    /* eslint-disable */
    info(`Your bot is available on the web at the following URL: ${tunnel.url}/botframework/receive`)
  /* eslint-enable */
  })

  tunnel.on('close', () => {
    /* eslint-disable */
    info('Your bot is no longer available on the web at the localtunnnel.me URL.')
    /* eslint-enable */
    process.exit()
  })
}

export default (controller, bot) => new Promise((resolve, reject) => {
  controller.setupWebserver(process.env.PORT || 3000, (err, webserver) => {
    if (err) {
      error(err)
      reject(err)
    }
    console.log(webserver.get)

    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
      }))
    }

    if (process.env.NODE_ENV === 'test') return resolve(webserver)

    controller.createWebhookEndpoints(webserver, bot)

    startTunnel()

    resolve(webserver)
  })
})
