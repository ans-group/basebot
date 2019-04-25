import db from './firebase'

export default logger => {
  const debug = logger('services:storage:azureTables', 'debug')
  const error = logger('services:storage:azureTables', 'error')

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

  function get(firebaseRef) {
    return id => new Promise((resolve, reject) => firebaseRef.doc(id).get().then(doc => {
      debug(`attempting to fetch document with ID: ${id}`)
      if (!doc.exists) {
        reject(Error('Document not found'))
        err('Document not found')
      } else {
        debug(`document retrieved:`, doc.data())
        resolve(doc.data())
      }
    }).catch(reject))
  }

  function save(firebaseRef) {
    return data => {
      debug('saving: ', data)
      return firebaseRef.doc(data.id).set(data, { merge: true })
    }
  }

  function all(firebaseRef) {
    return () => new Promise((resolve, reject) => firebaseRef.get().then(snapshot => {
      debug(`fetching all ${firebaseRef} records`)
      resolve(snapshot.toArray().map(doc => doc.data()))
    }).catch(err => {
      error(err)
      reject(err)
    }))
  }

  return driver
}
