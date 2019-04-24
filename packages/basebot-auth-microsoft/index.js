import Oauth2 from 'simple-oauth2'

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

export default logger => {
  const debug = logger('auth', 'debug')
  const error = logger('auth', 'error')

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
  const oauth2 = Oauth2.create(credentials)

  const getAuthUrl = userId => {
    const url = oauth2.authorizationCode.authorizeURL({
      redirect_uri: process.env.MS_REDIRECT_URI,
      scope: process.env.MS_APP_SCOPES,
      state: userId
    })
    debug(`Generated auth url: ${url}`)
    return url
  }

  const getTokenFromCode = async code => {
    const result = await oauth2.authorizationCode.getToken({
      code,
      redirect_uri: process.env.MS_REDIRECT_URI,
      scope: process.env.MS_APP_SCOPES
    })

    const payload = oauth2.accessToken.create(result)
    debug('Token created')

    return {
      token: payload.token.access_token,
      refresh: payload.token.refresh_token,
      expires: payload.token.expires_at.getTime()
    }
  }

  const refreshToken = async refreshToken => {
    const token = await oauth2.accessToken.create({ refresh_token: refreshToken }).refresh()
    return {
      token: token.token.access_token,
      refreshToken: token.token.refresh_token,
      tokenExpires: token.token.expires_at.getTime()
    }
  }

  return {
    getAuthUrl,
    getTokenFromCode,
    refreshToken,
    getUserToken
  }
}