import monk from 'monk';

// based on: https://github.com/howdyai/botkit-storage-mongo/blob/master/src/index.js

export default logger => {
  if (!process.env.DB_URL) {
    throw new Error('Need to set DB_URL');
  }

  const debug = logger('storage:mongo', 'debug')
  const error = logger('storage:mongo', 'error')
  const db = monk(config.mongoUri);

  db.catch(err => {
    error(err)
    throw new Error(err);
  });

  const storage = {};

  const tables = ['teams', 'channels', 'users'];

  tables.forEach(zone => {
    storage[zone] = getStorage(db, zone);
  });

  return storage;
};

/**
 * Creates a storage object for a given "zone", i.e, teams, channels, or users
 *
 * @param {Object} db A reference to the MongoDB instance
 * @param {String} zone The table to query in the database
 * @returns {{get: get, save: save, all: all, find: find}}
 */
function getStorage(db, zone) {
  const table = db.get(zone);

  return {
    get(id, cb) {
      debug(`fetching ${zone} with id of: ${id}`)
      return table.findOne({ id }, cb);
    },
    save(data, cb) {
      debug(`saving ${zone} with id of: ${data.id}`)
      return table.findOneAndUpdate({
        id: data.id
      }, data, {
          upsert: true,
          returnNewDocument: true
        }, cb);
    },
    all(cb) {
      debug(`fetching all ${zone}`)
      return table.find({}, cb);
    },
    find(data, cb) {
      return table.find(data, cb);
    },
    delete(id, cb) {
      return table.findOneAndDelete({ id }, cb);
    }
  };
}
