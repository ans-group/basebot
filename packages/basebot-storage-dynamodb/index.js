// based on https://github.com/joshuahoover/botkit-storage-dynamodb/blob/master/src/index.js
import { DynamoDB } from 'aws-sdk'
import mapValues from 'lodash/mapValues'

export default (logger = () => console.log) => {
  if (!process.env.AWS_REGION || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_ACCESS_KEY_ID) throw new Error('AWS_REGION, AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID are required')
  const debug = logger('services:storage:dynamoDB', 'debug')
  const error = logger('services:storage:dynamoDB', 'error')

  const db = new DynamoDB({region: process.env.AWS_REGION})
  const storage = {}
  const keys = ['teams', 'channels', 'users', 'responses']
  keys.forEach(function (type) {
    const dynamoTable = type
    storage[type] = getStorage(db, dynamoTable)
  })

  function getStorage (db, table) {
    return {
      get: hash => new Promise((resolve, reject) => {
        debug('fetching doc with hash: ', hash, ' from ', table)
        const cb = (err, res) => {
          if (err) {
            error(err)
            return reject(err)
          }
          debug('Response received: ', res)
          const items = res.Items || []
          if (items.length === 0) { // no result found
            resolve(null)
          } else { // result found
            resolve(mapValues(items[0], cleanRes))
          }
        }
        if (table === 'responses') {
          db.query({
            TableName: table,
            IndexName: 'intentName',
            KeyConditionExpression: 'intentName = :v1',
            ExpressionAttributeValues: {
              ':v1': {
                S: hash
              }
            }
          }, cb)
        } else {
          db.getItem({
            TableName: table,
            Key: {
              _id: {
                S: hash
              }
            }
          }, cb)
        }
      }),

      save: data => new Promise((resolve, reject) => {
        debug('saving doc with data: ', data)
        db.putItem({
          TableName: table,
          Item: mapValues(data, value => ({
            S: value
          }))
        }, (err, res) => {
          if (err) {
            error(err)
            return reject(err)
          }
          res = res || {}
          resolve(res)
        })
      }),

      all: () => new Promise((resolve, reject) => {
        debug('fetching all docs')
        db.scan({
          TableName: table
        }, (err, res) => {
          if (err) {
            error(err)
            return reject(err)
          }
          const items = res.Items || []
          resolve(mapValues(items, cleanRes))
        })
      })
    }
  }

  function cleanRes (value) {
    return Object.values(value)[0]
  }

  return storage
}
