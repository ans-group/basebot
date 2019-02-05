import Debug from 'debug'
import Oauth2 from 'simple-oauth2'
import jwt from 'jsonwebtoken'
import Cryptr from 'cryptr'

const cryptr = new Cryptr(process.env.CRYPTR_SECRET || 'unsecure_secret')

const log = Debug('basebot:services:auth:log')
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

function getAuthUrl(user) {
    const url = oauth2.authorizationCode.authorizeURL({
        redirect_uri: process.env.MS_REDIRECT_URI,
        scope: process.env.MS_APP_SCOPES,
        state: user
    })
    log(`Generated auth url: ${url}`)
    return url
}

async function getTokenFromCode(authCode, res) {
    let result = await oauth2.authorizationCode.getToken({
        code: authCode,
        redirect_uri: process.env.MS_REDIRECT_URI,
        scope: process.env.MS_APP_SCOPES
    })

    const token = oauth2.accessToken.create(result)
    log('Token created')

    const user = jwt.decode(token.token.id_token)

    return {
        token: token.token.access_token,
        refreshToken: token.token.refresh_token,
        tokenExpires: token.token.expires_at.getTime(),
        userName: user.name
    }
}

async function refreshToken(refreshToken) {
    const token = await oauth2.accessToken.create({ refresh_token: refreshToken }).refresh()
    return {
        token: token.token.access_token,
        refreshToken: token.token.refresh_token,
        tokenExpires: token.token.expires_at.getTime(),
        userName: user.name
    }
}

async function getUserToken(uid, controller) {
    const user = await controller.storage.users.get(uid)
    if (!user || !user.msToken) {
        return {
            userExists: !!user,
            tokenExists: !!user && !!user.msToken
        }
    }
    return {
        userExists: true,
        tokenExists: true,
        token: JSON.parse(cryptr.decrypt(user.msToken))
    }
}

export {
    getAuthUrl,
    getTokenFromCode,
    refreshToken,
    getUserToken
}
