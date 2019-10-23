"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;




var _localtunnel = _interopRequireDefault(require("localtunnel"));
var _production = _interopRequireDefault(require("./production"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };} /****************************************
                                                                                                                                                                   * Handles setting up the bot webserver
                                                                                                                                                                   * including localtunnel when applicable
                                                                                                                                                                   ***************************************/var _default = function _default(_ref) {var logger = _ref.logger;var debug = logger('webserver', 'debug');
  var info = logger('webserver', 'info');
  var error = logger('webserver', 'error');var _prod =
  (0, _production["default"])({ logger: logger }),app = _prod.app,server = _prod.server;

  /* start localtunnel */
  startTunnel();

  return { app: app, server: server };

  function startTunnel() {
    if (!process.env.USE_LT_SUBDOMAIN) return;
    var tunnel = (0, _localtunnel["default"])(process.env.PORT || 3000, { subdomain: process.env.USE_LT_SUBDOMAIN ? process.env.USE_LT_SUBDOMAIN.toLowerCase() : 'basebot' + Math.round(Math.random * 1000) }, function (err, tunnel) {
      if (err) {
        error(err);
        throw err;
      }
      var spacesCount = tunnel.url.length >= 65 ? 0 : (65 - tunnel.url.length) / 2;
      var spacesStart = new Array(Math.floor(spacesCount)).fill(' ').join('');
      var spacesEnd = new Array(Math.ceil(spacesCount)).fill(' ').join('');
      var tunnelUrl = spacesStart + tunnel.url + spacesEnd;
      /* eslint-disable */
      console.log("\n  $$$$$$$\\                                $$$$$$$\\             $$\\     \n  $$  __$$\\                               $$  __$$\\            $$ |    \n  $$ |  $$ | $$$$$$\\   $$$$$$$\\  $$$$$$\\  $$ |  $$ | $$$$$$\\ $$$$$$\\   \n  $$$$$$$\\ | \\____$$\\ $$  _____|$$  __$$\\ $$$$$$$\\ |$$  __$$\\_$$  _|  \n  $$  __$$\\  $$$$$$$ |\\$$$$$$\\  $$$$$$$$ |$$  __$$\\ $$ /  $$ | $$ |    \n  $$ |  $$ |$$  __$$ | \\____$$\\ $$   ____|$$ |  $$ |$$ |  $$ | $$ |$$\\ \n  $$$$$$$  |\\$$$$$$$ |$$$$$$$  |\\$$$$$$$\\ $$$$$$$  |\\$$$$$$  | \\$$$$  |\n  \\_______/  \\_______|\\_______/  \\_______|\\_______/  \\______/   \\____/ \n\n\n  ===================================================================\n  |                                                                 |\n  |                Your bot is available locally at:                |\n  |                      http://localhost:".concat(













      process.env.PORT || 3000, "                      |\n  |                                                                 |\n  |                          and online at:                         |\n  |").concat(


      tunnelUrl, "|\n  |                                                                 |\n  |                      To learn more, visit:                      |\n  |                 https://basebot.ans.tools/docs                  |\n  |                                                                 |\n  ===================================================================\n  "));







      /* eslint-enable */
    });

    tunnel.on('close', function () {
      /* eslint-disable */
      info('Your bot is no longer available on the web at the localtunnnel.me URL.');
      /* eslint-enable */
      process.exit();
    });
  }
};exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvZGV2ZWxvcG1lbnQuanMiXSwibmFtZXMiOlsibG9nZ2VyIiwiZGVidWciLCJpbmZvIiwiZXJyb3IiLCJhcHAiLCJzZXJ2ZXIiLCJzdGFydFR1bm5lbCIsInByb2Nlc3MiLCJlbnYiLCJVU0VfTFRfU1VCRE9NQUlOIiwidHVubmVsIiwiUE9SVCIsInN1YmRvbWFpbiIsInRvTG93ZXJDYXNlIiwiTWF0aCIsInJvdW5kIiwicmFuZG9tIiwiZXJyIiwic3BhY2VzQ291bnQiLCJ1cmwiLCJsZW5ndGgiLCJzcGFjZXNTdGFydCIsIkFycmF5IiwiZmxvb3IiLCJmaWxsIiwiam9pbiIsInNwYWNlc0VuZCIsImNlaWwiLCJ0dW5uZWxVcmwiLCJjb25zb2xlIiwibG9nIiwib24iLCJleGl0Il0sIm1hcHBpbmdzIjoiOzs7OztBQUtBO0FBQ0Esa0UsZ0dBTkE7OzswTkFRZSx3QkFBZ0IsS0FBYkEsTUFBYSxRQUFiQSxNQUFhLENBQzdCLElBQU1DLEtBQUssR0FBR0QsTUFBTSxDQUFDLFdBQUQsRUFBYyxPQUFkLENBQXBCO0FBQ0EsTUFBTUUsSUFBSSxHQUFHRixNQUFNLENBQUMsV0FBRCxFQUFjLE1BQWQsQ0FBbkI7QUFDQSxNQUFNRyxLQUFLLEdBQUdILE1BQU0sQ0FBQyxXQUFELEVBQWMsT0FBZCxDQUFwQixDQUg2QjtBQUlMLDhCQUFLLEVBQUVBLE1BQU0sRUFBTkEsTUFBRixFQUFMLENBSkssQ0FJckJJLEdBSnFCLFNBSXJCQSxHQUpxQixDQUloQkMsTUFKZ0IsU0FJaEJBLE1BSmdCOztBQU03QjtBQUNBQyxFQUFBQSxXQUFXOztBQUVYLFNBQU8sRUFBRUYsR0FBRyxFQUFIQSxHQUFGLEVBQU9DLE1BQU0sRUFBTkEsTUFBUCxFQUFQOztBQUVBLFdBQVNDLFdBQVQsR0FBdUI7QUFDckIsUUFBSSxDQUFDQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsZ0JBQWpCLEVBQW1DO0FBQ25DLFFBQU1DLE1BQU0sR0FBRyw2QkFBWUgsT0FBTyxDQUFDQyxHQUFSLENBQVlHLElBQVosSUFBb0IsSUFBaEMsRUFBc0MsRUFBRUMsU0FBUyxFQUFFTCxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsZ0JBQVosR0FBK0JGLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxnQkFBWixDQUE2QkksV0FBN0IsRUFBL0IsR0FBNEUsWUFBWUMsSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0UsTUFBTCxHQUFjLElBQXpCLENBQXJHLEVBQXRDLEVBQTZLLFVBQUNDLEdBQUQsRUFBTVAsTUFBTixFQUFpQjtBQUMzTSxVQUFJTyxHQUFKLEVBQVM7QUFDUGQsUUFBQUEsS0FBSyxDQUFDYyxHQUFELENBQUw7QUFDQSxjQUFNQSxHQUFOO0FBQ0Q7QUFDRCxVQUFNQyxXQUFXLEdBQUdSLE1BQU0sQ0FBQ1MsR0FBUCxDQUFXQyxNQUFYLElBQXFCLEVBQXJCLEdBQTBCLENBQTFCLEdBQThCLENBQUMsS0FBS1YsTUFBTSxDQUFDUyxHQUFQLENBQVdDLE1BQWpCLElBQTJCLENBQTdFO0FBQ0EsVUFBTUMsV0FBVyxHQUFHLElBQUlDLEtBQUosQ0FBVVIsSUFBSSxDQUFDUyxLQUFMLENBQVdMLFdBQVgsQ0FBVixFQUFtQ00sSUFBbkMsQ0FBd0MsR0FBeEMsRUFBNkNDLElBQTdDLENBQWtELEVBQWxELENBQXBCO0FBQ0EsVUFBTUMsU0FBUyxHQUFHLElBQUlKLEtBQUosQ0FBVVIsSUFBSSxDQUFDYSxJQUFMLENBQVVULFdBQVYsQ0FBVixFQUFrQ00sSUFBbEMsQ0FBdUMsR0FBdkMsRUFBNENDLElBQTVDLENBQWlELEVBQWpELENBQWxCO0FBQ0EsVUFBTUcsU0FBUyxHQUFHUCxXQUFXLEdBQUdYLE1BQU0sQ0FBQ1MsR0FBckIsR0FBMkJPLFNBQTdDO0FBQ0E7QUFDQUcsTUFBQUEsT0FBTyxDQUFDQyxHQUFSOzs7Ozs7Ozs7Ozs7OztBQWNzQ3ZCLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRyxJQUFaLElBQW9CLElBZDFEOzs7QUFpQkRpQixNQUFBQSxTQWpCQzs7Ozs7Ozs7QUF5QkE7QUFDRCxLQXBDYyxDQUFmOztBQXNDQWxCLElBQUFBLE1BQU0sQ0FBQ3FCLEVBQVAsQ0FBVSxPQUFWLEVBQW1CLFlBQU07QUFDdkI7QUFDQTdCLE1BQUFBLElBQUksQ0FBQyx3RUFBRCxDQUFKO0FBQ0E7QUFDQUssTUFBQUEsT0FBTyxDQUFDeUIsSUFBUjtBQUNELEtBTEQ7QUFNRDtBQUNGLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogSGFuZGxlcyBzZXR0aW5nIHVwIHRoZSBib3Qgd2Vic2VydmVyXG4gKiBpbmNsdWRpbmcgbG9jYWx0dW5uZWwgd2hlbiBhcHBsaWNhYmxlXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgbG9jYWx0dW5uZWwgZnJvbSAnbG9jYWx0dW5uZWwnXG5pbXBvcnQgcHJvZCBmcm9tICcuL3Byb2R1Y3Rpb24nXG5cbmV4cG9ydCBkZWZhdWx0ICh7IGxvZ2dlciB9KSA9PiB7XG4gIGNvbnN0IGRlYnVnID0gbG9nZ2VyKCd3ZWJzZXJ2ZXInLCAnZGVidWcnKVxuICBjb25zdCBpbmZvID0gbG9nZ2VyKCd3ZWJzZXJ2ZXInLCAnaW5mbycpXG4gIGNvbnN0IGVycm9yID0gbG9nZ2VyKCd3ZWJzZXJ2ZXInLCAnZXJyb3InKVxuICBjb25zdCB7IGFwcCwgc2VydmVyIH0gPSBwcm9kKHsgbG9nZ2VyIH0pXG5cbiAgLyogc3RhcnQgbG9jYWx0dW5uZWwgKi9cbiAgc3RhcnRUdW5uZWwoKVxuXG4gIHJldHVybiB7IGFwcCwgc2VydmVyIH1cblxuICBmdW5jdGlvbiBzdGFydFR1bm5lbCgpIHtcbiAgICBpZiAoIXByb2Nlc3MuZW52LlVTRV9MVF9TVUJET01BSU4pIHJldHVyblxuICAgIGNvbnN0IHR1bm5lbCA9IGxvY2FsdHVubmVsKHByb2Nlc3MuZW52LlBPUlQgfHwgMzAwMCwgeyBzdWJkb21haW46IHByb2Nlc3MuZW52LlVTRV9MVF9TVUJET01BSU4gPyBwcm9jZXNzLmVudi5VU0VfTFRfU1VCRE9NQUlOLnRvTG93ZXJDYXNlKCkgOiAnYmFzZWJvdCcgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tICogMTAwMCkgfSwgKGVyciwgdHVubmVsKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGVycm9yKGVycilcbiAgICAgICAgdGhyb3cgZXJyXG4gICAgICB9XG4gICAgICBjb25zdCBzcGFjZXNDb3VudCA9IHR1bm5lbC51cmwubGVuZ3RoID49IDY1ID8gMCA6ICg2NSAtIHR1bm5lbC51cmwubGVuZ3RoKSAvIDJcbiAgICAgIGNvbnN0IHNwYWNlc1N0YXJ0ID0gbmV3IEFycmF5KE1hdGguZmxvb3Ioc3BhY2VzQ291bnQpKS5maWxsKCcgJykuam9pbignJylcbiAgICAgIGNvbnN0IHNwYWNlc0VuZCA9IG5ldyBBcnJheShNYXRoLmNlaWwoc3BhY2VzQ291bnQpKS5maWxsKCcgJykuam9pbignJylcbiAgICAgIGNvbnN0IHR1bm5lbFVybCA9IHNwYWNlc1N0YXJ0ICsgdHVubmVsLnVybCArIHNwYWNlc0VuZFxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cbiAgICAgIGNvbnNvbGUubG9nKGBcbiAgJCQkJCQkJFxcXFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkJCQkJCRcXFxcICAgICAgICAgICAgICQkXFxcXCAgICAgXG4gICQkICBfXyQkXFxcXCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJCAgX18kJFxcXFwgICAgICAgICAgICAkJCB8ICAgIFxuICAkJCB8ICAkJCB8ICQkJCQkJFxcXFwgICAkJCQkJCQkXFxcXCAgJCQkJCQkXFxcXCAgJCQgfCAgJCQgfCAkJCQkJCRcXFxcICQkJCQkJFxcXFwgICBcbiAgJCQkJCQkJFxcXFwgfCBcXFxcX19fXyQkXFxcXCAkJCAgX19fX198JCQgIF9fJCRcXFxcICQkJCQkJCRcXFxcIHwkJCAgX18kJFxcXFxfJCQgIF98ICBcbiAgJCQgIF9fJCRcXFxcICAkJCQkJCQkIHxcXFxcJCQkJCQkXFxcXCAgJCQkJCQkJCQgfCQkICBfXyQkXFxcXCAkJCAvICAkJCB8ICQkIHwgICAgXG4gICQkIHwgICQkIHwkJCAgX18kJCB8IFxcXFxfX19fJCRcXFxcICQkICAgX19fX3wkJCB8ICAkJCB8JCQgfCAgJCQgfCAkJCB8JCRcXFxcIFxuICAkJCQkJCQkICB8XFxcXCQkJCQkJCQgfCQkJCQkJCQgIHxcXFxcJCQkJCQkJFxcXFwgJCQkJCQkJCAgfFxcXFwkJCQkJCQgIHwgXFxcXCQkJCQgIHxcbiAgXFxcXF9fX19fX18vICBcXFxcX19fX19fX3xcXFxcX19fX19fXy8gIFxcXFxfX19fX19ffFxcXFxfX19fX19fLyAgXFxcXF9fX19fXy8gICBcXFxcX19fXy8gXG5cblxuICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgfCAgICAgICAgICAgICAgICBZb3VyIGJvdCBpcyBhdmFpbGFibGUgbG9jYWxseSBhdDogICAgICAgICAgICAgICAgfFxuICB8ICAgICAgICAgICAgICAgICAgICAgIGh0dHA6Ly9sb2NhbGhvc3Q6JHtwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDB9ICAgICAgICAgICAgICAgICAgICAgIHxcbiAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICB8ICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgb25saW5lIGF0OiAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gIHwke3R1bm5lbFVybH18XG4gIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgfCAgICAgICAgICAgICAgICAgICAgICBUbyBsZWFybiBtb3JlLCB2aXNpdDogICAgICAgICAgICAgICAgICAgICAgfFxuICB8ICAgICAgICAgICAgICAgICBodHRwczovL2Jhc2Vib3QuYW5zLnRvb2xzL2RvY3MgICAgICAgICAgICAgICAgICB8XG4gIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBgXG4gICAgICApXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlICovXG4gICAgfSlcblxuICAgIHR1bm5lbC5vbignY2xvc2UnLCAoKSA9PiB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xuICAgICAgaW5mbygnWW91ciBib3QgaXMgbm8gbG9uZ2VyIGF2YWlsYWJsZSBvbiB0aGUgd2ViIGF0IHRoZSBsb2NhbHR1bm5uZWwubWUgVVJMLicpXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlICovXG4gICAgICBwcm9jZXNzLmV4aXQoKVxuICAgIH0pXG4gIH1cbn1cblxuXG4iXX0=