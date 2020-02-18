import { getAllModules, getSingleModule, getAllModels } from './configParser'
import Server from './server'
import applySkills from './applySkills'
import startChannels from './startChannels'

export const init = ({ skills, config }) => {
  const logger = getSingleModule(config.logger)
  const channels = getAllModules(config.channels)
  const rawMiddleware = getAllModules(config.middleware)
  const models = getAllModels(rawMiddleware)
  const storage = getSingleModule(config.storage)({ logger, models: models && Array.isArray(models) && models.length && typeof models[0] === 'object' ? Object.assign(...models) : models })
  const middleware = rawMiddleware.map(mw => mw({ storage, logger }))
  const info = logger('core', 'info')
  const { server, app } = Server({ logger })
  const controllers = startChannels({ channels, storage, logger, server, app })

  // Enable users to view the chat client
  app.use(express.static(path.join(__dirname, 'public')))

  // start server
  if (process.env.NODE_ENV !== 'test') {
    setTimeout(() => {
      info('setting up server on port: ' + (process.env.PORT || 3000))
      app.listen(process.env.PORT || 3000)
    })
  }

  applySkills({ channels: controllers, middleware, logger, skills })
  return {
    controllers,
    storage,
    logger
  }
}
