"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _forEach = _interopRequireDefault(require("lodash/forEach"));
var _groupBy = _interopRequireDefault(require("lodash/groupBy"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}var _default =

function _default(_ref) {var channels = _ref.channels,middleware = _ref.middleware,logger = _ref.logger,skills = _ref.skills;
  var info = logger('main', 'info');
  // activate middleware
  var groupedMiddleware = {
    hear: middleware.filter(function (mw) {return mw.hear;}).map(function (mw) {return {
        handler: mw.hear,
        triggers: mw.triggers || [],
        channels: mw.channels };}) };


  var types = ['receive', 'send', 'heard', 'capture'];
  types.forEach(applyMiddleware);

  function applyMiddleware(type) {
    groupedMiddleware[type] = [];
    middleware.forEach(function (mw) {
      if (mw[type]) {
        groupedMiddleware[type].push({
          handler: mw[type],
          triggers: mw.triggers || [],
          channels: mw.channels });

      }
    });
    (0, _forEach["default"])(channels, function (_ref2) {var controller = _ref2.controller,name = _ref2.name;
      groupedMiddleware[type].
      filter(function (item) {return !item.channels || item.channels.includes(name);}).
      forEach(function (item) {return controller.middleware[type].use(item.handler);});
    });
  }
  // activate the bots skills
  info('Setting up skills');
  (0, _forEach["default"])(skills, function (definitions) {return definitions.forEach(applySkill);});

  info('done');
  // default response
  (0, _forEach["default"])(channels, function (_ref3) {var controller = _ref3.controller;
    controller.hears('.*', 'message_received', defaultResponse);
  });

  function defaultResponse(bot, message) {
    if (!message.answered) {
      bot.reply(message, process.env.defaultResponse || "Sorry, didn't catch that")
    }
  }

  function applySkill(skill) {
    (0, _forEach["default"])(channels, skill.event ? mapEvents : mapHears);
    function mapHears(_ref4) {var controller = _ref4.controller,name = _ref4.name;
      var trigger = skill.intent || skill.pattern;
      var hearMiddleware = groupedMiddleware.hear || [];
      var filteredHandlers = hearMiddleware.filter(filterHandlers(name, skill.intent ? 'intent' : 'pattern'));
      controller.hears.apply(controller, [
      trigger,
      'message_received'].concat(_toConsumableArray(
      filteredHandlers.map(function (_ref5) {var handler = _ref5.handler;return handler;})), [
      function (bot, message) {return skill.handler(bot, message, controller);}]));

    }

    function mapEvents(_ref6) {var controller = _ref6.controller,name = _ref6.name;
      var trigger = skill.event;
      controller.on(trigger, function (bot, message) {return skill.handler(bot, message, controller);});
    }
  }
  function filterHandlers(channelName, type) {
    return function (handler) {
      var channelValid = !handler.channels || handler.channels.includes(channelName);
      var typeValid = !handler.triggers || handler.triggers.includes(type);
      return channelValid && typeValid;
    };
  }
};exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBseVNraWxscy5qcyJdLCJuYW1lcyI6WyJjaGFubmVscyIsIm1pZGRsZXdhcmUiLCJsb2dnZXIiLCJza2lsbHMiLCJpbmZvIiwiZ3JvdXBlZE1pZGRsZXdhcmUiLCJoZWFyIiwiZmlsdGVyIiwibXciLCJtYXAiLCJoYW5kbGVyIiwidHJpZ2dlcnMiLCJ0eXBlcyIsImZvckVhY2giLCJhcHBseU1pZGRsZXdhcmUiLCJ0eXBlIiwicHVzaCIsImNvbnRyb2xsZXIiLCJuYW1lIiwiaXRlbSIsImluY2x1ZGVzIiwidXNlIiwiZGVmaW5pdGlvbnMiLCJhcHBseVNraWxsIiwiaGVhcnMiLCJkZWZhdWx0UmVzcG9uc2UiLCJib3QiLCJtZXNzYWdlIiwiYW5zd2VyZWQiLCJyZXBseSIsInNraWxsIiwiZXZlbnQiLCJtYXBFdmVudHMiLCJtYXBIZWFycyIsInRyaWdnZXIiLCJpbnRlbnQiLCJwYXR0ZXJuIiwiaGVhck1pZGRsZXdhcmUiLCJmaWx0ZXJlZEhhbmRsZXJzIiwiZmlsdGVySGFuZGxlcnMiLCJvbiIsImNoYW5uZWxOYW1lIiwiY2hhbm5lbFZhbGlkIiwidHlwZVZhbGlkIl0sIm1hcHBpbmdzIjoidUdBQUE7QUFDQSxpRTs7QUFFZSx3QkFBOEMsS0FBM0NBLFFBQTJDLFFBQTNDQSxRQUEyQyxDQUFqQ0MsVUFBaUMsUUFBakNBLFVBQWlDLENBQXJCQyxNQUFxQixRQUFyQkEsTUFBcUIsQ0FBYkMsTUFBYSxRQUFiQSxNQUFhO0FBQzNELE1BQU1DLElBQUksR0FBR0YsTUFBTSxDQUFDLE1BQUQsRUFBUyxNQUFULENBQW5CO0FBQ0E7QUFDQSxNQUFNRyxpQkFBaUIsR0FBRztBQUN4QkMsSUFBQUEsSUFBSSxFQUFFTCxVQUFVLENBQUNNLE1BQVgsQ0FBa0IsVUFBQUMsRUFBRSxVQUFJQSxFQUFFLENBQUNGLElBQVAsRUFBcEIsRUFBaUNHLEdBQWpDLENBQXFDLFVBQUFELEVBQUUsVUFBSztBQUNoREUsUUFBQUEsT0FBTyxFQUFFRixFQUFFLENBQUNGLElBRG9DO0FBRWhESyxRQUFBQSxRQUFRLEVBQUVILEVBQUUsQ0FBQ0csUUFBSCxJQUFlLEVBRnVCO0FBR2hEWCxRQUFBQSxRQUFRLEVBQUVRLEVBQUUsQ0FBQ1IsUUFIbUMsRUFBTCxFQUF2QyxDQURrQixFQUExQjs7O0FBT0EsTUFBTVksS0FBSyxHQUFHLENBQUMsU0FBRCxFQUFZLE1BQVosRUFBb0IsT0FBcEIsRUFBNkIsU0FBN0IsQ0FBZDtBQUNBQSxFQUFBQSxLQUFLLENBQUNDLE9BQU4sQ0FBY0MsZUFBZDs7QUFFQSxXQUFTQSxlQUFULENBQXlCQyxJQUF6QixFQUErQjtBQUM3QlYsSUFBQUEsaUJBQWlCLENBQUNVLElBQUQsQ0FBakIsR0FBMEIsRUFBMUI7QUFDQWQsSUFBQUEsVUFBVSxDQUFDWSxPQUFYLENBQW1CLFVBQUFMLEVBQUUsRUFBSTtBQUN2QixVQUFJQSxFQUFFLENBQUNPLElBQUQsQ0FBTixFQUFjO0FBQ1pWLFFBQUFBLGlCQUFpQixDQUFDVSxJQUFELENBQWpCLENBQXdCQyxJQUF4QixDQUE2QjtBQUMzQk4sVUFBQUEsT0FBTyxFQUFFRixFQUFFLENBQUNPLElBQUQsQ0FEZ0I7QUFFM0JKLFVBQUFBLFFBQVEsRUFBRUgsRUFBRSxDQUFDRyxRQUFILElBQWUsRUFGRTtBQUczQlgsVUFBQUEsUUFBUSxFQUFFUSxFQUFFLENBQUNSLFFBSGMsRUFBN0I7O0FBS0Q7QUFDRixLQVJEO0FBU0EsNkJBQVFBLFFBQVIsRUFBa0IsaUJBQTBCLEtBQXZCaUIsVUFBdUIsU0FBdkJBLFVBQXVCLENBQVhDLElBQVcsU0FBWEEsSUFBVztBQUMxQ2IsTUFBQUEsaUJBQWlCLENBQUNVLElBQUQsQ0FBakI7QUFDR1IsTUFBQUEsTUFESCxDQUNVLFVBQUFZLElBQUksVUFBSSxDQUFDQSxJQUFJLENBQUNuQixRQUFOLElBQWtCbUIsSUFBSSxDQUFDbkIsUUFBTCxDQUFjb0IsUUFBZCxDQUF1QkYsSUFBdkIsQ0FBdEIsRUFEZDtBQUVHTCxNQUFBQSxPQUZILENBRVcsVUFBQU0sSUFBSSxVQUFJRixVQUFVLENBQUNoQixVQUFYLENBQXNCYyxJQUF0QixFQUE0Qk0sR0FBNUIsQ0FBZ0NGLElBQUksQ0FBQ1QsT0FBckMsQ0FBSixFQUZmO0FBR0QsS0FKRDtBQUtEO0FBQ0Q7QUFDQU4sRUFBQUEsSUFBSSxDQUFDLG1CQUFELENBQUo7QUFDQSwyQkFBUUQsTUFBUixFQUFnQixVQUFBbUIsV0FBVyxVQUFJQSxXQUFXLENBQUNULE9BQVosQ0FBb0JVLFVBQXBCLENBQUosRUFBM0I7O0FBRUFuQixFQUFBQSxJQUFJLENBQUMsTUFBRCxDQUFKO0FBQ0E7QUFDQSwyQkFBUUosUUFBUixFQUFrQixpQkFBb0IsS0FBakJpQixVQUFpQixTQUFqQkEsVUFBaUI7QUFDcENBLElBQUFBLFVBQVUsQ0FBQ08sS0FBWCxDQUFpQixJQUFqQixFQUF1QixrQkFBdkIsRUFBMkNDLGVBQTNDO0FBQ0QsR0FGRDs7QUFJQSxXQUFTQSxlQUFULENBQXlCQyxHQUF6QixFQUE4QkMsT0FBOUIsRUFBdUM7QUFDckMsUUFBSSxDQUFDQSxPQUFPLENBQUNDLFFBQWIsRUFBdUI7QUFDckJGLE1BQUFBLEdBQUcsQ0FBQ0csS0FBSixDQUFVRixPQUFWLEVBQW1CLDBCQUFuQjtBQUNEO0FBQ0Y7O0FBRUQsV0FBU0osVUFBVCxDQUFvQk8sS0FBcEIsRUFBMkI7QUFDekIsNkJBQVE5QixRQUFSLEVBQWtCOEIsS0FBSyxDQUFDQyxLQUFOLEdBQWNDLFNBQWQsR0FBMEJDLFFBQTVDO0FBQ0EsYUFBU0EsUUFBVCxRQUF3QyxLQUFwQmhCLFVBQW9CLFNBQXBCQSxVQUFvQixDQUFSQyxJQUFRLFNBQVJBLElBQVE7QUFDdEMsVUFBTWdCLE9BQU8sR0FBR0osS0FBSyxDQUFDSyxNQUFOLElBQWdCTCxLQUFLLENBQUNNLE9BQXRDO0FBQ0EsVUFBTUMsY0FBYyxHQUFHaEMsaUJBQWlCLENBQUNDLElBQWxCLElBQTBCLEVBQWpEO0FBQ0EsVUFBTWdDLGdCQUFnQixHQUFHRCxjQUFjLENBQUM5QixNQUFmLENBQXNCZ0MsY0FBYyxDQUFDckIsSUFBRCxFQUFPWSxLQUFLLENBQUNLLE1BQU4sR0FBZSxRQUFmLEdBQTBCLFNBQWpDLENBQXBDLENBQXpCO0FBQ0FsQixNQUFBQSxVQUFVLENBQUNPLEtBQVgsT0FBQVAsVUFBVTtBQUNSaUIsTUFBQUEsT0FEUTtBQUVSLHdCQUZRO0FBR0xJLE1BQUFBLGdCQUFnQixDQUFDN0IsR0FBakIsQ0FBcUIsc0JBQUdDLE9BQUgsU0FBR0EsT0FBSCxRQUFpQkEsT0FBakIsRUFBckIsQ0FISztBQUlSLGdCQUFDZ0IsR0FBRCxFQUFNQyxPQUFOLFVBQWtCRyxLQUFLLENBQUNwQixPQUFOLENBQWNnQixHQUFkLEVBQW1CQyxPQUFuQixFQUE0QlYsVUFBNUIsQ0FBbEIsRUFKUSxHQUFWOztBQU1EOztBQUVELGFBQVNlLFNBQVQsUUFBeUMsS0FBcEJmLFVBQW9CLFNBQXBCQSxVQUFvQixDQUFSQyxJQUFRLFNBQVJBLElBQVE7QUFDdkMsVUFBTWdCLE9BQU8sR0FBR0osS0FBSyxDQUFDQyxLQUF0QjtBQUNBZCxNQUFBQSxVQUFVLENBQUN1QixFQUFYLENBQWNOLE9BQWQsRUFBdUIsVUFBQ1IsR0FBRCxFQUFNQyxPQUFOLFVBQWtCRyxLQUFLLENBQUNwQixPQUFOLENBQWNnQixHQUFkLEVBQW1CQyxPQUFuQixFQUE0QlYsVUFBNUIsQ0FBbEIsRUFBdkI7QUFDRDtBQUNGO0FBQ0QsV0FBU3NCLGNBQVQsQ0FBd0JFLFdBQXhCLEVBQXFDMUIsSUFBckMsRUFBMkM7QUFDekMsV0FBTyxVQUFBTCxPQUFPLEVBQUk7QUFDaEIsVUFBTWdDLFlBQVksR0FBRyxDQUFDaEMsT0FBTyxDQUFDVixRQUFULElBQXFCVSxPQUFPLENBQUNWLFFBQVIsQ0FBaUJvQixRQUFqQixDQUEwQnFCLFdBQTFCLENBQTFDO0FBQ0EsVUFBTUUsU0FBUyxHQUFHLENBQUNqQyxPQUFPLENBQUNDLFFBQVQsSUFBcUJELE9BQU8sQ0FBQ0MsUUFBUixDQUFpQlMsUUFBakIsQ0FBMEJMLElBQTFCLENBQXZDO0FBQ0EsYUFBTzJCLFlBQVksSUFBSUMsU0FBdkI7QUFDRCxLQUpEO0FBS0Q7QUFDRixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnXG5pbXBvcnQgZ3JvdXBCeSBmcm9tICdsb2Rhc2gvZ3JvdXBCeSdcblxuZXhwb3J0IGRlZmF1bHQgKHsgY2hhbm5lbHMsIG1pZGRsZXdhcmUsIGxvZ2dlciwgc2tpbGxzIH0pID0+IHtcbiAgY29uc3QgaW5mbyA9IGxvZ2dlcignbWFpbicsICdpbmZvJylcbiAgLy8gYWN0aXZhdGUgbWlkZGxld2FyZVxuICBjb25zdCBncm91cGVkTWlkZGxld2FyZSA9IHtcbiAgICBoZWFyOiBtaWRkbGV3YXJlLmZpbHRlcihtdyA9PiBtdy5oZWFyKS5tYXAobXcgPT4gKHtcbiAgICAgIGhhbmRsZXI6IG13LmhlYXIsXG4gICAgICB0cmlnZ2VyczogbXcudHJpZ2dlcnMgfHwgW10sXG4gICAgICBjaGFubmVsczogbXcuY2hhbm5lbHNcbiAgICB9KSlcbiAgfVxuICBjb25zdCB0eXBlcyA9IFsncmVjZWl2ZScsICdzZW5kJywgJ2hlYXJkJywgJ2NhcHR1cmUnXVxuICB0eXBlcy5mb3JFYWNoKGFwcGx5TWlkZGxld2FyZSlcblxuICBmdW5jdGlvbiBhcHBseU1pZGRsZXdhcmUodHlwZSkge1xuICAgIGdyb3VwZWRNaWRkbGV3YXJlW3R5cGVdID0gW11cbiAgICBtaWRkbGV3YXJlLmZvckVhY2gobXcgPT4ge1xuICAgICAgaWYgKG13W3R5cGVdKSB7XG4gICAgICAgIGdyb3VwZWRNaWRkbGV3YXJlW3R5cGVdLnB1c2goe1xuICAgICAgICAgIGhhbmRsZXI6IG13W3R5cGVdLFxuICAgICAgICAgIHRyaWdnZXJzOiBtdy50cmlnZ2VycyB8fCBbXSxcbiAgICAgICAgICBjaGFubmVsczogbXcuY2hhbm5lbHNcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICAgIGZvckVhY2goY2hhbm5lbHMsICh7IGNvbnRyb2xsZXIsIG5hbWUgfSkgPT4ge1xuICAgICAgZ3JvdXBlZE1pZGRsZXdhcmVbdHlwZV1cbiAgICAgICAgLmZpbHRlcihpdGVtID0+ICFpdGVtLmNoYW5uZWxzIHx8IGl0ZW0uY2hhbm5lbHMuaW5jbHVkZXMobmFtZSkpXG4gICAgICAgIC5mb3JFYWNoKGl0ZW0gPT4gY29udHJvbGxlci5taWRkbGV3YXJlW3R5cGVdLnVzZShpdGVtLmhhbmRsZXIpKVxuICAgIH0pXG4gIH1cbiAgLy8gYWN0aXZhdGUgdGhlIGJvdHMgc2tpbGxzXG4gIGluZm8oJ1NldHRpbmcgdXAgc2tpbGxzJylcbiAgZm9yRWFjaChza2lsbHMsIGRlZmluaXRpb25zID0+IGRlZmluaXRpb25zLmZvckVhY2goYXBwbHlTa2lsbCkpXG5cbiAgaW5mbygnZG9uZScpXG4gIC8vIGRlZmF1bHQgcmVzcG9uc2VcbiAgZm9yRWFjaChjaGFubmVscywgKHsgY29udHJvbGxlciB9KSA9PiB7XG4gICAgY29udHJvbGxlci5oZWFycygnLionLCAnbWVzc2FnZV9yZWNlaXZlZCcsIGRlZmF1bHRSZXNwb25zZSlcbiAgfSlcblxuICBmdW5jdGlvbiBkZWZhdWx0UmVzcG9uc2UoYm90LCBtZXNzYWdlKSB7XG4gICAgaWYgKCFtZXNzYWdlLmFuc3dlcmVkKSB7XG4gICAgICBib3QucmVwbHkobWVzc2FnZSwgXCJTb3JyeSwgZGlkbid0IGNhdGNoIHRoYXRcIilcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhcHBseVNraWxsKHNraWxsKSB7XG4gICAgZm9yRWFjaChjaGFubmVscywgc2tpbGwuZXZlbnQgPyBtYXBFdmVudHMgOiBtYXBIZWFycylcbiAgICBmdW5jdGlvbiBtYXBIZWFycyh7IGNvbnRyb2xsZXIsIG5hbWUgfSkge1xuICAgICAgY29uc3QgdHJpZ2dlciA9IHNraWxsLmludGVudCB8fCBza2lsbC5wYXR0ZXJuXG4gICAgICBjb25zdCBoZWFyTWlkZGxld2FyZSA9IGdyb3VwZWRNaWRkbGV3YXJlLmhlYXIgfHwgW11cbiAgICAgIGNvbnN0IGZpbHRlcmVkSGFuZGxlcnMgPSBoZWFyTWlkZGxld2FyZS5maWx0ZXIoZmlsdGVySGFuZGxlcnMobmFtZSwgc2tpbGwuaW50ZW50ID8gJ2ludGVudCcgOiAncGF0dGVybicpKVxuICAgICAgY29udHJvbGxlci5oZWFycyhcbiAgICAgICAgdHJpZ2dlcixcbiAgICAgICAgJ21lc3NhZ2VfcmVjZWl2ZWQnLFxuICAgICAgICAuLi5maWx0ZXJlZEhhbmRsZXJzLm1hcCgoeyBoYW5kbGVyIH0pID0+IGhhbmRsZXIpLFxuICAgICAgICAoYm90LCBtZXNzYWdlKSA9PiBza2lsbC5oYW5kbGVyKGJvdCwgbWVzc2FnZSwgY29udHJvbGxlcilcbiAgICAgIClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXBFdmVudHMoeyBjb250cm9sbGVyLCBuYW1lIH0pIHtcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBza2lsbC5ldmVudFxuICAgICAgY29udHJvbGxlci5vbih0cmlnZ2VyLCAoYm90LCBtZXNzYWdlKSA9PiBza2lsbC5oYW5kbGVyKGJvdCwgbWVzc2FnZSwgY29udHJvbGxlcikpXG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGZpbHRlckhhbmRsZXJzKGNoYW5uZWxOYW1lLCB0eXBlKSB7XG4gICAgcmV0dXJuIGhhbmRsZXIgPT4ge1xuICAgICAgY29uc3QgY2hhbm5lbFZhbGlkID0gIWhhbmRsZXIuY2hhbm5lbHMgfHwgaGFuZGxlci5jaGFubmVscy5pbmNsdWRlcyhjaGFubmVsTmFtZSlcbiAgICAgIGNvbnN0IHR5cGVWYWxpZCA9ICFoYW5kbGVyLnRyaWdnZXJzIHx8IGhhbmRsZXIudHJpZ2dlcnMuaW5jbHVkZXModHlwZSlcbiAgICAgIHJldHVybiBjaGFubmVsVmFsaWQgJiYgdHlwZVZhbGlkXG4gICAgfVxuICB9XG59XG4iXX0=
