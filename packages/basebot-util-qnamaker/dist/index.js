"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _requestPromiseNative = _interopRequireDefault(require("request-promise-native"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}var _default =

function _default(_ref) {var logger = _ref.logger,defaultResponse = _ref.defaultResponse;
  logger = logger || function () {return console.log;};
  var info = logger('qnaMaker', 'info');
  var error = logger('qnaMaker', 'error');

  var heard = /*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(bot, message) {var threshold, url, res;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!
              message.intent) {_context.next = 2;break;}return _context.abrupt("return", bot.reply(message, defaultResponse));case 2:
              threshold = process.env.QNA_THRESHOLD || 70;if (!(
              !process.env.QNA_HOST || !process.env.QNA_KBID || !process.env.QNA_KEY)) {_context.next = 6;break;}
              info('not using QNA Maker as no key provided');return _context.abrupt("return",
              bot.reply(message, "Didn't catch that, sorry"));case 6:

              url = "".concat(process.env.QNA_HOST, "/knowledgebases/").concat(process.env.QNA_KBID, "/generateAnswer");_context.prev = 7;_context.next = 10;return (

                _requestPromiseNative["default"].post(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "EndpointKey ".concat(process.env.QNA_KEY) },

                  json: { question: message.text } }));case 10:res = _context.sent;if (!(

              res.answers && res.answers.length && res.answers[0].score > threshold)) {_context.next = 16;break;}
              message.answered = true;return _context.abrupt("return",
              bot.reply(message, res.answers[0].answer));case 16:return _context.abrupt("return",

              bot.reply(message, defaultResponse));case 17:_context.next = 23;break;case 19:_context.prev = 19;_context.t0 = _context["catch"](7);


              bot.reply(message, "Didn't catch that, sorry");
              error('Could not check QNA Maker', _context.t0);case 23:case "end":return _context.stop();}}}, _callee, null, [[7, 19]]);}));return function heard(_x, _x2) {return _ref2.apply(this, arguments);};}();



  return { heard: heard };
};exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbImxvZ2dlciIsImRlZmF1bHRSZXNwb25zZSIsImNvbnNvbGUiLCJsb2ciLCJpbmZvIiwiZXJyb3IiLCJoZWFyZCIsImJvdCIsIm1lc3NhZ2UiLCJpbnRlbnQiLCJyZXBseSIsInRocmVzaG9sZCIsInByb2Nlc3MiLCJlbnYiLCJRTkFfVEhSRVNIT0xEIiwiUU5BX0hPU1QiLCJRTkFfS0JJRCIsIlFOQV9LRVkiLCJ1cmwiLCJyZXF1ZXN0IiwicG9zdCIsIm1ldGhvZCIsImhlYWRlcnMiLCJqc29uIiwicXVlc3Rpb24iLCJ0ZXh0IiwicmVzIiwiYW5zd2VycyIsImxlbmd0aCIsInNjb3JlIiwiYW5zd2VyZWQiLCJhbnN3ZXIiXSwibWFwcGluZ3MiOiJ1R0FBQSxzRjs7QUFFZSx3QkFBaUMsS0FBOUJBLE1BQThCLFFBQTlCQSxNQUE4QixDQUF0QkMsZUFBc0IsUUFBdEJBLGVBQXNCO0FBQzlDRCxFQUFBQSxNQUFNLEdBQUdBLE1BQU0sSUFBSyxvQkFBTUUsT0FBTyxDQUFDQyxHQUFkLEVBQXBCO0FBQ0EsTUFBTUMsSUFBSSxHQUFHSixNQUFNLENBQUMsVUFBRCxFQUFhLE1BQWIsQ0FBbkI7QUFDQSxNQUFNSyxLQUFLLEdBQUdMLE1BQU0sQ0FBQyxVQUFELEVBQWEsT0FBYixDQUFwQjs7QUFFQSxNQUFNTSxLQUFLLGlHQUFHLGlCQUFlQyxHQUFmLEVBQW9CQyxPQUFwQjtBQUNSQSxjQUFBQSxPQUFPLENBQUNDLE1BREEsNkRBQ2VGLEdBQUcsQ0FBQ0csS0FBSixDQUFVRixPQUFWLEVBQW1CUCxlQUFuQixDQURmO0FBRU5VLGNBQUFBLFNBRk0sR0FFTUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGFBQVosSUFBNkIsRUFGbkM7QUFHUixlQUFDRixPQUFPLENBQUNDLEdBQVIsQ0FBWUUsUUFBYixJQUF5QixDQUFDSCxPQUFPLENBQUNDLEdBQVIsQ0FBWUcsUUFBdEMsSUFBa0QsQ0FBQ0osT0FBTyxDQUFDQyxHQUFSLENBQVlJLE9BSHZEO0FBSVZiLGNBQUFBLElBQUksQ0FBQyx3Q0FBRCxDQUFKLENBSlU7QUFLSEcsY0FBQUEsR0FBRyxDQUFDRyxLQUFKLENBQVVGLE9BQVYsNkJBTEc7O0FBT05VLGNBQUFBLEdBUE0sYUFPR04sT0FBTyxDQUFDQyxHQUFSLENBQVlFLFFBUGYsNkJBTzBDSCxPQUFPLENBQUNDLEdBQVIsQ0FBWUcsUUFQdEQ7O0FBU1FHLGlEQUFRQyxJQUFSLENBQWFGLEdBQWIsRUFBa0I7QUFDbENHLGtCQUFBQSxNQUFNLEVBQUUsTUFEMEI7QUFFbENDLGtCQUFBQSxPQUFPLEVBQUU7QUFDUCxvQ0FBZ0Isa0JBRFQ7QUFFUCwyREFBZ0NWLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSSxPQUE1QyxDQUZPLEVBRnlCOztBQU1sQ00sa0JBQUFBLElBQUksRUFBRSxFQUFFQyxRQUFRLEVBQUVoQixPQUFPLENBQUNpQixJQUFwQixFQU40QixFQUFsQixDQVRSLFVBU0pDLEdBVEk7O0FBaUJOQSxjQUFBQSxHQUFHLENBQUNDLE9BQUosSUFBZUQsR0FBRyxDQUFDQyxPQUFKLENBQVlDLE1BQTNCLElBQXFDRixHQUFHLENBQUNDLE9BQUosQ0FBWSxDQUFaLEVBQWVFLEtBQWYsR0FBdUJsQixTQWpCdEQ7QUFrQlJILGNBQUFBLE9BQU8sQ0FBQ3NCLFFBQVIsR0FBbUIsSUFBbkIsQ0FsQlE7QUFtQkR2QixjQUFBQSxHQUFHLENBQUNHLEtBQUosQ0FBVUYsT0FBVixFQUFtQmtCLEdBQUcsQ0FBQ0MsT0FBSixDQUFZLENBQVosRUFBZUksTUFBbEMsQ0FuQkM7O0FBcUJEeEIsY0FBQUEsR0FBRyxDQUFDRyxLQUFKLENBQVVGLE9BQVYsRUFBbUJQLGVBQW5CLENBckJDOzs7QUF3QlZNLGNBQUFBLEdBQUcsQ0FBQ0csS0FBSixDQUFVRixPQUFWO0FBQ0FILGNBQUFBLEtBQUssQ0FBQywyQkFBRCxjQUFMLENBekJVLDBFQUFILG1CQUFMQyxLQUFLLG9EQUFYOzs7O0FBNkJBLFNBQU8sRUFBRUEsS0FBSyxFQUFMQSxLQUFGLEVBQVA7QUFDRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdC1wcm9taXNlLW5hdGl2ZSdcblxuZXhwb3J0IGRlZmF1bHQgKHsgbG9nZ2VyLCBkZWZhdWx0UmVzcG9uc2UgfSkgPT4ge1xuICBsb2dnZXIgPSBsb2dnZXIgfHwgKCgpID0+IGNvbnNvbGUubG9nKVxuICBjb25zdCBpbmZvID0gbG9nZ2VyKCdxbmFNYWtlcicsICdpbmZvJylcbiAgY29uc3QgZXJyb3IgPSBsb2dnZXIoJ3FuYU1ha2VyJywgJ2Vycm9yJylcblxuICBjb25zdCBoZWFyZCA9IGFzeW5jIGZ1bmN0aW9uKGJvdCwgbWVzc2FnZSkge1xuICAgIGlmIChtZXNzYWdlLmludGVudCkgcmV0dXJuIGJvdC5yZXBseShtZXNzYWdlLCBkZWZhdWx0UmVzcG9uc2UpXG4gICAgY29uc3QgdGhyZXNob2xkID0gcHJvY2Vzcy5lbnYuUU5BX1RIUkVTSE9MRCB8fCA3MFxuICAgIGlmICghcHJvY2Vzcy5lbnYuUU5BX0hPU1QgfHwgIXByb2Nlc3MuZW52LlFOQV9LQklEIHx8ICFwcm9jZXNzLmVudi5RTkFfS0VZKSB7XG4gICAgICBpbmZvKCdub3QgdXNpbmcgUU5BIE1ha2VyIGFzIG5vIGtleSBwcm92aWRlZCcpXG4gICAgICByZXR1cm4gYm90LnJlcGx5KG1lc3NhZ2UsIGBEaWRuJ3QgY2F0Y2ggdGhhdCwgc29ycnlgKVxuICAgIH1cbiAgICBjb25zdCB1cmwgPSBgJHtwcm9jZXNzLmVudi5RTkFfSE9TVH0va25vd2xlZGdlYmFzZXMvJHtwcm9jZXNzLmVudi5RTkFfS0JJRH0vZ2VuZXJhdGVBbnN3ZXJgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3QucG9zdCh1cmwsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICdBdXRob3JpemF0aW9uJzogYEVuZHBvaW50S2V5ICR7cHJvY2Vzcy5lbnYuUU5BX0tFWX1gXG4gICAgICAgIH0sXG4gICAgICAgIGpzb246IHsgcXVlc3Rpb246IG1lc3NhZ2UudGV4dCB9XG4gICAgICB9KVxuICAgICAgaWYgKHJlcy5hbnN3ZXJzICYmIHJlcy5hbnN3ZXJzLmxlbmd0aCAmJiByZXMuYW5zd2Vyc1swXS5zY29yZSA+IHRocmVzaG9sZCkge1xuICAgICAgICBtZXNzYWdlLmFuc3dlcmVkID0gdHJ1ZVxuICAgICAgICByZXR1cm4gYm90LnJlcGx5KG1lc3NhZ2UsIHJlcy5hbnN3ZXJzWzBdLmFuc3dlcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBib3QucmVwbHkobWVzc2FnZSwgZGVmYXVsdFJlc3BvbnNlKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgYm90LnJlcGx5KG1lc3NhZ2UsIGBEaWRuJ3QgY2F0Y2ggdGhhdCwgc29ycnlgKVxuICAgICAgZXJyb3IoJ0NvdWxkIG5vdCBjaGVjayBRTkEgTWFrZXInLCBlcnIpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgaGVhcmQgfVxufVxuIl19