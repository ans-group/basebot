import Debug from 'debug'
import Cryptr from 'cryptr'
import path from 'path'
import express from 'express'
import uuid from 'uuid/v1'
import { notify } from './outgoing'
import { getTokenFromCode } from './microsoft/auth'

const log = Debug('basebot:services:http:log')
const error = Debug('basebot:services:http:error')

const cryptr = new Cryptr(process.env.CRYPTR_SECRET || 'unsecure_secret')

export default (app, controller) => {
    log('serving static assets from /public')
    app.use(express.static(path.join(__dirname, '/public')))
    const handlers = {
        auth: async function(req, res) {
            const { code, state } = req.query
            try {
                const token = await getTokenFromCode(code, res)
                if (token) {
                    log(`storing token`)
                    controller.storage.users.save({ id: state, msToken: cryptr.encrypt(JSON.stringify(token)) })
                        .then(() => notify({
                            uid: state,
                            text: "Great!, you're now logged in 😊",
                            trigger: 'loginSuccessful'
                        }))
                        .catch(() => notify({
                            uid: state,
                            text: 'Looks like something went wrong 🙁',
                            trigger: 'loginUnsuccessful'
                        }))
                }
            } catch (err) {
                error(err)
                notify({
                    uid: state,
                    text: 'Looks like something went wrong 🙁',
                    trigger: 'loginUnsuccessful'
                })
            }
            res.redirect('/login_success.html')
        },
        register(req, res) {
            try {
                const id = uuid()
                controller.storage.users.save({ id })
                // return without waiting - should be fine
                res.set('Content-Type', 'application/json')
                res.json({ success: true, id })
            } catch (err) {
                res.set('Content-Type', 'application/json')
                res.status(500).json({ success: false, message: err })
                error(err)
            }
        }
    }

    log(`setting up /authorize handler`)
    app.get('/authorize', handlers.auth)

    log(`setting up /register handler`)
    app.get('/register', handlers.register)
}
