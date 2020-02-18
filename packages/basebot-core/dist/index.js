"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.init = void 0;var _configParser = require("./configParser");
var _server = _interopRequireDefault(require("./server"));
var _applySkills = _interopRequireDefault(require("./applySkills"));
var _startChannels = _interopRequireDefault(require("./startChannels"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var init = function init(_ref) {var skills = _ref.skills,config = _ref.config;
  var logger = (0, _configParser.getSingleModule)(config.logger);
  var channels = (0, _configParser.getAllModules)(config.channels);
  var rawMiddleware = (0, _configParser.getAllModules)(config.middleware);
  var models = (0, _configParser.getAllModels)(rawMiddleware);
  var storage = (0, _configParser.getSingleModule)(config.storage)({ logger: logger, models: Object.assign.apply(Object, _toConsumableArray(models)) });
  var middleware = rawMiddleware.map(function (mw) {return mw({ storage: storage, logger: logger });});
  var info = logger('core', 'info');var _Server =
  (0, _server["default"])({ logger: logger }),server = _Server.server,app = _Server.app;
  var controllers = (0, _startChannels["default"])({ channels: channels, storage: storage, logger: logger, server: server, app: app });

  // Enable users to view the chat client
  app.use(express["static"](path.join(__dirname, 'public')));

  // start server
  if (process.env.NODE_ENV !== 'test') {
    setTimeout(function () {
      info('setting up server on port: ' + (process.env.PORT || 3000));
      app.listen(process.env.PORT || 3000);
    });
  }

  (0, _applySkills["default"])({ channels: controllers, middleware: middleware, logger: logger, skills: skills });
  return {
    controllers: controllers,
    storage: storage,
    logger: logger };

};exports.init = init;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbml0Iiwic2tpbGxzIiwiY29uZmlnIiwibG9nZ2VyIiwiY2hhbm5lbHMiLCJyYXdNaWRkbGV3YXJlIiwibWlkZGxld2FyZSIsIm1vZGVscyIsInN0b3JhZ2UiLCJPYmplY3QiLCJhc3NpZ24iLCJtYXAiLCJtdyIsImluZm8iLCJzZXJ2ZXIiLCJhcHAiLCJjb250cm9sbGVycyIsInVzZSIsImV4cHJlc3MiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsInNldFRpbWVvdXQiLCJQT1JUIiwibGlzdGVuIl0sIm1hcHBpbmdzIjoiaUdBQUE7QUFDQTtBQUNBO0FBQ0Esd0U7O0FBRU8sSUFBTUEsSUFBSSxHQUFHLFNBQVBBLElBQU8sT0FBd0IsS0FBckJDLE1BQXFCLFFBQXJCQSxNQUFxQixDQUFiQyxNQUFhLFFBQWJBLE1BQWE7QUFDMUMsTUFBTUMsTUFBTSxHQUFHLG1DQUFnQkQsTUFBTSxDQUFDQyxNQUF2QixDQUFmO0FBQ0EsTUFBTUMsUUFBUSxHQUFHLGlDQUFjRixNQUFNLENBQUNFLFFBQXJCLENBQWpCO0FBQ0EsTUFBTUMsYUFBYSxHQUFHLGlDQUFjSCxNQUFNLENBQUNJLFVBQXJCLENBQXRCO0FBQ0EsTUFBTUMsTUFBTSxHQUFHLGdDQUFhRixhQUFiLENBQWY7QUFDQSxNQUFNRyxPQUFPLEdBQUcsbUNBQWdCTixNQUFNLENBQUNNLE9BQXZCLEVBQWdDLEVBQUVMLE1BQU0sRUFBTkEsTUFBRixFQUFVSSxNQUFNLEVBQUVFLE1BQU0sQ0FBQ0MsTUFBUCxPQUFBRCxNQUFNLHFCQUFXRixNQUFYLEVBQXhCLEVBQWhDLENBQWhCO0FBQ0EsTUFBTUQsVUFBVSxHQUFHRCxhQUFhLENBQUNNLEdBQWQsQ0FBa0IsVUFBQUMsRUFBRSxVQUFJQSxFQUFFLENBQUMsRUFBRUosT0FBTyxFQUFQQSxPQUFGLEVBQVdMLE1BQU0sRUFBTkEsTUFBWCxFQUFELENBQU4sRUFBcEIsQ0FBbkI7QUFDQSxNQUFNVSxJQUFJLEdBQUdWLE1BQU0sQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUFuQixDQVAwQztBQVFsQiwwQkFBTyxFQUFFQSxNQUFNLEVBQU5BLE1BQUYsRUFBUCxDQVJrQixDQVFsQ1csTUFSa0MsV0FRbENBLE1BUmtDLENBUTFCQyxHQVIwQixXQVExQkEsR0FSMEI7QUFTMUMsTUFBTUMsV0FBVyxHQUFHLCtCQUFjLEVBQUVaLFFBQVEsRUFBUkEsUUFBRixFQUFZSSxPQUFPLEVBQVBBLE9BQVosRUFBcUJMLE1BQU0sRUFBTkEsTUFBckIsRUFBNkJXLE1BQU0sRUFBTkEsTUFBN0IsRUFBcUNDLEdBQUcsRUFBSEEsR0FBckMsRUFBZCxDQUFwQjs7QUFFQTtBQUNBQSxFQUFBQSxHQUFHLENBQUNFLEdBQUosQ0FBUUMsT0FBTyxVQUFQLENBQWVDLElBQUksQ0FBQ0MsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLFFBQXJCLENBQWYsQ0FBUjs7QUFFQTtBQUNBLE1BQUlDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUFaLEtBQXlCLE1BQTdCLEVBQXFDO0FBQ25DQyxJQUFBQSxVQUFVLENBQUMsWUFBTTtBQUNmWixNQUFBQSxJQUFJLENBQUMsaUNBQWlDUyxPQUFPLENBQUNDLEdBQVIsQ0FBWUcsSUFBWixJQUFvQixJQUFyRCxDQUFELENBQUo7QUFDQVgsTUFBQUEsR0FBRyxDQUFDWSxNQUFKLENBQVdMLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRyxJQUFaLElBQW9CLElBQS9CO0FBQ0QsS0FIUyxDQUFWO0FBSUQ7O0FBRUQsK0JBQVksRUFBRXRCLFFBQVEsRUFBRVksV0FBWixFQUF5QlYsVUFBVSxFQUFWQSxVQUF6QixFQUFxQ0gsTUFBTSxFQUFOQSxNQUFyQyxFQUE2Q0YsTUFBTSxFQUFOQSxNQUE3QyxFQUFaO0FBQ0EsU0FBTztBQUNMZSxJQUFBQSxXQUFXLEVBQVhBLFdBREs7QUFFTFIsSUFBQUEsT0FBTyxFQUFQQSxPQUZLO0FBR0xMLElBQUFBLE1BQU0sRUFBTkEsTUFISyxFQUFQOztBQUtELENBNUJNLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRBbGxNb2R1bGVzLCBnZXRTaW5nbGVNb2R1bGUsIGdldEFsbE1vZGVscyB9IGZyb20gJy4vY29uZmlnUGFyc2VyJ1xuaW1wb3J0IFNlcnZlciBmcm9tICcuL3NlcnZlcidcbmltcG9ydCBhcHBseVNraWxscyBmcm9tICcuL2FwcGx5U2tpbGxzJ1xuaW1wb3J0IHN0YXJ0Q2hhbm5lbHMgZnJvbSAnLi9zdGFydENoYW5uZWxzJ1xuXG5leHBvcnQgY29uc3QgaW5pdCA9ICh7IHNraWxscywgY29uZmlnIH0pID0+IHtcbiAgY29uc3QgbG9nZ2VyID0gZ2V0U2luZ2xlTW9kdWxlKGNvbmZpZy5sb2dnZXIpXG4gIGNvbnN0IGNoYW5uZWxzID0gZ2V0QWxsTW9kdWxlcyhjb25maWcuY2hhbm5lbHMpXG4gIGNvbnN0IHJhd01pZGRsZXdhcmUgPSBnZXRBbGxNb2R1bGVzKGNvbmZpZy5taWRkbGV3YXJlKVxuICBjb25zdCBtb2RlbHMgPSBnZXRBbGxNb2RlbHMocmF3TWlkZGxld2FyZSlcbiAgY29uc3Qgc3RvcmFnZSA9IGdldFNpbmdsZU1vZHVsZShjb25maWcuc3RvcmFnZSkoeyBsb2dnZXIsIG1vZGVsczogT2JqZWN0LmFzc2lnbiguLi5tb2RlbHMpIH0pXG4gIGNvbnN0IG1pZGRsZXdhcmUgPSByYXdNaWRkbGV3YXJlLm1hcChtdyA9PiBtdyh7IHN0b3JhZ2UsIGxvZ2dlciB9KSlcbiAgY29uc3QgaW5mbyA9IGxvZ2dlcignY29yZScsICdpbmZvJylcbiAgY29uc3QgeyBzZXJ2ZXIsIGFwcCB9ID0gU2VydmVyKHsgbG9nZ2VyIH0pXG4gIGNvbnN0IGNvbnRyb2xsZXJzID0gc3RhcnRDaGFubmVscyh7IGNoYW5uZWxzLCBzdG9yYWdlLCBsb2dnZXIsIHNlcnZlciwgYXBwIH0pXG5cbiAgLy8gRW5hYmxlIHVzZXJzIHRvIHZpZXcgdGhlIGNoYXQgY2xpZW50XG4gIGFwcC51c2UoZXhwcmVzcy5zdGF0aWMocGF0aC5qb2luKF9fZGlybmFtZSwgJ3B1YmxpYycpKSlcblxuICAvLyBzdGFydCBzZXJ2ZXJcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAndGVzdCcpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGluZm8oJ3NldHRpbmcgdXAgc2VydmVyIG9uIHBvcnQ6ICcgKyAocHJvY2Vzcy5lbnYuUE9SVCB8fCAzMDAwKSlcbiAgICAgIGFwcC5saXN0ZW4ocHJvY2Vzcy5lbnYuUE9SVCB8fCAzMDAwKVxuICAgIH0pXG4gIH1cblxuICBhcHBseVNraWxscyh7IGNoYW5uZWxzOiBjb250cm9sbGVycywgbWlkZGxld2FyZSwgbG9nZ2VyLCBza2lsbHMgfSlcbiAgcmV0dXJuIHtcbiAgICBjb250cm9sbGVycyxcbiAgICBzdG9yYWdlLFxuICAgIGxvZ2dlclxuICB9XG59XG4iXX0=