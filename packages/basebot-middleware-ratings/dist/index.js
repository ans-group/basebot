"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _v = _interopRequireDefault(require("uuid/v1"));
var _universalAnalytics = _interopRequireDefault(require("universal-analytics"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

var gaID = process.env.GOOGLE_ANALYTICS_ACCOUNT_ID;var _default =

function _default(_ref) {var logger = _ref.logger,storage = _ref.storage;
  logger = logger || function () {return console.log;};
  var debug = logger('middleware:ratings', 'debug');
  var error = logger('middleware:ratings', 'error');

  var models = {
    ratings: {
      hash: 'userId',
      secondary: 'intentName' },

    ratings_daily_aggregation: {
      hash: 'intentName',
      secondary: 'date' },

    ratings_weekly_aggregation: {
      hash: 'intentName',
      secondary: 'date' },

    ratings_monthly_aggregation: {
      hash: 'intentName',
      secondary: 'date' },

    ratings_yearly_aggregation: {
      hash: 'intentName',
      secondary: 'date' } };



  var send = /*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(bot, message, next) {return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
              if (message.intent) {
                storage.responses.get(message.intent).
                then(function (response) {
                  if (response && !response.nonFunctional) {
                    message.rateMe = message.intent;
                  }
                  next();
                })["catch"](
                function (err) {
                  error(err);
                  next();
                });
              } else {
                next();
              }case 1:case "end":return _context.stop();}}}, _callee);}));return function send(_x, _x2, _x3) {return _ref2.apply(this, arguments);};}();


  var receive = /*#__PURE__*/function () {var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(bot, message, next) {return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:if (!(
              message.type !== 'ratings_received')) {_context2.next = 2;break;}return _context2.abrupt("return", next());case 2:

              debug('sending intent trigger event');
              if (gaID) {
                (0, _universalAnalytics["default"])(gaID, message.user).event({
                  ec: 'Rating',
                  ea: message.intent,
                  ev: message.value === 'positive' ? 1 : -1 }).
                send();
              }

              storage.ratings.save({
                _id: (0, _v["default"])(),
                userId: message.user,
                value: message.value,
                date: Date.now(),
                intentName: message.intent });


              // roll up ratings
              aggregateRatings(storage, message);

              next();case 7:case "end":return _context2.stop();}}}, _callee2);}));return function receive(_x4, _x5, _x6) {return _ref3.apply(this, arguments);};}();


  return {
    send: send,
    receive: receive,
    models: models };

};exports["default"] = _default;function

aggregateRatings(_x7, _x8) {return _aggregateRatings.apply(this, arguments);}function _aggregateRatings() {_aggregateRatings = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(storage, message) {var periods;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
            periods = [
            { table: storage.ratings_daily_aggregation, date: new Date().setHours(0, 0, 0, 0) },
            { table: storage.ratings_weekly_aggregation, date: getStartOfWeek() },
            { table: storage.ratings_monthly_aggregation, date: getStartOfMonth() },
            { table: storage.ratings_yearly_aggregation, date: getStartOfYear() }];

            periods.forEach(function (period) {return handleAggregation(period.table, period.date, message);});case 2:case "end":return _context3.stop();}}}, _callee3);}));return _aggregateRatings.apply(this, arguments);}function


handleAggregation(_x9, _x10, _x11) {return _handleAggregation.apply(this, arguments);}function _handleAggregation() {_handleAggregation = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(table, date, message) {var currentItem, currentPositive, currentNegative;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (
              table.get(message.intent, date));case 2:currentItem = _context4.sent;
            currentPositive = currentItem ? currentItem.positive : 0;
            currentNegative = currentItem ? currentItem.negative : 0;
            table.save({
              date: date,
              intentName: message.intent,
              total: currentItem ? currentItem.total + 1 : 1,
              positive: message.value === 'positive' ? currentPositive + 1 : currentPositive,
              negative: message.value === 'negative' ? currentNegative + 1 : currentNegative });case 6:case "end":return _context4.stop();}}}, _callee4);}));return _handleAggregation.apply(this, arguments);}



function getStartOfWeek() {var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  d = new Date(d);
  var day = d.getDay();
  var diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff)).setHours(0, 0, 0, 0);
}

function getStartOfMonth() {var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  return new Date(d.setDate(1)).setHours(0, 0, 0, 0);
}

