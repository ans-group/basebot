"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _azureStorage = _interopRequireDefault(require("azure-storage"));
var _util = require("util");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

var defaultModels = {
  teams: {
    hash: '_id' },

  channels: {
    hash: '_id' },

  users: {
    hash: '_id' } };var _default =



function _default() {var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var logger = config.logger ? config.logger : function () {return console.log;};
  var models = Object.assign(defaultModels, config.models);
  var debug = logger('services:storage:azuretables', 'debug');
  var error = logger('services:storage:azuretables', 'error');
  var tablePrefix = (process.env.BOT_NAME || 'basebot').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  if (!process.env.DB_URL) {
    error('DB_URL is not set');
  }

  var storage = {};
  var keys = Object.keys(models);
  keys.forEach(function (model) {
    var modelName = model + '';
    var dbTable = process.env.RESOURCE_PREFIX.replace('_', '') + model.replace(/_/g, '');
    storage[model] = getStorage(dbTable, modelName);
  });

  var tableService = _azureStorage["default"].createTableService(process.env.DB_URL);
  var entGen = _azureStorage["default"].TableUtilities.entityGenerator;

  // promisifiy all the things
  var createTableIfNotExists = (0, _util.promisify)(tableService.createTableIfNotExists).bind(tableService);
  var retrieveEntity = (0, _util.promisify)(tableService.retrieveEntity).bind(tableService);
  var insertOrMergeEntity = (0, _util.promisify)(tableService.insertOrMergeEntity).bind(tableService);
  var queryEntities = (0, _util.promisify)(tableService.queryEntities).bind(tableService);

  function getStorage(table, modelName) {
    return {
      get: function get(hash, secondary) {return new Promise( /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {var model, hashKey, secondaryKey, _ref2, Data, query, _ref3, entries, data;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.prev = 0;_context.next = 3;return (

                      createTableIfNotExists(table));case 3:
                    model = models[modelName];
                    hashKey = model.hash;
                    secondaryKey = model.secondary;
                    debug("fetching doc with ".concat(hashKey, " of ").concat(hash, " from  ").concat(table));if (!(

                    hash && !secondary)) {_context.next = 15;break;}_context.next = 10;return (
                      retrieveEntity(table, 'partition', String(hash)));case 10:_ref2 = _context.sent;Data = _ref2.Data;
                    resolve(JSON.parse(Data._));_context.next = 23;break;case 15:

                    query = new _azureStorage["default"].TableQuery().where('? == ?', secondaryKey, secondary);
                    if (hash) query = query.and('? == ?', hashKey, hash);_context.next = 19;return (
                      queryEntities(table, query, null));case 19:_ref3 = _context.sent;entries = _ref3.entries;
                    data = Object.keys(entries).map(function (key) {return JSON.parse(entries[key].Data._);})[0];
                    resolve(data);case 23:_context.next = 28;break;case 25:_context.prev = 25;_context.t0 = _context["catch"](0);


                    resolve(null);case 28:case "end":return _context.stop();}}}, _callee, null, [[0, 25]]);}));return function (_x, _x2) {return _ref.apply(this, arguments);};}());},



      save: function save(data) {return new Promise( /*#__PURE__*/function () {var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve, reject) {var existingData, hashKey, _ref5, Data;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                    existingData = {};
                    hashKey = models[modelName].hash;
                    if (hashKey === '_id' && !data._id) {
                      data._id = uuid();
                    }_context2.prev = 3;

                    debug('saving doc with data: ', data);_context2.next = 7;return (
                      createTableIfNotExists(table));case 7:_context2.prev = 7;_context2.next = 10;return (

                      retrieveEntity(table, 'partition', String(data[hashKey])));case 10:_ref5 = _context2.sent;Data = _ref5.Data;
                    existingData = Data && JSON.parse(Data._) ? JSON.parse(Data._) : {};_context2.next = 17;break;case 15:_context2.prev = 15;_context2.t0 = _context2["catch"](7);case 17:_context2.next = 19;return (

                      insertOrMergeEntity(table, {
                        PartitionKey: entGen.String('partition'),
                        RowKey: String(data[hashKey]),
                        Data: entGen.String(JSON.stringify(Object.assign({}, existingData, data))) }));case 19:

                    resolve();_context2.next = 25;break;case 22:_context2.prev = 22;_context2.t1 = _context2["catch"](3);

                    error(new Error(_context2.t1));case 25:case "end":return _context2.stop();}}}, _callee2, null, [[3, 22], [7, 15]]);}));return function (_x3, _x4) {return _ref4.apply(this, arguments);};}());},



      all: function all(query) {return new Promise( /*#__PURE__*/function () {var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve, reject) {var tableQuery, _ref7, entries, data;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                    debug("fetching all records in: ".concat(table));_context3.prev = 1;

                    tableQuery = new _azureStorage["default"].TableQuery();
                    if (query) {
                      tableQuery = tableQuery.where('? == ?', query.key, query, value);
                    }_context3.next = 6;return (
                      createTableIfNotExists(table));case 6:_context3.next = 8;return (
                      queryEntities(table, tableQuery, null));case 8:_ref7 = _context3.sent;entries = _ref7.entries;
                    data = Object.keys(entries).map(function (key) {return JSON.parse(entries[key].Data._);});
                    resolve(data);_context3.next = 18;break;case 14:_context3.prev = 14;_context3.t0 = _context3["catch"](1);

                    error(_context3.t0);
                    reject(_context3.t0);case 18:case "end":return _context3.stop();}}}, _callee3, null, [[1, 14]]);}));return function (_x5, _x6) {return _ref6.apply(this, arguments);};}());} };



  }
  return storage;
};exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHRNb2RlbHMiLCJ0ZWFtcyIsImhhc2giLCJjaGFubmVscyIsInVzZXJzIiwiY29uZmlnIiwibG9nZ2VyIiwiY29uc29sZSIsImxvZyIsIm1vZGVscyIsIk9iamVjdCIsImFzc2lnbiIsImRlYnVnIiwiZXJyb3IiLCJ0YWJsZVByZWZpeCIsInByb2Nlc3MiLCJlbnYiLCJCT1RfTkFNRSIsInJlcGxhY2UiLCJ0b0xvd2VyQ2FzZSIsIkRCX1VSTCIsInN0b3JhZ2UiLCJrZXlzIiwiZm9yRWFjaCIsIm1vZGVsIiwibW9kZWxOYW1lIiwiZGJUYWJsZSIsIlJFU09VUkNFX1BSRUZJWCIsImdldFN0b3JhZ2UiLCJ0YWJsZVNlcnZpY2UiLCJhenVyZSIsImNyZWF0ZVRhYmxlU2VydmljZSIsImVudEdlbiIsIlRhYmxlVXRpbGl0aWVzIiwiZW50aXR5R2VuZXJhdG9yIiwiY3JlYXRlVGFibGVJZk5vdEV4aXN0cyIsImJpbmQiLCJyZXRyaWV2ZUVudGl0eSIsImluc2VydE9yTWVyZ2VFbnRpdHkiLCJxdWVyeUVudGl0aWVzIiwidGFibGUiLCJnZXQiLCJzZWNvbmRhcnkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImhhc2hLZXkiLCJzZWNvbmRhcnlLZXkiLCJTdHJpbmciLCJEYXRhIiwiSlNPTiIsInBhcnNlIiwiXyIsInF1ZXJ5IiwiVGFibGVRdWVyeSIsIndoZXJlIiwiYW5kIiwiZW50cmllcyIsImRhdGEiLCJtYXAiLCJrZXkiLCJzYXZlIiwiZXhpc3RpbmdEYXRhIiwiX2lkIiwidXVpZCIsIlBhcnRpdGlvbktleSIsIlJvd0tleSIsInN0cmluZ2lmeSIsIkVycm9yIiwiYWxsIiwidGFibGVRdWVyeSIsInZhbHVlIl0sIm1hcHBpbmdzIjoidUdBQUE7QUFDQSw0Qjs7QUFFQSxJQUFNQSxhQUFhLEdBQUc7QUFDcEJDLEVBQUFBLEtBQUssRUFBRTtBQUNMQyxJQUFBQSxJQUFJLEVBQUUsS0FERCxFQURh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RUFBWix5RUFBWCxFQWhEQSxFQUFQOzs7O0FBaUVEO0FBQ0QsU0FBT3hCLE9BQVA7QUFDRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF6dXJlIGZyb20gJ2F6dXJlLXN0b3JhZ2UnXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJ1xuXG5jb25zdCBkZWZhdWx0TW9kZWxzID0ge1xuICB0ZWFtczoge1xuICAgIGhhc2g6ICdfaWQnXG4gIH0sXG4gIGNoYW5uZWxzOiB7XG4gICAgaGFzaDogJ19pZCdcbiAgfSxcbiAgdXNlcnM6IHtcbiAgICBoYXNoOiAnX2lkJ1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IChjb25maWcgPSB7fSkgPT4ge1xuICBjb25zdCBsb2dnZXIgPSBjb25maWcubG9nZ2VyID8gY29uZmlnLmxvZ2dlciA6ICgpID0+IGNvbnNvbGUubG9nXG4gIGNvbnN0IG1vZGVscyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdE1vZGVscywgY29uZmlnLm1vZGVscylcbiAgY29uc3QgZGVidWcgPSBsb2dnZXIoJ3NlcnZpY2VzOnN0b3JhZ2U6YXp1cmV0YWJsZXMnLCAnZGVidWcnKVxuICBjb25zdCBlcnJvciA9IGxvZ2dlcignc2VydmljZXM6c3RvcmFnZTphenVyZXRhYmxlcycsICdlcnJvcicpXG4gIGNvbnN0IHRhYmxlUHJlZml4ID0gKHByb2Nlc3MuZW52LkJPVF9OQU1FIHx8ICdiYXNlYm90JykucmVwbGFjZSgvW15hLXpBLVowLTldL2csICcnKS50b0xvd2VyQ2FzZSgpXG5cbiAgaWYgKCFwcm9jZXNzLmVudi5EQl9VUkwpIHtcbiAgICBlcnJvcignREJfVVJMIGlzIG5vdCBzZXQnKVxuICB9XG5cbiAgY29uc3Qgc3RvcmFnZSA9IHt9XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhtb2RlbHMpXG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihtb2RlbCkge1xuICAgIGNvbnN0IG1vZGVsTmFtZSA9IG1vZGVsICsgJydcbiAgICBjb25zdCBkYlRhYmxlID0gcHJvY2Vzcy5lbnYuUkVTT1VSQ0VfUFJFRklYLnJlcGxhY2UoJ18nLCAnJykgKyBtb2RlbC5yZXBsYWNlKC9fL2csICcnKVxuICAgIHN0b3JhZ2VbbW9kZWxdID0gZ2V0U3RvcmFnZShkYlRhYmxlLCBtb2RlbE5hbWUpXG4gIH0pXG5cbiAgY29uc3QgdGFibGVTZXJ2aWNlID0gYXp1cmUuY3JlYXRlVGFibGVTZXJ2aWNlKHByb2Nlc3MuZW52LkRCX1VSTClcbiAgY29uc3QgZW50R2VuID0gYXp1cmUuVGFibGVVdGlsaXRpZXMuZW50aXR5R2VuZXJhdG9yXG5cbiAgLy8gcHJvbWlzaWZpeSBhbGwgdGhlIHRoaW5nc1xuICBjb25zdCBjcmVhdGVUYWJsZUlmTm90RXhpc3RzID0gcHJvbWlzaWZ5KHRhYmxlU2VydmljZS5jcmVhdGVUYWJsZUlmTm90RXhpc3RzKS5iaW5kKHRhYmxlU2VydmljZSlcbiAgY29uc3QgcmV0cmlldmVFbnRpdHkgPSBwcm9taXNpZnkodGFibGVTZXJ2aWNlLnJldHJpZXZlRW50aXR5KS5iaW5kKHRhYmxlU2VydmljZSlcbiAgY29uc3QgaW5zZXJ0T3JNZXJnZUVudGl0eSA9IHByb21pc2lmeSh0YWJsZVNlcnZpY2UuaW5zZXJ0T3JNZXJnZUVudGl0eSkuYmluZCh0YWJsZVNlcnZpY2UpXG4gIGNvbnN0IHF1ZXJ5RW50aXRpZXMgPSBwcm9taXNpZnkodGFibGVTZXJ2aWNlLnF1ZXJ5RW50aXRpZXMpLmJpbmQodGFibGVTZXJ2aWNlKVxuXG4gIGZ1bmN0aW9uIGdldFN0b3JhZ2UodGFibGUsIG1vZGVsTmFtZSkge1xuICAgIHJldHVybiB7XG4gICAgICBnZXQ6IChoYXNoLCBzZWNvbmRhcnkpID0+IG5ldyBQcm9taXNlKGFzeW5jKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IGNyZWF0ZVRhYmxlSWZOb3RFeGlzdHModGFibGUpXG4gICAgICAgICAgY29uc3QgbW9kZWwgPSBtb2RlbHNbbW9kZWxOYW1lXVxuICAgICAgICAgIGNvbnN0IGhhc2hLZXkgPSBtb2RlbC5oYXNoXG4gICAgICAgICAgY29uc3Qgc2Vjb25kYXJ5S2V5ID0gbW9kZWwuc2Vjb25kYXJ5XG4gICAgICAgICAgZGVidWcoYGZldGNoaW5nIGRvYyB3aXRoICR7aGFzaEtleX0gb2YgJHtoYXNofSBmcm9tICAke3RhYmxlfWApXG5cbiAgICAgICAgICBpZiAoaGFzaCAmJiAhc2Vjb25kYXJ5KSB7XG4gICAgICAgICAgICBjb25zdCB7IERhdGEgfSA9IGF3YWl0IHJldHJpZXZlRW50aXR5KHRhYmxlLCAncGFydGl0aW9uJywgU3RyaW5nKGhhc2gpKVxuICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKERhdGEuXykpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBxdWVyeSA9IG5ldyBhenVyZS5UYWJsZVF1ZXJ5KCkud2hlcmUoJz8gPT0gPycsIHNlY29uZGFyeUtleSwgc2Vjb25kYXJ5KVxuICAgICAgICAgICAgaWYgKGhhc2gpIHF1ZXJ5ID0gcXVlcnkuYW5kKCc/ID09ID8nLCBoYXNoS2V5LCBoYXNoKVxuICAgICAgICAgICAgY29uc3QgeyBlbnRyaWVzIH0gPSBhd2FpdCBxdWVyeUVudGl0aWVzKHRhYmxlLCBxdWVyeSwgbnVsbClcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBPYmplY3Qua2V5cyhlbnRyaWVzKS5tYXAoa2V5ID0+IEpTT04ucGFyc2UoZW50cmllc1trZXldLkRhdGEuXykpWzBdXG4gICAgICAgICAgICByZXNvbHZlKGRhdGEpXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuXG4gICAgICBzYXZlOiBkYXRhID0+IG5ldyBQcm9taXNlKGFzeW5jKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBsZXQgZXhpc3RpbmdEYXRhID0ge31cbiAgICAgICAgY29uc3QgaGFzaEtleSA9IG1vZGVsc1ttb2RlbE5hbWVdLmhhc2hcbiAgICAgICAgaWYgKGhhc2hLZXkgPT09ICdfaWQnICYmICFkYXRhLl9pZCkge1xuICAgICAgICAgIGRhdGEuX2lkID0gdXVpZCgpXG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBkZWJ1Zygnc2F2aW5nIGRvYyB3aXRoIGRhdGE6ICcsIGRhdGEpXG4gICAgICAgICAgYXdhaXQgY3JlYXRlVGFibGVJZk5vdEV4aXN0cyh0YWJsZSlcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBEYXRhIH0gPSBhd2FpdCByZXRyaWV2ZUVudGl0eSh0YWJsZSwgJ3BhcnRpdGlvbicsIFN0cmluZyhkYXRhW2hhc2hLZXldKSlcbiAgICAgICAgICAgIGV4aXN0aW5nRGF0YSA9IERhdGEgJiYgSlNPTi5wYXJzZShEYXRhLl8pID8gSlNPTi5wYXJzZShEYXRhLl8pIDoge31cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHt9XG4gICAgICAgICAgYXdhaXQgaW5zZXJ0T3JNZXJnZUVudGl0eSh0YWJsZSwge1xuICAgICAgICAgICAgUGFydGl0aW9uS2V5OiBlbnRHZW4uU3RyaW5nKCdwYXJ0aXRpb24nKSxcbiAgICAgICAgICAgIFJvd0tleTogU3RyaW5nKGRhdGFbaGFzaEtleV0pLFxuICAgICAgICAgICAgRGF0YTogZW50R2VuLlN0cmluZyhKU09OLnN0cmluZ2lmeShPYmplY3QuYXNzaWduKHt9LCBleGlzdGluZ0RhdGEsIGRhdGEpKSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBlcnJvcihuZXcgRXJyb3IoZXJyKSlcbiAgICAgICAgfVxuICAgICAgfSksXG5cbiAgICAgIGFsbDogKHF1ZXJ5KSA9PiBuZXcgUHJvbWlzZShhc3luYyhyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZGVidWcoYGZldGNoaW5nIGFsbCByZWNvcmRzIGluOiAke3RhYmxlfWApXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIHRhYmxlUXVlcnkgPSBuZXcgYXp1cmUuVGFibGVRdWVyeSgpXG4gICAgICAgICAgaWYgKHF1ZXJ5KSB7XG4gICAgICAgICAgICB0YWJsZVF1ZXJ5ID0gdGFibGVRdWVyeS53aGVyZSgnPyA9PSA/JywgcXVlcnkua2V5LCBxdWVyeSwgdmFsdWUpXG4gICAgICAgICAgfVxuICAgICAgICAgIGF3YWl0IGNyZWF0ZVRhYmxlSWZOb3RFeGlzdHModGFibGUpXG4gICAgICAgICAgY29uc3QgeyBlbnRyaWVzIH0gPSBhd2FpdCBxdWVyeUVudGl0aWVzKHRhYmxlLCB0YWJsZVF1ZXJ5LCBudWxsKVxuICAgICAgICAgIGNvbnN0IGRhdGEgPSBPYmplY3Qua2V5cyhlbnRyaWVzKS5tYXAoa2V5ID0+IEpTT04ucGFyc2UoZW50cmllc1trZXldLkRhdGEuXykpXG4gICAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBlcnJvcihlcnIpXG4gICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0b3JhZ2Vcbn1cbiJdfQ==