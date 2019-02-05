import * as admin from 'firebase-admin'
import fs from 'fs'
const serviceAccount = (() => {
    if (fs.existsSync(`${__dirname}/../firebase.json`)) {
        return require('../firebase.json')
    } else {
        return JSON.parse(process.env.FIREBASE)
    }
})()

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DB_URL
})

const auth = admin.auth()
const db = admin.firestore()
const messaging = admin.messaging()

/**
 * Utility function to simplify grabbing a single document from firestore by ID
 * @param {String} collection the collection name in which the document is stored
 * @param {String} docId the ID of the document to fetch
 * @returns {Object} firebase doc (or empty object)
 */
const getSingle = (collection, docId) => new Promise((resolve, reject) => {
    db.collection(collection).doc(docId).get().then(doc => {
        if (doc.exists) {
            resolve(doc.data())
        } else {
            resolve({})
        }
    }).catch(() => resolve({}))
})

export { auth, db, getSingle, messaging }
