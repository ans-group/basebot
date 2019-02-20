import azure from 'azure-storage'
import { promisify } from 'util'
import logger from '../logger'

const debug = logger('services:storage:azureTables', 'debug')
const error = logger('services:storage:azureTables', 'error')

const tablePrefix = (process.env.BOT_NAME || 'basebot').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
const teamsRef = `${tablePrefix}Teams`
const usersRef = `${tablePrefix}Users`
const channelsRef = `${tablePrefix}Channels`

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

const tableService = azure.createTableService(process.env.DB_URL)
const entGen = azure.TableUtilities.entityGenerator

// promisifiy all the things
const createTableIfNotExists = promisify(tableService.createTableIfNotExists).bind(tableService)
const retrieveEntity = promisify(tableService.retrieveEntity).bind(tableService)
const insertOrMergeEntity = promisify(tableService.insertOrMergeEntity).bind(tableService)
const queryEntities = promisify(tableService.queryEntities).bind(tableService)

function get(table) {
    return id => new Promise(async(resolve, reject) => {
        debug(`attempting to fetch document with ID: ${id}`)
        try {
            await createTableIfNotExists(table)
            const { Data } = await retrieveEntity(table, 'partition', id)
            const data = JSON.parse(Data['_'])
            debug(`document retrieved:`, data)
            resolve(data)
        } catch (err) {
            error(err)
            resolve(null)
        }
    })
}

function save(table) {
    return data => new Promise(async(resolve, reject) => {
        debug('saving: ', data)
        try {
            await createTableIfNotExists(table)
            let existingData = {}
            try {
                const { Data } = await retrieveEntity(table, 'partition', data.id)
                existingData = Data && JSON.parse(Data['_']) ? JSON.parse(Data['_']) : {}
            } catch (err) {
                error(new Error(err))
            }
            await insertOrMergeEntity(table, {
                PartitionKey: entGen.String('partition'),
                RowKey: entGen.String(data.id),
                Data: entGen.String(JSON.stringify(Object.assign({}, existingData, data)))
            })
            resolve()
        } catch (err) {
            error(new Error(err))
            reject(err)
        }
    })
}

function all(table) {
    return () => new Promise(async(resolve, reject) => {
        debug(`fetching all records in: ${table}`)
        try {
            await createTableIfNotExists(table)
            const { entries } = await queryEntities(table, new azure.TableQuery(), null)
            const data = Object.keys(entries).map(key => JSON.parse(entries[key].Data['_']))
            resolve(data)
        } catch (err) {
            error(err)
            reject(err)
        }
    })
}
