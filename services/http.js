import logger from './logger'
import Cryptr from 'cryptr'
import path from 'path'
import express from 'express'
import uuid from 'uuid/v1'
import { notify } from './outgoing'
import { getTokenFromCode } from './microsoft/auth'

const info = logger('services:http', 'info')
const debug = logger('services:http', 'debug')
const error = logger('services:http', 'error')

const cryptr = new Cryptr(process.env.CRYPTR_SECRET || 'unsecure_secret')

export default (app, controller) => {
    info('serving static assets from /public')
    app.use(express.static(path.join(__dirname, '/public')))
    const handlers = {
        auth: async function(req, res) {
            const { code, state } = req.query
            try {
                const token = await getTokenFromCode(code, res)
                if (token) {
                    debug(`storing token`)
                    await controller.storage.users.save({ id: state, msToken: cryptr.encrypt(JSON.stringify(token)) })
                    notify({
                        uid: state,
                        text: "Great!, you're now logged in 😊",
                        trigger: 'loginSuccessful',
                        controller
                    })
                }
            } catch (err) {
                error(err)
                notify({
                    uid: state,
                    text: 'Looks like something went wrong 🙁',
                    trigger: 'loginUnsuccessful',
                    controller
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

    info(`setting up /authorize handler`)
    app.get('/authorize', handlers.auth)

    info(`setting up /register handler`)
    app.get('/register', handlers.register)
}
