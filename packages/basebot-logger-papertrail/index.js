import winston from 'winston'
/* eslint-disable */
require('winston-papertrail').Papertrail
/* eslint-enable */

if (!process.env.PAPERTRAIL_HOST || !process.env.PAPERTRAIL_PORT) {
  throw new Error('PAPERTRAIL_HOST and PAPERTRAIL_PORT are required')
}

export default function(program = '' , level = 'info') {
  const allowedLevels = ['debug', 'info', 'warn', 'error']
  if (!allowedLevels.includes(level)) {
    throw new Error(`Log level should be one of: \n${allowedLevels.join(',\n')}`)
  }

  const consoleLogger = new winston.transports.Console({
    level,
    timestamp() {
      return `${process.env.BOT_NAME || 'basebot'}:${program}:`
    },
    colorize: true
  })

  const winstonPapertrail = new winston.transports.Papertrail({
    host: process.env.PAPERTRAIL_HOST,
    port: process.env.PAPERTRAIL_PORT,
    program: `${process.env.BOT_NAME || 'basebot'}:${program}`,
    level,
    colorize: true
  })

  const transports = [winstonPapertrail]

  if (process.env.NODE_ENV !== 'production') {
    transports.push(consoleLogger)
  }

  const logger = new winston.Logger({
  transports})

  return function () {
    Array.prototype.forEach.call(arguments, arg => logger[level](arg))
  }
}
