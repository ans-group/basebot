// based on https://github.com/joshuahoover/botkit-storage-dynamodb/blob/master/src/index.js
import dynasty from 'dynasty'

export default (logger = () => console.log) => {
  if (!process.env.AWS_REGION || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_ACCESS_KEY_ID) throw new Error('AWS_REGION, AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID are required')
  const debug = logger('services:storage:dynamoDB', 'debug')
  const error = logger('services:storage:dynamoDB', 'error')

  const dynamoTable = 'basebot'
  const db = dynasty({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  dynamoTable})

  const storage = {}
  const keys = ['teams', 'channels', 'users', 'responses']
  keys.forEach(function (type) {
    storage[type] = getStorage(db, dynamoTable, type)
  })

  return storage
}

function getStorage (db, table, type) {
  var dynamo = db.table(table)

  return {
    get: id => new Promise((resolve, reject) => {
      debug('fetching doc with ID: ', id)
      dynamo.find({hash: type, range: id})
        .then(function (res) {
          res = res || {}
          if (Object.keys(res).length === 0) { // no result found
            resolve(null)
          } else { // result found
            resolve(res)
          }
        }).catch(function (err) {
        error(err)
        reject(err)
      })
    }),

    save: data => new Promise((resolve, reject) => {
      debug('saving doc with data: ', data)
      dynamo.update({ hash: type, range: data.id }, removeTypeAndID(data))
        .then(function (res) {
          res = res || {}
          resolve(res)
        }).catch(function (err) {
        error(err)
        reject(err)
      })
    }),

    all: () => new Promise((resolve, reject) => {
      debug('fetching all docs')
      dynamo.findAll(type)
        .then(function (res) {
          res = res || {}
          resolve(res)
        }).catch(function (err) {
        error(err)
        reject(err)
      })
    })
  }
}

function removeTypeAndID (data) {
  var copy = JSON.parse(JSON.stringify(data))
  delete copy.id
  delete copy.type
  return copy
}