function getStartOfYear() {var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  return new Date(d.setMonth(0, 1)).setHours(0, 0, 0, 0);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbImdhSUQiLCJwcm9jZXNzIiwiZW52IiwiR09PR0xFX0FOQUxZVElDU19BQ0NPVU5UX0lEIiwibG9nZ2VyIiwic3RvcmFnZSIsImNvbnNvbGUiLCJsb2ciLCJkZWJ1ZyIsImVycm9yIiwibW9kZWxzIiwicmF0aW5ncyIsImhhc2giLCJzZWNvbmRhcnkiLCJyYXRpbmdzX2RhaWx5X2FnZ3JlZ2F0aW9uIiwicmF0aW5nc193ZWVrbHlfYWdncmVnYXRpb24iLCJyYXRpbmdzX21vbnRobHlfYWdncmVnYXRpb24iLCJyYXRpbmdzX3llYXJseV9hZ2dyZWdhdGlvbiIsInNlbmQiLCJib3QiLCJtZXNzYWdlIiwibmV4dCIsImludGVudCIsInJlc3BvbnNlcyIsImdldCIsInRoZW4iLCJyZXNwb25zZSIsIm5vbkZ1bmN0aW9uYWwiLCJyYXRlTWUiLCJlcnIiLCJyZWNlaXZlIiwidHlwZSIsInVzZXIiLCJldmVudCIsImVjIiwiZWEiLCJldiIsInZhbHVlIiwic2F2ZSIsIl9pZCIsInVzZXJJZCIsImRhdGUiLCJEYXRlIiwibm93IiwiaW50ZW50TmFtZSIsImFnZ3JlZ2F0ZVJhdGluZ3MiLCJwZXJpb2RzIiwidGFibGUiLCJzZXRIb3VycyIsImdldFN0YXJ0T2ZXZWVrIiwiZ2V0U3RhcnRPZk1vbnRoIiwiZ2V0U3RhcnRPZlllYXIiLCJmb3JFYWNoIiwicGVyaW9kIiwiaGFuZGxlQWdncmVnYXRpb24iLCJjdXJyZW50SXRlbSIsImN1cnJlbnRQb3NpdGl2ZSIsInBvc2l0aXZlIiwiY3VycmVudE5lZ2F0aXZlIiwibmVnYXRpdmUiLCJ0b3RhbCIsImQiLCJkYXkiLCJnZXREYXkiLCJkaWZmIiwiZ2V0RGF0ZSIsInNldERhdGUiLCJzZXRNb250aCJdLCJtYXBwaW5ncyI6InVHQUFBO0FBQ0EsaUY7O0FBRUEsSUFBTUEsSUFBSSxHQUFHQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsMkJBQXpCLEM7O0FBRWUsd0JBQXlCLEtBQXRCQyxN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VixDQUFULEVBQTBCaEIsUUFBMUIsQ0FBbUMsQ0FBbkMsRUFBc0MsQ0FBdEMsRUFBeUMsQ0FBekMsRUFBNEMsQ0FBNUMsQ0FBUDtBQUNEOztBQUVELFNBQVNFLGVBQVQsR0FBeUMsS0FBaEJXLENBQWdCLHVFQUFaLElBQUluQixJQUFKLEVBQVk7QUFDdkMsU0FBTyxJQUFJQSxJQUFKLENBQVNtQixDQUFDLENBQUNLLE9BQUYsQ0FBVSxDQUFWLENBQVQsRUFBdUJsQixRQUF2QixDQUFnQyxDQUFoQyxFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5QyxDQUF6QyxDQUFQO0FBQ0Q7O0FBRUQsU0FBU0csY0FBVCxHQUF3QyxLQUFoQlUsQ0FBZ0IsdUVBQVosSUFBSW5CLElBQUosRUFBWTtBQUN0QyxTQUFPLElBQUlBLElBQUosQ0FBU21CLENBQUMsQ0FBQ00sUUFBRixDQUFXLENBQVgsRUFBYyxDQUFkLENBQVQsRUFBMkJuQixRQUEzQixDQUFvQyxDQUFwQyxFQUF1QyxDQUF2QyxFQUEwQyxDQUExQyxFQUE2QyxDQUE3QyxDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXVpZCBmcm9tICd1dWlkL3YxJ1xuaW1wb3J0IHVhIGZyb20gJ3VuaXZlcnNhbC1hbmFseXRpY3MnXG5cbmNvbnN0IGdhSUQgPSBwcm9jZXNzLmVudi5HT09HTEVfQU5BTFlUSUNTX0FDQ09VTlRfSURcblxuZXhwb3J0IGRlZmF1bHQgKHsgbG9nZ2VyLCBzdG9yYWdlIH0pID0+IHtcbiAgbG9nZ2VyID0gbG9nZ2VyIHx8ICgoKSA9PiBjb25zb2xlLmxvZylcbiAgY29uc3QgZGVidWcgPSBsb2dnZXIoJ21pZGRsZXdhcmU6cmF0aW5ncycsICdkZWJ1ZycpXG4gIGNvbnN0IGVycm9yID0gbG9nZ2VyKCdtaWRkbGV3YXJlOnJhdGluZ3MnLCAnZXJyb3InKVxuXG4gIGNvbnN0IG1vZGVscyA9IHtcbiAgICByYXRpbmdzOiB7XG4gICAgICBoYXNoOiAndXNlcklkJyxcbiAgICAgIHNlY29uZGFyeTogJ2ludGVudE5hbWUnXG4gICAgfSxcbiAgICByYXRpbmdzX2RhaWx5X2FnZ3JlZ2F0aW9uOiB7XG4gICAgICBoYXNoOiAnaW50ZW50TmFtZScsXG4gICAgICBzZWNvbmRhcnk6ICdkYXRlJ1xuICAgIH0sXG4gICAgcmF0aW5nc193ZWVrbHlfYWdncmVnYXRpb246IHtcbiAgICAgIGhhc2g6ICdpbnRlbnROYW1lJyxcbiAgICAgIHNlY29uZGFyeTogJ2RhdGUnXG4gICAgfSxcbiAgICByYXRpbmdzX21vbnRobHlfYWdncmVnYXRpb246IHtcbiAgICAgIGhhc2g6ICdpbnRlbnROYW1lJyxcbiAgICAgIHNlY29uZGFyeTogJ2RhdGUnXG4gICAgfSxcbiAgICByYXRpbmdzX3llYXJseV9hZ2dyZWdhdGlvbjoge1xuICAgICAgaGFzaDogJ2ludGVudE5hbWUnLFxuICAgICAgc2Vjb25kYXJ5OiAnZGF0ZSdcbiAgICB9XG4gIH1cblxuICBjb25zdCBzZW5kID0gYXN5bmMoYm90LCBtZXNzYWdlLCBuZXh0KSA9PiB7XG4gICAgaWYgKG1lc3NhZ2UuaW50ZW50KSB7XG4gICAgICBzdG9yYWdlLnJlc3BvbnNlcy5nZXQobWVzc2FnZS5pbnRlbnQpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgIXJlc3BvbnNlLm5vbkZ1bmN0aW9uYWwpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UucmF0ZU1lID0gbWVzc2FnZS5pbnRlbnRcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV4dCgpXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIGVycm9yKGVycilcbiAgICAgICAgICBuZXh0KClcbiAgICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dCgpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVjZWl2ZSA9IGFzeW5jKGJvdCwgbWVzc2FnZSwgbmV4dCkgPT4ge1xuICAgIGlmIChtZXNzYWdlLnR5cGUgIT09ICdyYXRpbmdzX3JlY2VpdmVkJykgcmV0dXJuIG5leHQoKVxuXG4gICAgZGVidWcoJ3NlbmRpbmcgaW50ZW50IHRyaWdnZXIgZXZlbnQnKVxuICAgIGlmIChnYUlEKSB7XG4gICAgICB1YShnYUlELCBtZXNzYWdlLnVzZXIpLmV2ZW50KHtcbiAgICAgICAgZWM6ICdSYXRpbmcnLFxuICAgICAgICBlYTogbWVzc2FnZS5pbnRlbnQsXG4gICAgICAgIGV2OiBtZXNzYWdlLnZhbHVlID09PSAncG9zaXRpdmUnID8gMSA6IC0xXG4gICAgICB9KS5zZW5kKClcbiAgICB9XG5cbiAgICBzdG9yYWdlLnJhdGluZ3Muc2F2ZSh7XG4gICAgICBfaWQ6IHV1aWQoKSxcbiAgICAgIHVzZXJJZDogbWVzc2FnZS51c2VyLFxuICAgICAgdmFsdWU6IG1lc3NhZ2UudmFsdWUsXG4gICAgICBkYXRlOiBEYXRlLm5vdygpLFxuICAgICAgaW50ZW50TmFtZTogbWVzc2FnZS5pbnRlbnRcbiAgICB9KVxuXG4gICAgLy8gcm9sbCB1cCByYXRpbmdzXG4gICAgYWdncmVnYXRlUmF0aW5ncyhzdG9yYWdlLCBtZXNzYWdlKVxuXG4gICAgbmV4dCgpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHNlbmQsXG4gICAgcmVjZWl2ZSxcbiAgICBtb2RlbHNcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBhZ2dyZWdhdGVSYXRpbmdzKHN0b3JhZ2UsIG1lc3NhZ2UpIHtcbiAgY29uc3QgcGVyaW9kcyA9IFtcbiAgICB7IHRhYmxlOiBzdG9yYWdlLnJhdGluZ3NfZGFpbHlfYWdncmVnYXRpb24sIGRhdGU6IG5ldyBEYXRlKCkuc2V0SG91cnMoMCwgMCwgMCwgMCkgfSxcbiAgICB7IHRhYmxlOiBzdG9yYWdlLnJhdGluZ3Nfd2Vla2x5X2FnZ3JlZ2F0aW9uLCBkYXRlOiBnZXRTdGFydE9mV2VlaygpIH0sXG4gICAgeyB0YWJsZTogc3RvcmFnZS5yYXRpbmdzX21vbnRobHlfYWdncmVnYXRpb24sIGRhdGU6IGdldFN0YXJ0T2ZNb250aCgpIH0sXG4gICAgeyB0YWJsZTogc3RvcmFnZS5yYXRpbmdzX3llYXJseV9hZ2dyZWdhdGlvbiwgZGF0ZTogZ2V0U3RhcnRPZlllYXIoKSB9XG4gIF1cbiAgcGVyaW9kcy5mb3JFYWNoKHBlcmlvZCA9PiBoYW5kbGVBZ2dyZWdhdGlvbihwZXJpb2QudGFibGUsIHBlcmlvZC5kYXRlLCBtZXNzYWdlKSlcbn1cblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQWdncmVnYXRpb24odGFibGUsIGRhdGUsIG1lc3NhZ2UpIHtcbiAgY29uc3QgY3VycmVudEl0ZW0gPSBhd2FpdCB0YWJsZS5nZXQobWVzc2FnZS5pbnRlbnQsIGRhdGUpXG4gIGNvbnN0IGN1cnJlbnRQb3NpdGl2ZSA9IGN1cnJlbnRJdGVtID8gY3VycmVudEl0ZW0ucG9zaXRpdmUgOiAwXG4gIGNvbnN0IGN1cnJlbnROZWdhdGl2ZSA9IGN1cnJlbnRJdGVtID8gY3VycmVudEl0ZW0ubmVnYXRpdmUgOiAwXG4gIHRhYmxlLnNhdmUoe1xuICAgIGRhdGUsXG4gICAgaW50ZW50TmFtZTogbWVzc2FnZS5pbnRlbnQsXG4gICAgdG90YWw6IGN1cnJlbnRJdGVtID8gY3VycmVudEl0ZW0udG90YWwgKyAxIDogMSxcbiAgICBwb3NpdGl2ZTogbWVzc2FnZS52YWx1ZSA9PT0gJ3Bvc2l0aXZlJyA/IGN1cnJlbnRQb3NpdGl2ZSArIDEgOiBjdXJyZW50UG9zaXRpdmUsXG4gICAgbmVnYXRpdmU6IG1lc3NhZ2UudmFsdWUgPT09ICduZWdhdGl2ZScgPyBjdXJyZW50TmVnYXRpdmUgKyAxIDogY3VycmVudE5lZ2F0aXZlXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGdldFN0YXJ0T2ZXZWVrKGQgPSBuZXcgRGF0ZSgpKSB7XG4gIGQgPSBuZXcgRGF0ZShkKVxuICB2YXIgZGF5ID0gZC5nZXREYXkoKVxuICB2YXIgZGlmZiA9IGQuZ2V0RGF0ZSgpIC0gZGF5ICsgKGRheSA9PSAwID8gLTYgOiAxKVxuICByZXR1cm4gbmV3IERhdGUoZC5zZXREYXRlKGRpZmYpKS5zZXRIb3VycygwLCAwLCAwLCAwKVxufVxuXG5mdW5jdGlvbiBnZXRTdGFydE9mTW9udGgoZCA9IG5ldyBEYXRlKCkpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKGQuc2V0RGF0ZSgxKSkuc2V0SG91cnMoMCwgMCwgMCwgMClcbn1cblxuZnVuY3Rpb24gZ2V0U3RhcnRPZlllYXIoZCA9IG5ldyBEYXRlKCkpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKGQuc2V0TW9udGgoMCwgMSkpLnNldEhvdXJzKDAsIDAsIDAsIDApXG59XG4iXX0=