"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _v = _interopRequireDefault(require("uuid/v1"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}var _default =

function _default(storage) {
  return function (req, res) {
    try {
      var id = (0, _v["default"])();
      controller.storage.users.save({ id: id });
      // return without waiting - should be fine
      res.set('Content-Type', 'application/json');
      res.json({ success: true, id: id });
    } catch (err) {
      res.set('Content-Type', 'application/json');
      res.status(500).json({ success: false, message: err });
    }
  };
};exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbInN0b3JhZ2UiLCJyZXEiLCJyZXMiLCJpZCIsImNvbnRyb2xsZXIiLCJ1c2VycyIsInNhdmUiLCJzZXQiLCJqc29uIiwic3VjY2VzcyIsImVyciIsInN0YXR1cyIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiJ1R0FBQSxvRDs7QUFFZSxrQkFBQUEsT0FBTyxFQUFJO0FBQ3hCLFNBQU8sVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDbkIsUUFBSTtBQUNGLFVBQU1DLEVBQUUsR0FBRyxvQkFBWDtBQUNBQyxNQUFBQSxVQUFVLENBQUNKLE9BQVgsQ0FBbUJLLEtBQW5CLENBQXlCQyxJQUF6QixDQUE4QixFQUFFSCxFQUFFLEVBQUZBLEVBQUYsRUFBOUI7QUFDQTtBQUNBRCxNQUFBQSxHQUFHLENBQUNLLEdBQUosQ0FBUSxjQUFSLEVBQXdCLGtCQUF4QjtBQUNBTCxNQUFBQSxHQUFHLENBQUNNLElBQUosQ0FBUyxFQUFFQyxPQUFPLEVBQUUsSUFBWCxFQUFpQk4sRUFBRSxFQUFGQSxFQUFqQixFQUFUO0FBQ0QsS0FORCxDQU1FLE9BQU9PLEdBQVAsRUFBWTtBQUNaUixNQUFBQSxHQUFHLENBQUNLLEdBQUosQ0FBUSxjQUFSLEVBQXdCLGtCQUF4QjtBQUNBTCxNQUFBQSxHQUFHLENBQUNTLE1BQUosQ0FBVyxHQUFYLEVBQWdCSCxJQUFoQixDQUFxQixFQUFFQyxPQUFPLEVBQUUsS0FBWCxFQUFrQkcsT0FBTyxFQUFFRixHQUEzQixFQUFyQjtBQUNEO0FBQ0YsR0FYRDtBQVlELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXVpZCBmcm9tICd1dWlkL3YxJ1xuXG5leHBvcnQgZGVmYXVsdCBzdG9yYWdlID0+IHtcbiAgcmV0dXJuIChyZXEsIHJlcykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBpZCA9IHV1aWQoKVxuICAgICAgY29udHJvbGxlci5zdG9yYWdlLnVzZXJzLnNhdmUoeyBpZCB9KVxuICAgICAgLy8gcmV0dXJuIHdpdGhvdXQgd2FpdGluZyAtIHNob3VsZCBiZSBmaW5lXG4gICAgICByZXMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpXG4gICAgICByZXMuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGlkIH0pXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpXG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiBlcnIgfSlcbiAgICB9XG4gIH1cbn1cbiJdfQ==