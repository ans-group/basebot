"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;



var _forEach = _interopRequireDefault(require("lodash/forEach"));
var _path = _interopRequireDefault(require("path"));
var _http = _interopRequireDefault(require("http"));
var _express = _interopRequireDefault(require("express"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };} /****************************************
                                                                                                                                                           * Handles setting up the bot webserver
                                                                                                                                                           * including localtunnel when applicable
                                                                                                                                                           ***************************************/var _default = function _default(_ref) {var logger = _ref.logger;var error = logger('webserver', 'error');
  var info = logger('webserver', 'info');

  var app = (0, _express["default"])();
  var server = _http["default"].createServer(app);

  /* set up various express things */
  app.
  use(_express["default"].json()).
  use(_express["default"].urlencoded({ extended: false })).
  use(_express["default"]["static"](_path["default"].join(_path["default"].dirname(require.main.filename), 'public')));

  /* health check endpoint */
  app.get('/status', function (req, res) {
    res.sendStatus(200);
  });

  app.on('error', onError);
  app.on('listening', onListening);

  return { server: server, app: app

    /**
                                      * Event listener for HTTP server "error" event.
                                    */ };
  function onError(err) {
    if (err.syscall !== 'listen') {
      throw err;
    }
    var port = process.env.PORT || 3000;

    var bind = typeof port === 'string' ? "Pipe ".concat(
    port) : "Port ".concat(
    port);

    // handle specific listen errors with friendly messages
    switch (err.code) {
      case 'EACCES':
        error("".concat(bind, " requires elevated privileges"));
        process.exit(1);
        break;
      case 'EADDRINUSE':
        error("".concat(bind, " is already in use"));
        process.exit(1);
        break;
      default:
        throw err;}

  }

  /**
     * Event listener for HTTP server "listening" event.
    */
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? "pipe ".concat(
    addr) : "port ".concat(
    addr.port);
    info("Listening on ".concat(bind));
  }
};exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvcHJvZHVjdGlvbi5qcyJdLCJuYW1lcyI6WyJsb2dnZXIiLCJlcnJvciIsImluZm8iLCJhcHAiLCJzZXJ2ZXIiLCJodHRwIiwiY3JlYXRlU2VydmVyIiwidXNlIiwiZXhwcmVzcyIsImpzb24iLCJ1cmxlbmNvZGVkIiwiZXh0ZW5kZWQiLCJwYXRoIiwiam9pbiIsImRpcm5hbWUiLCJyZXF1aXJlIiwibWFpbiIsImZpbGVuYW1lIiwiZ2V0IiwicmVxIiwicmVzIiwic2VuZFN0YXR1cyIsIm9uIiwib25FcnJvciIsIm9uTGlzdGVuaW5nIiwiZXJyIiwic3lzY2FsbCIsInBvcnQiLCJwcm9jZXNzIiwiZW52IiwiUE9SVCIsImJpbmQiLCJjb2RlIiwiZXhpdCIsImFkZHIiLCJhZGRyZXNzIl0sIm1hcHBpbmdzIjoiOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0EsMEQsZ0dBUEE7OztrTkFTZSx3QkFBZ0IsS0FBYkEsTUFBYSxRQUFiQSxNQUFhLENBQzdCLElBQU1DLEtBQUssR0FBR0QsTUFBTSxDQUFDLFdBQUQsRUFBYyxPQUFkLENBQXBCO0FBQ0EsTUFBTUUsSUFBSSxHQUFHRixNQUFNLENBQUMsV0FBRCxFQUFjLE1BQWQsQ0FBbkI7O0FBRUEsTUFBTUcsR0FBRyxHQUFHLDBCQUFaO0FBQ0EsTUFBTUMsTUFBTSxHQUFHQyxpQkFBS0MsWUFBTCxDQUFrQkgsR0FBbEIsQ0FBZjs7QUFFQTtBQUNBQSxFQUFBQSxHQUFHO0FBQ0FJLEVBQUFBLEdBREgsQ0FDT0Msb0JBQVFDLElBQVIsRUFEUDtBQUVHRixFQUFBQSxHQUZILENBRU9DLG9CQUFRRSxVQUFSLENBQW1CLEVBQUVDLFFBQVEsRUFBRSxLQUFaLEVBQW5CLENBRlA7QUFHR0osRUFBQUEsR0FISCxDQUdPQyw4QkFBZUksaUJBQUtDLElBQUwsQ0FBVUQsaUJBQUtFLE9BQUwsQ0FBYUMsT0FBTyxDQUFDQyxJQUFSLENBQWFDLFFBQTFCLENBQVYsRUFBK0MsUUFBL0MsQ0FBZixDQUhQOztBQUtBO0FBQ0FkLEVBQUFBLEdBQUcsQ0FBQ2UsR0FBSixDQUFRLFNBQVIsRUFBbUIsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDL0JBLElBQUFBLEdBQUcsQ0FBQ0MsVUFBSixDQUFlLEdBQWY7QUFDRCxHQUZEOztBQUlBbEIsRUFBQUEsR0FBRyxDQUFDbUIsRUFBSixDQUFPLE9BQVAsRUFBZ0JDLE9BQWhCO0FBQ0FwQixFQUFBQSxHQUFHLENBQUNtQixFQUFKLENBQU8sV0FBUCxFQUFvQkUsV0FBcEI7O0FBRUEsU0FBTyxFQUFFcEIsTUFBTSxFQUFOQSxNQUFGLEVBQVVELEdBQUcsRUFBSEE7O0FBRWpCOztzQ0FGTyxFQUFQO0FBS0EsV0FBU29CLE9BQVQsQ0FBaUJFLEdBQWpCLEVBQXNCO0FBQ3BCLFFBQUlBLEdBQUcsQ0FBQ0MsT0FBSixLQUFnQixRQUFwQixFQUE4QjtBQUM1QixZQUFNRCxHQUFOO0FBQ0Q7QUFDRCxRQUFNRSxJQUFJLEdBQUdDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxJQUFaLElBQW9CLElBQWpDOztBQUVBLFFBQU1DLElBQUksR0FBRyxPQUFPSixJQUFQLEtBQWdCLFFBQWhCO0FBQ0RBLElBQUFBLElBREM7QUFFREEsSUFBQUEsSUFGQyxDQUFiOztBQUlBO0FBQ0EsWUFBUUYsR0FBRyxDQUFDTyxJQUFaO0FBQ0EsV0FBSyxRQUFMO0FBQ0UvQixRQUFBQSxLQUFLLFdBQUk4QixJQUFKLG1DQUFMO0FBQ0FILFFBQUFBLE9BQU8sQ0FBQ0ssSUFBUixDQUFhLENBQWI7QUFDQTtBQUNGLFdBQUssWUFBTDtBQUNFaEMsUUFBQUEsS0FBSyxXQUFJOEIsSUFBSix3QkFBTDtBQUNBSCxRQUFBQSxPQUFPLENBQUNLLElBQVIsQ0FBYSxDQUFiO0FBQ0E7QUFDRjtBQUNFLGNBQU1SLEdBQU4sQ0FWRjs7QUFZRDs7QUFFRDs7O0FBR0EsV0FBU0QsV0FBVCxHQUF1QjtBQUNyQixRQUFNVSxJQUFJLEdBQUc5QixNQUFNLENBQUMrQixPQUFQLEVBQWI7QUFDQSxRQUFNSixJQUFJLEdBQUcsT0FBT0csSUFBUCxLQUFnQixRQUFoQjtBQUNEQSxJQUFBQSxJQURDO0FBRURBLElBQUFBLElBQUksQ0FBQ1AsSUFGSixDQUFiO0FBR0F6QixJQUFBQSxJQUFJLHdCQUFpQjZCLElBQWpCLEVBQUo7QUFDRDtBQUNGLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogSGFuZGxlcyBzZXR0aW5nIHVwIHRoZSBib3Qgd2Vic2VydmVyXG4gKiBpbmNsdWRpbmcgbG9jYWx0dW5uZWwgd2hlbiBhcHBsaWNhYmxlXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCdcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnXG5cbmV4cG9ydCBkZWZhdWx0ICh7IGxvZ2dlciB9KSA9PiB7XG4gIGNvbnN0IGVycm9yID0gbG9nZ2VyKCd3ZWJzZXJ2ZXInLCAnZXJyb3InKVxuICBjb25zdCBpbmZvID0gbG9nZ2VyKCd3ZWJzZXJ2ZXInLCAnaW5mbycpXG5cbiAgY29uc3QgYXBwID0gZXhwcmVzcygpXG4gIGNvbnN0IHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcClcblxuICAvKiBzZXQgdXAgdmFyaW91cyBleHByZXNzIHRoaW5ncyAqL1xuICBhcHBcbiAgICAudXNlKGV4cHJlc3MuanNvbigpKVxuICAgIC51c2UoZXhwcmVzcy51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKVxuICAgIC51c2UoZXhwcmVzcy5zdGF0aWMocGF0aC5qb2luKHBhdGguZGlybmFtZShyZXF1aXJlLm1haW4uZmlsZW5hbWUpLCAncHVibGljJykpKVxuXG4gIC8qIGhlYWx0aCBjaGVjayBlbmRwb2ludCAqL1xuICBhcHAuZ2V0KCcvc3RhdHVzJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLnNlbmRTdGF0dXMoMjAwKVxuICB9KVxuXG4gIGFwcC5vbignZXJyb3InLCBvbkVycm9yKVxuICBhcHAub24oJ2xpc3RlbmluZycsIG9uTGlzdGVuaW5nKVxuXG4gIHJldHVybiB7IHNlcnZlciwgYXBwIH1cblxuICAvKipcbiAgICAqIEV2ZW50IGxpc3RlbmVyIGZvciBIVFRQIHNlcnZlciBcImVycm9yXCIgZXZlbnQuXG4gICovXG4gIGZ1bmN0aW9uIG9uRXJyb3IoZXJyKSB7XG4gICAgaWYgKGVyci5zeXNjYWxsICE9PSAnbGlzdGVuJykge1xuICAgICAgdGhyb3cgZXJyXG4gICAgfVxuICAgIGNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDBcblxuICAgIGNvbnN0IGJpbmQgPSB0eXBlb2YgcG9ydCA9PT0gJ3N0cmluZydcbiAgICAgID8gYFBpcGUgJHtwb3J0fWBcbiAgICAgIDogYFBvcnQgJHtwb3J0fWBcblxuICAgIC8vIGhhbmRsZSBzcGVjaWZpYyBsaXN0ZW4gZXJyb3JzIHdpdGggZnJpZW5kbHkgbWVzc2FnZXNcbiAgICBzd2l0Y2ggKGVyci5jb2RlKSB7XG4gICAgY2FzZSAnRUFDQ0VTJzpcbiAgICAgIGVycm9yKGAke2JpbmR9IHJlcXVpcmVzIGVsZXZhdGVkIHByaXZpbGVnZXNgKVxuICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ0VBRERSSU5VU0UnOlxuICAgICAgZXJyb3IoYCR7YmluZH0gaXMgYWxyZWFkeSBpbiB1c2VgKVxuICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBlcnJcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXZlbnQgbGlzdGVuZXIgZm9yIEhUVFAgc2VydmVyIFwibGlzdGVuaW5nXCIgZXZlbnQuXG4gICovXG4gIGZ1bmN0aW9uIG9uTGlzdGVuaW5nKCkge1xuICAgIGNvbnN0IGFkZHIgPSBzZXJ2ZXIuYWRkcmVzcygpXG4gICAgY29uc3QgYmluZCA9IHR5cGVvZiBhZGRyID09PSAnc3RyaW5nJ1xuICAgICAgPyBgcGlwZSAke2FkZHJ9YFxuICAgICAgOiBgcG9ydCAke2FkZHIucG9ydH1gXG4gICAgaW5mbyhgTGlzdGVuaW5nIG9uICR7YmluZH1gKVxuICB9XG59XG4iXX0=