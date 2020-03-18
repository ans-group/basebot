"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _requestPromiseNative = _interopRequireDefault(require("request-promise-native"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}var _default =

function _default(_ref) {var logger = _ref.logger,defaultResponse = _ref.defaultResponse;
  logger = logger || function () {return console.log;};
  var info = logger('qnaMaker', 'info');
  var error = logger('qnaMaker', 'error');

  var heard = /*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(bot, message) {var threshold, url, res;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!
              message.intent) {_context.next = 2;break;}return _context.abrupt("return", bot.reply(message, defaultResponse));case 2:
              threshold = process.env.QNA_THRESHOLD || 70;if (!(
              !process.env.QNA_HOST || !process.env.QNA_KBID || !process.env.QNA_KEY)) {_context.next = 6;break;}
              info('not using QNA Maker as no key provided');return _context.abrupt("return");case 6:


              url = "".concat(process.env.QNA_HOST, "/knowledgebases/").concat(process.env.QNA_KBID, "/generateAnswer");_context.prev = 7;_context.next = 10;return (

                _requestPromiseNative["default"].post(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "EndpointKey ".concat(process.env.QNA_KEY) },

                  json: { question: message.text } }));case 10:res = _context.sent;if (!(

              res.answers && res.answers.length && res.answers[0].score > threshold)) {_context.next = 16;break;}
              message.answered = true;return _context.abrupt("return",
              bot.reply(message, res.answers[0].answer));case 16:return _context.abrupt("return");case 17:_context.next = 24;break;case 19:_context.prev = 19;_context.t0 = _context["catch"](7);




              message.answered = true;return _context.abrupt("return",
              bot.reply(message, "Didn't catch that, sorry"));case 24:case "end":return _context.stop();}}}, _callee, null, [[7, 19]]);}));return function heard(_x, _x2) {return _ref2.apply(this, arguments);};}();




  return { heard: heard };
};exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbImxvZ2dlciIsImRlZmF1bHRSZXNwb25zZSIsImNvbnNvbGUiLCJsb2ciLCJpbmZvIiwiZXJyb3IiLCJoZWFyZCIsImJvdCIsIm1lc3NhZ2UiLCJpbnRlbnQiLCJyZXBseSIsInRocmVzaG9sZCIsInByb2Nlc3MiLCJlbnYiLCJRTkFfVEhSRVNIT0xEIiwiUU5BX0hPU1QiLCJRTkFfS0JJRCIsIlFOQV9LRVkiLCJ1cmwiLCJyZXF1ZXN0IiwicG9zdCIsIm1ldGhvZCIsImhlYWRlcnMiLCJqc29uIiwicXVlc3Rpb24iLCJ0ZXh0IiwicmVzIiwiYW5zd2VycyIsImxlbmd0aCIsInNjb3JlIiwiYW5zd2VyZWQiLCJhbnN3ZXIiXSwibWFwcGluZ3MiOiJ1R0FBQSxzRjs7QUFFZSx3QkFBaUMsS0FBOUJBLE1BQThCLFFBQTlCQSxNQUE4QixDQUF0QkMsZUFBc0IsUUFBdEJBLGVBQXNCO0FBQzlDRCxFQUFBQSxNQUFNLEdBQUdBLE1BQU0sSUFBSyxvQkFBTUUsT0FBTyxDQUFDQyxHQUFkLEVBQXBCO0FBQ0EsTUFBTUMsSUFBSSxHQUFHSixNQUFNLENBQUMsVUFBRCxFQUFhLE1BQWIsQ0FBbkI7QUFDQSxNQUFNSyxLQUFLLEdBQUdMLE1BQU0sQ0FBQyxVQUFELEVBQWEsT0FBYixDQUFwQjs7QUFFQSxNQUFNTSxLQUFLLGlHQUFHLGlCQUFlQyxHQUFmLEVBQW9CQyxPQUFwQjtBQUNSQSxjQUFBQSxPQUFPLENBQUNDLE1BREEsNkRBQ2VGLEdBQUcsQ0FBQ0csS0FBSixDQUFVRixPQUFWLEVBQW1CUCxlQUFuQixDQURmO0FBRU5VLGNBQUFBLFNBRk0sR0FFTUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGFBQVosSUFBNkIsRUFGbkM7QUFHUixlQUFDRixPQUFPLENBQUNDLEdBQVIsQ0FBWUUsUUFBYixJQUF5QixDQUFDSCxPQUFPLENBQUNDLEdBQVIsQ0FBWUcsUUFBdEMsSUFBa0QsQ0FBQ0osT0FBTyxDQUFDQyxHQUFSLENBQVlJLE9BSHZEO0FBSVZiLGNBQUFBLElBQUksQ0FBQyx3Q0FBRCxDQUFKLENBSlU7OztBQU9OYyxjQUFBQSxHQVBNLGFBT0dOLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRSxRQVBmLDZCQU8wQ0gsT0FBTyxDQUFDQyxHQUFSLENBQVlHLFFBUHREOztBQVNRRyxpREFBUUMsSUFBUixDQUFhRixHQUFiLEVBQWtCO0FBQ2xDRyxrQkFBQUEsTUFBTSxFQUFFLE1BRDBCO0FBRWxDQyxrQkFBQUEsT0FBTyxFQUFFO0FBQ1Asb0NBQWdCLGtCQURUO0FBRVAsMkRBQWdDVixPQUFPLENBQUNDLEdBQVIsQ0FBWUksT0FBNUMsQ0FGTyxFQUZ5Qjs7QUFNbENNLGtCQUFBQSxJQUFJLEVBQUUsRUFBRUMsUUFBUSxFQUFFaEIsT0FBTyxDQUFDaUIsSUFBcEIsRUFONEIsRUFBbEIsQ0FUUixVQVNKQyxHQVRJOztBQWlCTkEsY0FBQUEsR0FBRyxDQUFDQyxPQUFKLElBQWVELEdBQUcsQ0FBQ0MsT0FBSixDQUFZQyxNQUEzQixJQUFxQ0YsR0FBRyxDQUFDQyxPQUFKLENBQVksQ0FBWixFQUFlRSxLQUFmLEdBQXVCbEIsU0FqQnREO0FBa0JSSCxjQUFBQSxPQUFPLENBQUNzQixRQUFSLEdBQW1CLElBQW5CLENBbEJRO0FBbUJEdkIsY0FBQUEsR0FBRyxDQUFDRyxLQUFKLENBQVVGLE9BQVYsRUFBbUJrQixHQUFHLENBQUNDLE9BQUosQ0FBWSxDQUFaLEVBQWVJLE1BQWxDLENBbkJDOzs7OztBQXdCVnZCLGNBQUFBLE9BQU8sQ0FBQ3NCLFFBQVIsR0FBbUIsSUFBbkIsQ0F4QlU7QUF5Qkh2QixjQUFBQSxHQUFHLENBQUNHLEtBQUosQ0FBVUYsT0FBViw2QkF6QkcsNEVBQUgsbUJBQUxGLEtBQUssb0RBQVg7Ozs7O0FBOEJBLFNBQU8sRUFBRUEsS0FBSyxFQUFMQSxLQUFGLEVBQVA7QUFDRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdC1wcm9taXNlLW5hdGl2ZSdcblxuZXhwb3J0IGRlZmF1bHQgKHsgbG9nZ2VyLCBkZWZhdWx0UmVzcG9uc2UgfSkgPT4ge1xuICBsb2dnZXIgPSBsb2dnZXIgfHwgKCgpID0+IGNvbnNvbGUubG9nKVxuICBjb25zdCBpbmZvID0gbG9nZ2VyKCdxbmFNYWtlcicsICdpbmZvJylcbiAgY29uc3QgZXJyb3IgPSBsb2dnZXIoJ3FuYU1ha2VyJywgJ2Vycm9yJylcblxuICBjb25zdCBoZWFyZCA9IGFzeW5jIGZ1bmN0aW9uKGJvdCwgbWVzc2FnZSkge1xuICAgIGlmIChtZXNzYWdlLmludGVudCkgcmV0dXJuIGJvdC5yZXBseShtZXNzYWdlLCBkZWZhdWx0UmVzcG9uc2UpXG4gICAgY29uc3QgdGhyZXNob2xkID0gcHJvY2Vzcy5lbnYuUU5BX1RIUkVTSE9MRCB8fCA3MFxuICAgIGlmICghcHJvY2Vzcy5lbnYuUU5BX0hPU1QgfHwgIXByb2Nlc3MuZW52LlFOQV9LQklEIHx8ICFwcm9jZXNzLmVudi5RTkFfS0VZKSB7XG4gICAgICBpbmZvKCdub3QgdXNpbmcgUU5BIE1ha2VyIGFzIG5vIGtleSBwcm92aWRlZCcpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgdXJsID0gYCR7cHJvY2Vzcy5lbnYuUU5BX0hPU1R9L2tub3dsZWRnZWJhc2VzLyR7cHJvY2Vzcy5lbnYuUU5BX0tCSUR9L2dlbmVyYXRlQW5zd2VyYFxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0LnBvc3QodXJsLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IGBFbmRwb2ludEtleSAke3Byb2Nlc3MuZW52LlFOQV9LRVl9YFxuICAgICAgICB9LFxuICAgICAgICBqc29uOiB7IHF1ZXN0aW9uOiBtZXNzYWdlLnRleHQgfVxuICAgICAgfSlcbiAgICAgIGlmIChyZXMuYW5zd2VycyAmJiByZXMuYW5zd2Vycy5sZW5ndGggJiYgcmVzLmFuc3dlcnNbMF0uc2NvcmUgPiB0aHJlc2hvbGQpIHtcbiAgICAgICAgbWVzc2FnZS5hbnN3ZXJlZCA9IHRydWVcbiAgICAgICAgcmV0dXJuIGJvdC5yZXBseShtZXNzYWdlLCByZXMuYW5zd2Vyc1swXS5hbnN3ZXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIG1lc3NhZ2UuYW5zd2VyZWQgPSB0cnVlXG4gICAgICByZXR1cm4gYm90LnJlcGx5KG1lc3NhZ2UsIGBEaWRuJ3QgY2F0Y2ggdGhhdCwgc29ycnlgKVxuICAgICAgZXJyb3IoJ0NvdWxkIG5vdCBjaGVjayBRTkEgTWFrZXInLCBlcnIpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgaGVhcmQgfVxufVxuIl19