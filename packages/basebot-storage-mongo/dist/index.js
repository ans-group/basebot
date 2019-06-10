"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _monk = _interopRequireDefault(require("monk"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}

// based on: https://github.com/howdyai/botkit-storage-mongo/blob/master/src/index.js
var _default =
function _default(logger) {
  if (!process.env.DB_URL) {
    throw new Error('Need to set DB_URL');
  }

  var debug = logger('storage:mongo', 'debug');
  var error = logger('storage:mongo', 'error');
  var db = (0, _monk["default"])(config.mongoUri);

  db["catch"](function (err) {
    error(err);
    throw new Error(err);
  });

  var storage = {};

  var tables = ['teams', 'channels', 'users'];

  tables.forEach(function (zone) {
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
    */exports["default"] = _default;
function getStorage(db, zone) {
  var table = db.get(zone);

  return {
    get: function get(id, cb) {
      debug("fetching ".concat(zone, " with id of: ").concat(id));
      return table.findOne({ id: id }, cb);
    },
    save: function save(data, cb) {
      debug("saving ".concat(zone, " with id of: ").concat(data.id));
      return table.findOneAndUpdate({
        id: data.id },
      data, {
        upsert: true,
        returnNewDocument: true },
      cb);
    },
    all: function all(cb) {
      debug("fetching all ".concat(zone));
      return table.find({}, cb);
    },
    find: function find(data, cb) {
      return table.find(data, cb);
    }, "delete": function _delete(
    id, cb) {
      return table.findOneAndDelete({ id: id }, cb);
    } };

}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbImxvZ2dlciIsInByb2Nlc3MiLCJlbnYiLCJEQl9VUkwiLCJFcnJvciIsImRlYnVnIiwiZXJyb3IiLCJkYiIsImNvbmZpZyIsIm1vbmdvVXJpIiwiZXJyIiwic3RvcmFnZSIsInRhYmxlcyIsImZvckVhY2giLCJ6b25lIiwiZ2V0U3RvcmFnZSIsInRhYmxlIiwiZ2V0IiwiaWQiLCJjYiIsImZpbmRPbmUiLCJzYXZlIiwiZGF0YSIsImZpbmRPbmVBbmRVcGRhdGUiLCJ1cHNlcnQiLCJyZXR1cm5OZXdEb2N1bWVudCIsImFsbCIsImZpbmQiLCJmaW5kT25lQW5kRGVsZXRlIl0sIm1hcHBpbmdzIjoidUdBQUEsb0Q7O0FBRUE7O0FBRWUsa0JBQUFBLE1BQU0sRUFBSTtBQUN2QixNQUFJLENBQUNDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxNQUFqQixFQUF5QjtBQUN2QixVQUFNLElBQUlDLEtBQUosQ0FBVSxvQkFBVixDQUFOO0FBQ0Q7O0FBRUQsTUFBTUMsS0FBSyxHQUFHTCxNQUFNLENBQUMsZUFBRCxFQUFrQixPQUFsQixDQUFwQjtBQUNBLE1BQU1NLEtBQUssR0FBR04sTUFBTSxDQUFDLGVBQUQsRUFBa0IsT0FBbEIsQ0FBcEI7QUFDQSxNQUFNTyxFQUFFLEdBQUcsc0JBQUtDLE1BQU0sQ0FBQ0MsUUFBWixDQUFYOztBQUVBRixFQUFBQSxFQUFFLFNBQUYsQ0FBUyxVQUFBRyxHQUFHLEVBQUk7QUFDZEosSUFBQUEsS0FBSyxDQUFDSSxHQUFELENBQUw7QUFDQSxVQUFNLElBQUlOLEtBQUosQ0FBVU0sR0FBVixDQUFOO0FBQ0QsR0FIRDs7QUFLQSxNQUFNQyxPQUFPLEdBQUcsRUFBaEI7O0FBRUEsTUFBTUMsTUFBTSxHQUFHLENBQUMsT0FBRCxFQUFVLFVBQVYsRUFBc0IsT0FBdEIsQ0FBZjs7QUFFQUEsRUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWUsVUFBQUMsSUFBSSxFQUFJO0FBQ3JCSCxJQUFBQSxPQUFPLENBQUNHLElBQUQsQ0FBUCxHQUFnQkMsVUFBVSxDQUFDUixFQUFELEVBQUtPLElBQUwsQ0FBMUI7QUFDRCxHQUZEOztBQUlBLFNBQU9ILE9BQVA7QUFDRCxDOztBQUVEOzs7Ozs7O0FBT0EsU0FBU0ksVUFBVCxDQUFvQlIsRUFBcEIsRUFBd0JPLElBQXhCLEVBQThCO0FBQzVCLE1BQU1FLEtBQUssR0FBR1QsRUFBRSxDQUFDVSxHQUFILENBQU9ILElBQVAsQ0FBZDs7QUFFQSxTQUFPO0FBQ0xHLElBQUFBLEdBREssZUFDREMsRUFEQyxFQUNHQyxFQURILEVBQ087QUFDVmQsTUFBQUEsS0FBSyxvQkFBYVMsSUFBYiwwQkFBaUNJLEVBQWpDLEVBQUw7QUFDQSxhQUFPRixLQUFLLENBQUNJLE9BQU4sQ0FBYyxFQUFFRixFQUFFLEVBQUZBLEVBQUYsRUFBZCxFQUFzQkMsRUFBdEIsQ0FBUDtBQUNELEtBSkk7QUFLTEUsSUFBQUEsSUFMSyxnQkFLQUMsSUFMQSxFQUtNSCxFQUxOLEVBS1U7QUFDYmQsTUFBQUEsS0FBSyxrQkFBV1MsSUFBWCwwQkFBK0JRLElBQUksQ0FBQ0osRUFBcEMsRUFBTDtBQUNBLGFBQU9GLEtBQUssQ0FBQ08sZ0JBQU4sQ0FBdUI7QUFDNUJMLFFBQUFBLEVBQUUsRUFBRUksSUFBSSxDQUFDSixFQURtQixFQUF2QjtBQUVKSSxNQUFBQSxJQUZJLEVBRUU7QUFDTEUsUUFBQUEsTUFBTSxFQUFFLElBREg7QUFFTEMsUUFBQUEsaUJBQWlCLEVBQUUsSUFGZCxFQUZGO0FBS0ZOLE1BQUFBLEVBTEUsQ0FBUDtBQU1ELEtBYkk7QUFjTE8sSUFBQUEsR0FkSyxlQWNEUCxFQWRDLEVBY0c7QUFDTmQsTUFBQUEsS0FBSyx3QkFBaUJTLElBQWpCLEVBQUw7QUFDQSxhQUFPRSxLQUFLLENBQUNXLElBQU4sQ0FBVyxFQUFYLEVBQWVSLEVBQWYsQ0FBUDtBQUNELEtBakJJO0FBa0JMUSxJQUFBQSxJQWxCSyxnQkFrQkFMLElBbEJBLEVBa0JNSCxFQWxCTixFQWtCVTtBQUNiLGFBQU9ILEtBQUssQ0FBQ1csSUFBTixDQUFXTCxJQUFYLEVBQWlCSCxFQUFqQixDQUFQO0FBQ0QsS0FwQkk7QUFxQkVELElBQUFBLEVBckJGLEVBcUJNQyxFQXJCTixFQXFCVTtBQUNiLGFBQU9ILEtBQUssQ0FBQ1ksZ0JBQU4sQ0FBdUIsRUFBRVYsRUFBRSxFQUFGQSxFQUFGLEVBQXZCLEVBQStCQyxFQUEvQixDQUFQO0FBQ0QsS0F2QkksRUFBUDs7QUF5QkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9uayBmcm9tICdtb25rJztcblxuLy8gYmFzZWQgb246IGh0dHBzOi8vZ2l0aHViLmNvbS9ob3dkeWFpL2JvdGtpdC1zdG9yYWdlLW1vbmdvL2Jsb2IvbWFzdGVyL3NyYy9pbmRleC5qc1xuXG5leHBvcnQgZGVmYXVsdCBsb2dnZXIgPT4ge1xuICBpZiAoIXByb2Nlc3MuZW52LkRCX1VSTCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTmVlZCB0byBzZXQgREJfVVJMJyk7XG4gIH1cblxuICBjb25zdCBkZWJ1ZyA9IGxvZ2dlcignc3RvcmFnZTptb25nbycsICdkZWJ1ZycpXG4gIGNvbnN0IGVycm9yID0gbG9nZ2VyKCdzdG9yYWdlOm1vbmdvJywgJ2Vycm9yJylcbiAgY29uc3QgZGIgPSBtb25rKGNvbmZpZy5tb25nb1VyaSk7XG5cbiAgZGIuY2F0Y2goZXJyID0+IHtcbiAgICBlcnJvcihlcnIpXG4gICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gIH0pO1xuXG4gIGNvbnN0IHN0b3JhZ2UgPSB7fTtcblxuICBjb25zdCB0YWJsZXMgPSBbJ3RlYW1zJywgJ2NoYW5uZWxzJywgJ3VzZXJzJ107XG5cbiAgdGFibGVzLmZvckVhY2goem9uZSA9PiB7XG4gICAgc3RvcmFnZVt6b25lXSA9IGdldFN0b3JhZ2UoZGIsIHpvbmUpO1xuICB9KTtcblxuICByZXR1cm4gc3RvcmFnZTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0b3JhZ2Ugb2JqZWN0IGZvciBhIGdpdmVuIFwiem9uZVwiLCBpLmUsIHRlYW1zLCBjaGFubmVscywgb3IgdXNlcnNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGIgQSByZWZlcmVuY2UgdG8gdGhlIE1vbmdvREIgaW5zdGFuY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSB6b25lIFRoZSB0YWJsZSB0byBxdWVyeSBpbiB0aGUgZGF0YWJhc2VcbiAqIEByZXR1cm5zIHt7Z2V0OiBnZXQsIHNhdmU6IHNhdmUsIGFsbDogYWxsLCBmaW5kOiBmaW5kfX1cbiAqL1xuZnVuY3Rpb24gZ2V0U3RvcmFnZShkYiwgem9uZSkge1xuICBjb25zdCB0YWJsZSA9IGRiLmdldCh6b25lKTtcblxuICByZXR1cm4ge1xuICAgIGdldChpZCwgY2IpIHtcbiAgICAgIGRlYnVnKGBmZXRjaGluZyAke3pvbmV9IHdpdGggaWQgb2Y6ICR7aWR9YClcbiAgICAgIHJldHVybiB0YWJsZS5maW5kT25lKHsgaWQgfSwgY2IpO1xuICAgIH0sXG4gICAgc2F2ZShkYXRhLCBjYikge1xuICAgICAgZGVidWcoYHNhdmluZyAke3pvbmV9IHdpdGggaWQgb2Y6ICR7ZGF0YS5pZH1gKVxuICAgICAgcmV0dXJuIHRhYmxlLmZpbmRPbmVBbmRVcGRhdGUoe1xuICAgICAgICBpZDogZGF0YS5pZFxuICAgICAgfSwgZGF0YSwge1xuICAgICAgICAgIHVwc2VydDogdHJ1ZSxcbiAgICAgICAgICByZXR1cm5OZXdEb2N1bWVudDogdHJ1ZVxuICAgICAgICB9LCBjYik7XG4gICAgfSxcbiAgICBhbGwoY2IpIHtcbiAgICAgIGRlYnVnKGBmZXRjaGluZyBhbGwgJHt6b25lfWApXG4gICAgICByZXR1cm4gdGFibGUuZmluZCh7fSwgY2IpO1xuICAgIH0sXG4gICAgZmluZChkYXRhLCBjYikge1xuICAgICAgcmV0dXJuIHRhYmxlLmZpbmQoZGF0YSwgY2IpO1xuICAgIH0sXG4gICAgZGVsZXRlKGlkLCBjYikge1xuICAgICAgcmV0dXJuIHRhYmxlLmZpbmRPbmVBbmREZWxldGUoeyBpZCB9LCBjYik7XG4gICAgfVxuICB9O1xufVxuIl19