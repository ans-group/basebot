"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _azureStorage = _interopRequireDefault(require("azure-storage"));
var _v = _interopRequireDefault(require("uuid/v1"));
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
                      data._id = (0, _v["default"])();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHRNb2RlbHMiLCJ0ZWFtcyIsImhhc2giLCJjaGFubmVscyIsInVzZXJzIiwiY29uZmlnIiwibG9nZ2VyIiwiY29uc29sZSIsImxvZyIsIm1vZGVscyIsIk9iamVjdCIsImFzc2lnbiIsImRlYnVnIiwiZXJyb3IiLCJ0YWJsZVByZWZpeCIsInByb2Nlc3MiLCJlbnYiLCJCT1RfTkFNRSIsInJlcGxhY2UiLCJ0b0xvd2VyQ2FzZSIsIkRCX1VSTCIsInN0b3JhZ2UiLCJrZXlzIiwiZm9yRWFjaCIsIm1vZGVsIiwibW9kZWxOYW1lIiwiZGJUYWJsZSIsIlJFU09VUkNFX1BSRUZJWCIsImdldFN0b3JhZ2UiLCJ0YWJsZVNlcnZpY2UiLCJhenVyZSIsImNyZWF0ZVRhYmxlU2VydmljZSIsImVudEdlbiIsIlRhYmxlVXRpbGl0aWVzIiwiZW50aXR5R2VuZXJhdG9yIiwiY3JlYXRlVGFibGVJZk5vdEV4aXN0cyIsImJpbmQiLCJyZXRyaWV2ZUVudGl0eSIsImluc2VydE9yTWVyZ2VFbnRpdHkiLCJxdWVyeUVudGl0aWVzIiwidGFibGUiLCJnZXQiLCJzZWNvbmRhcnkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImhhc2hLZXkiLCJzZWNvbmRhcnlLZXkiLCJTdHJpbmciLCJEYXRhIiwiSlNPTiIsInBhcnNlIiwiXyIsInF1ZXJ5IiwiVGFibGVRdWVyeSIsIndoZXJlIiwiYW5kIiwiZW50cmllcyIsImRhdGEiLCJtYXAiLCJrZXkiLCJzYXZlIiwiZXhpc3RpbmdEYXRhIiwiX2lkIiwiUGFydGl0aW9uS2V5IiwiUm93S2V5Iiwic3RyaW5naWZ5IiwiRXJyb3IiLCJhbGwiLCJ0YWJsZVF1ZXJ5IiwidmFsdWUiXSwibWFwcGluZ3MiOiJ1R0FBQTtBQUNBO0FBQ0EsNEI7O0FBRUEsSUFBTUEsYUFBYSxHQUFHO0FBQ3BCQyxFQUFBQSxLQUFLLEVBQUU7QUFDTEMsSUFBQUEsSUFBSSxFQUFFLEtBREQsRUFEYTs7QUFJcEJDLEVBQUFBLFFBQVEsRUFBRTtBQUNSRCxJQUFBQSxJQUFJLEVBQUUsS0FERSxFQUpVOztBQU9wQkUsRUFBQUEsS0FBSyxFQUFFO0FBQ0xGLElBQUFBLElBQUksRUFBRSxLQURELEVBUGEsRUFBdEIsQzs7OztBQVllLG9CQUFpQixLQUFoQkcsTUFBZ0IsdUVBQVAsRUFBTztBQUM5QixNQUFNQyxNQUFNLEdBQUdELE1BQU0sQ0FBQ0MsTUFBUCxHQUFnQkQsTUFBTSxDQUFDQyxNQUF2QixHQUFnQyxvQkFBTUMsT0FBTyxDQUFDQyxHQUFkLEVBQS9DO0FBQ0EsTUFBTUMsTUFBTSxHQUFHQyxNQUFNLENBQUNDLE1BQVAsQ0FBY1gsYUFBZCxFQUE2QkssTUFBTSxDQUFDSSxNQUFwQyxDQUFmO0FBQ0EsTUFBTUcsS0FBSyxHQUFHTixNQUFNLENBQUMsOEJBQUQsRUFBaUMsT0FBakMsQ0FBcEI7QUFDQSxNQUFNTyxLQUFLLEdBQUdQLE1BQU0sQ0FBQyw4QkFBRCxFQUFpQyxPQUFqQyxDQUFwQjtBQUNBLE1BQU1RLFdBQVcsR0FBRyxDQUFDQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsUUFBWixJQUF3QixTQUF6QixFQUFvQ0MsT0FBcEMsQ0FBNEMsZUFBNUMsRUFBNkQsRUFBN0QsRUFBaUVDLFdBQWpFLEVBQXBCOztBQUVBLE1BQUksQ0FBQ0osT0FBTyxDQUFDQyxHQUFSLENBQVlJLE1BQWpCLEVBQXlCO0FBQ3ZCUCxJQUFBQSxLQUFLLENBQUMsbUJBQUQsQ0FBTDtBQUNEOztBQUVELE1BQU1RLE9BQU8sR0FBRyxFQUFoQjtBQUNBLE1BQU1DLElBQUksR0FBR1osTUFBTSxDQUFDWSxJQUFQLENBQVliLE1BQVosQ0FBYjtBQUNBYSxFQUFBQSxJQUFJLENBQUNDLE9BQUwsQ0FBYSxVQUFTQyxLQUFULEVBQWdCO0FBQzNCLFFBQU1DLFNBQVMsR0FBR0QsS0FBSyxHQUFHLEVBQTFCO0FBQ0EsUUFBTUUsT0FBTyxHQUFHWCxPQUFPLENBQUNDLEdBQVIsQ0FBWVcsZUFBWixDQUE0QlQsT0FBNUIsQ0FBb0MsR0FBcEMsRUFBeUMsRUFBekMsSUFBK0NNLEtBQUssQ0FBQ04sT0FBTixDQUFjLElBQWQsRUFBb0IsRUFBcEIsQ0FBL0Q7QUFDQUcsSUFBQUEsT0FBTyxDQUFDRyxLQUFELENBQVAsR0FBaUJJLFVBQVUsQ0FBQ0YsT0FBRCxFQUFVRCxTQUFWLENBQTNCO0FBQ0QsR0FKRDs7QUFNQSxNQUFNSSxZQUFZLEdBQUdDLHlCQUFNQyxrQkFBTixDQUF5QmhCLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSSxNQUFyQyxDQUFyQjtBQUNBLE1BQU1ZLE1BQU0sR0FBR0YseUJBQU1HLGNBQU4sQ0FBcUJDLGVBQXBDOztBQUVBO0FBQ0EsTUFBTUMsc0JBQXNCLEdBQUcscUJBQVVOLFlBQVksQ0FBQ00sc0JBQXZCLEVBQStDQyxJQUEvQyxDQUFvRFAsWUFBcEQsQ0FBL0I7QUFDQSxNQUFNUSxjQUFjLEdBQUcscUJBQVVSLFlBQVksQ0FBQ1EsY0FBdkIsRUFBdUNELElBQXZDLENBQTRDUCxZQUE1QyxDQUF2QjtBQUNBLE1BQU1TLG1CQUFtQixHQUFHLHFCQUFVVCxZQUFZLENBQUNTLG1CQUF2QixFQUE0Q0YsSUFBNUMsQ0FBaURQLFlBQWpELENBQTVCO0FBQ0EsTUFBTVUsYUFBYSxHQUFHLHFCQUFVVixZQUFZLENBQUNVLGFBQXZCLEVBQXNDSCxJQUF0QyxDQUEyQ1AsWUFBM0MsQ0FBdEI7O0FBRUEsV0FBU0QsVUFBVCxDQUFvQlksS0FBcEIsRUFBMkJmLFNBQTNCLEVBQXNDO0FBQ3BDLFdBQU87QUFDTGdCLE1BQUFBLEdBQUcsRUFBRSxhQUFDdkMsSUFBRCxFQUFPd0MsU0FBUCxVQUFxQixJQUFJQyxPQUFKLCtGQUFZLGlCQUFNQyxPQUFOLEVBQWVDLE1BQWY7O0FBRTVCVixzQkFBQUEsc0JBQXNCLENBQUNLLEtBQUQsQ0FGTTtBQUc1QmhCLG9CQUFBQSxLQUg0QixHQUdwQmYsTUFBTSxDQUFDZ0IsU0FBRCxDQUhjO0FBSTVCcUIsb0JBQUFBLE9BSjRCLEdBSWxCdEIsS0FBSyxDQUFDdEIsSUFKWTtBQUs1QjZDLG9CQUFBQSxZQUw0QixHQUtidkIsS0FBSyxDQUFDa0IsU0FMTztBQU1sQzlCLG9CQUFBQSxLQUFLLDZCQUFzQmtDLE9BQXRCLGlCQUFvQzVDLElBQXBDLG9CQUFrRHNDLEtBQWxELEVBQUwsQ0FOa0M7O0FBUTlCdEMsb0JBQUFBLElBQUksSUFBSSxDQUFDd0MsU0FScUI7QUFTVEwsc0JBQUFBLGNBQWMsQ0FBQ0csS0FBRCxFQUFRLFdBQVIsRUFBcUJRLE1BQU0sQ0FBQzlDLElBQUQsQ0FBM0IsQ0FUTCxnQ0FTeEIrQyxJQVR3QixTQVN4QkEsSUFUd0I7QUFVaENMLG9CQUFBQSxPQUFPLENBQUNNLElBQUksQ0FBQ0MsS0FBTCxDQUFXRixJQUFJLENBQUNHLENBQWhCLENBQUQsQ0FBUCxDQVZnQzs7QUFZNUJDLG9CQUFBQSxLQVo0QixHQVlwQixJQUFJdkIseUJBQU13QixVQUFWLEdBQXVCQyxLQUF2QixDQUE2QixRQUE3QixFQUF1Q1IsWUFBdkMsRUFBcURMLFNBQXJELENBWm9CO0FBYWhDLHdCQUFJeEMsSUFBSixFQUFVbUQsS0FBSyxHQUFHQSxLQUFLLENBQUNHLEdBQU4sQ0FBVSxRQUFWLEVBQW9CVixPQUFwQixFQUE2QjVDLElBQTdCLENBQVIsQ0Fic0I7QUFjTnFDLHNCQUFBQSxhQUFhLENBQUNDLEtBQUQsRUFBUWEsS0FBUixFQUFlLElBQWYsQ0FkUCxnQ0FjeEJJLE9BZHdCLFNBY3hCQSxPQWR3QjtBQWUxQkMsb0JBQUFBLElBZjBCLEdBZW5CaEQsTUFBTSxDQUFDWSxJQUFQLENBQVltQyxPQUFaLEVBQXFCRSxHQUFyQixDQUF5QixVQUFBQyxHQUFHLFVBQUlWLElBQUksQ0FBQ0MsS0FBTCxDQUFXTSxPQUFPLENBQUNHLEdBQUQsQ0FBUCxDQUFhWCxJQUFiLENBQWtCRyxDQUE3QixDQUFKLEVBQTVCLEVBQWlFLENBQWpFLENBZm1CO0FBZ0JoQ1Isb0JBQUFBLE9BQU8sQ0FBQ2MsSUFBRCxDQUFQLENBaEJnQzs7O0FBbUJsQ2Qsb0JBQUFBLE9BQU8sQ0FBQyxJQUFELENBQVAsQ0FuQmtDLDBFQUFaLHVFQUFyQixFQURBOzs7O0FBd0JMaUIsTUFBQUEsSUFBSSxFQUFFLGNBQUFILElBQUksVUFBSSxJQUFJZixPQUFKLGdHQUFZLGtCQUFNQyxPQUFOLEVBQWVDLE1BQWY7QUFDcEJpQixvQkFBQUEsWUFEb0IsR0FDTCxFQURLO0FBRWxCaEIsb0JBQUFBLE9BRmtCLEdBRVJyQyxNQUFNLENBQUNnQixTQUFELENBQU4sQ0FBa0J2QixJQUZWO0FBR3hCLHdCQUFJNEMsT0FBTyxLQUFLLEtBQVosSUFBcUIsQ0FBQ1ksSUFBSSxDQUFDSyxHQUEvQixFQUFvQztBQUNsQ0wsc0JBQUFBLElBQUksQ0FBQ0ssR0FBTCxHQUFXLG9CQUFYO0FBQ0QscUJBTHVCOztBQU90Qm5ELG9CQUFBQSxLQUFLLENBQUMsd0JBQUQsRUFBMkI4QyxJQUEzQixDQUFMLENBUHNCO0FBUWhCdkIsc0JBQUFBLHNCQUFzQixDQUFDSyxLQUFELENBUk47O0FBVUdILHNCQUFBQSxjQUFjLENBQUNHLEtBQUQsRUFBUSxXQUFSLEVBQXFCUSxNQUFNLENBQUNVLElBQUksQ0FBQ1osT0FBRCxDQUFMLENBQTNCLENBVmpCLGlDQVVaRyxJQVZZLFNBVVpBLElBVlk7QUFXcEJhLG9CQUFBQSxZQUFZLEdBQUdiLElBQUksSUFBSUMsSUFBSSxDQUFDQyxLQUFMLENBQVdGLElBQUksQ0FBQ0csQ0FBaEIsQ0FBUixHQUE2QkYsSUFBSSxDQUFDQyxLQUFMLENBQVdGLElBQUksQ0FBQ0csQ0FBaEIsQ0FBN0IsR0FBa0QsRUFBakUsQ0FYb0I7O0FBYWhCZCxzQkFBQUEsbUJBQW1CLENBQUNFLEtBQUQsRUFBUTtBQUMvQndCLHdCQUFBQSxZQUFZLEVBQUVoQyxNQUFNLENBQUNnQixNQUFQLENBQWMsV0FBZCxDQURpQjtBQUUvQmlCLHdCQUFBQSxNQUFNLEVBQUVqQixNQUFNLENBQUNVLElBQUksQ0FBQ1osT0FBRCxDQUFMLENBRmlCO0FBRy9CRyx3QkFBQUEsSUFBSSxFQUFFakIsTUFBTSxDQUFDZ0IsTUFBUCxDQUFjRSxJQUFJLENBQUNnQixTQUFMLENBQWV4RCxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCbUQsWUFBbEIsRUFBZ0NKLElBQWhDLENBQWYsQ0FBZCxDQUh5QixFQUFSLENBYkg7O0FBa0J0QmQsb0JBQUFBLE9BQU8sR0FsQmU7O0FBb0J0Qi9CLG9CQUFBQSxLQUFLLENBQUMsSUFBSXNELEtBQUosY0FBRCxDQUFMLENBcEJzQixxRkFBWix5RUFBSixFQXhCTDs7OztBQWdETEMsTUFBQUEsR0FBRyxFQUFFLGFBQUNmLEtBQUQsVUFBVyxJQUFJVixPQUFKLGdHQUFZLGtCQUFNQyxPQUFOLEVBQWVDLE1BQWY7QUFDMUJqQyxvQkFBQUEsS0FBSyxvQ0FBNkI0QixLQUE3QixFQUFMLENBRDBCOztBQUdwQjZCLG9CQUFBQSxVQUhvQixHQUdQLElBQUl2Qyx5QkFBTXdCLFVBQVYsRUFITztBQUl4Qix3QkFBSUQsS0FBSixFQUFXO0FBQ1RnQixzQkFBQUEsVUFBVSxHQUFHQSxVQUFVLENBQUNkLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkJGLEtBQUssQ0FBQ08sR0FBakMsRUFBc0NQLEtBQXRDLEVBQTZDaUIsS0FBN0MsQ0FBYjtBQUNELHFCQU51QjtBQU9sQm5DLHNCQUFBQSxzQkFBc0IsQ0FBQ0ssS0FBRCxDQVBKO0FBUUVELHNCQUFBQSxhQUFhLENBQUNDLEtBQUQsRUFBUTZCLFVBQVIsRUFBb0IsSUFBcEIsQ0FSZixnQ0FRaEJaLE9BUmdCLFNBUWhCQSxPQVJnQjtBQVNsQkMsb0JBQUFBLElBVGtCLEdBU1hoRCxNQUFNLENBQUNZLElBQVAsQ0FBWW1DLE9BQVosRUFBcUJFLEdBQXJCLENBQXlCLFVBQUFDLEdBQUcsVUFBSVYsSUFBSSxDQUFDQyxLQUFMLENBQVdNLE9BQU8sQ0FBQ0csR0FBRCxDQUFQLENBQWFYLElBQWIsQ0FBa0JHLENBQTdCLENBQUosRUFBNUIsQ0FUVztBQVV4QlIsb0JBQUFBLE9BQU8sQ0FBQ2MsSUFBRCxDQUFQLENBVndCOztBQVl4QjdDLG9CQUFBQSxLQUFLLGNBQUw7QUFDQWdDLG9CQUFBQSxNQUFNLGNBQU4sQ0Fid0IsNEVBQVoseUVBQVgsRUFoREEsRUFBUDs7OztBQWlFRDtBQUNELFNBQU94QixPQUFQO0FBQ0QsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhenVyZSBmcm9tICdhenVyZS1zdG9yYWdlJ1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZC92MSdcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnXG5cbmNvbnN0IGRlZmF1bHRNb2RlbHMgPSB7XG4gIHRlYW1zOiB7XG4gICAgaGFzaDogJ19pZCdcbiAgfSxcbiAgY2hhbm5lbHM6IHtcbiAgICBoYXNoOiAnX2lkJ1xuICB9LFxuICB1c2Vyczoge1xuICAgIGhhc2g6ICdfaWQnXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgKGNvbmZpZyA9IHt9KSA9PiB7XG4gIGNvbnN0IGxvZ2dlciA9IGNvbmZpZy5sb2dnZXIgPyBjb25maWcubG9nZ2VyIDogKCkgPT4gY29uc29sZS5sb2dcbiAgY29uc3QgbW9kZWxzID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0TW9kZWxzLCBjb25maWcubW9kZWxzKVxuICBjb25zdCBkZWJ1ZyA9IGxvZ2dlcignc2VydmljZXM6c3RvcmFnZTphenVyZXRhYmxlcycsICdkZWJ1ZycpXG4gIGNvbnN0IGVycm9yID0gbG9nZ2VyKCdzZXJ2aWNlczpzdG9yYWdlOmF6dXJldGFibGVzJywgJ2Vycm9yJylcbiAgY29uc3QgdGFibGVQcmVmaXggPSAocHJvY2Vzcy5lbnYuQk9UX05BTUUgfHwgJ2Jhc2Vib3QnKS5yZXBsYWNlKC9bXmEtekEtWjAtOV0vZywgJycpLnRvTG93ZXJDYXNlKClcblxuICBpZiAoIXByb2Nlc3MuZW52LkRCX1VSTCkge1xuICAgIGVycm9yKCdEQl9VUkwgaXMgbm90IHNldCcpXG4gIH1cblxuICBjb25zdCBzdG9yYWdlID0ge31cbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG1vZGVscylcbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgY29uc3QgbW9kZWxOYW1lID0gbW9kZWwgKyAnJ1xuICAgIGNvbnN0IGRiVGFibGUgPSBwcm9jZXNzLmVudi5SRVNPVVJDRV9QUkVGSVgucmVwbGFjZSgnXycsICcnKSArIG1vZGVsLnJlcGxhY2UoL18vZywgJycpXG4gICAgc3RvcmFnZVttb2RlbF0gPSBnZXRTdG9yYWdlKGRiVGFibGUsIG1vZGVsTmFtZSlcbiAgfSlcblxuICBjb25zdCB0YWJsZVNlcnZpY2UgPSBhenVyZS5jcmVhdGVUYWJsZVNlcnZpY2UocHJvY2Vzcy5lbnYuREJfVVJMKVxuICBjb25zdCBlbnRHZW4gPSBhenVyZS5UYWJsZVV0aWxpdGllcy5lbnRpdHlHZW5lcmF0b3JcblxuICAvLyBwcm9taXNpZml5IGFsbCB0aGUgdGhpbmdzXG4gIGNvbnN0IGNyZWF0ZVRhYmxlSWZOb3RFeGlzdHMgPSBwcm9taXNpZnkodGFibGVTZXJ2aWNlLmNyZWF0ZVRhYmxlSWZOb3RFeGlzdHMpLmJpbmQodGFibGVTZXJ2aWNlKVxuICBjb25zdCByZXRyaWV2ZUVudGl0eSA9IHByb21pc2lmeSh0YWJsZVNlcnZpY2UucmV0cmlldmVFbnRpdHkpLmJpbmQodGFibGVTZXJ2aWNlKVxuICBjb25zdCBpbnNlcnRPck1lcmdlRW50aXR5ID0gcHJvbWlzaWZ5KHRhYmxlU2VydmljZS5pbnNlcnRPck1lcmdlRW50aXR5KS5iaW5kKHRhYmxlU2VydmljZSlcbiAgY29uc3QgcXVlcnlFbnRpdGllcyA9IHByb21pc2lmeSh0YWJsZVNlcnZpY2UucXVlcnlFbnRpdGllcykuYmluZCh0YWJsZVNlcnZpY2UpXG5cbiAgZnVuY3Rpb24gZ2V0U3RvcmFnZSh0YWJsZSwgbW9kZWxOYW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldDogKGhhc2gsIHNlY29uZGFyeSkgPT4gbmV3IFByb21pc2UoYXN5bmMocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgY3JlYXRlVGFibGVJZk5vdEV4aXN0cyh0YWJsZSlcbiAgICAgICAgICBjb25zdCBtb2RlbCA9IG1vZGVsc1ttb2RlbE5hbWVdXG4gICAgICAgICAgY29uc3QgaGFzaEtleSA9IG1vZGVsLmhhc2hcbiAgICAgICAgICBjb25zdCBzZWNvbmRhcnlLZXkgPSBtb2RlbC5zZWNvbmRhcnlcbiAgICAgICAgICBkZWJ1ZyhgZmV0Y2hpbmcgZG9jIHdpdGggJHtoYXNoS2V5fSBvZiAke2hhc2h9IGZyb20gICR7dGFibGV9YClcblxuICAgICAgICAgIGlmIChoYXNoICYmICFzZWNvbmRhcnkpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgRGF0YSB9ID0gYXdhaXQgcmV0cmlldmVFbnRpdHkodGFibGUsICdwYXJ0aXRpb24nLCBTdHJpbmcoaGFzaCkpXG4gICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UoRGF0YS5fKSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gbmV3IGF6dXJlLlRhYmxlUXVlcnkoKS53aGVyZSgnPyA9PSA/Jywgc2Vjb25kYXJ5S2V5LCBzZWNvbmRhcnkpXG4gICAgICAgICAgICBpZiAoaGFzaCkgcXVlcnkgPSBxdWVyeS5hbmQoJz8gPT0gPycsIGhhc2hLZXksIGhhc2gpXG4gICAgICAgICAgICBjb25zdCB7IGVudHJpZXMgfSA9IGF3YWl0IHF1ZXJ5RW50aXRpZXModGFibGUsIHF1ZXJ5LCBudWxsKVxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IE9iamVjdC5rZXlzKGVudHJpZXMpLm1hcChrZXkgPT4gSlNPTi5wYXJzZShlbnRyaWVzW2tleV0uRGF0YS5fKSlbMF1cbiAgICAgICAgICAgIHJlc29sdmUoZGF0YSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgfVxuICAgICAgfSksXG5cbiAgICAgIHNhdmU6IGRhdGEgPT4gbmV3IFByb21pc2UoYXN5bmMocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCBleGlzdGluZ0RhdGEgPSB7fVxuICAgICAgICBjb25zdCBoYXNoS2V5ID0gbW9kZWxzW21vZGVsTmFtZV0uaGFzaFxuICAgICAgICBpZiAoaGFzaEtleSA9PT0gJ19pZCcgJiYgIWRhdGEuX2lkKSB7XG4gICAgICAgICAgZGF0YS5faWQgPSB1dWlkKClcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGRlYnVnKCdzYXZpbmcgZG9jIHdpdGggZGF0YTogJywgZGF0YSlcbiAgICAgICAgICBhd2FpdCBjcmVhdGVUYWJsZUlmTm90RXhpc3RzKHRhYmxlKVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IERhdGEgfSA9IGF3YWl0IHJldHJpZXZlRW50aXR5KHRhYmxlLCAncGFydGl0aW9uJywgU3RyaW5nKGRhdGFbaGFzaEtleV0pKVxuICAgICAgICAgICAgZXhpc3RpbmdEYXRhID0gRGF0YSAmJiBKU09OLnBhcnNlKERhdGEuXykgPyBKU09OLnBhcnNlKERhdGEuXykgOiB7fVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge31cbiAgICAgICAgICBhd2FpdCBpbnNlcnRPck1lcmdlRW50aXR5KHRhYmxlLCB7XG4gICAgICAgICAgICBQYXJ0aXRpb25LZXk6IGVudEdlbi5TdHJpbmcoJ3BhcnRpdGlvbicpLFxuICAgICAgICAgICAgUm93S2V5OiBTdHJpbmcoZGF0YVtoYXNoS2V5XSksXG4gICAgICAgICAgICBEYXRhOiBlbnRHZW4uU3RyaW5nKEpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oe30sIGV4aXN0aW5nRGF0YSwgZGF0YSkpKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGVycm9yKG5ldyBFcnJvcihlcnIpKVxuICAgICAgICB9XG4gICAgICB9KSxcblxuICAgICAgYWxsOiAocXVlcnkpID0+IG5ldyBQcm9taXNlKGFzeW5jKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBkZWJ1ZyhgZmV0Y2hpbmcgYWxsIHJlY29yZHMgaW46ICR7dGFibGV9YClcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgdGFibGVRdWVyeSA9IG5ldyBhenVyZS5UYWJsZVF1ZXJ5KClcbiAgICAgICAgICBpZiAocXVlcnkpIHtcbiAgICAgICAgICAgIHRhYmxlUXVlcnkgPSB0YWJsZVF1ZXJ5LndoZXJlKCc/ID09ID8nLCBxdWVyeS5rZXksIHF1ZXJ5LCB2YWx1ZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgYXdhaXQgY3JlYXRlVGFibGVJZk5vdEV4aXN0cyh0YWJsZSlcbiAgICAgICAgICBjb25zdCB7IGVudHJpZXMgfSA9IGF3YWl0IHF1ZXJ5RW50aXRpZXModGFibGUsIHRhYmxlUXVlcnksIG51bGwpXG4gICAgICAgICAgY29uc3QgZGF0YSA9IE9iamVjdC5rZXlzKGVudHJpZXMpLm1hcChrZXkgPT4gSlNPTi5wYXJzZShlbnRyaWVzW2tleV0uRGF0YS5fKSlcbiAgICAgICAgICByZXNvbHZlKGRhdGEpXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGVycm9yKGVycilcbiAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3RvcmFnZVxufVxuIl19