import azure from 'azure-storage'
import uuid from 'uuid/v1'
import { promisify } from 'util'

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
  const debug = logger('services:storage:azuretables', 'debug')
  const error = logger('services:storage:azuretables', 'error')
  const tablePrefix = (process.env.BOT_NAME || 'basebot').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()

  if (!process.env.DB_URL) {
    error('DB_URL is not set')
  }

  const storage = {}
  const keys = Object.keys(models)
  keys.forEach(function(model) {
    const modelName = model + ''
    const dbTable = process.env.RESOURCE_PREFIX.replace('_', '') + model.replace(/_/g, '')
    storage[model] = getStorage(dbTable, modelName)
  })

  const tableService = azure.createTableService(process.env.DB_URL)
  const entGen = azure.TableUtilities.entityGenerator

  // promisifiy all the things
  const createTableIfNotExists = promisify(tableService.createTableIfNotExists).bind(tableService)
  const retrieveEntity = promisify(tableService.retrieveEntity).bind(tableService)
  const insertOrMergeEntity = promisify(tableService.insertOrMergeEntity).bind(tableService)
  const queryEntities = promisify(tableService.queryEntities).bind(tableService)

  function getStorage(table, modelName) {
    return {
      get: (hash, secondary) => new Promise(async(resolve, reject) => {
        try {
          await createTableIfNotExists(table)
          const model = models[modelName]
          const hashKey = model.hash
          const secondaryKey = model.secondary
          debug(`fetching doc with ${hashKey} of ${hash} from  ${table}`)

          if (hash && !secondary) {
            const { Data } = await retrieveEntity(table, 'partition', String(hash))
            resolve(JSON.parse(Data._))
          } else {
            var query = new azure.TableQuery().where('? == ?', secondaryKey, secondary)
            if (hash) query = query.and('? == ?', hashKey, hash)
            const { entries } = await queryEntities(table, query, null)
            const data = Object.keys(entries).map(key => JSON.parse(entries[key].Data._))[0]
            resolve(data)
          }
        } catch (err) {
          resolve(null)
        }
      }),

      save: data => new Promise(async(resolve, reject) => {
        let existingData = {}
        const hashKey = models[modelName].hash
        if (hashKey === '_id' && !data._id) {
          data._id = uuid()
        }
        try {
          debug('saving doc with data: ', data)
          await createTableIfNotExists(table)
          try {
            const { Data } = await retrieveEntity(table, 'partition', String(data[hashKey]))
            existingData = Data && JSON.parse(Data._) ? JSON.parse(Data._) : {}
          } catch (err) {}
          await insertOrMergeEntity(table, {
            PartitionKey: entGen.String('partition'),
            RowKey: String(data[hashKey]),
            Data: entGen.String(JSON.stringify(Object.assign({}, existingData, data)))
          })
          resolve()
        } catch (err) {
          error(new Error(err))
        }
      }),

      all: (query) => new Promise(async(resolve, reject) => {
        debug(`fetching all records in: ${table}`)
        try {
          var tableQuery = new azure.TableQuery()
          if (query) {
            tableQuery = tableQuery.where('? == ?', query.key, query, value)
          }
          await createTableIfNotExists(table)
          const { entries } = await queryEntities(table, tableQuery, null)
          const data = Object.keys(entries).map(key => JSON.parse(entries[key].Data._))
          resolve(data)
        } catch (err) {
          error(err)
          reject(err)
        }
      })
    }
  }
  return storage
}
