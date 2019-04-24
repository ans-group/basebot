"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _azureStorage = _interopRequireDefault(require("azure-storage"));
var _util = require("util");
var _logger = _interopRequireDefault(require("../logger"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

var debug = (0, _logger["default"])('services:storage:azureTables', 'debug');
var error = (0, _logger["default"])('services:storage:azureTables', 'error');

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
    all: all(usersRef) } };var _default =



driver;exports["default"] = _default;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlYnVnIiwiZXJyb3IiLCJ0YWJsZVByZWZpeCIsInByb2Nlc3MiLCJlbnYiLCJCT1RfTkFNRSIsInJlcGxhY2UiLCJ0b0xvd2VyQ2FzZSIsInRlYW1zUmVmIiwidXNlcnNSZWYiLCJjaGFubmVsc1JlZiIsImRyaXZlciIsInRlYW1zIiwiZ2V0Iiwic2F2ZSIsImFsbCIsImNoYW5uZWxzIiwidXNlcnMiLCJ0YWJsZVNlcnZpY2UiLCJhenVyZSIsImNyZWF0ZVRhYmxlU2VydmljZSIsIkRCX1VSTCIsImVudEdlbiIsIlRhYmxlVXRpbGl0aWVzIiwiZW50aXR5R2VuZXJhdG9yIiwiY3JlYXRlVGFibGVJZk5vdEV4aXN0cyIsImJpbmQiLCJyZXRyaWV2ZUVudGl0eSIsImluc2VydE9yTWVyZ2VFbnRpdHkiLCJxdWVyeUVudGl0aWVzIiwidGFibGUiLCJpZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiRGF0YSIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJleGlzdGluZ0RhdGEiLCJFcnJvciIsIlBhcnRpdGlvbktleSIsIlN0cmluZyIsIlJvd0tleSIsInN0cmluZ2lmeSIsIk9iamVjdCIsImFzc2lnbiIsIlRhYmxlUXVlcnkiLCJlbnRyaWVzIiwia2V5cyIsIm1hcCIsImtleSJdLCJtYXBwaW5ncyI6InVHQUFBO0FBQ0E7QUFDQSwyRDs7QUFFQSxJQUFNQSxLQUFLLEdBQUcsd0JBQU8sOEJBQVAsRUFBdUMsT0FBdkMsQ0FBZDtBQUNBLElBQU1DLEtBQUssR0FBRyx3QkFBTyw4QkFBUCxFQUF1QyxPQUF2QyxDQUFkOztBQUVBLElBQU1DLFdBQVcsR0FBRyxDQUFDQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsUUFBWixJQUF3QixTQUF6QixFQUFvQ0MsT0FBcEMsQ0FBNEMsZUFBNUMsRUFBNkQsRUFBN0QsRUFBaUVDLFdBQWpFLEVBQXBCO0FBQ0EsSUFBTUMsUUFBUSxhQUFNTixXQUFOLFVBQWQ7QUFDQSxJQUFN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QUFhLENBQUNDLEtBQUQsRUFBUSxJQUFJWCx5QkFBTTRCLFVBQVYsRUFBUixFQUFnQyxJQUFoQyxDQUpsQixnQ0FJYkMsT0FKYSxTQUliQSxPQUphO0FBS2ZaLGdCQUFBQSxJQUxlLEdBS1JTLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZRCxPQUFaLEVBQXFCRSxHQUFyQixDQUF5QixVQUFBQyxHQUFHLFVBQUlkLElBQUksQ0FBQ0MsS0FBTCxDQUFXVSxPQUFPLENBQUNHLEdBQUQsQ0FBUCxDQUFhaEIsSUFBYixDQUFrQixHQUFsQixDQUFYLENBQUosRUFBNUIsQ0FMUTtBQU1yQkYsZ0JBQUFBLE9BQU8sQ0FBQ0csSUFBRCxDQUFQLENBTnFCOztBQVFyQm5DLGdCQUFBQSxLQUFLLGNBQUw7QUFDQWlDLGdCQUFBQSxNQUFNLGNBQU4sQ0FUcUIsNEVBQVoseUVBQU4sRUFBUDs7O0FBWUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXp1cmUgZnJvbSAnYXp1cmUtc3RvcmFnZSdcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnXG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4uL2xvZ2dlcidcblxuY29uc3QgZGVidWcgPSBsb2dnZXIoJ3NlcnZpY2VzOnN0b3JhZ2U6YXp1cmVUYWJsZXMnLCAnZGVidWcnKVxuY29uc3QgZXJyb3IgPSBsb2dnZXIoJ3NlcnZpY2VzOnN0b3JhZ2U6YXp1cmVUYWJsZXMnLCAnZXJyb3InKVxuXG5jb25zdCB0YWJsZVByZWZpeCA9IChwcm9jZXNzLmVudi5CT1RfTkFNRSB8fCAnYmFzZWJvdCcpLnJlcGxhY2UoL1teYS16QS1aMC05XS9nLCAnJykudG9Mb3dlckNhc2UoKVxuY29uc3QgdGVhbXNSZWYgPSBgJHt0YWJsZVByZWZpeH1UZWFtc2BcbmNvbnN0IHVzZXJzUmVmID0gYCR7dGFibGVQcmVmaXh9VXNlcnNgXG5jb25zdCBjaGFubmVsc1JlZiA9IGAke3RhYmxlUHJlZml4fUNoYW5uZWxzYFxuXG5jb25zdCBkcml2ZXIgPSB7XG4gIHRlYW1zOiB7XG4gICAgZ2V0OiBnZXQodGVhbXNSZWYpLFxuICAgIHNhdmU6IHNhdmUodGVhbXNSZWYpLFxuICAgIGFsbDogYWxsKHRlYW1zUmVmKVxuICB9LFxuICBjaGFubmVsczoge1xuICAgIGdldDogZ2V0KGNoYW5uZWxzUmVmKSxcbiAgICBzYXZlOiBzYXZlKGNoYW5uZWxzUmVmKSxcbiAgICBhbGw6IGFsbChjaGFubmVsc1JlZilcbiAgfSxcbiAgdXNlcnM6IHtcbiAgICBnZXQ6IGdldCh1c2Vyc1JlZiksXG4gICAgc2F2ZTogc2F2ZSh1c2Vyc1JlZiksXG4gICAgYWxsOiBhbGwodXNlcnNSZWYpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZHJpdmVyXG5cbmNvbnN0IHRhYmxlU2VydmljZSA9IGF6dXJlLmNyZWF0ZVRhYmxlU2VydmljZShwcm9jZXNzLmVudi5EQl9VUkwpXG5jb25zdCBlbnRHZW4gPSBhenVyZS5UYWJsZVV0aWxpdGllcy5lbnRpdHlHZW5lcmF0b3JcblxuLy8gcHJvbWlzaWZpeSBhbGwgdGhlIHRoaW5nc1xuY29uc3QgY3JlYXRlVGFibGVJZk5vdEV4aXN0cyA9IHByb21pc2lmeSh0YWJsZVNlcnZpY2UuY3JlYXRlVGFibGVJZk5vdEV4aXN0cykuYmluZCh0YWJsZVNlcnZpY2UpXG5jb25zdCByZXRyaWV2ZUVudGl0eSA9IHByb21pc2lmeSh0YWJsZVNlcnZpY2UucmV0cmlldmVFbnRpdHkpLmJpbmQodGFibGVTZXJ2aWNlKVxuY29uc3QgaW5zZXJ0T3JNZXJnZUVudGl0eSA9IHByb21pc2lmeSh0YWJsZVNlcnZpY2UuaW5zZXJ0T3JNZXJnZUVudGl0eSkuYmluZCh0YWJsZVNlcnZpY2UpXG5jb25zdCBxdWVyeUVudGl0aWVzID0gcHJvbWlzaWZ5KHRhYmxlU2VydmljZS5xdWVyeUVudGl0aWVzKS5iaW5kKHRhYmxlU2VydmljZSlcblxuZnVuY3Rpb24gZ2V0ICh0YWJsZSkge1xuICByZXR1cm4gaWQgPT4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGRlYnVnKGBhdHRlbXB0aW5nIHRvIGZldGNoIGRvY3VtZW50IHdpdGggSUQ6ICR7aWR9YClcbiAgICB0cnkge1xuICAgICAgYXdhaXQgY3JlYXRlVGFibGVJZk5vdEV4aXN0cyh0YWJsZSlcbiAgICAgIGNvbnN0IHsgRGF0YSB9ID0gYXdhaXQgcmV0cmlldmVFbnRpdHkodGFibGUsICdwYXJ0aXRpb24nLCBpZClcbiAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKERhdGFbJ18nXSlcbiAgICAgIGRlYnVnKGBkb2N1bWVudCByZXRyaWV2ZWQ6YCwgZGF0YSlcbiAgICAgIHJlc29sdmUoZGF0YSlcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGVycm9yKGVycilcbiAgICAgIHJlc29sdmUobnVsbClcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHNhdmUgKHRhYmxlKSB7XG4gIHJldHVybiBkYXRhID0+IG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBkZWJ1Zygnc2F2aW5nOiAnLCBkYXRhKVxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBjcmVhdGVUYWJsZUlmTm90RXhpc3RzKHRhYmxlKVxuICAgICAgbGV0IGV4aXN0aW5nRGF0YSA9IHt9XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB7IERhdGEgfSA9IGF3YWl0IHJldHJpZXZlRW50aXR5KHRhYmxlLCAncGFydGl0aW9uJywgZGF0YS5pZClcbiAgICAgICAgZXhpc3RpbmdEYXRhID0gRGF0YSAmJiBKU09OLnBhcnNlKERhdGFbJ18nXSkgPyBKU09OLnBhcnNlKERhdGFbJ18nXSkgOiB7fVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGVycm9yKG5ldyBFcnJvcihlcnIpKVxuICAgICAgfVxuICAgICAgYXdhaXQgaW5zZXJ0T3JNZXJnZUVudGl0eSh0YWJsZSwge1xuICAgICAgICBQYXJ0aXRpb25LZXk6IGVudEdlbi5TdHJpbmcoJ3BhcnRpdGlvbicpLFxuICAgICAgICBSb3dLZXk6IGVudEdlbi5TdHJpbmcoZGF0YS5pZCksXG4gICAgICAgIERhdGE6IGVudEdlbi5TdHJpbmcoSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmFzc2lnbih7fSwgZXhpc3RpbmdEYXRhLCBkYXRhKSkpXG4gICAgICB9KVxuICAgICAgcmVzb2x2ZSgpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBlcnJvcihuZXcgRXJyb3IoZXJyKSlcbiAgICAgIHJlamVjdChlcnIpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBhbGwgKHRhYmxlKSB7XG4gIHJldHVybiAoKSA9PiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgZGVidWcoYGZldGNoaW5nIGFsbCByZWNvcmRzIGluOiAke3RhYmxlfWApXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGNyZWF0ZVRhYmxlSWZOb3RFeGlzdHModGFibGUpXG4gICAgICBjb25zdCB7IGVudHJpZXMgfSA9IGF3YWl0IHF1ZXJ5RW50aXRpZXModGFibGUsIG5ldyBhenVyZS5UYWJsZVF1ZXJ5KCksIG51bGwpXG4gICAgICBjb25zdCBkYXRhID0gT2JqZWN0LmtleXMoZW50cmllcykubWFwKGtleSA9PiBKU09OLnBhcnNlKGVudHJpZXNba2V5XS5EYXRhWydfJ10pKVxuICAgICAgcmVzb2x2ZShkYXRhKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZXJyb3IoZXJyKVxuICAgICAgcmVqZWN0KGVycilcbiAgICB9XG4gIH0pXG59XG4iXX0=