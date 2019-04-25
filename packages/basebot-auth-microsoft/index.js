import Oauth2 from 'simple-oauth2'
import Cryptr from 'cryptr'

const requiredValues = [
  'MS_APP_ID',
  'MS_APP_PASSWORD',
  'MS_APP_SCOPES',
  'MS_REDIRECT_URI'
]

requiredValues.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Config Error: ${key} is required`)
  }
})

if (!process.env.CRYPTR_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('CRYPTR_SECRET is required in production')
}

const oauth2 = oAuthInit()

export default (logger) => {
  const debug = logger('auth', 'debug')
  const info = logger('auth', 'info')
  const error = logger('auth', 'error')
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET || 'unsecure_secret')

  function registerEndpoints(server, storage, onAuthorize = function noop() {}) {
    info('registering GET /authorize/microsoft')
    server.get('/authorize/microsoft', async function(req, res) {
      const { code, state } = req.query
      try {
        const token = await getTokenFromCode(code, res)
        if (!token) throw new Error('Could not retrieve token')
        debug(`storing token`)
        await storage.users.save({ id: state, microsoft_token: cryptr.encrypt(JSON.stringify(token)) })
        onAuthorize(null, state)
      } catch (err) {
        error(err)
        onAuthorize(err, state)
      }
      res.redirect('/login_success.html')
    })
  }

  async function refreshToken(refreshToken) {
    const token = await oauth2.accessToken.create({ refresh_token: refreshToken }).refresh()
    return {
      token: token.token.access_token,
      refreshToken: token.token.refresh_token,
      tokenExpires: token.token.expires_at.getTime()
    }
  }

  function getAuthUrl(userId) {
    const url = oauth2.authorizationCode.authorizeURL({
      redirect_uri: process.env.MS_REDIRECT_URI,
      scope: process.env.MS_APP_SCOPES,
      state: userId
    })
    debug(`Generated auth url: ${url}`)
    return url
  }

  return {
    getAuthUrl,
    registerEndpoints,
    refreshToken
  }
}

function oAuthInit() {
  const credentials = {
    client: {
      id: process.env.MS_APP_ID,
      secret: process.env.MS_APP_PASSWORD
    },
    auth: {
      tokenHost: 'https://login.microsoftonline.com',
      authorizePath: 'common/oauth2/v2.0/authorize',
      tokenPath: 'common/oauth2/v2.0/token'
    }
  }
  return Oauth2.create(credentials)
}

async function getTokenFromCode(code) {
  const result = await oauth2.authorizationCode.getToken({
    code,
    redirect_uri: process.env.MS_REDIRECT_URI,
    scope: process.env.MS_APP_SCOPES
  })
  const payload = oauth2.accessToken.create(result)
  return {
    token: payload.token.access_token,
    refresh: payload.token.refresh_token,
    expires: payload.token.expires_at.getTime()
  }
}
