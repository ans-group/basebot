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
  use(_express["default"]["static"](_path["default"].join(__dirname, '../../public')));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvcHJvZHVjdGlvbi5qcyJdLCJuYW1lcyI6WyJsb2dnZXIiLCJlcnJvciIsImluZm8iLCJhcHAiLCJzZXJ2ZXIiLCJodHRwIiwiY3JlYXRlU2VydmVyIiwidXNlIiwiZXhwcmVzcyIsImpzb24iLCJ1cmxlbmNvZGVkIiwiZXh0ZW5kZWQiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsImdldCIsInJlcSIsInJlcyIsInNlbmRTdGF0dXMiLCJvbiIsIm9uRXJyb3IiLCJvbkxpc3RlbmluZyIsImVyciIsInN5c2NhbGwiLCJwb3J0IiwicHJvY2VzcyIsImVudiIsIlBPUlQiLCJiaW5kIiwiY29kZSIsImV4aXQiLCJhZGRyIiwiYWRkcmVzcyJdLCJtYXBwaW5ncyI6Ijs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBLDBELGdHQVBBOzs7a05BU2Usd0JBQWdCLEtBQWJBLE1BQWEsUUFBYkEsTUFBYSxDQUM3QixJQUFNQyxLQUFLLEdBQUdELE1BQU0sQ0FBQyxXQUFELEVBQWMsT0FBZCxDQUFwQjtBQUNBLE1BQU1FLElBQUksR0FBR0YsTUFBTSxDQUFDLFdBQUQsRUFBYyxNQUFkLENBQW5COztBQUVBLE1BQU1HLEdBQUcsR0FBRywwQkFBWjtBQUNBLE1BQU1DLE1BQU0sR0FBR0MsaUJBQUtDLFlBQUwsQ0FBa0JILEdBQWxCLENBQWY7O0FBRUE7QUFDQUEsRUFBQUEsR0FBRztBQUNBSSxFQUFBQSxHQURILENBQ09DLG9CQUFRQyxJQUFSLEVBRFA7QUFFR0YsRUFBQUEsR0FGSCxDQUVPQyxvQkFBUUUsVUFBUixDQUFtQixFQUFFQyxRQUFRLEVBQUUsS0FBWixFQUFuQixDQUZQO0FBR0dKLEVBQUFBLEdBSEgsQ0FHT0MsOEJBQWVJLGlCQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsY0FBckIsQ0FBZixDQUhQOztBQUtBO0FBQ0FYLEVBQUFBLEdBQUcsQ0FBQ1ksR0FBSixDQUFRLFNBQVIsRUFBbUIsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDL0JBLElBQUFBLEdBQUcsQ0FBQ0MsVUFBSixDQUFlLEdBQWY7QUFDRCxHQUZEOztBQUlBZixFQUFBQSxHQUFHLENBQUNnQixFQUFKLENBQU8sT0FBUCxFQUFnQkMsT0FBaEI7QUFDQWpCLEVBQUFBLEdBQUcsQ0FBQ2dCLEVBQUosQ0FBTyxXQUFQLEVBQW9CRSxXQUFwQjs7QUFFQSxTQUFPLEVBQUVqQixNQUFNLEVBQU5BLE1BQUYsRUFBVUQsR0FBRyxFQUFIQTs7QUFFakI7O3NDQUZPLEVBQVA7QUFLQSxXQUFTaUIsT0FBVCxDQUFpQkUsR0FBakIsRUFBc0I7QUFDcEIsUUFBSUEsR0FBRyxDQUFDQyxPQUFKLEtBQWdCLFFBQXBCLEVBQThCO0FBQzVCLFlBQU1ELEdBQU47QUFDRDtBQUNELFFBQU1FLElBQUksR0FBR0MsT0FBTyxDQUFDQyxHQUFSLENBQVlDLElBQVosSUFBb0IsSUFBakM7O0FBRUEsUUFBTUMsSUFBSSxHQUFHLE9BQU9KLElBQVAsS0FBZ0IsUUFBaEI7QUFDREEsSUFBQUEsSUFEQztBQUVEQSxJQUFBQSxJQUZDLENBQWI7O0FBSUE7QUFDQSxZQUFRRixHQUFHLENBQUNPLElBQVo7QUFDRSxXQUFLLFFBQUw7QUFDRTVCLFFBQUFBLEtBQUssV0FBSTJCLElBQUosbUNBQUw7QUFDQUgsUUFBQUEsT0FBTyxDQUFDSyxJQUFSLENBQWEsQ0FBYjtBQUNBO0FBQ0YsV0FBSyxZQUFMO0FBQ0U3QixRQUFBQSxLQUFLLFdBQUkyQixJQUFKLHdCQUFMO0FBQ0FILFFBQUFBLE9BQU8sQ0FBQ0ssSUFBUixDQUFhLENBQWI7QUFDQTtBQUNGO0FBQ0UsY0FBTVIsR0FBTixDQVZKOztBQVlEOztBQUVEOzs7QUFHQSxXQUFTRCxXQUFULEdBQXVCO0FBQ3JCLFFBQU1VLElBQUksR0FBRzNCLE1BQU0sQ0FBQzRCLE9BQVAsRUFBYjtBQUNBLFFBQU1KLElBQUksR0FBRyxPQUFPRyxJQUFQLEtBQWdCLFFBQWhCO0FBQ0RBLElBQUFBLElBREM7QUFFREEsSUFBQUEsSUFBSSxDQUFDUCxJQUZKLENBQWI7QUFHQXRCLElBQUFBLElBQUksd0JBQWlCMEIsSUFBakIsRUFBSjtBQUNEO0FBQ0YsQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBIYW5kbGVzIHNldHRpbmcgdXAgdGhlIGJvdCB3ZWJzZXJ2ZXJcbiAqIGluY2x1ZGluZyBsb2NhbHR1bm5lbCB3aGVuIGFwcGxpY2FibGVcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJ1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcydcblxuZXhwb3J0IGRlZmF1bHQgKHsgbG9nZ2VyIH0pID0+IHtcbiAgY29uc3QgZXJyb3IgPSBsb2dnZXIoJ3dlYnNlcnZlcicsICdlcnJvcicpXG4gIGNvbnN0IGluZm8gPSBsb2dnZXIoJ3dlYnNlcnZlcicsICdpbmZvJylcblxuICBjb25zdCBhcHAgPSBleHByZXNzKClcbiAgY29uc3Qgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoYXBwKVxuXG4gIC8qIHNldCB1cCB2YXJpb3VzIGV4cHJlc3MgdGhpbmdzICovXG4gIGFwcFxuICAgIC51c2UoZXhwcmVzcy5qc29uKCkpXG4gICAgLnVzZShleHByZXNzLnVybGVuY29kZWQoeyBleHRlbmRlZDogZmFsc2UgfSkpXG4gICAgLnVzZShleHByZXNzLnN0YXRpYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vcHVibGljJykpKVxuXG4gIC8qIGhlYWx0aCBjaGVjayBlbmRwb2ludCAqL1xuICBhcHAuZ2V0KCcvc3RhdHVzJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLnNlbmRTdGF0dXMoMjAwKVxuICB9KVxuXG4gIGFwcC5vbignZXJyb3InLCBvbkVycm9yKVxuICBhcHAub24oJ2xpc3RlbmluZycsIG9uTGlzdGVuaW5nKVxuXG4gIHJldHVybiB7IHNlcnZlciwgYXBwIH1cblxuICAvKipcbiAgICAqIEV2ZW50IGxpc3RlbmVyIGZvciBIVFRQIHNlcnZlciBcImVycm9yXCIgZXZlbnQuXG4gICovXG4gIGZ1bmN0aW9uIG9uRXJyb3IoZXJyKSB7XG4gICAgaWYgKGVyci5zeXNjYWxsICE9PSAnbGlzdGVuJykge1xuICAgICAgdGhyb3cgZXJyXG4gICAgfVxuICAgIGNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDBcblxuICAgIGNvbnN0IGJpbmQgPSB0eXBlb2YgcG9ydCA9PT0gJ3N0cmluZydcbiAgICAgID8gYFBpcGUgJHtwb3J0fWBcbiAgICAgIDogYFBvcnQgJHtwb3J0fWBcblxuICAgIC8vIGhhbmRsZSBzcGVjaWZpYyBsaXN0ZW4gZXJyb3JzIHdpdGggZnJpZW5kbHkgbWVzc2FnZXNcbiAgICBzd2l0Y2ggKGVyci5jb2RlKSB7XG4gICAgICBjYXNlICdFQUNDRVMnOlxuICAgICAgICBlcnJvcihgJHtiaW5kfSByZXF1aXJlcyBlbGV2YXRlZCBwcml2aWxlZ2VzYClcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdFQUREUklOVVNFJzpcbiAgICAgICAgZXJyb3IoYCR7YmluZH0gaXMgYWxyZWFkeSBpbiB1c2VgKVxuICAgICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IGVyclxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBsaXN0ZW5lciBmb3IgSFRUUCBzZXJ2ZXIgXCJsaXN0ZW5pbmdcIiBldmVudC5cbiAgKi9cbiAgZnVuY3Rpb24gb25MaXN0ZW5pbmcoKSB7XG4gICAgY29uc3QgYWRkciA9IHNlcnZlci5hZGRyZXNzKClcbiAgICBjb25zdCBiaW5kID0gdHlwZW9mIGFkZHIgPT09ICdzdHJpbmcnXG4gICAgICA/IGBwaXBlICR7YWRkcn1gXG4gICAgICA6IGBwb3J0ICR7YWRkci5wb3J0fWBcbiAgICBpbmZvKGBMaXN0ZW5pbmcgb24gJHtiaW5kfWApXG4gIH1cbn1cblxuXG4iXX0=