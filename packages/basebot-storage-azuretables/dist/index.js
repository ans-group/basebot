"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _azureStorage = _interopRequireDefault(require("azure-storage"));
var _util = require("util");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

if (!process.env.DB_URL) {
  throw new Error('DB_URL is not set');
}var _default =

function _default(logger) {
  var debug = logger('services:storage:azureTables', 'debug');
  var error = logger('services:storage:azureTables', 'error');

  var tablePrefix = (process.env.BOT_NAME || 'basebot').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  var teamsRef = "".concat(tablePrefix, "Teams");
  var usersRef = "".concat(tablePrefix, "Users");
  var channelsRef = "".concat(tablePrefix, "Channels");

  var driver = {
    teams: {
      get: get(teamsRef),
      save: save(teamsRef),
      all: all(teamsRef) },

    channels: {
      get: get(channelsRef),
      save: save(channelsRef),
      all: all(channelsRef) },

    users: {
      get: get(usersRef),
      save: save(usersRef),
      all: all(usersRef) } };



  var tableService = _azureStorage["default"].createTableService(process.env.DB_URL);
  var entGen = _azureStorage["default"].TableUtilities.entityGenerator;

  // promisifiy all the things
  var createTableIfNotExists = (0, _util.promisify)(tableService.createTableIfNotExists).bind(tableService);
  var retrieveEntity = (0, _util.promisify)(tableService.retrieveEntity).bind(tableService);
  var insertOrMergeEntity = (0, _util.promisify)(tableService.insertOrMergeEntity).bind(tableService);
  var queryEntities = (0, _util.promisify)(tableService.queryEntities).bind(tableService);

  function get(table) {
    return function (id) {return new Promise( /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {var _ref2, Data, data;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                  debug("attempting to fetch document with ID: ".concat(id));_context.prev = 1;_context.next = 4;return (

                    createTableIfNotExists(table));case 4:_context.next = 6;return (
                    retrieveEntity(table, 'partition', id));case 6:_ref2 = _context.sent;Data = _ref2.Data;
                  data = JSON.parse(Data['_']);
                  debug("document retrieved:", data);
                  resolve(data);_context.next = 17;break;case 13:_context.prev = 13;_context.t0 = _context["catch"](1);

                  error(_context.t0);
                  resolve(null);case 17:case "end":return _context.stop();}}}, _callee, null, [[1, 13]]);}));return function (_x, _x2) {return _ref.apply(this, arguments);};}());};


  }

  function save(table) {
    return function (data) {return new Promise( /*#__PURE__*/function () {var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve, reject) {var existingData, _ref4, Data;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                  debug('saving: ', data);_context2.prev = 1;_context2.next = 4;return (

                    createTableIfNotExists(table));case 4:
                  existingData = {};_context2.prev = 5;_context2.next = 8;return (

                    retrieveEntity(table, 'partition', data.id));case 8:_ref4 = _context2.sent;Data = _ref4.Data;
                  existingData = Data && JSON.parse(Data['_']) ? JSON.parse(Data['_']) : {};_context2.next = 16;break;case 13:_context2.prev = 13;_context2.t0 = _context2["catch"](5);

                  error(new Error(_context2.t0));case 16:_context2.next = 18;return (

                    insertOrMergeEntity(table, {
                      PartitionKey: entGen.String('partition'),
                      RowKey: entGen.String(data.id),
                      Data: entGen.String(JSON.stringify(Object.assign({}, existingData, data))) }));case 18:

                  resolve();_context2.next = 25;break;case 21:_context2.prev = 21;_context2.t1 = _context2["catch"](1);

                  error(new Error(_context2.t1));
                  reject(_context2.t1);case 25:case "end":return _context2.stop();}}}, _callee2, null, [[1, 21], [5, 13]]);}));return function (_x3, _x4) {return _ref3.apply(this, arguments);};}());};


  }

  function all(table) {
    return function () {return new Promise( /*#__PURE__*/function () {var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve, reject) {var _ref6, entries, data;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                  debug("fetching all records in: ".concat(table));_context3.prev = 1;_context3.next = 4;return (

                    createTableIfNotExists(table));case 4:_context3.next = 6;return (
                    queryEntities(table, new _azureStorage["default"].TableQuery(), null));case 6:_ref6 = _context3.sent;entries = _ref6.entries;
                  data = Object.keys(entries).map(function (key) {return JSON.parse(entries[key].Data['_']);});
                  resolve(data);_context3.next = 16;break;case 12:_context3.prev = 12;_context3.t0 = _context3["catch"](1);

                  error(_context3.t0);
                  reject(_context3.t0);case 16:case "end":return _context3.stop();}}}, _callee3, null, [[1, 12]]);}));return function (_x5, _x6) {return _ref5.apply(this, arguments);};}());};


  }

  return driver;
};exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbInByb2Nlc3MiLCJlbnYiLCJEQl9VUkwiLCJFcnJvciIsImxvZ2dlciIsImRlYnVnIiwiZXJyb3IiLCJ0YWJsZVByZWZpeCIsIkJPVF9OQU1FIiwicmVwbGFjZSIsInRvTG93ZXJDYXNlIiwidGVhbXNSZWYiLCJ1c2Vyc1JlZiIsImNoYW5uZWxzUmVmIiwiZHJpdmVyIiwidGVhbXMiLCJnZXQiLCJzYXZlIiwiYWxsIiwiY2hhbm5lbHMiLCJ1c2VycyIsInRhYmxlU2VydmljZSIsImF6dXJlIiwiY3JlYXRlVGFibGVTZXJ2aWNlIiwiZW50R2VuIiwiVGFibGVVdGlsaXRpZXMiLCJlbnRpdHlHZW5lcmF0b3IiLCJjcmVhdGVUYWJsZUlmTm90RXhpc3RzIiwiYmluZCIsInJldHJpZXZlRW50aXR5IiwiaW5zZXJ0T3JNZXJnZUVudGl0eSIsInF1ZXJ5RW50aXRpZXMiLCJ0YWJsZSIsImlkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJEYXRhIiwiZGF0YSIsIkpTT04iLCJwYXJzZSIsImV4aXN0aW5nRGF0YSIsIlBhcnRpdGlvbktleSIsIlN0cmluZyIsIlJvd0tleSIsInN0cmluZ2lmeSIsIk9iamVjdCIsImFzc2lnbiIsIlRhYmxlUXVlcnkiLCJlbnRyaWVzIiwia2V5cyIsIm1hcCIsImtleSJdLCJtYXBwaW5ncyI6InVHQUFBO0FBQ0EsNEI7O0FBRUEsSUFBSSxDQUFDQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsTUFBakIsRUFBeUI7QUFDdkIsUUFBTSxJQUFJQyxLQUFKLENBQVUsbUJBQVYsQ0FBTjtBQUNELEM7O0FBRWMsa0JBQUFDLE1BQU0sRUFBSTtBQUN2QixNQUFNQyxLQUFLLEdBQUdELE1BQU0sQ0FBQyw4QkFBRCxFQUFpQyxPQUFqQyxDQUFwQjtBQUNBLE1BQU1FLEtBQUssR0FBR0YsTUFBTSxDQUFDLDhCQUFELEVBQWlDLE9BQWpDLENBQXBCOztBQUVBLE1BQU1HLFdBQVcsR0FBRyxDQUFDUCxP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LGtCQUFPQyxPQUFQLEVBQWdCQyxNQUFoQjtBQUN2Qi9CLGtCQUFBQSxLQUFLLG9DQUE2QjJCLEtBQTdCLEVBQUwsQ0FEdUI7O0FBR2ZMLG9CQUFBQSxzQkFBc0IsQ0FBQ0ssS0FBRCxDQUhQO0FBSUtELG9CQUFBQSxhQUFhLENBQUNDLEtBQUQsRUFBUSxJQUFJVix5QkFBTTBCLFVBQVYsRUFBUixFQUFnQyxJQUFoQyxDQUpsQixnQ0FJYkMsT0FKYSxTQUliQSxPQUphO0FBS2ZYLGtCQUFBQSxJQUxlLEdBS1JRLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZRCxPQUFaLEVBQXFCRSxHQUFyQixDQUF5QixVQUFBQyxHQUFHLFVBQUliLElBQUksQ0FBQ0MsS0FBTCxDQUFXUyxPQUFPLENBQUNHLEdBQUQsQ0FBUCxDQUFhZixJQUFiLENBQWtCLEdBQWxCLENBQVgsQ0FBSixFQUE1QixDQUxRO0FBTXJCRixrQkFBQUEsT0FBTyxDQUFDRyxJQUFELENBQVAsQ0FOcUI7O0FBUXJCaEMsa0JBQUFBLEtBQUssY0FBTDtBQUNBOEIsa0JBQUFBLE1BQU0sY0FBTixDQVRxQiw0RUFBWix5RUFBTixFQUFQOzs7QUFZRDs7QUFFRCxTQUFPdEIsTUFBUDtBQUNELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXp1cmUgZnJvbSAnYXp1cmUtc3RvcmFnZSdcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnXG5cbmlmICghcHJvY2Vzcy5lbnYuREJfVVJMKSB7XG4gIHRocm93IG5ldyBFcnJvcignREJfVVJMIGlzIG5vdCBzZXQnKVxufVxuXG5leHBvcnQgZGVmYXVsdCBsb2dnZXIgPT4ge1xuICBjb25zdCBkZWJ1ZyA9IGxvZ2dlcignc2VydmljZXM6c3RvcmFnZTphenVyZVRhYmxlcycsICdkZWJ1ZycpXG4gIGNvbnN0IGVycm9yID0gbG9nZ2VyKCdzZXJ2aWNlczpzdG9yYWdlOmF6dXJlVGFibGVzJywgJ2Vycm9yJylcblxuICBjb25zdCB0YWJsZVByZWZpeCA9IChwcm9jZXNzLmVudi5CT1RfTkFNRSB8fCAnYmFzZWJvdCcpLnJlcGxhY2UoL1teYS16QS1aMC05XS9nLCAnJykudG9Mb3dlckNhc2UoKVxuICBjb25zdCB0ZWFtc1JlZiA9IGAke3RhYmxlUHJlZml4fVRlYW1zYFxuICBjb25zdCB1c2Vyc1JlZiA9IGAke3RhYmxlUHJlZml4fVVzZXJzYFxuICBjb25zdCBjaGFubmVsc1JlZiA9IGAke3RhYmxlUHJlZml4fUNoYW5uZWxzYFxuXG4gIGNvbnN0IGRyaXZlciA9IHtcbiAgICB0ZWFtczoge1xuICAgICAgZ2V0OiBnZXQodGVhbXNSZWYpLFxuICAgICAgc2F2ZTogc2F2ZSh0ZWFtc1JlZiksXG4gICAgICBhbGw6IGFsbCh0ZWFtc1JlZilcbiAgICB9LFxuICAgIGNoYW5uZWxzOiB7XG4gICAgICBnZXQ6IGdldChjaGFubmVsc1JlZiksXG4gICAgICBzYXZlOiBzYXZlKGNoYW5uZWxzUmVmKSxcbiAgICAgIGFsbDogYWxsKGNoYW5uZWxzUmVmKVxuICAgIH0sXG4gICAgdXNlcnM6IHtcbiAgICAgIGdldDogZ2V0KHVzZXJzUmVmKSxcbiAgICAgIHNhdmU6IHNhdmUodXNlcnNSZWYpLFxuICAgICAgYWxsOiBhbGwodXNlcnNSZWYpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdGFibGVTZXJ2aWNlID0gYXp1cmUuY3JlYXRlVGFibGVTZXJ2aWNlKHByb2Nlc3MuZW52LkRCX1VSTClcbiAgY29uc3QgZW50R2VuID0gYXp1cmUuVGFibGVVdGlsaXRpZXMuZW50aXR5R2VuZXJhdG9yXG5cbiAgLy8gcHJvbWlzaWZpeSBhbGwgdGhlIHRoaW5nc1xuICBjb25zdCBjcmVhdGVUYWJsZUlmTm90RXhpc3RzID0gcHJvbWlzaWZ5KHRhYmxlU2VydmljZS5jcmVhdGVUYWJsZUlmTm90RXhpc3RzKS5iaW5kKHRhYmxlU2VydmljZSlcbiAgY29uc3QgcmV0cmlldmVFbnRpdHkgPSBwcm9taXNpZnkodGFibGVTZXJ2aWNlLnJldHJpZXZlRW50aXR5KS5iaW5kKHRhYmxlU2VydmljZSlcbiAgY29uc3QgaW5zZXJ0T3JNZXJnZUVudGl0eSA9IHByb21pc2lmeSh0YWJsZVNlcnZpY2UuaW5zZXJ0T3JNZXJnZUVudGl0eSkuYmluZCh0YWJsZVNlcnZpY2UpXG4gIGNvbnN0IHF1ZXJ5RW50aXRpZXMgPSBwcm9taXNpZnkodGFibGVTZXJ2aWNlLnF1ZXJ5RW50aXRpZXMpLmJpbmQodGFibGVTZXJ2aWNlKVxuXG4gIGZ1bmN0aW9uIGdldCAodGFibGUpIHtcbiAgICByZXR1cm4gaWQgPT4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZGVidWcoYGF0dGVtcHRpbmcgdG8gZmV0Y2ggZG9jdW1lbnQgd2l0aCBJRDogJHtpZH1gKVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY3JlYXRlVGFibGVJZk5vdEV4aXN0cyh0YWJsZSlcbiAgICAgICAgY29uc3QgeyBEYXRhIH0gPSBhd2FpdCByZXRyaWV2ZUVudGl0eSh0YWJsZSwgJ3BhcnRpdGlvbicsIGlkKVxuICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShEYXRhWydfJ10pXG4gICAgICAgIGRlYnVnKGBkb2N1bWVudCByZXRyaWV2ZWQ6YCwgZGF0YSlcbiAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGVycm9yKGVycilcbiAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBzYXZlICh0YWJsZSkge1xuICAgIHJldHVybiBkYXRhID0+IG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGRlYnVnKCdzYXZpbmc6ICcsIGRhdGEpXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjcmVhdGVUYWJsZUlmTm90RXhpc3RzKHRhYmxlKVxuICAgICAgICBsZXQgZXhpc3RpbmdEYXRhID0ge31cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCB7IERhdGEgfSA9IGF3YWl0IHJldHJpZXZlRW50aXR5KHRhYmxlLCAncGFydGl0aW9uJywgZGF0YS5pZClcbiAgICAgICAgICBleGlzdGluZ0RhdGEgPSBEYXRhICYmIEpTT04ucGFyc2UoRGF0YVsnXyddKSA/IEpTT04ucGFyc2UoRGF0YVsnXyddKSA6IHt9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGVycm9yKG5ldyBFcnJvcihlcnIpKVxuICAgICAgICB9XG4gICAgICAgIGF3YWl0IGluc2VydE9yTWVyZ2VFbnRpdHkodGFibGUsIHtcbiAgICAgICAgICBQYXJ0aXRpb25LZXk6IGVudEdlbi5TdHJpbmcoJ3BhcnRpdGlvbicpLFxuICAgICAgICAgIFJvd0tleTogZW50R2VuLlN0cmluZyhkYXRhLmlkKSxcbiAgICAgICAgICBEYXRhOiBlbnRHZW4uU3RyaW5nKEpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oe30sIGV4aXN0aW5nRGF0YSwgZGF0YSkpKVxuICAgICAgICB9KVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBlcnJvcihuZXcgRXJyb3IoZXJyKSlcbiAgICAgICAgcmVqZWN0KGVycilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gYWxsICh0YWJsZSkge1xuICAgIHJldHVybiAoKSA9PiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBkZWJ1ZyhgZmV0Y2hpbmcgYWxsIHJlY29yZHMgaW46ICR7dGFibGV9YClcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNyZWF0ZVRhYmxlSWZOb3RFeGlzdHModGFibGUpXG4gICAgICAgIGNvbnN0IHsgZW50cmllcyB9ID0gYXdhaXQgcXVlcnlFbnRpdGllcyh0YWJsZSwgbmV3IGF6dXJlLlRhYmxlUXVlcnkoKSwgbnVsbClcbiAgICAgICAgY29uc3QgZGF0YSA9IE9iamVjdC5rZXlzKGVudHJpZXMpLm1hcChrZXkgPT4gSlNPTi5wYXJzZShlbnRyaWVzW2tleV0uRGF0YVsnXyddKSlcbiAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGVycm9yKGVycilcbiAgICAgICAgcmVqZWN0KGVycilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIGRyaXZlclxufVxuIl19