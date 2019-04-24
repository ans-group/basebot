"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.notify = exports.schedule = void 0;var _nodeSchedule = _interopRequireDefault(require("node-schedule"));
var _firebase = require("./firebase");
var _logger = _interopRequireDefault(require("./logger"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

var debug = (0, _logger["default"])('outgoing', 'debug');
var error = (0, _logger["default"])('outgoing', 'error');

/**
                                                           * notify
                                                           * @param {Object} OutgoingMessage {uid: String, text: String, controller: botkitController, trigger: botkitTrigger}
                                                           */
var notify = /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {var uid, text, trigger, controller, user, notification, status;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.prev = 0;

            debug("sending notification:", params);
            uid = params.uid, text = params.text, trigger = params.trigger, controller = params.controller;if (
            controller) {_context.next = 5;break;}return _context.abrupt("return", warn('Please provide a controller'));case 5:_context.next = 7;return (
              controller.storage.users.get(uid));case 7:user = _context.sent;if (!(
            user && user.pushToken)) {_context.next = 14;break;}
            notification = {
              notification: {
                body: text },

              data: {
                text: text,
                trigger: trigger,
                click_action: 'FLUTTER_NOTIFICATION_CLICK' },

              token: user.pushToken };

            status = _firebase.messaging.send(notification);return _context.abrupt("return",
            debug("Notification sent: ", status));case 14:return _context.abrupt("return",

            error("Can't send notification to user ".concat(uid, ": no user or push token found")));case 15:_context.next = 20;break;case 17:_context.prev = 17;_context.t0 = _context["catch"](0);


            error(_context.t0);case 20:case "end":return _context.stop();}}}, _callee, null, [[0, 17]]);}));return function notify(_x) {return _ref.apply(this, arguments);};}();exports.notify = notify;



