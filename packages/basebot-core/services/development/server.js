/****************************************
 * Handles setting up the bot webserver
 * including localtunnel when applicable
 ***************************************/

import localtunnel from 'localtunnel'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpack from 'webpack'
import { logger } from '../'
import config from '../../webpack.config'
import webserver from '../production/server'

const compiler = webpack(config)

const info = logger('webserver', 'info')

/* use various webpack middlewares */
webserver
  .use(webpackHotMiddleware(compiler))
  .use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }))

/* start localtunnel */
startTunnel()

export default webserver

function startTunnel() {
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
