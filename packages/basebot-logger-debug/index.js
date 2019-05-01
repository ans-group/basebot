import Debug from 'debug'

export default (program = '' , level = 'info') => new Debug(`${process.env.BOT_NAME || 'basebot'}:${program}:${level}`)