var schedule = function schedule(at, message) {
  _nodeSchedule["default"].scheduleJob(at, function () {return notify(message);});
};exports.schedule = schedule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL291dGdvaW5nLmpzIl0sIm5hbWVzIjpbImRlYnVnIiwiZXJyb3IiLCJub3RpZnkiLCJwYXJhbXMiLCJ1aWQiLCJ0ZXh0IiwidHJpZ2dlciIsImNvbnRyb2xsZXIiLCJ3YXJuIiwic3RvcmFnZSIsInVzZXJzIiwiZ2V0IiwidXNlciIsInB1c2hUb2tlbiIsIm5vdGlmaWNhdGlvbiIsImJvZHkiLCJkYXRhIiwiY2xpY2tfYWN0aW9uIiwidG9rZW4iLCJzdGF0dXMiLCJtZXNzYWdpbmciLCJzZW5kIiwic2NoZWR1bGUiLCJhdCIsIm1lc3NhZ2UiLCJucyIsInNjaGVkdWxlSm9iIl0sIm1hcHBpbmdzIjoic0hBQUE7QUFDQTtBQUNBLDBEOztBQUVBLElBQU1BLEtBQUssR0FBRyx3QkFBTyxVQUFQLEVBQW1CLE9BQW5CLENBQWQ7QUFDQSxJQUFNQyxLQUFLLEdBQUcsd0JBQU8sVUFBUCxFQUFtQixPQUFuQixDQUFkOztBQUVBOzs7O0FBSUEsSUFBTUMsTUFBTSxnR0FBRyxpQkFBZ0JDLE1BQWhCOztBQUVYSCxZQUFBQSxLQUFLLDBCQUEwQkcsTUFBMUIsQ0FBTDtBQUNRQyxZQUFBQSxHQUhHLEdBR2dDRCxNQUhoQyxDQUdIQyxHQUhHLEVBR0VDLElBSEYsR0FHZ0NGLE1BSGhDLENBR0VFLElBSEYsRUFHUUMsT0FIUixHQUdnQ0gsTUFIaEMsQ0FHUUcsT0FIUixFQUdpQkMsVUFIakIsR0FHZ0NKLE1BSGhDLENBR2lCSSxVQUhqQjtBQUlOQSxZQUFBQSxVQUpNLDZEQUlhQyxJQUFJLENBQUMsNkJBQUQsQ0FKakI7QUFLUUQsY0FBQUEsVUFBVSxDQUFDRSxPQUFYLENBQW1CQyxLQUFuQixDQUF5QkMsR0FBekIsQ0FBNkJQLEdBQTdCLENBTFIsU0FLTFEsSUFMSztBQU1QQSxZQUFBQSxJQUFJLElBQUlBLElBQUksQ0FBQ0MsU0FOTjtBQU9IQyxZQUFBQSxZQVBHLEdBT1k7QUFDbkJBLGNBQUFBLFlBQVksRUFBRTtBQUNaQyxnQkFBQUEsSUFBSSxFQUFFVixJQURNLEVBREs7O0FBSW5CVyxjQUFBQSxJQUFJLEVBQUU7QUFDSlgsZ0JBQUFBLElBQUksRUFBSkEsSUFESTtBQUVKQyxnQkFBQUEsT0FBTyxFQUFQQSxPQUZJO0FBR0pXLGdCQUFBQSxZQUFZLEVBQUUsNEJBSFYsRUFKYTs7QUFTbkJDLGNBQUFBLEtBQUssRUFBRU4sSUFBSSxDQUFDQyxTQVRPLEVBUFo7O0FBa0JITSxZQUFBQSxNQWxCRyxHQWtCTUMsb0JBQVVDLElBQVYsQ0FBZVAsWUFBZixDQWxCTjtBQW1CRmQsWUFBQUEsS0FBSyx3QkFBd0JtQixNQUF4QixDQW5CSDs7QUFxQkZsQixZQUFBQSxLQUFLLDJDQUFvQ0csR0FBcEMsbUNBckJIOzs7QUF3QlhILFlBQUFBLEtBQUssYUFBTCxDQXhCVywwRUFBSCxtQkFBTkMsTUFBTSw4Q0FBWixDOzs7O0FBNEJBLElBQU1vQixRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFDQyxFQUFELEVBQUtDLE9BQUwsRUFBaUI7QUFDaENDLDJCQUFHQyxXQUFILENBQWVILEVBQWYsRUFBbUIsb0JBQU1yQixNQUFNLENBQUNzQixPQUFELENBQVosRUFBbkI7QUFDRCxDQUZELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbnMgZnJvbSAnbm9kZS1zY2hlZHVsZSdcbmltcG9ydCB7IG1lc3NhZ2luZyB9IGZyb20gJy4vZmlyZWJhc2UnXG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJ1xuXG5jb25zdCBkZWJ1ZyA9IGxvZ2dlcignb3V0Z29pbmcnLCAnZGVidWcnKVxuY29uc3QgZXJyb3IgPSBsb2dnZXIoJ291dGdvaW5nJywgJ2Vycm9yJylcblxuLyoqXG4gKiBub3RpZnlcbiAqIEBwYXJhbSB7T2JqZWN0fSBPdXRnb2luZ01lc3NhZ2Uge3VpZDogU3RyaW5nLCB0ZXh0OiBTdHJpbmcsIGNvbnRyb2xsZXI6IGJvdGtpdENvbnRyb2xsZXIsIHRyaWdnZXI6IGJvdGtpdFRyaWdnZXJ9XG4gKi9cbmNvbnN0IG5vdGlmeSA9IGFzeW5jIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgdHJ5IHtcbiAgICBkZWJ1Zyhgc2VuZGluZyBub3RpZmljYXRpb246YCwgcGFyYW1zKVxuICAgIGNvbnN0IHsgdWlkLCB0ZXh0LCB0cmlnZ2VyLCBjb250cm9sbGVyIH0gPSBwYXJhbXNcbiAgICBpZiAoIWNvbnRyb2xsZXIpIHJldHVybiB3YXJuKCdQbGVhc2UgcHJvdmlkZSBhIGNvbnRyb2xsZXInKVxuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBjb250cm9sbGVyLnN0b3JhZ2UudXNlcnMuZ2V0KHVpZClcbiAgICBpZiAodXNlciAmJiB1c2VyLnB1c2hUb2tlbikge1xuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uID0ge1xuICAgICAgICBub3RpZmljYXRpb246IHtcbiAgICAgICAgICBib2R5OiB0ZXh0XG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0ZXh0LFxuICAgICAgICAgIHRyaWdnZXIsXG4gICAgICAgICAgY2xpY2tfYWN0aW9uOiAnRkxVVFRFUl9OT1RJRklDQVRJT05fQ0xJQ0snXG4gICAgICAgIH0sXG4gICAgICAgIHRva2VuOiB1c2VyLnB1c2hUb2tlblxuICAgICAgfVxuICAgICAgY29uc3Qgc3RhdHVzID0gbWVzc2FnaW5nLnNlbmQobm90aWZpY2F0aW9uKVxuICAgICAgcmV0dXJuIGRlYnVnKGBOb3RpZmljYXRpb24gc2VudDogYCwgc3RhdHVzKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZXJyb3IoYENhbid0IHNlbmQgbm90aWZpY2F0aW9uIHRvIHVzZXIgJHt1aWR9OiBubyB1c2VyIG9yIHB1c2ggdG9rZW4gZm91bmRgKVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyb3IoZXJyKVxuICB9XG59XG5cbmNvbnN0IHNjaGVkdWxlID0gKGF0LCBtZXNzYWdlKSA9PiB7XG4gIG5zLnNjaGVkdWxlSm9iKGF0LCAoKSA9PiBub3RpZnkobWVzc2FnZSkpXG59XG5cbmV4cG9ydCB7IHNjaGVkdWxlLCBub3RpZnkgfVxuIl19