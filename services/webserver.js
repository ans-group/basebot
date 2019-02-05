import dbg from 'debug'
import localtunnel from 'localtunnel'

const log = dbg('basebot:webserver:log')

export default (controller, bot) => new Promise((resolve, reject) => {
    controller.setupWebserver(process.env.PORT || 3000, (err, webserver) => {
        if (err) {
            reject(err)
        }
        controller.createWebhookEndpoints(webserver, bot, () => {
            log('server online')
            if (process.env.USE_LT_SUBDOMAIN) {
                const tunnel = localtunnel(process.env.PORT || 3000, { subdomain: process.env.USE_LT_SUBDOMAIN }, (err, tunnel) => {
                    if (err) {
                        throw err
                    }
                    /* eslint-disable */
                    console.log(`Your bot is available on the web at the following URL: ${tunnel.url}/botframework/receive`)
                    /* eslint-enable */
                })

                tunnel.on('close', () => {
                    /* eslint-disable */
                    console.log('Your bot is no longer available on the web at the localtunnnel.me URL.')
                    /* eslint-enable */
                    process.exit()
                })
            }
        })
        resolve(webserver)
    })
})
