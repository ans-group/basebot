import AWS from 'aws-sdk'
import uuid from 'uuid/v4'
const { DynamoDB } = AWS

const parse = DynamoDB.Converter.unmarshall

const defaultModels = {
  teams: {
    hash: '_id'
  },
  channels: {
    hash: '_id'
  },
  users: {
    hash: '_id'
  }
}

export default (config = {}) => {
  const logger = config.logger ? config.logger : () => console.log
  const models = Object.assign(defaultModels, config.models)
  const debug = logger('services:storage:dynamoDB', 'debug')
  const error = logger('services:storage:dynamoDB', 'error')

  if (!process.env.AWS_REGION || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_ACCESS_KEY_ID) {
    error('AWS_REGION, AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID are required')
  }
  const params = { region: process.env.AWS_REGION }
  if (process.env.NODE_ENV !== 'production') {
    params.endpoint = 'http://localhost:8000'
  }
  AWS.config.update(params)
  const db = new DynamoDB(params)
  const docClient = new DynamoDB.DocumentClient()
  const storage = {}
  const keys = Object.keys(models)
  keys.forEach(function(type) {
    const dynamoTable = process.env.RESOURCE_PREFIX + type
    storage[type] = getStorage(db, dynamoTable)
  })

  function getStorage(db, table) {
    return {
      get: (hash, secondary) => new Promise((resolve, reject) => {
        const model = models[table.replace(process.env.RESOURCE_PREFIX, '')]
        const hashKey = model.hash
        const secondaryKey = model.secondary
        debug(`fetching doc with ${hashKey} of ${hash} from  ${table}`)
        const query = {}
        if (hashKey && hash) query[hashKey] = { [hashKey === 'date' ? 'N' : 'S']: String(hash) }
        if (secondaryKey && secondary) query[secondaryKey] = { [secondaryKey === 'date' ? 'N' : 'S']: String(secondary) }

        const cb = (err, res) => {
          if (err) {
            error(err)
            return reject(err)
          }
          const item = res.Item ? parse(res.Item) : null
          debug('Response received: ', item)
          if (!item) { // no result found
            resolve(null)
          } else { // result found
            resolve(item)
          }
        }
        db.getItem({
          TableName: table,
          Key: query
        }, cb)
      }),

      save: data => new Promise((resolve, reject) => {
        debug('saving doc with data: ', data)
        const hashKey = models[table.replace(process.env.RESOURCE_PREFIX, '')].hash
        if (hashKey === '_id' && !data._id) {
          data._id = uuid()
        }
        docClient.put({
          TableName: table,
          Item: data
        }, (err, res) => {
          if (err) {
            error(err)
            return reject(err)
          }
          res = res || {}
          resolve(res)
        })
      }),

      all: (query) => new Promise((resolve, reject) => {
        const params = {
          TableName: table
        }
        if (query) {
          params.ExpressionAttributeValues = {
            ':a': {
              S: query.value
            }
          }
          params.FilterExpression = `#${query.key.charAt(0)}${query.attributes.indexOf(query.key) > -1 ? query.attributes.indexOf(query.key) : ''} = :a`
          params.ExpressionAttributeNames = {}
          params.ProjectionExpression = query.attributes.map((attribute, i) => `#${attribute.charAt(0)}${i}`).join(', ')
          if (!query.attributes.includes(query.key)) {
            params.ExpressionAttributeNames[`#${query.key.charAt(0)}`] = query.key
          }
          query.attributes.forEach((attribute, i) => {
            params.ExpressionAttributeNames[`#${attribute.charAt(0)}${i}`] = attribute
          })
        }
        debug(`fetching all docs from ${table}`)
        db.scan(params, (err, res) => {
          if (err) {
            error(err)
            return reject(err)
          }
          const items = res.Items.map(parse) || []
          debug('docs received: ', items)
          resolve(items)
        })
      })
    }
  }

  return storage
}
