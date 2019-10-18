"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = exports.ratingFlagMiddleware = exports.models = void 0;var _v = _interopRequireDefault(require("uuid/v1"));
var _universalAnalytics = _interopRequireDefault(require("universal-analytics"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

var gaID = process.env.GOOGLE_ANALYTICS_ACCOUNT_ID;

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
    secondary: 'date' } };exports.models = models;



var ratingFlagMiddleware = function ratingFlagMiddleware(_ref) {var logger = _ref.logger,storage = _ref.storage;return (/*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(bot, message, next) {var error;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                logger = logger || function () {return console.log;};
                error = logger('middleware:ratings', 'error');
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
                }case 3:case "end":return _context.stop();}}}, _callee);}));return function (_x, _x2, _x3) {return _ref2.apply(this, arguments);};}());};exports.ratingFlagMiddleware = ratingFlagMiddleware;var _default =


function _default(_ref3) {var logger = _ref3.logger,storage = _ref3.storage;return (/*#__PURE__*/function () {var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(bot, message, next) {var debug;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:if (!(
                message.type !== 'ratings_received')) {_context2.next = 2;break;}return _context2.abrupt("return", next());case 2:
                logger = logger || function () {return console.log;};
                debug = logger('middleware:ratings', 'debug');

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

                next();case 9:case "end":return _context2.stop();}}}, _callee2);}));return function (_x4, _x5, _x6) {return _ref4.apply(this, arguments);};}());};exports["default"] = _default;function


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbImdhSUQiLCJwcm9jZXNzIiwiZW52IiwiR09PR0xFX0FOQUxZVElDU19BQ0NPVU5UX0lEIiwibW9kZWxzIiwicmF0aW5ncyIsImhhc2giLCJzZWNvbmRhcnkiLCJyYXRpbmdzX2RhaWx5X2FnZ3JlZ2F0aW9uIiwicmF0aW5nc193ZWVrbHlfYWdncmVnYXRpb24iLCJyYXRpbmdzX21vbnRobHlfYWdncmVnYXRpb24iLCJyYXRpbmdzX3llYXJseV9hZ2dyZWdhdGlvbiIsInJhdGluZ0ZsYWdNaWRkbGV3YXJlIiwibG9nZ2VyIiwic3RvcmFnZSIsImJvdCIsIm1lc3NhZ2UiLCJuZXh0IiwiY29uc29sZSIsImxvZyIsImVycm9yIiwiaW50ZW50IiwicmVzcG9uc2VzIiwiZ2V0IiwidGhlbiIsInJlc3BvbnNlIiwibm9uRnVuY3Rpb25hbCIsInJhdGVNZSIsImVyciIsInR5cGUiLCJkZWJ1ZyIsInVzZXIiLCJldmVudCIsImVjIiwiZWEiLCJldiIsInZhbHVlIiwic2VuZCIsInNhdmUiLCJfaWQiLCJ1c2VySWQiLCJkYXRlIiwiRGF0ZSIsIm5vdyIsImludGVudE5hbWUiLCJhZ2dyZWdhdGVSYXRpbmdzIiwicGVyaW9kcyIsInRhYmxlIiwic2V0SG91cnMiLCJnZXRTdGFydE9mV2VlayIsImdldFN0YXJ0T2ZNb250aCIsImdldFN0YXJ0T2ZZZWFyIiwiZm9yRWFjaCIsInBlcmlvZCIsImhhbmRsZUFnZ3JlZ2F0aW9uIiwiY3VycmVudEl0ZW0iLCJjdXJyZW50UG9zaXRpdmUiLCJwb3NpdGl2ZSIsImN1cnJlbnROZWdhdGl2ZSIsIm5lZ2F0aXZlIiwidG90YWwiLCJkIiwiZGF5IiwiZ2V0RGF5IiwiZGlmZiIsImdldERhdGUiLCJzZXREYXRlIiwic2V0TW9udGgiXSwibWFwcGluZ3MiOiJ1SkFBQTtBQUNBLGlGOztBQUVBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDQyxHQUFSLENBQVlDLDJCQUF6Qjs7QUFFTyxJQUFN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RixDQUFVRixJQUFWLENBQVQsRUFBMEJoQixRQUExQixDQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5QyxDQUF6QyxFQUE0QyxDQUE1QyxDQUFQO0FBQ0Q7O0FBRUQsU0FBU0UsZUFBVCxHQUF5QyxLQUFoQlcsQ0FBZ0IsdUVBQVosSUFBSW5CLElBQUosRUFBWTtBQUN2QyxTQUFPLElBQUlBLElBQUosQ0FBU21CLENBQUMsQ0FBQ0ssT0FBRixDQUFVLENBQVYsQ0FBVCxFQUF1QmxCLFFBQXZCLENBQWdDLENBQWhDLEVBQW1DLENBQW5DLEVBQXNDLENBQXRDLEVBQXlDLENBQXpDLENBQVA7QUFDRDs7QUFFRCxTQUFTRyxjQUFULEdBQXdDLEtBQWhCVSxDQUFnQix1RUFBWixJQUFJbkIsSUFBSixFQUFZO0FBQ3RDLFNBQU8sSUFBSUEsSUFBSixDQUFTbUIsQ0FBQyxDQUFDTSxRQUFGLENBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBVCxFQUEyQm5CLFFBQTNCLENBQW9DLENBQXBDLEVBQXVDLENBQXZDLEVBQTBDLENBQTFDLEVBQTZDLENBQTdDLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1dWlkIGZyb20gJ3V1aWQvdjEnXG5pbXBvcnQgdWEgZnJvbSAndW5pdmVyc2FsLWFuYWx5dGljcydcblxuY29uc3QgZ2FJRCA9IHByb2Nlc3MuZW52LkdPT0dMRV9BTkFMWVRJQ1NfQUNDT1VOVF9JRFxuXG5leHBvcnQgY29uc3QgbW9kZWxzID0ge1xuICByYXRpbmdzOiB7XG4gICAgaGFzaDogJ3VzZXJJZCcsXG4gICAgc2Vjb25kYXJ5OiAnaW50ZW50TmFtZSdcbiAgfSxcbiAgcmF0aW5nc19kYWlseV9hZ2dyZWdhdGlvbjoge1xuICAgIGhhc2g6ICdpbnRlbnROYW1lJyxcbiAgICBzZWNvbmRhcnk6ICdkYXRlJ1xuICB9LFxuICByYXRpbmdzX3dlZWtseV9hZ2dyZWdhdGlvbjoge1xuICAgIGhhc2g6ICdpbnRlbnROYW1lJyxcbiAgICBzZWNvbmRhcnk6ICdkYXRlJ1xuICB9LFxuICByYXRpbmdzX21vbnRobHlfYWdncmVnYXRpb246IHtcbiAgICBoYXNoOiAnaW50ZW50TmFtZScsXG4gICAgc2Vjb25kYXJ5OiAnZGF0ZSdcbiAgfSxcbiAgcmF0aW5nc195ZWFybHlfYWdncmVnYXRpb246IHtcbiAgICBoYXNoOiAnaW50ZW50TmFtZScsXG4gICAgc2Vjb25kYXJ5OiAnZGF0ZSdcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgcmF0aW5nRmxhZ01pZGRsZXdhcmUgPSAoeyBsb2dnZXIsIHN0b3JhZ2UgfSkgPT4gYXN5bmMoYm90LCBtZXNzYWdlLCBuZXh0KSA9PiB7XG4gIGxvZ2dlciA9IGxvZ2dlciB8fCAoKCkgPT4gY29uc29sZS5sb2cpXG4gIGNvbnN0IGVycm9yID0gbG9nZ2VyKCdtaWRkbGV3YXJlOnJhdGluZ3MnLCAnZXJyb3InKVxuICBpZiAobWVzc2FnZS5pbnRlbnQpIHtcbiAgICBzdG9yYWdlLnJlc3BvbnNlcy5nZXQobWVzc2FnZS5pbnRlbnQpXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGlmIChyZXNwb25zZSAmJiAhcmVzcG9uc2Uubm9uRnVuY3Rpb25hbCkge1xuICAgICAgICAgIG1lc3NhZ2UucmF0ZU1lID0gbWVzc2FnZS5pbnRlbnRcbiAgICAgICAgfVxuICAgICAgICBuZXh0KClcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgZXJyb3IoZXJyKVxuICAgICAgICBuZXh0KClcbiAgICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgbmV4dCgpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgKHsgbG9nZ2VyLCBzdG9yYWdlIH0pID0+IGFzeW5jKGJvdCwgbWVzc2FnZSwgbmV4dCkgPT4ge1xuICBpZiAobWVzc2FnZS50eXBlICE9PSAncmF0aW5nc19yZWNlaXZlZCcpIHJldHVybiBuZXh0KClcbiAgbG9nZ2VyID0gbG9nZ2VyIHx8ICgoKSA9PiBjb25zb2xlLmxvZylcbiAgY29uc3QgZGVidWcgPSBsb2dnZXIoJ21pZGRsZXdhcmU6cmF0aW5ncycsICdkZWJ1ZycpXG5cbiAgZGVidWcoJ3NlbmRpbmcgaW50ZW50IHRyaWdnZXIgZXZlbnQnKVxuICBpZiAoZ2FJRCkge1xuICAgIHVhKGdhSUQsIG1lc3NhZ2UudXNlcikuZXZlbnQoe1xuICAgICAgZWM6ICdSYXRpbmcnLFxuICAgICAgZWE6IG1lc3NhZ2UuaW50ZW50LFxuICAgICAgZXY6IG1lc3NhZ2UudmFsdWUgPT09ICdwb3NpdGl2ZScgPyAxIDogLTFcbiAgICB9KS5zZW5kKClcbiAgfVxuXG4gIHN0b3JhZ2UucmF0aW5ncy5zYXZlKHtcbiAgICBfaWQ6IHV1aWQoKSxcbiAgICB1c2VySWQ6IG1lc3NhZ2UudXNlcixcbiAgICB2YWx1ZTogbWVzc2FnZS52YWx1ZSxcbiAgICBkYXRlOiBEYXRlLm5vdygpLFxuICAgIGludGVudE5hbWU6IG1lc3NhZ2UuaW50ZW50XG4gIH0pXG5cbiAgLy8gcm9sbCB1cCByYXRpbmdzXG4gIGFnZ3JlZ2F0ZVJhdGluZ3Moc3RvcmFnZSwgbWVzc2FnZSlcblxuICBuZXh0KClcbn1cblxuYXN5bmMgZnVuY3Rpb24gYWdncmVnYXRlUmF0aW5ncyhzdG9yYWdlLCBtZXNzYWdlKSB7XG4gIGNvbnN0IHBlcmlvZHMgPSBbXG4gICAgeyB0YWJsZTogc3RvcmFnZS5yYXRpbmdzX2RhaWx5X2FnZ3JlZ2F0aW9uLCBkYXRlOiBuZXcgRGF0ZSgpLnNldEhvdXJzKDAsIDAsIDAsIDApIH0sXG4gICAgeyB0YWJsZTogc3RvcmFnZS5yYXRpbmdzX3dlZWtseV9hZ2dyZWdhdGlvbiwgZGF0ZTogZ2V0U3RhcnRPZldlZWsoKSB9LFxuICAgIHsgdGFibGU6IHN0b3JhZ2UucmF0aW5nc19tb250aGx5X2FnZ3JlZ2F0aW9uLCBkYXRlOiBnZXRTdGFydE9mTW9udGgoKSB9LFxuICAgIHsgdGFibGU6IHN0b3JhZ2UucmF0aW5nc195ZWFybHlfYWdncmVnYXRpb24sIGRhdGU6IGdldFN0YXJ0T2ZZZWFyKCkgfVxuICBdXG4gIHBlcmlvZHMuZm9yRWFjaChwZXJpb2QgPT4gaGFuZGxlQWdncmVnYXRpb24ocGVyaW9kLnRhYmxlLCBwZXJpb2QuZGF0ZSwgbWVzc2FnZSkpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUFnZ3JlZ2F0aW9uKHRhYmxlLCBkYXRlLCBtZXNzYWdlKSB7XG4gIGNvbnN0IGN1cnJlbnRJdGVtID0gYXdhaXQgdGFibGUuZ2V0KG1lc3NhZ2UuaW50ZW50LCBkYXRlKVxuICBjb25zdCBjdXJyZW50UG9zaXRpdmUgPSBjdXJyZW50SXRlbSA/IGN1cnJlbnRJdGVtLnBvc2l0aXZlIDogMFxuICBjb25zdCBjdXJyZW50TmVnYXRpdmUgPSBjdXJyZW50SXRlbSA/IGN1cnJlbnRJdGVtLm5lZ2F0aXZlIDogMFxuICB0YWJsZS5zYXZlKHtcbiAgICBkYXRlLFxuICAgIGludGVudE5hbWU6IG1lc3NhZ2UuaW50ZW50LFxuICAgIHRvdGFsOiBjdXJyZW50SXRlbSA/IGN1cnJlbnRJdGVtLnRvdGFsICsgMSA6IDEsXG4gICAgcG9zaXRpdmU6IG1lc3NhZ2UudmFsdWUgPT09ICdwb3NpdGl2ZScgPyBjdXJyZW50UG9zaXRpdmUgKyAxIDogY3VycmVudFBvc2l0aXZlLFxuICAgIG5lZ2F0aXZlOiBtZXNzYWdlLnZhbHVlID09PSAnbmVnYXRpdmUnID8gY3VycmVudE5lZ2F0aXZlICsgMSA6IGN1cnJlbnROZWdhdGl2ZVxuICB9KVxufVxuXG5mdW5jdGlvbiBnZXRTdGFydE9mV2VlayhkID0gbmV3IERhdGUoKSkge1xuICBkID0gbmV3IERhdGUoZClcbiAgdmFyIGRheSA9IGQuZ2V0RGF5KClcbiAgdmFyIGRpZmYgPSBkLmdldERhdGUoKSAtIGRheSArIChkYXkgPT0gMCA/IC02IDogMSlcbiAgcmV0dXJuIG5ldyBEYXRlKGQuc2V0RGF0ZShkaWZmKSkuc2V0SG91cnMoMCwgMCwgMCwgMClcbn1cblxuZnVuY3Rpb24gZ2V0U3RhcnRPZk1vbnRoKGQgPSBuZXcgRGF0ZSgpKSB7XG4gIHJldHVybiBuZXcgRGF0ZShkLnNldERhdGUoMSkpLnNldEhvdXJzKDAsIDAsIDAsIDApXG59XG5cbmZ1bmN0aW9uIGdldFN0YXJ0T2ZZZWFyKGQgPSBuZXcgRGF0ZSgpKSB7XG4gIHJldHVybiBuZXcgRGF0ZShkLnNldE1vbnRoKDAsIDEpKS5zZXRIb3VycygwLCAwLCAwLCAwKVxufVxuIl19