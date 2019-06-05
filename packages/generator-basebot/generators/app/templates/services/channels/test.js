import Botmock from 'botkit-mock'
import storage from '../storage'

const botOptions = { storage }

const channels = {

  test: {
    controller: Botmock(botOptions),
    listen(controller, server) {
      controller.bot = controller.spawn()
      console.log('Test bot online')
    }
  },

}

export default channels
