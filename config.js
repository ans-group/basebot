import logger from './services/logger'
import env from 'node-env-file'
const info = logger('config', 'info')
const warn = logger('config', 'warn')

try {
    env(`${__dirname}/.env`)
} catch (err) {
    info('no .env file found')
}

const requiredValues = [
    'MS_APP_ID',
    'MS_APP_PASSWORD',
    'MS_APP_SCOPES',
    'MS_REDIRECT_URI',
    'LUIS_URI',
    'DB_URL'
]

requiredValues.forEach(key => {
    if (!process.env[key]) {
        throw new Error(`Config Error: ${key} is not set`)
    }
})

if (!process.env.CRYPTR_SECRET) {
    warn('Warning: CRYPTR_SECRET is not set, you should set this to a random string')
}
