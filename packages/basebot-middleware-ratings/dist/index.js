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


function _default(_ref3) {var logger = _ref3.logger,storage = _ref3.storage;return (/*#__PURE__*/function () {var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(bot, message, next) {var debug;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
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

                next();case 7:case "end":return _context2.stop();}}}, _callee2);}));return function (_x4, _x5, _x6) {return _ref4.apply(this, arguments);};}());};exports["default"] = _default;function


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbImdhSUQiLCJwcm9jZXNzIiwiZW52IiwiR09PR0xFX0FOQUxZVElDU19BQ0NPVU5UX0lEIiwibW9kZWxzIiwicmF0aW5ncyIsImhhc2giLCJzZWNvbmRhcnkiLCJyYXRpbmdzX2RhaWx5X2FnZ3JlZ2F0aW9uIiwicmF0aW5nc193ZWVrbHlfYWdncmVnYXRpb24iLCJyYXRpbmdzX21vbnRobHlfYWdncmVnYXRpb24iLCJyYXRpbmdzX3llYXJseV9hZ2dyZWdhdGlvbiIsInJhdGluZ0ZsYWdNaWRkbGV3YXJlIiwibG9nZ2VyIiwic3RvcmFnZSIsImJvdCIsIm1lc3NhZ2UiLCJuZXh0IiwiY29uc29sZSIsImxvZyIsImVycm9yIiwiaW50ZW50IiwicmVzcG9uc2VzIiwiZ2V0IiwidGhlbiIsInJlc3BvbnNlIiwibm9uRnVuY3Rpb25hbCIsInJhdGVNZSIsImVyciIsImRlYnVnIiwidXNlciIsImV2ZW50IiwiZWMiLCJlYSIsImV2IiwidmFsdWUiLCJzZW5kIiwic2F2ZSIsIl9pZCIsInVzZXJJZCIsImRhdGUiLCJEYXRlIiwibm93IiwiaW50ZW50TmFtZSIsImFnZ3JlZ2F0ZVJhdGluZ3MiLCJwZXJpb2RzIiwidGFibGUiLCJzZXRIb3VycyIsImdldFN0YXJ0T2ZXZWVrIiwiZ2V0U3RhcnRPZk1vbnRoIiwiZ2V0U3RhcnRPZlllYXIiLCJmb3JFYWNoIiwicGVyaW9kIiwiaGFuZGxlQWdncmVnYXRpb24iLCJjdXJyZW50SXRlbSIsImN1cnJlbnRQb3NpdGl2ZSIsInBvc2l0aXZlIiwiY3VycmVudE5lZ2F0aXZlIiwibmVnYXRpdmUiLCJ0b3RhbCIsImQiLCJkYXkiLCJnZXREYXkiLCJkaWZmIiwiZ2V0RGF0ZSIsInNldERhdGUiLCJzZXRNb250aCJdLCJtYXBwaW5ncyI6InVKQUFBO0FBQ0EsaUY7O0FBRUEsSUFBTUEsSUFBSSxHQUFHQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsMkJBQXpCOztBQUVPLElBQU1DLE1BQU0s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LEVBQTRDLENBQTVDLENBQVA7QUFDRDs7QUFFRCxTQUFTRSxlQUFULEdBQXlDLEtBQWhCVyxDQUFnQix1RUFBWixJQUFJbkIsSUFBSixFQUFZO0FBQ3ZDLFNBQU8sSUFBSUEsSUFBSixDQUFTbUIsQ0FBQyxDQUFDSyxPQUFGLENBQVUsQ0FBVixDQUFULEVBQXVCbEIsUUFBdkIsQ0FBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkMsRUFBc0MsQ0FBdEMsRUFBeUMsQ0FBekMsQ0FBUDtBQUNEOztBQUVELFNBQVNHLGNBQVQsR0FBd0MsS0FBaEJVLENBQWdCLHVFQUFaLElBQUluQixJQUFKLEVBQVk7QUFDdEMsU0FBTyxJQUFJQSxJQUFKLENBQVNtQixDQUFDLENBQUNNLFFBQUYsQ0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFULEVBQTJCbkIsUUFBM0IsQ0FBb0MsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFBMEMsQ0FBMUMsRUFBNkMsQ0FBN0MsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHV1aWQgZnJvbSAndXVpZC92MSdcbmltcG9ydCB1YSBmcm9tICd1bml2ZXJzYWwtYW5hbHl0aWNzJ1xuXG5jb25zdCBnYUlEID0gcHJvY2Vzcy5lbnYuR09PR0xFX0FOQUxZVElDU19BQ0NPVU5UX0lEXG5cbmV4cG9ydCBjb25zdCBtb2RlbHMgPSB7XG4gIHJhdGluZ3M6IHtcbiAgICBoYXNoOiAndXNlcklkJyxcbiAgICBzZWNvbmRhcnk6ICdpbnRlbnROYW1lJ1xuICB9LFxuICByYXRpbmdzX2RhaWx5X2FnZ3JlZ2F0aW9uOiB7XG4gICAgaGFzaDogJ2ludGVudE5hbWUnLFxuICAgIHNlY29uZGFyeTogJ2RhdGUnXG4gIH0sXG4gIHJhdGluZ3Nfd2Vla2x5X2FnZ3JlZ2F0aW9uOiB7XG4gICAgaGFzaDogJ2ludGVudE5hbWUnLFxuICAgIHNlY29uZGFyeTogJ2RhdGUnXG4gIH0sXG4gIHJhdGluZ3NfbW9udGhseV9hZ2dyZWdhdGlvbjoge1xuICAgIGhhc2g6ICdpbnRlbnROYW1lJyxcbiAgICBzZWNvbmRhcnk6ICdkYXRlJ1xuICB9LFxuICByYXRpbmdzX3llYXJseV9hZ2dyZWdhdGlvbjoge1xuICAgIGhhc2g6ICdpbnRlbnROYW1lJyxcbiAgICBzZWNvbmRhcnk6ICdkYXRlJ1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCByYXRpbmdGbGFnTWlkZGxld2FyZSA9ICh7IGxvZ2dlciwgc3RvcmFnZSB9KSA9PiBhc3luYyhib3QsIG1lc3NhZ2UsIG5leHQpID0+IHtcbiAgbG9nZ2VyID0gbG9nZ2VyIHx8ICgoKSA9PiBjb25zb2xlLmxvZylcbiAgY29uc3QgZXJyb3IgPSBsb2dnZXIoJ21pZGRsZXdhcmU6cmF0aW5ncycsICdlcnJvcicpXG4gIGlmIChtZXNzYWdlLmludGVudCkge1xuICAgIHN0b3JhZ2UucmVzcG9uc2VzLmdldChtZXNzYWdlLmludGVudClcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlICYmICFyZXNwb25zZS5ub25GdW5jdGlvbmFsKSB7XG4gICAgICAgICAgbWVzc2FnZS5yYXRlTWUgPSBtZXNzYWdlLmludGVudFxuICAgICAgICB9XG4gICAgICAgIG5leHQoKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICBlcnJvcihlcnIpXG4gICAgICAgIG5leHQoKVxuICAgICAgfSlcbiAgfSBlbHNlIHtcbiAgICBuZXh0KClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCAoeyBsb2dnZXIsIHN0b3JhZ2UgfSkgPT4gYXN5bmMoYm90LCBtZXNzYWdlLCBuZXh0KSA9PiB7XG4gIGxvZ2dlciA9IGxvZ2dlciB8fCAoKCkgPT4gY29uc29sZS5sb2cpXG4gIGNvbnN0IGRlYnVnID0gbG9nZ2VyKCdtaWRkbGV3YXJlOnJhdGluZ3MnLCAnZGVidWcnKVxuXG4gIGRlYnVnKCdzZW5kaW5nIGludGVudCB0cmlnZ2VyIGV2ZW50JylcbiAgaWYgKGdhSUQpIHtcbiAgICB1YShnYUlELCBtZXNzYWdlLnVzZXIpLmV2ZW50KHtcbiAgICAgIGVjOiAnUmF0aW5nJyxcbiAgICAgIGVhOiBtZXNzYWdlLmludGVudCxcbiAgICAgIGV2OiBtZXNzYWdlLnZhbHVlID09PSAncG9zaXRpdmUnID8gMSA6IC0xXG4gICAgfSkuc2VuZCgpXG4gIH1cblxuICBzdG9yYWdlLnJhdGluZ3Muc2F2ZSh7XG4gICAgX2lkOiB1dWlkKCksXG4gICAgdXNlcklkOiBtZXNzYWdlLnVzZXIsXG4gICAgdmFsdWU6IG1lc3NhZ2UudmFsdWUsXG4gICAgZGF0ZTogRGF0ZS5ub3coKSxcbiAgICBpbnRlbnROYW1lOiBtZXNzYWdlLmludGVudFxuICB9KVxuXG4gIC8vIHJvbGwgdXAgcmF0aW5nc1xuICBhZ2dyZWdhdGVSYXRpbmdzKHN0b3JhZ2UsIG1lc3NhZ2UpXG5cbiAgbmV4dCgpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGFnZ3JlZ2F0ZVJhdGluZ3Moc3RvcmFnZSwgbWVzc2FnZSkge1xuICBjb25zdCBwZXJpb2RzID0gW1xuICAgIHsgdGFibGU6IHN0b3JhZ2UucmF0aW5nc19kYWlseV9hZ2dyZWdhdGlvbiwgZGF0ZTogbmV3IERhdGUoKS5zZXRIb3VycygwLCAwLCAwLCAwKSB9LFxuICAgIHsgdGFibGU6IHN0b3JhZ2UucmF0aW5nc193ZWVrbHlfYWdncmVnYXRpb24sIGRhdGU6IGdldFN0YXJ0T2ZXZWVrKCkgfSxcbiAgICB7IHRhYmxlOiBzdG9yYWdlLnJhdGluZ3NfbW9udGhseV9hZ2dyZWdhdGlvbiwgZGF0ZTogZ2V0U3RhcnRPZk1vbnRoKCkgfSxcbiAgICB7IHRhYmxlOiBzdG9yYWdlLnJhdGluZ3NfeWVhcmx5X2FnZ3JlZ2F0aW9uLCBkYXRlOiBnZXRTdGFydE9mWWVhcigpIH1cbiAgXVxuICBwZXJpb2RzLmZvckVhY2gocGVyaW9kID0+IGhhbmRsZUFnZ3JlZ2F0aW9uKHBlcmlvZC50YWJsZSwgcGVyaW9kLmRhdGUsIG1lc3NhZ2UpKVxufVxuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBZ2dyZWdhdGlvbih0YWJsZSwgZGF0ZSwgbWVzc2FnZSkge1xuICBjb25zdCBjdXJyZW50SXRlbSA9IGF3YWl0IHRhYmxlLmdldChtZXNzYWdlLmludGVudCwgZGF0ZSlcbiAgY29uc3QgY3VycmVudFBvc2l0aXZlID0gY3VycmVudEl0ZW0gPyBjdXJyZW50SXRlbS5wb3NpdGl2ZSA6IDBcbiAgY29uc3QgY3VycmVudE5lZ2F0aXZlID0gY3VycmVudEl0ZW0gPyBjdXJyZW50SXRlbS5uZWdhdGl2ZSA6IDBcbiAgdGFibGUuc2F2ZSh7XG4gICAgZGF0ZSxcbiAgICBpbnRlbnROYW1lOiBtZXNzYWdlLmludGVudCxcbiAgICB0b3RhbDogY3VycmVudEl0ZW0gPyBjdXJyZW50SXRlbS50b3RhbCArIDEgOiAxLFxuICAgIHBvc2l0aXZlOiBtZXNzYWdlLnZhbHVlID09PSAncG9zaXRpdmUnID8gY3VycmVudFBvc2l0aXZlICsgMSA6IGN1cnJlbnRQb3NpdGl2ZSxcbiAgICBuZWdhdGl2ZTogbWVzc2FnZS52YWx1ZSA9PT0gJ25lZ2F0aXZlJyA/IGN1cnJlbnROZWdhdGl2ZSArIDEgOiBjdXJyZW50TmVnYXRpdmVcbiAgfSlcbn1cblxuZnVuY3Rpb24gZ2V0U3RhcnRPZldlZWsoZCA9IG5ldyBEYXRlKCkpIHtcbiAgZCA9IG5ldyBEYXRlKGQpXG4gIHZhciBkYXkgPSBkLmdldERheSgpXG4gIHZhciBkaWZmID0gZC5nZXREYXRlKCkgLSBkYXkgKyAoZGF5ID09IDAgPyAtNiA6IDEpXG4gIHJldHVybiBuZXcgRGF0ZShkLnNldERhdGUoZGlmZikpLnNldEhvdXJzKDAsIDAsIDAsIDApXG59XG5cbmZ1bmN0aW9uIGdldFN0YXJ0T2ZNb250aChkID0gbmV3IERhdGUoKSkge1xuICByZXR1cm4gbmV3IERhdGUoZC5zZXREYXRlKDEpKS5zZXRIb3VycygwLCAwLCAwLCAwKVxufVxuXG5mdW5jdGlvbiBnZXRTdGFydE9mWWVhcihkID0gbmV3IERhdGUoKSkge1xuICByZXR1cm4gbmV3IERhdGUoZC5zZXRNb250aCgwLCAxKSkuc2V0SG91cnMoMCwgMCwgMCwgMClcbn1cbiJdfQ==