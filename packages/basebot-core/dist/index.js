"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.init = void 0;var _configParser = require("./configParser");
var _server = _interopRequireDefault(require("./server"));
var _applySkills = _interopRequireDefault(require("./applySkills"));
var _startChannels = _interopRequireDefault(require("./startChannels"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var init = function init(_ref) {var skills = _ref.skills,config = _ref.config;
  var logger = (0, _configParser.getSingleModule)(config.logger);
  var channels = (0, _configParser.getAllModules)(config.channels);
  var rawMiddleware = (0, _configParser.getAllModules)(config.middleware);
  var models = (0, _configParser.getAllModels)(rawMiddleware);
  var storage = (0, _configParser.getSingleModule)(config.storage)({ logger: logger, models: models && Object.assign.apply(Object, _toConsumableArray(models)) });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbml0Iiwic2tpbGxzIiwiY29uZmlnIiwibG9nZ2VyIiwiY2hhbm5lbHMiLCJyYXdNaWRkbGV3YXJlIiwibWlkZGxld2FyZSIsIm1vZGVscyIsInN0b3JhZ2UiLCJPYmplY3QiLCJhc3NpZ24iLCJtYXAiLCJtdyIsImluZm8iLCJzZXJ2ZXIiLCJhcHAiLCJjb250cm9sbGVycyIsInVzZSIsImV4cHJlc3MiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsInNldFRpbWVvdXQiLCJQT1JUIiwibGlzdGVuIl0sIm1hcHBpbmdzIjoiaUdBQUE7QUFDQTtBQUNBO0FBQ0Esd0U7O0FBRU8sSUFBTUEsSUFBSSxHQUFHLFNBQVBBLElBQU8sT0FBd0IsS0FBckJDLE1BQXFCLFFBQXJCQSxNQUFxQixDQUFiQyxNQUFhLFFBQWJBLE1BQWE7QUFDMUMsTUFBTUMsTUFBTSxHQUFHLG1DQUFnQkQsTUFBTSxDQUFDQyxNQUF2QixDQUFmO0FBQ0EsTUFBTUMsUUFBUSxHQUFHLGlDQUFjRixNQUFNLENBQUNFLFFBQXJCLENBQWpCO0FBQ0EsTUFBTUMsYUFBYSxHQUFHLGlDQUFjSCxNQUFNLENBQUNJLFVBQXJCLENBQXRCO0FBQ0EsTUFBTUMsTUFBTSxHQUFHLGdDQUFhRixhQUFiLENBQWY7QUFDQSxNQUFNRyxPQUFPLEdBQUcsbUNBQWdCTixNQUFNLENBQUNNLE9BQXZCLEVBQWdDLEVBQUVMLE1BQU0sRUFBTkEsTUFBRixFQUFVSSxNQUFNLEVBQUVBLE1BQU0sSUFBSUUsTUFBTSxDQUFDQyxNQUFQLE9BQUFELE1BQU0scUJBQVdGLE1BQVgsRUFBbEMsRUFBaEMsQ0FBaEI7QUFDQSxNQUFNRCxVQUFVLEdBQUdELGFBQWEsQ0FBQ00sR0FBZCxDQUFrQixVQUFBQyxFQUFFLFVBQUlBLEVBQUUsQ0FBQyxFQUFFSixPQUFPLEVBQVBBLE9BQUYsRUFBV0wsTUFBTSxFQUFOQSxNQUFYLEVBQUQsQ0FBTixFQUFwQixDQUFuQjtBQUNBLE1BQU1VLElBQUksR0FBR1YsTUFBTSxDQUFDLE1BQUQsRUFBUyxNQUFULENBQW5CLENBUDBDO0FBUWxCLDBCQUFPLEVBQUVBLE1BQU0sRUFBTkEsTUFBRixFQUFQLENBUmtCLENBUWxDVyxNQVJrQyxXQVFsQ0EsTUFSa0MsQ0FRMUJDLEdBUjBCLFdBUTFCQSxHQVIwQjtBQVMxQyxNQUFNQyxXQUFXLEdBQUcsK0JBQWMsRUFBRVosUUFBUSxFQUFSQSxRQUFGLEVBQVlJLE9BQU8sRUFBUEEsT0FBWixFQUFxQkwsTUFBTSxFQUFOQSxNQUFyQixFQUE2QlcsTUFBTSxFQUFOQSxNQUE3QixFQUFxQ0MsR0FBRyxFQUFIQSxHQUFyQyxFQUFkLENBQXBCOztBQUVBO0FBQ0FBLEVBQUFBLEdBQUcsQ0FBQ0UsR0FBSixDQUFRQyxPQUFPLFVBQVAsQ0FBZUMsSUFBSSxDQUFDQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsUUFBckIsQ0FBZixDQUFSOztBQUVBO0FBQ0EsTUFBSUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFFBQVosS0FBeUIsTUFBN0IsRUFBcUM7QUFDbkNDLElBQUFBLFVBQVUsQ0FBQyxZQUFNO0FBQ2ZaLE1BQUFBLElBQUksQ0FBQyxpQ0FBaUNTLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRyxJQUFaLElBQW9CLElBQXJELENBQUQsQ0FBSjtBQUNBWCxNQUFBQSxHQUFHLENBQUNZLE1BQUosQ0FBV0wsT0FBTyxDQUFDQyxHQUFSLENBQVlHLElBQVosSUFBb0IsSUFBL0I7QUFDRCxLQUhTLENBQVY7QUFJRDs7QUFFRCwrQkFBWSxFQUFFdEIsUUFBUSxFQUFFWSxXQUFaLEVBQXlCVixVQUFVLEVBQVZBLFVBQXpCLEVBQXFDSCxNQUFNLEVBQU5BLE1BQXJDLEVBQTZDRixNQUFNLEVBQU5BLE1BQTdDLEVBQVo7QUFDQSxTQUFPO0FBQ0xlLElBQUFBLFdBQVcsRUFBWEEsV0FESztBQUVMUixJQUFBQSxPQUFPLEVBQVBBLE9BRks7QUFHTEwsSUFBQUEsTUFBTSxFQUFOQSxNQUhLLEVBQVA7O0FBS0QsQ0E1Qk0sQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldEFsbE1vZHVsZXMsIGdldFNpbmdsZU1vZHVsZSwgZ2V0QWxsTW9kZWxzIH0gZnJvbSAnLi9jb25maWdQYXJzZXInXG5pbXBvcnQgU2VydmVyIGZyb20gJy4vc2VydmVyJ1xuaW1wb3J0IGFwcGx5U2tpbGxzIGZyb20gJy4vYXBwbHlTa2lsbHMnXG5pbXBvcnQgc3RhcnRDaGFubmVscyBmcm9tICcuL3N0YXJ0Q2hhbm5lbHMnXG5cbmV4cG9ydCBjb25zdCBpbml0ID0gKHsgc2tpbGxzLCBjb25maWcgfSkgPT4ge1xuICBjb25zdCBsb2dnZXIgPSBnZXRTaW5nbGVNb2R1bGUoY29uZmlnLmxvZ2dlcilcbiAgY29uc3QgY2hhbm5lbHMgPSBnZXRBbGxNb2R1bGVzKGNvbmZpZy5jaGFubmVscylcbiAgY29uc3QgcmF3TWlkZGxld2FyZSA9IGdldEFsbE1vZHVsZXMoY29uZmlnLm1pZGRsZXdhcmUpXG4gIGNvbnN0IG1vZGVscyA9IGdldEFsbE1vZGVscyhyYXdNaWRkbGV3YXJlKVxuICBjb25zdCBzdG9yYWdlID0gZ2V0U2luZ2xlTW9kdWxlKGNvbmZpZy5zdG9yYWdlKSh7IGxvZ2dlciwgbW9kZWxzOiBtb2RlbHMgJiYgT2JqZWN0LmFzc2lnbiguLi5tb2RlbHMpIH0pXG4gIGNvbnN0IG1pZGRsZXdhcmUgPSByYXdNaWRkbGV3YXJlLm1hcChtdyA9PiBtdyh7IHN0b3JhZ2UsIGxvZ2dlciB9KSlcbiAgY29uc3QgaW5mbyA9IGxvZ2dlcignY29yZScsICdpbmZvJylcbiAgY29uc3QgeyBzZXJ2ZXIsIGFwcCB9ID0gU2VydmVyKHsgbG9nZ2VyIH0pXG4gIGNvbnN0IGNvbnRyb2xsZXJzID0gc3RhcnRDaGFubmVscyh7IGNoYW5uZWxzLCBzdG9yYWdlLCBsb2dnZXIsIHNlcnZlciwgYXBwIH0pXG5cbiAgLy8gRW5hYmxlIHVzZXJzIHRvIHZpZXcgdGhlIGNoYXQgY2xpZW50XG4gIGFwcC51c2UoZXhwcmVzcy5zdGF0aWMocGF0aC5qb2luKF9fZGlybmFtZSwgJ3B1YmxpYycpKSlcblxuICAvLyBzdGFydCBzZXJ2ZXJcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAndGVzdCcpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGluZm8oJ3NldHRpbmcgdXAgc2VydmVyIG9uIHBvcnQ6ICcgKyAocHJvY2Vzcy5lbnYuUE9SVCB8fCAzMDAwKSlcbiAgICAgIGFwcC5saXN0ZW4ocHJvY2Vzcy5lbnYuUE9SVCB8fCAzMDAwKVxuICAgIH0pXG4gIH1cblxuICBhcHBseVNraWxscyh7IGNoYW5uZWxzOiBjb250cm9sbGVycywgbWlkZGxld2FyZSwgbG9nZ2VyLCBza2lsbHMgfSlcbiAgcmV0dXJuIHtcbiAgICBjb250cm9sbGVycyxcbiAgICBzdG9yYWdlLFxuICAgIGxvZ2dlclxuICB9XG59XG4iXX0=