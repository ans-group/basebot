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

function startTunnel() {
  if (!process.env.USE_LT_SUBDOMAIN) return
  const tunnel = localtunnel(process.env.PORT || 3000, { subdomain: process.env.USE_LT_SUBDOMAIN ? process.env.USE_LT_SUBDOMAIN.toLowerCase() : 'basebot' + Math.round(Math.random * 1000) }, (err, tunnel) => {
    if (err) {
      error(err)
      throw err
    }
    const spacesCount = tunnel.url.length >= 65 ? 0 : (65 - tunnel.url.length) / 2
    const spacesStart = new Array(Math.floor(spacesCount)).fill(' ').join('')
    const spacesEnd = new Array(Math.ceil(spacesCount)).fill(' ').join('')
    const tunnelUrl = spacesStart + tunnel.url + spacesEnd
    /* eslint-disable */
    console.log(`
$$$$$$$\\                                $$$$$$$\\             $$\\     
$$  __$$\\                               $$  __$$\\            $$ |    
$$ |  $$ | $$$$$$\\   $$$$$$$\\  $$$$$$\\  $$ |  $$ | $$$$$$\\ $$$$$$\\   
$$$$$$$\\ | \\____$$\\ $$  _____|$$  __$$\\ $$$$$$$\\ |$$  __$$\\_$$  _|  
$$  __$$\\  $$$$$$$ |\\$$$$$$\\  $$$$$$$$ |$$  __$$\\ $$ /  $$ | $$ |    
$$ |  $$ |$$  __$$ | \\____$$\\ $$   ____|$$ |  $$ |$$ |  $$ | $$ |$$\\ 
$$$$$$$  |\\$$$$$$$ |$$$$$$$  |\\$$$$$$$\\ $$$$$$$  |\\$$$$$$  | \\$$$$  |
\\_______/  \\_______|\\_______/  \\_______|\\_______/  \\______/   \\____/ 



===================================================================
|                                                                 |
|                Your bot is available locally at:                |
|                      http://localhost:${process.env.PORT || 3000}
|                                                                 |                      |
|                          and online at:                         |
|${tunnelUrl}|
|                                                                 |
|                      To learn more, visit:                      |
|             https://ans-group.github.io/basebot/docs            |
|                                                                 |
===================================================================
`
    )
    /* eslint-enable */
  })

  tunnel.on('close', () => {
    /* eslint-disable */
    info('Your bot is no longer available on the web at the localtunnnel.me URL.')
    /* eslint-enable */
    process.exit()
  })
}
