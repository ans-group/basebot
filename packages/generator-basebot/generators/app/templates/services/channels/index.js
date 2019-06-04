import test from './test'
import production from './production'

const configurations = { test, production }

export default configurations[process.env.NODE_ENV] || configurations.production
