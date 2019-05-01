import development from './development'
import production from './production'

const configurations = { development, production}

export default configurations[process.env.NODE_ENV || 'development']
