"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = exports.models = void 0;var _universalAnalytics = _interopRequireDefault(require("universal-analytics"));
var _findIndex = _interopRequireDefault(require("lodash/findIndex"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
var gaID = process.env.GOOGLE_ANALYTICS_ACCOUNT_ID;

var models = {
  interactions_daily_aggregation: {
    hash: 'date' },

  interactions_weekly_aggregation: {
    hash: 'date' },

  interactions_monthly_aggregation: {
    hash: 'date' },

  interactions_yearly_aggregation: {
    hash: 'date' } };exports.models = models;var _default =



function _default(_ref) {var logger = _ref.logger,storage = _ref.storage;return (/*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(bot, message, next) {var debug, visitor;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!(
                message.type !== 'message_received')) {_context.next = 2;break;}return _context.abrupt("return", next());case 2:
                logger = logger || function () {return console.log;};
                debug = logger('middleware:analytics', 'debug');

                // rollup interaction data
                aggregateInteractions(storage, message);

                // send to GA
                if (gaID) {
                  visitor = (0, _universalAnalytics["default"])(gaID, message.user);
                  debug('sending utterance event');
                  visitor.event('Utterance', message.text).send();
                }
                next();case 7:case "end":return _context.stop();}}}, _callee);}));return function (_x, _x2, _x3) {return _ref2.apply(this, arguments);};}());};exports["default"] = _default;function


aggregateInteractions(_x4, _x5) {return _aggregateInteractions.apply(this, arguments);}function _aggregateInteractions() {_aggregateInteractions = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(storage, message) {var periods;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
            periods = [
            { table: storage.interactions_daily_aggregation, date: new Date().setHours(0, 0, 0, 0) },
            { table: storage.interactions_weekly_aggregation, date: getStartOfWeek() },
            { table: storage.interactions_monthly_aggregation, date: getStartOfMonth() },
            { table: storage.interactions_yearly_aggregation, date: getStartOfYear() }];

            periods.forEach(function (period) {return handleAggregation(period.table, period.date, message);});case 2:case "end":return _context2.stop();}}}, _callee2);}));return _aggregateInteractions.apply(this, arguments);}function


handleAggregation(_x6, _x7, _x8) {return _handleAggregation.apply(this, arguments);}function _handleAggregation() {_handleAggregation = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(table, date, message) {var currentItem, users, userIndex;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.next = 2;return (
              table.get(date));case 2:currentItem = _context3.sent;
            users = currentItem ? currentItem.users : [];
            userIndex = (0, _findIndex["default"])(users, { userId: message.user });
            if (userIndex < 0) {
              users.push({
                userId: message.user,
                device: message.device });

            }
            table.save({
              date: date,
              users: users,
              total: currentItem ? currentItem.total + 1 : 1 });case 7:case "end":return _context3.stop();}}}, _callee3);}));return _handleAggregation.apply(this, arguments);}



function getStartOfWeek() {var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  d = new Date(d);
  var day = d.getDay();
  var diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).setHours(0, 0, 0, 0);
}

function getStartOfMonth() {var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  return new Date(d.setDate(1)).setHours(0, 0, 0, 0);
}

function getStartOfYear() {var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  return new Date(d.setMonth(0, 1)).setHours(0, 0, 0, 0);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbImdhSUQiLCJwcm9jZXNzIiwiZW52IiwiR09PR0xFX0FOQUxZVElDU19BQ0NPVU5UX0lEIiwibW9kZWxzIiwiaW50ZXJhY3Rpb25zX2RhaWx5X2FnZ3JlZ2F0aW9uIiwiaGFzaCIsImludGVyYWN0aW9uc193ZWVrbHlfYWdncmVnYXRpb24iLCJpbnRlcmFjdGlvbnNfbW9udGhseV9hZ2dyZWdhdGlvbiIsImludGVyYWN0aW9uc195ZWFybHlfYWdncmVnYXRpb24iLCJsb2dnZXIiLCJzdG9yYWdlIiwiYm90IiwibWVzc2FnZSIsIm5leHQiLCJ0eXBlIiwiY29uc29sZSIsImxvZyIsImRlYnVnIiwiYWdncmVnYXRlSW50ZXJhY3Rpb25zIiwidmlzaXRvciIsInVzZXIiLCJldmVudCIsInRleHQiLCJzZW5kIiwicGVyaW9kcyIsInRhYmxlIiwiZGF0ZSIsIkRhdGUiLCJzZXRIb3VycyIsImdldFN0YXJ0T2ZXZWVrIiwiZ2V0U3RhcnRPZk1vbnRoIiwiZ2V0U3RhcnRPZlllYXIiLCJmb3JFYWNoIiwicGVyaW9kIiwiaGFuZGxlQWdncmVnYXRpb24iLCJnZXQiLCJjdXJyZW50SXRlbSIsInVzZXJzIiwidXNlckluZGV4IiwidXNlcklkIiwicHVzaCIsImRldmljZSIsInNhdmUiLCJ0b3RhbCIsImQiLCJkYXkiLCJnZXREYXkiLCJkaWZmIiwiZ2V0RGF0ZSIsInNldERhdGUiLCJzZXRNb250aCJdLCJtYXBwaW5ncyI6IndIQUFBO0FBQ0EscUU7QUFDQSxJQUFNQSxJQUFJLEdBQUdDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQywyQkFBekI7O0FBRU8sSUFBTUMsTUFBTSxHQUFHO0FBQ3BCQyxFQUFBQSw4QkFBOEIsRUFBRTtBQUM5QkMsSUFBQUEsSUFBSSxFQUFFLE1BRHdCLEVBRFo7O0FBSXBCQyxFQUFBQSwrQkFBK0IsRUFBRTtBQUMvQkQsSUFBQUEsSUFBSSxFQUFFLE1BRHlCLEVBSmI7O0FBT3BCRSxFQUFBQSxnQ0FBZ0Ms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bmFseXRpY3MnXG5pbXBvcnQgZmluZEluZGV4IGZyb20gJ2xvZGFzaC9maW5kSW5kZXgnXG5jb25zdCBnYUlEID0gcHJvY2Vzcy5lbnYuR09PR0xFX0FOQUxZVElDU19BQ0NPVU5UX0lEXG5cbmV4cG9ydCBjb25zdCBtb2RlbHMgPSB7XG4gIGludGVyYWN0aW9uc19kYWlseV9hZ2dyZWdhdGlvbjoge1xuICAgIGhhc2g6ICdkYXRlJ1xuICB9LFxuICBpbnRlcmFjdGlvbnNfd2Vla2x5X2FnZ3JlZ2F0aW9uOiB7XG4gICAgaGFzaDogJ2RhdGUnXG4gIH0sXG4gIGludGVyYWN0aW9uc19tb250aGx5X2FnZ3JlZ2F0aW9uOiB7XG4gICAgaGFzaDogJ2RhdGUnXG4gIH0sXG4gIGludGVyYWN0aW9uc195ZWFybHlfYWdncmVnYXRpb246IHtcbiAgICBoYXNoOiAnZGF0ZSdcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCAoeyBsb2dnZXIsIHN0b3JhZ2UgfSkgPT4gYXN5bmMoYm90LCBtZXNzYWdlLCBuZXh0KSA9PiB7XG4gIGlmIChtZXNzYWdlLnR5cGUgIT09ICdtZXNzYWdlX3JlY2VpdmVkJykgcmV0dXJuIG5leHQoKVxuICBsb2dnZXIgPSBsb2dnZXIgfHwgKCgpID0+IGNvbnNvbGUubG9nKVxuICBjb25zdCBkZWJ1ZyA9IGxvZ2dlcignbWlkZGxld2FyZTphbmFseXRpY3MnLCAnZGVidWcnKVxuXG4gIC8vIHJvbGx1cCBpbnRlcmFjdGlvbiBkYXRhXG4gIGFnZ3JlZ2F0ZUludGVyYWN0aW9ucyhzdG9yYWdlLCBtZXNzYWdlKVxuXG4gIC8vIHNlbmQgdG8gR0FcbiAgaWYgKGdhSUQpIHtcbiAgICBjb25zdCB2aXNpdG9yID0gdWEoZ2FJRCwgbWVzc2FnZS51c2VyKVxuICAgIGRlYnVnKCdzZW5kaW5nIHV0dGVyYW5jZSBldmVudCcpXG4gICAgdmlzaXRvci5ldmVudCgnVXR0ZXJhbmNlJywgbWVzc2FnZS50ZXh0KS5zZW5kKClcbiAgfVxuICBuZXh0KClcbn1cblxuYXN5bmMgZnVuY3Rpb24gYWdncmVnYXRlSW50ZXJhY3Rpb25zKHN0b3JhZ2UsIG1lc3NhZ2UpIHtcbiAgY29uc3QgcGVyaW9kcyA9IFtcbiAgICB7IHRhYmxlOiBzdG9yYWdlLmludGVyYWN0aW9uc19kYWlseV9hZ2dyZWdhdGlvbiwgZGF0ZTogbmV3IERhdGUoKS5zZXRIb3VycygwLCAwLCAwLCAwKSB9LFxuICAgIHsgdGFibGU6IHN0b3JhZ2UuaW50ZXJhY3Rpb25zX3dlZWtseV9hZ2dyZWdhdGlvbiwgZGF0ZTogZ2V0U3RhcnRPZldlZWsoKSB9LFxuICAgIHsgdGFibGU6IHN0b3JhZ2UuaW50ZXJhY3Rpb25zX21vbnRobHlfYWdncmVnYXRpb24sIGRhdGU6IGdldFN0YXJ0T2ZNb250aCgpIH0sXG4gICAgeyB0YWJsZTogc3RvcmFnZS5pbnRlcmFjdGlvbnNfeWVhcmx5X2FnZ3JlZ2F0aW9uLCBkYXRlOiBnZXRTdGFydE9mWWVhcigpIH1cbiAgXVxuICBwZXJpb2RzLmZvckVhY2gocGVyaW9kID0+IGhhbmRsZUFnZ3JlZ2F0aW9uKHBlcmlvZC50YWJsZSwgcGVyaW9kLmRhdGUsIG1lc3NhZ2UpKVxufVxuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBZ2dyZWdhdGlvbih0YWJsZSwgZGF0ZSwgbWVzc2FnZSkge1xuICBjb25zdCBjdXJyZW50SXRlbSA9IGF3YWl0IHRhYmxlLmdldChkYXRlKVxuICBjb25zdCB1c2VycyA9IGN1cnJlbnRJdGVtID8gY3VycmVudEl0ZW0udXNlcnMgOiBbXVxuICBjb25zdCB1c2VySW5kZXggPSBmaW5kSW5kZXgodXNlcnMsIHsgdXNlcklkOiBtZXNzYWdlLnVzZXIgfSlcbiAgaWYgKHVzZXJJbmRleCA8IDApIHtcbiAgICB1c2Vycy5wdXNoKHtcbiAgICAgIHVzZXJJZDogbWVzc2FnZS51c2VyLFxuICAgICAgZGV2aWNlOiBtZXNzYWdlLmRldmljZVxuICAgIH0pXG4gIH1cbiAgdGFibGUuc2F2ZSh7XG4gICAgZGF0ZSxcbiAgICB1c2VycyxcbiAgICB0b3RhbDogY3VycmVudEl0ZW0gPyBjdXJyZW50SXRlbS50b3RhbCArIDEgOiAxXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGdldFN0YXJ0T2ZXZWVrKGQgPSBuZXcgRGF0ZSgpKSB7XG4gIGQgPSBuZXcgRGF0ZShkKVxuICB2YXIgZGF5ID0gZC5nZXREYXkoKVxuICB2YXIgZGlmZiA9IGQuZ2V0RGF0ZSgpIC0gZGF5ICsgKGRheSA9PT0gMCA/IC02IDogMSlcbiAgcmV0dXJuIG5ldyBEYXRlKGQuc2V0RGF0ZShkaWZmKSkuc2V0SG91cnMoMCwgMCwgMCwgMClcbn1cblxuZnVuY3Rpb24gZ2V0U3RhcnRPZk1vbnRoKGQgPSBuZXcgRGF0ZSgpKSB7XG4gIHJldHVybiBuZXcgRGF0ZShkLnNldERhdGUoMSkpLnNldEhvdXJzKDAsIDAsIDAsIDApXG59XG5cbmZ1bmN0aW9uIGdldFN0YXJ0T2ZZZWFyKGQgPSBuZXcgRGF0ZSgpKSB7XG4gIHJldHVybiBuZXcgRGF0ZShkLnNldE1vbnRoKDAsIDEpKS5zZXRIb3VycygwLCAwLCAwLCAwKVxufVxuIl19