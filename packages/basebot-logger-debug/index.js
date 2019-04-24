import Debug from 'debug'

export default (program = '', level = 'info') => new Debug(`basebot:${program}:${level}`)
