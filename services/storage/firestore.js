import { db } from './firebase'

const teamsRef = db.collection('teams')
const usersRef = db.collection('users')
const channelsRef = db.collection('channels')

const driver = {
  teams: {
    get: get(teamsRef),
    save: save(teamsRef),
    all: all(teamsRef)
  },
  channels: {
    get: get(channelsRef),
    save: save(channelsRef),
    all: all(channelsRef)
  },
  users: {
    get: get(usersRef),
    save: save(usersRef),
    all: all(usersRef)
  }
}
export default driver

function get (firebaseRef) {
  return id => new Promise((resolve, reject) => firebaseRef.doc(id).get().then(doc => {
    if (!doc.exists) {
      reject(Error('Document not found'))
    } else {
      resolve(doc.data())
    }
  }).catch(reject))
}

function save (firebaseRef) {
  return data => firebaseRef.doc(data.id).set(data, { merge: true })
}

function all (firebaseRef) {
  return () => new Promise((resolve, reject) => firebaseRef.get().then(snapshot => {
    resolve(snapshot.toArray().map(doc => doc.data()))
  }).catch(reject))
}
