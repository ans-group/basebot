"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.notify = exports.schedule = void 0;var _nodeSchedule = _interopRequireDefault(require("node-schedule"));
var _firebase = _interopRequireDefault(require("./firebase"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

var notify = /*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {var userId, storage, payload, user, notification, status;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:userId = _ref.userId, storage = _ref.storage, payload = _ref.payload;_context.prev = 1;if (

            storage) {_context.next = 4;break;}return _context.abrupt("return", console.warn('Storage is required'));case 4:_context.next = 6;return (
              storage.users.get(userId));case 6:user = _context.sent;if (!(
            user && user.pushToken)) {_context.next = 13;break;}
            notification = {
              notification: {
                body: payload.text },

              data: payload,
              token: user.pushToken };

            status = _firebase["default"].send(notification);return _context.abrupt("return",
            true);case 13:return _context.abrupt("return",

            console.warn("Can't send notification to user ".concat(uid, ": no user or push token found")));case 14:_context.next = 19;break;case 16:_context.prev = 16;_context.t0 = _context["catch"](1);


            console.error(_context.t0);case 19:case "end":return _context.stop();}}}, _callee, null, [[1, 16]]);}));return function notify(_x) {return _ref2.apply(this, arguments);};}();exports.notify = notify;



var schedule = function schedule(at, notification) {
  _nodeSchedule["default"].scheduleJob(at, function () {return notify(notification);});
};exports.schedule = schedule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbIm5vdGlmeSIsInVzZXJJZCIsInN0b3JhZ2UiLCJwYXlsb2FkIiwiY29uc29sZSIsIndhcm4iLCJ1c2VycyIsImdldCIsInVzZXIiLCJwdXNoVG9rZW4iLCJub3RpZmljYXRpb24iLCJib2R5IiwidGV4dCIsImRhdGEiLCJ0b2tlbiIsInN0YXR1cyIsIm1lc3NhZ2luZyIsInNlbmQiLCJ1aWQiLCJlcnJvciIsInNjaGVkdWxlIiwiYXQiLCJucyIsInNjaGVkdWxlSm9iIl0sIm1hcHBpbmdzIjoic0hBQUE7QUFDQSw4RDs7QUFFQSxJQUFNQSxNQUFNLGlHQUFHLHVNQUFpQkMsTUFBakIsUUFBaUJBLE1BQWpCLEVBQXlCQyxPQUF6QixRQUF5QkEsT0FBekIsRUFBa0NDLE9BQWxDLFFBQWtDQSxPQUFsQzs7QUFFTkQsWUFBQUEsT0FGTSw2REFFVUUsT0FBTyxDQUFDQyxJQUFSLENBQWEscUJBQWIsQ0FGVjtBQUdRSCxjQUFBQSxPQUFPLENBQUNJLEtBQVIsQ0FBY0MsR0FBZCxDQUFrQk4sTUFBbEIsQ0FIUixTQUdMTyxJQUhLO0FBSVBBLFlBQUFBLElBQUksSUFBSUEsSUFBSSxDQUFDQyxTQUpOO0FBS0hDLFlBQUFBLFlBTEcsR0FLWTtBQUNuQkEsY0FBQUEsWUFBWSxFQUFFO0FBQ1pDLGdCQUFBQSxJQUFJLEVBQUVSLE9BQU8sQ0FBQ1MsSUFERixFQURLOztBQUluQkMsY0FBQUEsSUFBSSxFQUFFVixPQUphO0FBS25CVyxjQUFBQSxLQUFLLEVBQUVOLElBQUksQ0FBQ0MsU0FMTyxFQUxaOztBQVlITSxZQUFBQSxNQVpHLEdBWU1DLHFCQUFVQyxJQUFWLENBQWVQLFlBQWYsQ0FaTjtBQWFGLGdCQWJFOztBQWVGTixZQUFBQSxPQUFPLENBQUNDLElBQVIsMkNBQWdEYSxHQUFoRCxtQ0FmRTs7O0FBa0JYZCxZQUFBQSxPQUFPLENBQUNlLEtBQVIsY0FsQlcsMEVBQUgsbUJBQU5uQixNQUFNLCtDQUFaLEM7Ozs7QUFzQkEsSUFBTW9CLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUNDLEVBQUQsRUFBS1gsWUFBTCxFQUFzQjtBQUNyQ1ksMkJBQUdDLFdBQUgsQ0FBZUYsRUFBZixFQUFtQixvQkFBTXJCLE1BQU0sQ0FBQ1UsWUFBRCxDQUFaLEVBQW5CO0FBQ0QsQ0FGRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gJ25vZGUtc2NoZWR1bGUnXG5pbXBvcnQgbWVzc2FnaW5nIGZyb20gJy4vZmlyZWJhc2UnXG5cbmNvbnN0IG5vdGlmeSA9IGFzeW5jIGZ1bmN0aW9uKHsgdXNlcklkLCBzdG9yYWdlLCBwYXlsb2FkIH0pIHtcbiAgdHJ5IHtcbiAgICBpZiAoIXN0b3JhZ2UpIHJldHVybiBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgaXMgcmVxdWlyZWQnKVxuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBzdG9yYWdlLnVzZXJzLmdldCh1c2VySWQpXG4gICAgaWYgKHVzZXIgJiYgdXNlci5wdXNoVG9rZW4pIHtcbiAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IHtcbiAgICAgICAgbm90aWZpY2F0aW9uOiB7XG4gICAgICAgICAgYm9keTogcGF5bG9hZC50ZXh0XG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IHBheWxvYWQsXG4gICAgICAgIHRva2VuOiB1c2VyLnB1c2hUb2tlblxuICAgICAgfVxuICAgICAgY29uc3Qgc3RhdHVzID0gbWVzc2FnaW5nLnNlbmQobm90aWZpY2F0aW9uKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvbnNvbGUud2FybihgQ2FuJ3Qgc2VuZCBub3RpZmljYXRpb24gdG8gdXNlciAke3VpZH06IG5vIHVzZXIgb3IgcHVzaCB0b2tlbiBmb3VuZGApXG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycilcbiAgfVxufVxuXG5jb25zdCBzY2hlZHVsZSA9IChhdCwgbm90aWZpY2F0aW9uKSA9PiB7XG4gIG5zLnNjaGVkdWxlSm9iKGF0LCAoKSA9PiBub3RpZnkobm90aWZpY2F0aW9uKSlcbn1cblxuZXhwb3J0IHsgc2NoZWR1bGUsIG5vdGlmeSB9XG4iXX0=