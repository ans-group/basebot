import development from './development'
import test from './test'

const configurations = { development, test}

export default configurations[process.env.NODE_ENV || 'development']
