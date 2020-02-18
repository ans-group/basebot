"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.init = void 0;var _configParser = require("./configParser");
var _server = _interopRequireDefault(require("./server"));
var _applySkills = _interopRequireDefault(require("./applySkills"));
var _startChannels = _interopRequireDefault(require("./startChannels"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var init = function init(_ref) {var skills = _ref.skills,config = _ref.config;
  var logger = (0, _configParser.getSingleModule)(config.logger);
  var channels = (0, _configParser.getAllModules)(config.channels);
  var rawMiddleware = (0, _configParser.getAllModules)(config.middleware);
  var models = (0, _configParser.getAllModels)(rawMiddleware);
  var storage = (0, _configParser.getSingleModule)(config.storage)({ logger: logger, models: models && Array.isArray(models) ? Object.assign.apply(Object, _toConsumableArray(models)) : models });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbml0Iiwic2tpbGxzIiwiY29uZmlnIiwibG9nZ2VyIiwiY2hhbm5lbHMiLCJyYXdNaWRkbGV3YXJlIiwibWlkZGxld2FyZSIsIm1vZGVscyIsInN0b3JhZ2UiLCJBcnJheSIsImlzQXJyYXkiLCJPYmplY3QiLCJhc3NpZ24iLCJtYXAiLCJtdyIsImluZm8iLCJzZXJ2ZXIiLCJhcHAiLCJjb250cm9sbGVycyIsInVzZSIsImV4cHJlc3MiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsInNldFRpbWVvdXQiLCJQT1JUIiwibGlzdGVuIl0sIm1hcHBpbmdzIjoiaUdBQUE7QUFDQTtBQUNBO0FBQ0Esd0U7O0FBRU8sSUFBTUEsSUFBSSxHQUFHLFNBQVBBLElBQU8sT0FBd0IsS0FBckJDLE1BQXFCLFFBQXJCQSxNQUFxQixDQUFiQyxNQUFhLFFBQWJBLE1BQWE7QUFDMUMsTUFBTUMsTUFBTSxHQUFHLG1DQUFnQkQsTUFBTSxDQUFDQyxNQUF2QixDQUFmO0FBQ0EsTUFBTUMsUUFBUSxHQUFHLGlDQUFjRixNQUFNLENBQUNFLFFBQXJCLENBQWpCO0FBQ0EsTUFBTUMsYUFBYSxHQUFHLGlDQUFjSCxNQUFNLENBQUNJLFVBQXJCLENBQXRCO0FBQ0EsTUFBTUMsTUFBTSxHQUFHLGdDQUFhRixhQUFiLENBQWY7QUFDQSxNQUFNRyxPQUFPLEdBQUcsbUNBQWdCTixNQUFNLENBQUNNLE9BQXZCLEVBQWdDLEVBQUVMLE1BQU0sRUFBTkEsTUFBRixFQUFVSSxNQUFNLEVBQUVBLE1BQU0sSUFBSUUsS0FBSyxDQUFDQyxPQUFOLENBQWNILE1BQWQsQ0FBVixHQUFrQ0ksTUFBTSxDQUFDQyxNQUFQLE9BQUFELE1BQU0scUJBQVdKLE1BQVgsRUFBeEMsR0FBNkRBLE1BQS9FLEVBQWhDLENBQWhCO0FBQ0EsTUFBTUQsVUFBVSxHQUFHRCxhQUFhLENBQUNRLEdBQWQsQ0FBa0IsVUFBQUMsRUFBRSxVQUFJQSxFQUFFLENBQUMsRUFBRU4sT0FBTyxFQUFQQSxPQUFGLEVBQVdMLE1BQU0sRUFBTkEsTUFBWCxFQUFELENBQU4sRUFBcEIsQ0FBbkI7QUFDQSxNQUFNWSxJQUFJLEdBQUdaLE1BQU0sQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUFuQixDQVAwQztBQVFsQiwwQkFBTyxFQUFFQSxNQUFNLEVBQU5BLE1BQUYsRUFBUCxDQVJrQixDQVFsQ2EsTUFSa0MsV0FRbENBLE1BUmtDLENBUTFCQyxHQVIwQixXQVExQkEsR0FSMEI7QUFTMUMsTUFBTUMsV0FBVyxHQUFHLCtCQUFjLEVBQUVkLFFBQVEsRUFBUkEsUUFBRixFQUFZSSxPQUFPLEVBQVBBLE9BQVosRUFBcUJMLE1BQU0sRUFBTkEsTUFBckIsRUFBNkJhLE1BQU0sRUFBTkEsTUFBN0IsRUFBcUNDLEdBQUcsRUFBSEEsR0FBckMsRUFBZCxDQUFwQjs7QUFFQTtBQUNBQSxFQUFBQSxHQUFHLENBQUNFLEdBQUosQ0FBUUMsT0FBTyxVQUFQLENBQWVDLElBQUksQ0FBQ0MsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLFFBQXJCLENBQWYsQ0FBUjs7QUFFQTtBQUNBLE1BQUlDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUFaLEtBQXlCLE1BQTdCLEVBQXFDO0FBQ25DQyxJQUFBQSxVQUFVLENBQUMsWUFBTTtBQUNmWixNQUFBQSxJQUFJLENBQUMsaUNBQWlDUyxPQUFPLENBQUNDLEdBQVIsQ0FBWUcsSUFBWixJQUFvQixJQUFyRCxDQUFELENBQUo7QUFDQVgsTUFBQUEsR0FBRyxDQUFDWSxNQUFKLENBQVdMLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRyxJQUFaLElBQW9CLElBQS9CO0FBQ0QsS0FIUyxDQUFWO0FBSUQ7O0FBRUQsK0JBQVksRUFBRXhCLFFBQVEsRUFBRWMsV0FBWixFQUF5QlosVUFBVSxFQUFWQSxVQUF6QixFQUFxQ0gsTUFBTSxFQUFOQSxNQUFyQyxFQUE2Q0YsTUFBTSxFQUFOQSxNQUE3QyxFQUFaO0FBQ0EsU0FBTztBQUNMaUIsSUFBQUEsV0FBVyxFQUFYQSxXQURLO0FBRUxWLElBQUFBLE9BQU8sRUFBUEEsT0FGSztBQUdMTCxJQUFBQSxNQUFNLEVBQU5BLE1BSEssRUFBUDs7QUFLRCxDQTVCTSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0QWxsTW9kdWxlcywgZ2V0U2luZ2xlTW9kdWxlLCBnZXRBbGxNb2RlbHMgfSBmcm9tICcuL2NvbmZpZ1BhcnNlcidcbmltcG9ydCBTZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInXG5pbXBvcnQgYXBwbHlTa2lsbHMgZnJvbSAnLi9hcHBseVNraWxscydcbmltcG9ydCBzdGFydENoYW5uZWxzIGZyb20gJy4vc3RhcnRDaGFubmVscydcblxuZXhwb3J0IGNvbnN0IGluaXQgPSAoeyBza2lsbHMsIGNvbmZpZyB9KSA9PiB7XG4gIGNvbnN0IGxvZ2dlciA9IGdldFNpbmdsZU1vZHVsZShjb25maWcubG9nZ2VyKVxuICBjb25zdCBjaGFubmVscyA9IGdldEFsbE1vZHVsZXMoY29uZmlnLmNoYW5uZWxzKVxuICBjb25zdCByYXdNaWRkbGV3YXJlID0gZ2V0QWxsTW9kdWxlcyhjb25maWcubWlkZGxld2FyZSlcbiAgY29uc3QgbW9kZWxzID0gZ2V0QWxsTW9kZWxzKHJhd01pZGRsZXdhcmUpXG4gIGNvbnN0IHN0b3JhZ2UgPSBnZXRTaW5nbGVNb2R1bGUoY29uZmlnLnN0b3JhZ2UpKHsgbG9nZ2VyLCBtb2RlbHM6IG1vZGVscyAmJiBBcnJheS5pc0FycmF5KG1vZGVscykgPyBPYmplY3QuYXNzaWduKC4uLm1vZGVscykgOiBtb2RlbHMgfSlcbiAgY29uc3QgbWlkZGxld2FyZSA9IHJhd01pZGRsZXdhcmUubWFwKG13ID0+IG13KHsgc3RvcmFnZSwgbG9nZ2VyIH0pKVxuICBjb25zdCBpbmZvID0gbG9nZ2VyKCdjb3JlJywgJ2luZm8nKVxuICBjb25zdCB7IHNlcnZlciwgYXBwIH0gPSBTZXJ2ZXIoeyBsb2dnZXIgfSlcbiAgY29uc3QgY29udHJvbGxlcnMgPSBzdGFydENoYW5uZWxzKHsgY2hhbm5lbHMsIHN0b3JhZ2UsIGxvZ2dlciwgc2VydmVyLCBhcHAgfSlcblxuICAvLyBFbmFibGUgdXNlcnMgdG8gdmlldyB0aGUgY2hhdCBjbGllbnRcbiAgYXBwLnVzZShleHByZXNzLnN0YXRpYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAncHVibGljJykpKVxuXG4gIC8vIHN0YXJ0IHNlcnZlclxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICd0ZXN0Jykge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaW5mbygnc2V0dGluZyB1cCBzZXJ2ZXIgb24gcG9ydDogJyArIChwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDApKVxuICAgICAgYXBwLmxpc3Rlbihwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDApXG4gICAgfSlcbiAgfVxuXG4gIGFwcGx5U2tpbGxzKHsgY2hhbm5lbHM6IGNvbnRyb2xsZXJzLCBtaWRkbGV3YXJlLCBsb2dnZXIsIHNraWxscyB9KVxuICByZXR1cm4ge1xuICAgIGNvbnRyb2xsZXJzLFxuICAgIHN0b3JhZ2UsXG4gICAgbG9nZ2VyXG4gIH1cbn1cbiJdfQ==