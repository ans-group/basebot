import devAuth from './development/auth'
import devLogger from './development/logger'
import devStorage from './development/storage'
import devChannels from './development/channels'
import devServer from './development/server'
import devMiddleware from './development/middleware'

import testAuth from './test/auth'
import testLogger from './test/logger'
import testStorage from './test/storage'
import testChannels from './test/channels'
import testServer from './test/server'
import testMiddleware from './test/middleware'

import prodAuth from './production/auth'
import prodLogger from './production/logger'
import prodStorage from './production/storage'
import prodChannels from './production/channels'
import prodServer from './production/server'
import prodMiddleware from './production/middleware'

const modules = {
  development: {
    auth: devAuth,
    logger: devLogger,
    storage: devStorage,
    channels: devChannels,
    server: devServer,
    middleware: devMiddleware
  },
  test: {
    auth: testAuth,
    logger: testLogger,
    storage: testStorage,
    channels: testChannels,
    server: testServer,
    middleware: testMiddleware
  },
  production: {
    auth: prodAuth,
    logger: prodLogger,
    storage: prodStorage,
    channels: prodChannels,
    server: prodServer,
    middleware: prodMiddleware
  }
}

const { auth, logger, storage, channels, server, middleware } = modules[process.env.NODE_ENV || 'development']

export { auth, logger, storage, channels, server, middleware }
