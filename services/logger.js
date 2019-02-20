/* eslint-disable */
require('winston-papertrail').Papertrail
/* eslint-enable */
import winston from 'winston'
import Debug from 'debug'

export default (program = '', level = 'info') => {
    if (process.env.PAPERTRAIL_HOST && process.env.PAPERTRAIL_PORT) {
        const allowedLevels = ['debug', 'info', 'warn', 'error']
        if (!allowedLevels.includes(level)) {
            throw new Error(`Log level should be one of: \n${allowedLevels.join(',\n')}`)
        }

        const consoleLogger = new winston.transports.Console({
            level,
            timestamp() {
                return `basebot:${program}:`
            },
            colorize: true
        })

        const winstonPapertrail = new winston.transports.Papertrail({
            host: process.env.PAPERTRAIL_HOST,
            port: process.env.PAPERTRAIL_PORT,
            program: `basebot:${program}`,
            level,
            colorize: true
        })

        const logger = new winston.Logger({
            transports: [winstonPapertrail, consoleLogger]
        })

        return () => Array.prototype.forEach.call(arguments, arg => logger[level](arg))
    } else {
        return new Debug(`basebot:${program}:${level}`)
    }
}
