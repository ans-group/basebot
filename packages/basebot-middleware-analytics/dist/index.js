"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _universalAnalytics = _interopRequireDefault(require("universal-analytics"));
var _findIndex = _interopRequireDefault(require("lodash/findIndex"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
var gaID = process.env.GOOGLE_ANALYTICS_ACCOUNT_ID;var _default =

function _default(_ref) {var logger = _ref.logger,storage = _ref.storage;
  logger = logger || function () {return console.log;};
  var debug = logger('middleware:analytics', 'debug');

  var models = {
    interactions_daily_aggregation: {
      hash: 'date' },

    interactions_weekly_aggregation: {
      hash: 'date' },

    interactions_monthly_aggregation: {
      hash: 'date' },

    interactions_yearly_aggregation: {
      hash: 'date' } };



  var receive = /*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(bot, message, next) {var visitor;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!(
              message.type !== 'message_received')) {_context.next = 2;break;}return _context.abrupt("return", next());case 2:

              // rollup interaction data
              aggregateInteractions(storage, message);

              // send to GA
              if (gaID) {
                visitor = (0, _universalAnalytics["default"])(gaID, message.user);
                debug('sending utterance event');
                visitor.event('Utterance', message.text).send();
              }
              next();case 5:case "end":return _context.stop();}}}, _callee);}));return function receive(_x, _x2, _x3) {return _ref2.apply(this, arguments);};}();


  return {
    models: models,
    receive: receive };

};exports["default"] = _default;function

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbImdhSUQiLCJwcm9jZXNzIiwiZW52IiwiR09PR0xFX0FOQUxZVElDU19BQ0NPVU5UX0lEIiwibG9nZ2VyIiwic3RvcmFnZSIsImNvbnNvbGUiLCJsb2ciLCJkZWJ1ZyIsIm1vZGVscyIsImludGVyYWN0aW9uc19kYWlseV9hZ2dyZWdhdGlvbiIsImhhc2giLCJpbnRlcmFjdGlvbnNfd2Vla2x5X2FnZ3JlZ2F0aW9uIiwiaW50ZXJhY3Rpb25zX21vbnRobHlfYWdncmVnYXRpb24iLCJpbnRlcmFjdGlvbnNfeWVhcmx5X2FnZ3JlZ2F0aW9uIiwicmVjZWl2ZSIsImJvdCIsIm1lc3NhZ2UiLCJuZXh0IiwidHlwZSIsImFnZ3JlZ2F0ZUludGVyYWN0aW9ucyIsInZpc2l0b3IiLCJ1c2VyIiwiZXZlbnQiLCJ0ZXh0Iiwic2VuZCIsInBlcmlvZHMiLCJ0YWJsZSIsImRhdGUiLCJEYXRlIiwic2V0SG91cnMiLCJnZXRTdGFydE9mV2VlayIsImdldFN0YXJ0T2ZNb250aCIsImdldFN0YXJ0T2ZZZWFyIiwiZm9yRWFjaCIsInBlcmlvZCIsImhhbmRsZUFnZ3JlZ2F0aW9uIiwiZ2V0IiwiY3VycmVudEl0ZW0iLCJ1c2VycyIsInVzZXJJbmRleCIsInVzZXJJZCIsInB1c2giLCJkZXZpY2UiLCJzYXZlIiwidG90YWwiLCJkIiwiZGF5IiwiZ2V0RGF5IiwiZGlmZiIsImdldERhdGUiLCJzZXREYXRlIiwic2V0TW9udGgiXSwibWFwcGluZ3MiOiJ1R0FBQTtBQUNBLHFFO0FBQ0EsSUFBTUEsSUFBSSxHQUFHQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsMkJBQXpCLEM7O0FBRWUsd0JBQXlCLEtBQXRCQyxNQUFzQixRQUF0QkEsTUFBc0IsQ0FBZEMsT0FBYyxRQUFkQSxPQUFjO0FBQ3RDRCxFQUFBQSxNQUFNLEdBQUdBLE1BQU0sSUFBSyxvQkFBTUUsT0FBTyxDQUFDQyxHQUFkLEVBQXBCO0FBQ0EsTUFBTUMsS0FBSyxHQUFHSixNQUFN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QUFULEVBQTJCdEIsUUFBM0IsQ0FBb0MsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFBMEMsQ0FBMUMsRUFBNkMsQ0FBN0MsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVhIGZyb20gJ3VuaXZlcnNhbC1hbmFseXRpY3MnXG5pbXBvcnQgZmluZEluZGV4IGZyb20gJ2xvZGFzaC9maW5kSW5kZXgnXG5jb25zdCBnYUlEID0gcHJvY2Vzcy5lbnYuR09PR0xFX0FOQUxZVElDU19BQ0NPVU5UX0lEXG5cbmV4cG9ydCBkZWZhdWx0ICh7IGxvZ2dlciwgc3RvcmFnZSB9KSA9PiB7XG4gIGxvZ2dlciA9IGxvZ2dlciB8fCAoKCkgPT4gY29uc29sZS5sb2cpXG4gIGNvbnN0IGRlYnVnID0gbG9nZ2VyKCdtaWRkbGV3YXJlOmFuYWx5dGljcycsICdkZWJ1ZycpXG5cbiAgY29uc3QgbW9kZWxzID0ge1xuICAgIGludGVyYWN0aW9uc19kYWlseV9hZ2dyZWdhdGlvbjoge1xuICAgICAgaGFzaDogJ2RhdGUnXG4gICAgfSxcbiAgICBpbnRlcmFjdGlvbnNfd2Vla2x5X2FnZ3JlZ2F0aW9uOiB7XG4gICAgICBoYXNoOiAnZGF0ZSdcbiAgICB9LFxuICAgIGludGVyYWN0aW9uc19tb250aGx5X2FnZ3JlZ2F0aW9uOiB7XG4gICAgICBoYXNoOiAnZGF0ZSdcbiAgICB9LFxuICAgIGludGVyYWN0aW9uc195ZWFybHlfYWdncmVnYXRpb246IHtcbiAgICAgIGhhc2g6ICdkYXRlJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlY2VpdmUgPSBhc3luYyhib3QsIG1lc3NhZ2UsIG5leHQpID0+IHtcbiAgICBpZiAobWVzc2FnZS50eXBlICE9PSAnbWVzc2FnZV9yZWNlaXZlZCcpIHJldHVybiBuZXh0KClcblxuICAgIC8vIHJvbGx1cCBpbnRlcmFjdGlvbiBkYXRhXG4gICAgYWdncmVnYXRlSW50ZXJhY3Rpb25zKHN0b3JhZ2UsIG1lc3NhZ2UpXG5cbiAgICAvLyBzZW5kIHRvIEdBXG4gICAgaWYgKGdhSUQpIHtcbiAgICAgIGNvbnN0IHZpc2l0b3IgPSB1YShnYUlELCBtZXNzYWdlLnVzZXIpXG4gICAgICBkZWJ1Zygnc2VuZGluZyB1dHRlcmFuY2UgZXZlbnQnKVxuICAgICAgdmlzaXRvci5ldmVudCgnVXR0ZXJhbmNlJywgbWVzc2FnZS50ZXh0KS5zZW5kKClcbiAgICB9XG4gICAgbmV4dCgpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIG1vZGVscyxcbiAgICByZWNlaXZlXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gYWdncmVnYXRlSW50ZXJhY3Rpb25zKHN0b3JhZ2UsIG1lc3NhZ2UpIHtcbiAgY29uc3QgcGVyaW9kcyA9IFtcbiAgICB7IHRhYmxlOiBzdG9yYWdlLmludGVyYWN0aW9uc19kYWlseV9hZ2dyZWdhdGlvbiwgZGF0ZTogbmV3IERhdGUoKS5zZXRIb3VycygwLCAwLCAwLCAwKSB9LFxuICAgIHsgdGFibGU6IHN0b3JhZ2UuaW50ZXJhY3Rpb25zX3dlZWtseV9hZ2dyZWdhdGlvbiwgZGF0ZTogZ2V0U3RhcnRPZldlZWsoKSB9LFxuICAgIHsgdGFibGU6IHN0b3JhZ2UuaW50ZXJhY3Rpb25zX21vbnRobHlfYWdncmVnYXRpb24sIGRhdGU6IGdldFN0YXJ0T2ZNb250aCgpIH0sXG4gICAgeyB0YWJsZTogc3RvcmFnZS5pbnRlcmFjdGlvbnNfeWVhcmx5X2FnZ3JlZ2F0aW9uLCBkYXRlOiBnZXRTdGFydE9mWWVhcigpIH1cbiAgXVxuICBwZXJpb2RzLmZvckVhY2gocGVyaW9kID0+IGhhbmRsZUFnZ3JlZ2F0aW9uKHBlcmlvZC50YWJsZSwgcGVyaW9kLmRhdGUsIG1lc3NhZ2UpKVxufVxuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBZ2dyZWdhdGlvbih0YWJsZSwgZGF0ZSwgbWVzc2FnZSkge1xuICBjb25zdCBjdXJyZW50SXRlbSA9IGF3YWl0IHRhYmxlLmdldChkYXRlKVxuICBjb25zdCB1c2VycyA9IGN1cnJlbnRJdGVtID8gY3VycmVudEl0ZW0udXNlcnMgOiBbXVxuICBjb25zdCB1c2VySW5kZXggPSBmaW5kSW5kZXgodXNlcnMsIHsgdXNlcklkOiBtZXNzYWdlLnVzZXIgfSlcbiAgaWYgKHVzZXJJbmRleCA8IDApIHtcbiAgICB1c2Vycy5wdXNoKHtcbiAgICAgIHVzZXJJZDogbWVzc2FnZS51c2VyLFxuICAgICAgZGV2aWNlOiBtZXNzYWdlLmRldmljZVxuICAgIH0pXG4gIH1cbiAgdGFibGUuc2F2ZSh7XG4gICAgZGF0ZSxcbiAgICB1c2VycyxcbiAgICB0b3RhbDogY3VycmVudEl0ZW0gPyBjdXJyZW50SXRlbS50b3RhbCArIDEgOiAxXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGdldFN0YXJ0T2ZXZWVrKGQgPSBuZXcgRGF0ZSgpKSB7XG4gIGQgPSBuZXcgRGF0ZShkKVxuICB2YXIgZGF5ID0gZC5nZXREYXkoKVxuICB2YXIgZGlmZiA9IGQuZ2V0RGF0ZSgpIC0gZGF5ICsgKGRheSA9PT0gMCA/IC02IDogMSlcbiAgcmV0dXJuIG5ldyBEYXRlKGQuc2V0RGF0ZShkaWZmKSkuc2V0SG91cnMoMCwgMCwgMCwgMClcbn1cblxuZnVuY3Rpb24gZ2V0U3RhcnRPZk1vbnRoKGQgPSBuZXcgRGF0ZSgpKSB7XG4gIHJldHVybiBuZXcgRGF0ZShkLnNldERhdGUoMSkpLnNldEhvdXJzKDAsIDAsIDAsIDApXG59XG5cbmZ1bmN0aW9uIGdldFN0YXJ0T2ZZZWFyKGQgPSBuZXcgRGF0ZSgpKSB7XG4gIHJldHVybiBuZXcgRGF0ZShkLnNldE1vbnRoKDAsIDEpKS5zZXRIb3VycygwLCAwLCAwLCAwKVxufVxuIl19