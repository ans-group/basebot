import * as admin from 'firebase-admin'

if (!process.env.FIREBASE) {
  throw new Error('FIREBASE env settings are required')
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE))
})

export default admin.messaging()
