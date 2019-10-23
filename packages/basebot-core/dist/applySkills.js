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
    bot.reply(message, "Sorry, didn't catch that");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBseVNraWxscy5qcyJdLCJuYW1lcyI6WyJjaGFubmVscyIsIm1pZGRsZXdhcmUiLCJsb2dnZXIiLCJza2lsbHMiLCJpbmZvIiwiZ3JvdXBlZE1pZGRsZXdhcmUiLCJoZWFyIiwiZmlsdGVyIiwibXciLCJtYXAiLCJoYW5kbGVyIiwidHJpZ2dlcnMiLCJ0eXBlcyIsImZvckVhY2giLCJhcHBseU1pZGRsZXdhcmUiLCJ0eXBlIiwicHVzaCIsImNvbnRyb2xsZXIiLCJuYW1lIiwiaXRlbSIsImluY2x1ZGVzIiwidXNlIiwiZGVmaW5pdGlvbnMiLCJhcHBseVNraWxsIiwiaGVhcnMiLCJkZWZhdWx0UmVzcG9uc2UiLCJib3QiLCJtZXNzYWdlIiwicmVwbHkiLCJza2lsbCIsImV2ZW50IiwibWFwRXZlbnRzIiwibWFwSGVhcnMiLCJ0cmlnZ2VyIiwiaW50ZW50IiwicGF0dGVybiIsImhlYXJNaWRkbGV3YXJlIiwiZmlsdGVyZWRIYW5kbGVycyIsImZpbHRlckhhbmRsZXJzIiwib24iLCJjaGFubmVsTmFtZSIsImNoYW5uZWxWYWxpZCIsInR5cGVWYWxpZCJdLCJtYXBwaW5ncyI6InVHQUFBO0FBQ0EsaUU7O0FBRWUsd0JBQThDLEtBQTNDQSxRQUEyQyxRQUEzQ0EsUUFBMkMsQ0FBakNDLFVBQWlDLFFBQWpDQSxVQUFpQyxDQUFyQkMsTUFBcUIsUUFBckJBLE1BQXFCLENBQWJDLE1BQWEsUUFBYkEsTUFBYTs7QUFFM0QsTUFBTUMsSUFBSSxHQUFHRixNQUFNLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBbkI7QUFDQTtBQUNBLE1BQU1HLGlCQUFpQixHQUFHO0FBQ3hCQyxJQUFBQSxJQUFJLEVBQUVMLFVBQVUsQ0FBQ00sTUFBWCxDQUFrQixVQUFBQyxFQUFFLFVBQUlBLEVBQUUsQ0FBQ0YsSUFBUCxFQUFwQixFQUFpQ0csR0FBakMsQ0FBcUMsVUFBQUQsRUFBRSxVQUFLO0FBQ2hERSxRQUFBQSxPQUFPLEVBQUVGLEVBQUUsQ0FBQ0YsSUFEb0M7QUFF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ckVhY2gnXG5pbXBvcnQgZ3JvdXBCeSBmcm9tICdsb2Rhc2gvZ3JvdXBCeSdcblxuZXhwb3J0IGRlZmF1bHQgKHsgY2hhbm5lbHMsIG1pZGRsZXdhcmUsIGxvZ2dlciwgc2tpbGxzIH0pID0+IHtcblxuICBjb25zdCBpbmZvID0gbG9nZ2VyKCdtYWluJywgJ2luZm8nKVxuICAvLyBhY3RpdmF0ZSBtaWRkbGV3YXJlXG4gIGNvbnN0IGdyb3VwZWRNaWRkbGV3YXJlID0ge1xuICAgIGhlYXI6IG1pZGRsZXdhcmUuZmlsdGVyKG13ID0+IG13LmhlYXIpLm1hcChtdyA9PiAoe1xuICAgICAgaGFuZGxlcjogbXcuaGVhcixcbiAgICAgIHRyaWdnZXJzOiBtdy50cmlnZ2VycyB8fCBbXSxcbiAgICAgIGNoYW5uZWxzOiBtdy5jaGFubmVsc1xuICAgIH0pKVxuICB9IFxuICBjb25zdCB0eXBlcyA9IFsncmVjZWl2ZScsICdzZW5kJywgJ2hlYXJkJywgJ2NhcHR1cmUnXVxuICB0eXBlcy5mb3JFYWNoKGFwcGx5TWlkZGxld2FyZSlcblxuICBmdW5jdGlvbiBhcHBseU1pZGRsZXdhcmUodHlwZSkge1xuICAgIGdyb3VwZWRNaWRkbGV3YXJlW3R5cGVdID0gW11cbiAgICBtaWRkbGV3YXJlLmZvckVhY2gobXcgPT4ge1xuICAgICAgaWYgKG13W3R5cGVdKSB7XG4gICAgICAgIGdyb3VwZWRNaWRkbGV3YXJlW3R5cGVdLnB1c2goe1xuICAgICAgICAgIGhhbmRsZXI6IG13W3R5cGVdLFxuICAgICAgICAgIHRyaWdnZXJzOiBtdy50cmlnZ2VycyB8fCBbXSxcbiAgICAgICAgICBjaGFubmVsczogbXcuY2hhbm5lbHNcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICAgIGZvckVhY2goY2hhbm5lbHMsICh7IGNvbnRyb2xsZXIsIG5hbWUgfSkgPT4ge1xuICAgICAgZ3JvdXBlZE1pZGRsZXdhcmVbdHlwZV1cbiAgICAgICAgLmZpbHRlcihpdGVtID0+ICFpdGVtLmNoYW5uZWxzIHx8IGl0ZW0uY2hhbm5lbHMuaW5jbHVkZXMobmFtZSkpXG4gICAgICAgIC5mb3JFYWNoKGl0ZW0gPT4gY29udHJvbGxlci5taWRkbGV3YXJlW3R5cGVdLnVzZShpdGVtLmhhbmRsZXIpKVxuICAgIH0pXG4gIH1cbiAgLy8gYWN0aXZhdGUgdGhlIGJvdHMgc2tpbGxzXG4gIGluZm8oJ1NldHRpbmcgdXAgc2tpbGxzJylcbiAgZm9yRWFjaChza2lsbHMsIGRlZmluaXRpb25zID0+IGRlZmluaXRpb25zLmZvckVhY2goYXBwbHlTa2lsbCkpXG5cbiAgaW5mbygnZG9uZScpXG4gIC8vIGRlZmF1bHQgcmVzcG9uc2VcbiAgZm9yRWFjaChjaGFubmVscywgKHsgY29udHJvbGxlciB9KSA9PiB7XG4gICAgY29udHJvbGxlci5oZWFycygnLionLCAnbWVzc2FnZV9yZWNlaXZlZCcsIGRlZmF1bHRSZXNwb25zZSlcbiAgfSlcblxuICBmdW5jdGlvbiBkZWZhdWx0UmVzcG9uc2UoYm90LCBtZXNzYWdlKSB7XG4gICAgYm90LnJlcGx5KG1lc3NhZ2UsIFwiU29ycnksIGRpZG4ndCBjYXRjaCB0aGF0XCIpXG4gIH1cblxuICBmdW5jdGlvbiBhcHBseVNraWxsKHNraWxsKSB7XG4gICAgZm9yRWFjaChjaGFubmVscywgc2tpbGwuZXZlbnQgPyBtYXBFdmVudHMgOiBtYXBIZWFycylcbiAgICBmdW5jdGlvbiBtYXBIZWFycyh7IGNvbnRyb2xsZXIsIG5hbWUgfSkge1xuICAgICAgY29uc3QgdHJpZ2dlciA9IHNraWxsLmludGVudCB8fCBza2lsbC5wYXR0ZXJuXG4gICAgICBjb25zdCBoZWFyTWlkZGxld2FyZSA9IGdyb3VwZWRNaWRkbGV3YXJlLmhlYXIgfHwgW11cbiAgICAgIGNvbnN0IGZpbHRlcmVkSGFuZGxlcnMgPSBoZWFyTWlkZGxld2FyZS5maWx0ZXIoZmlsdGVySGFuZGxlcnMobmFtZSwgc2tpbGwuaW50ZW50ID8gJ2ludGVudCcgOiAncGF0dGVybicpKVxuICAgICAgY29udHJvbGxlci5oZWFycyhcbiAgICAgICAgdHJpZ2dlcixcbiAgICAgICAgJ21lc3NhZ2VfcmVjZWl2ZWQnLFxuICAgICAgICAuLi5maWx0ZXJlZEhhbmRsZXJzLm1hcCgoeyBoYW5kbGVyIH0pID0+IGhhbmRsZXIpLFxuICAgICAgICAoYm90LCBtZXNzYWdlKSA9PiBza2lsbC5oYW5kbGVyKGJvdCwgbWVzc2FnZSwgY29udHJvbGxlcilcbiAgICAgIClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXBFdmVudHMoeyBjb250cm9sbGVyLCBuYW1lIH0pIHtcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBza2lsbC5ldmVudFxuICAgICAgY29udHJvbGxlci5vbih0cmlnZ2VyLCAoYm90LCBtZXNzYWdlKSA9PiBza2lsbC5oYW5kbGVyKGJvdCwgbWVzc2FnZSwgY29udHJvbGxlcikpXG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGZpbHRlckhhbmRsZXJzKGNoYW5uZWxOYW1lLCB0eXBlKSB7XG4gICAgcmV0dXJuIGhhbmRsZXIgPT4ge1xuICAgICAgY29uc3QgY2hhbm5lbFZhbGlkID0gIWhhbmRsZXIuY2hhbm5lbHMgfHwgaGFuZGxlci5jaGFubmVscy5pbmNsdWRlcyhjaGFubmVsTmFtZSlcbiAgICAgIGNvbnN0IHR5cGVWYWxpZCA9ICFoYW5kbGVyLnRyaWdnZXJzIHx8IGhhbmRsZXIudHJpZ2dlcnMuaW5jbHVkZXModHlwZSlcbiAgICAgIHJldHVybiBjaGFubmVsVmFsaWQgJiYgdHlwZVZhbGlkXG4gICAgfVxuICB9XG59XG4iXX0=