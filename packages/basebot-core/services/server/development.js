/****************************************
 * Handles setting up the bot webserver
 * including localtunnel when applicable
 ***************************************/

import localtunnel from 'localtunnel'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotClient from 'webpack-hot-client'
import webpack from 'webpack'
import logger from '../logger'
import config from '../../webpack.config'
import webserver from './production'

const compiler = webpack(config)

const debug = logger('webserver', 'debug')
const info = logger('webserver', 'info')
const error = logger('webserver', 'error')

/* use various webpack middlewares */
const { server } = webpackHotClient(compiler, {})

server.on('listening', () => {
  webserver.use(webpackDevMiddleware(compiler, {
    logger: {info,debug,error},
    noInfo: true,
    hot: true,
    publicPath: config.output.publicPath,
    stats: 'errors-only',
    historyApiFallback: true
  }))
})

/* start localtunnel */
startTunnel()

export default webserver

function startTunnel () {
  if (!process.env.USE_LT_SUBDOMAIN) return
  const tunnel = localtunnel(process.env.PORT || 3000, { subdomain: process.env.USE_LT_SUBDOMAIN }, (err, tunnel) => {
    if (err) {
      error(err)
      throw err
    }
    /* eslint-disable */
    info(`Your bot is available on the web at the following URL: ${tunnel.url}`)
  /* eslint-enable */
  })

  tunnel.on('close', () => {
    /* eslint-disable */
    info('Your bot is no longer available on the web at the localtunnnel.me URL.')
    /* eslint-enable */
    process.exit()
  })
}
