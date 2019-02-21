import logger from './logger'
import localtunnel from 'localtunnel'

const info = logger('webserver', 'info')

export default (controller, bot) => new Promise((resolve, reject) => {
  controller.setupWebserver(process.env.PORT || 3000, (err, webserver) => {
    if (err) {
      reject(err)
    }
    if (process.env.NODE_ENV !== 'test') {
      controller.createWebhookEndpoints(webserver, bot, () => {
        info('server online')
        if (process.env.USE_LT_SUBDOMAIN) {
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
      })
    }
    resolve(webserver)
  })
})
