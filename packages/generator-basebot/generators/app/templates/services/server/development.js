/****************************************
 * Handles setting up the bot webserver
 * including localtunnel when applicable
 ***************************************/

import localtunnel from 'localtunnel'
import logger from '../logger'
import app from './production'

const debug = logger('webserver', 'debug')
const info = logger('webserver', 'info')
const error = logger('webserver', 'error')

/* start localtunnel */
startTunnel()

export default app

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
