import * as admin from 'firebase-admin'

if (!process.env.FIREBASE) {
  throw new Error('FIREBASE env settings are required')
}
if (!process.env.DB_URL) {
  throw new Error('DB_URL is not set')
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE)),
  databaseURL: process.env.DB_URL
})

export default admin.firestore()
