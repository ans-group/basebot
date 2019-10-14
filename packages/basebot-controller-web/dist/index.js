"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _util = require("util");
var _CoreBot = _interopRequireDefault(require("botkit/lib/CoreBot"));
var _ws = _interopRequireDefault(require("ws"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

function WebBot(configuration) {
  var controller = (0, _CoreBot["default"])(configuration || {});
  var error = configuration.logger ?
  configuration.logger('controller:web', 'error') :
  console.error;
  var debug = configuration.logger ?
  configuration.logger('controller:web', 'debug') :
  console.log;

  if (controller.config.typingDelayFactor === undefined) {
    controller.config.typingDelayFactor = 1;
  }

  controller.excludeFromConversations(['hello', 'welcome_back', 'reconnect', 'rating_received']);

  controller.openSocketServer = function (server) {var wsconfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // create the socket server along side the existing webserver.
    var wss = new _ws["default"].Server(_objectSpread({
      server: server },
    wsconfig, {
      clientTracking: true }));


    // Expose the web socket server object to the controller so it can be used later.
    controller.wss = wss;

    function noop() {}

    function heartbeat() {
      this.isAlive = true;
    }

    wss.on('connection', function connection(ws) {
      console.log('connected');
      // search through all the convos, if a bot matches, update its ws
      var bot = controller.spawn();
      bot.ws = ws;
      bot.connected = true;
      ws.isAlive = true;
      ws.on('pong', heartbeat.bind(ws));

      ws.on('message', /*#__PURE__*/function () {var _incoming = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(message) {var parsedMessage, alert;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!(
                  message === 'ping')) {_context.next = 2;break;}return _context.abrupt("return",
                  ws.send(JSON.stringify({ type: 'heartbeat', event: 'pong' })));case 2:

                  try {
                    parsedMessage = JSON.parse(message);
                    controller.ingest(bot, parsedMessage, ws);
                  } catch (e) {
                    alert = [
                    'Error parsing incoming message from websocket.',
                    'Message must be JSON, and should be in the format documented here:',
                    'https://botkit.ai/docs/readme-web.html#message-objects'];

                    error(alert.join('\n'));
                    error(e);
                  }case 3:case "end":return _context.stop();}}}, _callee);}));function incoming(_x) {return _incoming.apply(this, arguments);}return incoming;}());


      ws.on('error', function (err) {return error('Websocket Error: ', err);});

      ws.on('close', function () {
        bot.connected = false;
      });
    });

    var interval = setInterval(function () {
      wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping(noop);
      });
    }, 30000);
  };

  controller.middleware.ingest.use(function (bot, message, reply_channel, next) {
    /*
                                                                                  * this could be a message from the WebSocket
                                                                                  * or it might be coming from a webhook.
                                                                                  * configure the bot appropriately so the reply goes to the right place!
                                                                                  */
    if (!bot.ws) {
      bot.http_response = reply_channel;
    }

    /*
       * look for an existing conversation for this user/channel combo
       * why not just pass in message? because we only care if there is a conversation  ongoing
       * and we might be dealing with "silent" message that would not otherwise match a conversation
       */
    bot.findConversation({
      user: message.user,
      channel: message.channel },
    function (convo) {
      if (convo) {
        if (bot.ws) {
          // replace the websocket connection
          convo.task.bot.ws = bot.ws;
          convo.task.bot.connected = true;
          if (message.type == 'hello' || message.type == 'welcome_back') {
            message.type = 'reconnect';
          }
        } else {
          /*
                 * replace the reply channel in the active conversation
                 * this is the one that gets used to send the actual reply
                 */
          convo.task.bot.http_response = bot.http_response;
        }
      }
      next();
    });
  });

  controller.middleware.categorize.use(function (bot, message, next) {
    if (message.type == 'message') {
      message.type = 'message_received';
    }

    next();
  });

  // simple message clone because its already in the right format!
  controller.middleware.format.use(function (bot, message, platform_message, next) {
    for (var key in message) {
      platform_message[key] = message[key];
    }
    if (!platform_message.type) {
      platform_message.type = 'message';
    }
    next();
  });

  controller.defineBot(function (botkit, config) {
    var bot = {
      type: 'socket',
      botkit: botkit,
      config: config || {},
      utterances: botkit.utterances };


    bot.startConversation = function (message, cb) {
      botkit.startConversation(this, message, cb);
    };

    bot.createConversation = function (message, cb) {
      botkit.createConversation(this, message, cb);
    };

    bot.send = function (message, cb) {
      if (bot.connected || !bot.ws) {
        if (bot.ws) {
          try {
            if (bot.ws && bot.ws.readyState === _ws["default"].OPEN) {
              bot.ws.send(JSON.stringify(message), function (err) {
                if (cb) {
                  return cb(err, message);
                }
              });
            } else {
              error('Cannot send message to closed socket');
            }
          } catch (err) {
            return cb(err);
          }
        } else {
          try {
            bot.http_response.json(message);
            if (cb) {
              cb(null, message);
            }
          } catch (err) {
            if (cb) {
              return cb(err, message);
            } else {
              error('ERROR SENDING', err);
            }
          }
        }
      } else {
        setTimeout(function () {
          bot.send(message, cb);
        }, 3000);
      }
    };

    bot.startTyping = function () {
      if (bot.connected) {
        try {
          if (bot.ws && bot.ws.readyState === _ws["default"].OPEN) {
            bot.ws.send(JSON.stringify({
              type: 'typing' }),
            function (err) {
              if (err) {
                error("startTyping failed: ".concat(err.message));
              }
            });
          } else {
            error('Socket closed! Cannot send message');
          }
        } catch (err) {
          error('startTyping failed: ', err);
        }
      }
    };

    bot.typingDelay = function (_ref) {var typingDelay = _ref.typingDelay,text = _ref.text;return new Promise(function (resolve) {
        var typingLength = 0;
        if (typingDelay) {
          typingLength = typingDelay;
        } else {
          var textLength;
          if (text) {
            textLength = text.length;
          } else {
            textLength = 80; // default attachment text length
          }

          var avgWPM = 150;
          var avgCPM = avgWPM * 7;

          typingLength = Math.min(Math.floor(textLength / (avgCPM / 60)) * 1000, 2000) * controller.config.typingDelayFactor;
        }

        setTimeout(function () {
          resolve();
        }, typingLength);
      });};

    bot.replyWithTyping = function (_ref2, resp, cb) {var user = _ref2.user,channel = _ref2.channel;
      bot.startTyping();
      bot.typingDelay(resp).then(function () {
        if (typeof resp === 'string') {
          resp = {
            text: resp };

        }

        resp.user = user;
        resp.channel = channel;
        resp.to = user;

        bot.say(resp, cb);
      });
    };

    bot.reply = function (src, resp, cb) {
      if (typeof resp === 'string') {
        resp = {
          text: resp };

      }
      console.log('RESPONSE IS');
      console.log(resp);

      resp.user = src.user;
      resp.channel = src.channel;
      resp.to = src.user;

      if (resp.typing || resp.typingDelay || controller.config.replyWithTyping) {
        bot.replyWithTyping(src, resp, cb);
      } else {
        bot.say(resp, cb);
      }
    };

    bot.findConversation = function (_ref3, cb) {var user = _ref3.user,channel = _ref3.channel,type = _ref3.type;
      botkit.debug('CUSTOM FIND CONVO', user, channel);
      for (var t = 0; t < botkit.tasks.length; t++) {
        for (var c = 0; c < botkit.tasks[t].convos.length; c++) {
          if (
          botkit.tasks[t].convos[c].isActive() &&
          botkit.tasks[t].convos[c].source_message.user == user &&
          !botkit.excludedEvents.includes(type) // this type of message should not be included
          ) {
              botkit.debug('FOUND EXISTING CONVO!');
              cb(botkit.tasks[t].convos[c]);
              return;
            }
        }
      }

      cb();
    };

    /*
        * return info about the specific instance of this bot
        * including identity information, and any other info that is relevant
        */
    bot.getInstanceInfo = function (cb) {return new Promise(function (resolve) {
        var instance = {
          identity: {},
          team: {} };


        if (bot.identity) {
          instance.identity.name = bot.identity.name;
          instance.identity.id = bot.identity.id;

          instance.team.name = bot.identity.name;
          instance.team.url = bot.identity.root_url;
          instance.team.id = bot.identity.name;
        } else {
          instance.identity.name = 'Botkit Web';
          instance.identity.id = 'web';
        }

        if (cb) cb(null, instance);
        resolve(instance);
      });};

    bot.getMessageUser = function (message, cb) {return new Promise(function (resolve) {
        // normalize this into what botkit wants to see
        controller.storage.users.get(message.user, function (err, user) {
          if (!user) {
            user = {
              id: message.user,
              name: 'Unknown',
              attributes: {} };

          }

          var profile = {
            id: user.id,
            username: user.name,
            first_name: user.attributes.first_name || '',
            last_name: user.attributes.last_name || '',
            full_name: user.attributes.full_name || '',
            email: user.attributes.email, // may be blank
            gender: user.attributes.gender, // no source for this info
            timezone_offset: user.attributes.timezone_offset,
            timezone: user.attributes.timezone };


          if (cb) {
            cb(null, profile);
          }
          resolve(profile);
        });
      });};

    return bot;
  });

  controller.handleWebhookPayload = function (_ref4, res) {var body = _ref4.body;
    var payload = body;
    controller.ingest(controller.spawn({}), payload, res);
  };

  // change the speed of typing a reply in a conversation
  controller.setTypingDelayFactor = function (delayFactor) {
    controller.config.typingDelayFactor = delayFactor;
  };

  // Substantially shorten the delay for processing messages in conversations
  controller.setTickDelay(10);

  return controller;
}var _default =

WebBot;exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbIldlYkJvdCIsImNvbmZpZ3VyYXRpb24iLCJjb250cm9sbGVyIiwiZXJyb3IiLCJsb2dnZXIiLCJjb25zb2xlIiwiZGVidWciLCJsb2ciLCJjb25maWciLCJ0eXBpbmdEZWxheUZhY3RvciIsInVuZGVmaW5lZCIsImV4Y2x1ZGVGcm9tQ29udmVyc2F0aW9ucyIsIm9wZW5Tb2NrZXRTZXJ2ZXIiLCJzZXJ2ZXIiLCJ3c2NvbmZpZyIsIndzcyIsIldlYlNvY2tldCIsIlNlcnZlciIsImNsaWVudFRyYWNraW5nIiwibm9vcCIsImhlYXJ0YmVhdCIsImlzQWxpdmUiLCJvbiIsImNvbm5lY3Rpb24iLCJ3cyIsImJvdCIsInNwYXduIiwiY29ubmVjdGVkIiwiYmluZCIsIm1lc3NhZ2UiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsInR5cGUiLCJldmVudCIsInBhcnNlZE1lc3NhZ2UiLCJwYXJzZSIsImluZ2VzdCIsImUiLCJhbGVydCIsImpvaW4iLCJpbmNvbWluZyIsImVyciIsImludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjbGllbnRzIiwiZm9yRWFjaCIsImVhY2giLCJ0ZXJtaW5hdGUiLCJwaW5nIiwibWlkZGxld2FyZSIsInVzZSIsInJlcGx5X2NoYW5uZWwiLCJuZXh0IiwiaHR0cF9yZXNwb25zZSIsImZpbmRDb252ZXJzYXRpb24iLCJ1c2VyIiwiY2hhbm5lbCIsImNvbnZvIiwidGFzayIsImNhdGVnb3JpemUiLCJmb3JtYXQiLCJwbGF0Zm9ybV9tZXNzYWdlIiwia2V5IiwiZGVmaW5lQm90IiwiYm90a2l0IiwidXR0ZXJhbmNlcyIsInN0YXJ0Q29udmVyc2F0aW9uIiwiY2IiLCJjcmVhdGVDb252ZXJzYXRpb24iLCJyZWFkeVN0YXRlIiwiT1BFTiIsImpzb24iLCJzZXRUaW1lb3V0Iiwic3RhcnRUeXBpbmciLCJ0eXBpbmdEZWxheSIsInRleHQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInR5cGluZ0xlbmd0aCIsInRleHRMZW5ndGgiLCJsZW5ndGgiLCJhdmdXUE0iLCJhdmdDUE0iLCJNYXRoIiwibWluIiwiZmxvb3IiLCJyZXBseVdpdGhUeXBpbmciLCJyZXNwIiwidGhlbiIsInRvIiwic2F5IiwicmVwbHkiLCJzcmMiLCJ0eXBpbmciLCJ0IiwidGFza3MiLCJjIiwiY29udm9zIiwiaXNBY3RpdmUiLCJzb3VyY2VfbWVzc2FnZSIsImV4Y2x1ZGVkRXZlbnRzIiwiaW5jbHVkZXMiLCJnZXRJbnN0YW5jZUluZm8iLCJpbnN0YW5jZSIsImlkZW50aXR5IiwidGVhbSIsIm5hbWUiLCJpZCIsInVybCIsInJvb3RfdXJsIiwiZ2V0TWVzc2FnZVVzZXIiLCJzdG9yYWdlIiwidXNlcnMiLCJnZXQiLCJhdHRyaWJ1dGVzIiwicHJvZmlsZSIsInVzZXJuYW1lIiwiZmlyc3RfbmFtZSIsImxhc3RfbmFtZSIsImZ1bGxfbmFtZSIsImVtYWlsIiwiZ2VuZGVyIiwidGltZXpvbmVfb2Zmc2V0IiwidGltZXpvbmUiLCJoYW5kbGVXZWJob29rUGF5bG9hZCIsInJlcyIsImJvZHkiLCJwYXlsb2FkIiwic2V0VHlwaW5nRGVsYXlGYWN0b3IiLCJkZWxheUZhY3RvciIsInNldFRpY2tEZWxheSJdLCJtYXBwaW5ncyI6InVHQUFBO0FBQ0E7QUFDQSxnRDs7QUFFQSxTQUFTQSxNQUFULENBQWdCQyxhQUFoQixFQUErQjtBQUM3QixNQUFNQyxVQUFVLEdBQUcseUJBQU9ELGFBQWEsSUFBSSxFQUF4QixDQUFuQjtBQUNBLE1BQU1FLEtBQUssR0FBR0YsYUFBYSxDQUFDRyxNQUFkO0FBQ1ZILEVBQUFBLGFBQWEsQ0FBQ0csTUFBZCxDQUFxQixnQkFBckIsRUFBdUMsT0FBdkMsQ0FEVTtBQUVWQyxFQUFBQSxPQUFPLENBQUNGLEtBRlo7QUFHQSxNQUFNRyxLQUFLLEdBQUdMLGFBQWEsQ0FBQ0csTUFBZDtBQUNWSCxFQUFBQSxhQUFhLENBQUNHLE1BQWQsQ0FBcUIsZ0JBQXJCLEVBQXVDLE9BQXZDLENBRFU7QUFFVkMsRUFBQUEsT0FBTyxDQUFD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Q0FBZ0JNLEtBTlQsRUFNZ0I7QUFDOUJDLFlBQUFBLE1BQU0sRUFBRWxFLElBQUksQ0FBQzJELFVBQUwsQ0FBZ0JPLE1BUFYsRUFPa0I7QUFDaENDLFlBQUFBLGVBQWUsRUFBRW5FLElBQUksQ0FBQzJELFVBQUwsQ0FBZ0JRLGVBUm5CO0FBU2RDLFlBQUFBLFFBQVEsRUFBRXBFLElBQUksQ0FBQzJELFVBQUwsQ0FBZ0JTLFFBVFosRUFBaEI7OztBQVlBLGNBQUl4RCxFQUFKLEVBQVE7QUFDTkEsWUFBQUEsRUFBRSxDQUFDLElBQUQsRUFBT2dELE9BQVAsQ0FBRjtBQUNEO0FBQ0R0QyxVQUFBQSxPQUFPLENBQUNzQyxPQUFELENBQVA7QUFDRCxTQXpCRDtBQTBCRCxPQTVCcUMsQ0FBakIsRUFBckI7O0FBOEJBLFdBQU8zRixHQUFQO0FBQ0QsR0FqTkQ7O0FBbU5BdkIsRUFBQUEsVUFBVSxDQUFDMkgsb0JBQVgsR0FBa0MsaUJBQVdDLEdBQVgsRUFBbUIsS0FBaEJDLElBQWdCLFNBQWhCQSxJQUFnQjtBQUNuRCxRQUFNQyxPQUFPLEdBQUdELElBQWhCO0FBQ0E3SCxJQUFBQSxVQUFVLENBQUNtQyxNQUFYLENBQWtCbkMsVUFBVSxDQUFDd0IsS0FBWCxDQUFpQixFQUFqQixDQUFsQixFQUF3Q3NHLE9BQXhDLEVBQWlERixHQUFqRDtBQUNELEdBSEQ7O0FBS0E7QUFDQTVILEVBQUFBLFVBQVUsQ0FBQytILG9CQUFYLEdBQWtDLFVBQUFDLFdBQVcsRUFBSTtBQUMvQ2hJLElBQUFBLFVBQVUsQ0FBQ00sTUFBWCxDQUFrQkMsaUJBQWxCLEdBQXNDeUgsV0FBdEM7QUFDRCxHQUZEOztBQUlBO0FBQ0FoSSxFQUFBQSxVQUFVLENBQUNpSSxZQUFYLENBQXdCLEVBQXhCOztBQUVBLFNBQU9qSSxVQUFQO0FBQ0QsQzs7QUFFY0YsTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnXG5pbXBvcnQgQm90a2l0IGZyb20gJ2JvdGtpdC9saWIvQ29yZUJvdCdcbmltcG9ydCBXZWJTb2NrZXQgZnJvbSAnd3MnXG5cbmZ1bmN0aW9uIFdlYkJvdChjb25maWd1cmF0aW9uKSB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBCb3RraXQoY29uZmlndXJhdGlvbiB8fCB7fSlcbiAgY29uc3QgZXJyb3IgPSBjb25maWd1cmF0aW9uLmxvZ2dlclxuICAgID8gY29uZmlndXJhdGlvbi5sb2dnZXIoJ2NvbnRyb2xsZXI6d2ViJywgJ2Vycm9yJylcbiAgICA6IGNvbnNvbGUuZXJyb3JcbiAgY29uc3QgZGVidWcgPSBjb25maWd1cmF0aW9uLmxvZ2dlclxuICAgID8gY29uZmlndXJhdGlvbi5sb2dnZXIoJ2NvbnRyb2xsZXI6d2ViJywgJ2RlYnVnJylcbiAgICA6IGNvbnNvbGUubG9nXG5cbiAgaWYgKGNvbnRyb2xsZXIuY29uZmlnLnR5cGluZ0RlbGF5RmFjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICBjb250cm9sbGVyLmNvbmZpZy50eXBpbmdEZWxheUZhY3RvciA9IDFcbiAgfVxuXG4gIGNvbnRyb2xsZXIuZXhjbHVkZUZyb21Db252ZXJzYXRpb25zKFsnaGVsbG8nLCAnd2VsY29tZV9iYWNrJywgJ3JlY29ubmVjdCcsICdyYXRpbmdfcmVjZWl2ZWQnXSlcblxuICBjb250cm9sbGVyLm9wZW5Tb2NrZXRTZXJ2ZXIgPSAoc2VydmVyLCB3c2NvbmZpZyA9IHt9KSA9PiB7XG4gICAgLy8gY3JlYXRlIHRoZSBzb2NrZXQgc2VydmVyIGFsb25nIHNpZGUgdGhlIGV4aXN0aW5nIHdlYnNlcnZlci5cbiAgICBjb25zdCB3c3MgPSBuZXcgV2ViU29ja2V0LlNlcnZlcih7XG4gICAgICBzZXJ2ZXIsXG4gICAgICAuLi53c2NvbmZpZyxcbiAgICAgIGNsaWVudFRyYWNraW5nOiB0cnVlXG4gICAgfSlcblxuICAgIC8vIEV4cG9zZSB0aGUgd2ViIHNvY2tldCBzZXJ2ZXIgb2JqZWN0IHRvIHRoZSBjb250cm9sbGVyIHNvIGl0IGNhbiBiZSB1c2VkIGxhdGVyLlxuICAgIGNvbnRyb2xsZXIud3NzID0gd3NzXG5cbiAgICBmdW5jdGlvbiBub29wKCkgeyB9XG5cbiAgICBmdW5jdGlvbiBoZWFydGJlYXQoKSB7XG4gICAgICB0aGlzLmlzQWxpdmUgPSB0cnVlXG4gICAgfVxuXG4gICAgd3NzLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24gY29ubmVjdGlvbih3cykge1xuICAgICAgY29uc29sZS5sb2coJ2Nvbm5lY3RlZCcpXG4gICAgICAvLyBzZWFyY2ggdGhyb3VnaCBhbGwgdGhlIGNvbnZvcywgaWYgYSBib3QgbWF0Y2hlcywgdXBkYXRlIGl0cyB3c1xuICAgICAgY29uc3QgYm90ID0gY29udHJvbGxlci5zcGF3bigpXG4gICAgICBib3Qud3MgPSB3c1xuICAgICAgYm90LmNvbm5lY3RlZCA9IHRydWVcbiAgICAgIHdzLmlzQWxpdmUgPSB0cnVlXG4gICAgICB3cy5vbigncG9uZycsIGhlYXJ0YmVhdC5iaW5kKHdzKSlcblxuICAgICAgd3Mub24oJ21lc3NhZ2UnLCBhc3luYyBmdW5jdGlvbiBpbmNvbWluZyhtZXNzYWdlKSB7XG4gICAgICAgIGlmIChtZXNzYWdlID09PSAncGluZycpIHtcbiAgICAgICAgICByZXR1cm4gd3Muc2VuZChKU09OLnN0cmluZ2lmeSh7IHR5cGU6ICdoZWFydGJlYXQnLCBldmVudDogJ3BvbmcnIH0pKVxuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgcGFyc2VkTWVzc2FnZSA9IEpTT04ucGFyc2UobWVzc2FnZSlcbiAgICAgICAgICBjb250cm9sbGVyLmluZ2VzdChib3QsIHBhcnNlZE1lc3NhZ2UsIHdzKVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc3QgYWxlcnQgPSBbXG4gICAgICAgICAgICAnRXJyb3IgcGFyc2luZyBpbmNvbWluZyBtZXNzYWdlIGZyb20gd2Vic29ja2V0LicsXG4gICAgICAgICAgICAnTWVzc2FnZSBtdXN0IGJlIEpTT04sIGFuZCBzaG91bGQgYmUgaW4gdGhlIGZvcm1hdCBkb2N1bWVudGVkIGhlcmU6JyxcbiAgICAgICAgICAgICdodHRwczovL2JvdGtpdC5haS9kb2NzL3JlYWRtZS13ZWIuaHRtbCNtZXNzYWdlLW9iamVjdHMnXG4gICAgICAgICAgXVxuICAgICAgICAgIGVycm9yKGFsZXJ0LmpvaW4oJ1xcbicpKVxuICAgICAgICAgIGVycm9yKGUpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHdzLm9uKCdlcnJvcicsIChlcnIpID0+IGVycm9yKCdXZWJzb2NrZXQgRXJyb3I6ICcsIGVycikpXG5cbiAgICAgIHdzLm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgICAgYm90LmNvbm5lY3RlZCA9IGZhbHNlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHdzcy5jbGllbnRzLmZvckVhY2goZnVuY3Rpb24gZWFjaCh3cykge1xuICAgICAgICBpZiAod3MuaXNBbGl2ZSA9PT0gZmFsc2UpIHJldHVybiB3cy50ZXJtaW5hdGUoKVxuXG4gICAgICAgIHdzLmlzQWxpdmUgPSBmYWxzZVxuICAgICAgICB3cy5waW5nKG5vb3ApXG4gICAgICB9KVxuICAgIH0sIDMwMDAwKVxuICB9XG5cbiAgY29udHJvbGxlci5taWRkbGV3YXJlLmluZ2VzdC51c2UoKGJvdCwgbWVzc2FnZSwgcmVwbHlfY2hhbm5lbCwgbmV4dCkgPT4ge1xuICAgIC8qXG4gICAgICogdGhpcyBjb3VsZCBiZSBhIG1lc3NhZ2UgZnJvbSB0aGUgV2ViU29ja2V0XG4gICAgICogb3IgaXQgbWlnaHQgYmUgY29taW5nIGZyb20gYSB3ZWJob29rLlxuICAgICAqIGNvbmZpZ3VyZSB0aGUgYm90IGFwcHJvcHJpYXRlbHkgc28gdGhlIHJlcGx5IGdvZXMgdG8gdGhlIHJpZ2h0IHBsYWNlIVxuICAgICAqL1xuICAgIGlmICghYm90LndzKSB7XG4gICAgICBib3QuaHR0cF9yZXNwb25zZSA9IHJlcGx5X2NoYW5uZWxcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIGxvb2sgZm9yIGFuIGV4aXN0aW5nIGNvbnZlcnNhdGlvbiBmb3IgdGhpcyB1c2VyL2NoYW5uZWwgY29tYm9cbiAgICAgKiB3aHkgbm90IGp1c3QgcGFzcyBpbiBtZXNzYWdlPyBiZWNhdXNlIHdlIG9ubHkgY2FyZSBpZiB0aGVyZSBpcyBhIGNvbnZlcnNhdGlvbiAgb25nb2luZ1xuICAgICAqIGFuZCB3ZSBtaWdodCBiZSBkZWFsaW5nIHdpdGggXCJzaWxlbnRcIiBtZXNzYWdlIHRoYXQgd291bGQgbm90IG90aGVyd2lzZSBtYXRjaCBhIGNvbnZlcnNhdGlvblxuICAgICAqL1xuICAgIGJvdC5maW5kQ29udmVyc2F0aW9uKHtcbiAgICAgIHVzZXI6IG1lc3NhZ2UudXNlcixcbiAgICAgIGNoYW5uZWw6IG1lc3NhZ2UuY2hhbm5lbFxuICAgIH0sIGNvbnZvID0+IHtcbiAgICAgIGlmIChjb252bykge1xuICAgICAgICBpZiAoYm90LndzKSB7XG4gICAgICAgICAgLy8gcmVwbGFjZSB0aGUgd2Vic29ja2V0IGNvbm5lY3Rpb25cbiAgICAgICAgICBjb252by50YXNrLmJvdC53cyA9IGJvdC53c1xuICAgICAgICAgIGNvbnZvLnRhc2suYm90LmNvbm5lY3RlZCA9IHRydWVcbiAgICAgICAgICBpZiAobWVzc2FnZS50eXBlID09ICdoZWxsbycgfHwgbWVzc2FnZS50eXBlID09ICd3ZWxjb21lX2JhY2snKSB7XG4gICAgICAgICAgICBtZXNzYWdlLnR5cGUgPSAncmVjb25uZWN0J1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKlxuICAgICAgICAgICAqIHJlcGxhY2UgdGhlIHJlcGx5IGNoYW5uZWwgaW4gdGhlIGFjdGl2ZSBjb252ZXJzYXRpb25cbiAgICAgICAgICAgKiB0aGlzIGlzIHRoZSBvbmUgdGhhdCBnZXRzIHVzZWQgdG8gc2VuZCB0aGUgYWN0dWFsIHJlcGx5XG4gICAgICAgICAgICovXG4gICAgICAgICAgY29udm8udGFzay5ib3QuaHR0cF9yZXNwb25zZSA9IGJvdC5odHRwX3Jlc3BvbnNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG5leHQoKVxuICAgIH0pXG4gIH0pXG5cbiAgY29udHJvbGxlci5taWRkbGV3YXJlLmNhdGVnb3JpemUudXNlKChib3QsIG1lc3NhZ2UsIG5leHQpID0+IHtcbiAgICBpZiAobWVzc2FnZS50eXBlID09ICdtZXNzYWdlJykge1xuICAgICAgbWVzc2FnZS50eXBlID0gJ21lc3NhZ2VfcmVjZWl2ZWQnXG4gICAgfVxuXG4gICAgbmV4dCgpXG4gIH0pXG5cbiAgLy8gc2ltcGxlIG1lc3NhZ2UgY2xvbmUgYmVjYXVzZSBpdHMgYWxyZWFkeSBpbiB0aGUgcmlnaHQgZm9ybWF0IVxuICBjb250cm9sbGVyLm1pZGRsZXdhcmUuZm9ybWF0LnVzZSgoYm90LCBtZXNzYWdlLCBwbGF0Zm9ybV9tZXNzYWdlLCBuZXh0KSA9PiB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gbWVzc2FnZSkge1xuICAgICAgcGxhdGZvcm1fbWVzc2FnZVtrZXldID0gbWVzc2FnZVtrZXldXG4gICAgfVxuICAgIGlmICghcGxhdGZvcm1fbWVzc2FnZS50eXBlKSB7XG4gICAgICBwbGF0Zm9ybV9tZXNzYWdlLnR5cGUgPSAnbWVzc2FnZSdcbiAgICB9XG4gICAgbmV4dCgpXG4gIH0pXG5cbiAgY29udHJvbGxlci5kZWZpbmVCb3QoKGJvdGtpdCwgY29uZmlnKSA9PiB7XG4gICAgY29uc3QgYm90ID0ge1xuICAgICAgdHlwZTogJ3NvY2tldCcsXG4gICAgICBib3RraXQsXG4gICAgICBjb25maWc6IGNvbmZpZyB8fCB7fSxcbiAgICAgIHV0dGVyYW5jZXM6IGJvdGtpdC51dHRlcmFuY2VzXG4gICAgfVxuXG4gICAgYm90LnN0YXJ0Q29udmVyc2F0aW9uID0gZnVuY3Rpb24obWVzc2FnZSwgY2IpIHtcbiAgICAgIGJvdGtpdC5zdGFydENvbnZlcnNhdGlvbih0aGlzLCBtZXNzYWdlLCBjYilcbiAgICB9XG5cbiAgICBib3QuY3JlYXRlQ29udmVyc2F0aW9uID0gZnVuY3Rpb24obWVzc2FnZSwgY2IpIHtcbiAgICAgIGJvdGtpdC5jcmVhdGVDb252ZXJzYXRpb24odGhpcywgbWVzc2FnZSwgY2IpXG4gICAgfVxuXG4gICAgYm90LnNlbmQgPSAobWVzc2FnZSwgY2IpID0+IHtcbiAgICAgIGlmIChib3QuY29ubmVjdGVkIHx8ICFib3Qud3MpIHtcbiAgICAgICAgaWYgKGJvdC53cykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoYm90LndzICYmIGJvdC53cy5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICBib3Qud3Muc2VuZChKU09OLnN0cmluZ2lmeShtZXNzYWdlKSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIsIG1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXJyb3IoJ0Nhbm5vdCBzZW5kIG1lc3NhZ2UgdG8gY2xvc2VkIHNvY2tldCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2IoZXJyKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgYm90Lmh0dHBfcmVzcG9uc2UuanNvbihtZXNzYWdlKVxuICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgIGNiKG51bGwsIG1lc3NhZ2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKGVyciwgbWVzc2FnZSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVycm9yKCdFUlJPUiBTRU5ESU5HJywgZXJyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYm90LnNlbmQobWVzc2FnZSwgY2IpXG4gICAgICAgIH0sIDMwMDApXG4gICAgICB9XG4gICAgfVxuXG4gICAgYm90LnN0YXJ0VHlwaW5nID0gKCkgPT4ge1xuICAgICAgaWYgKGJvdC5jb25uZWN0ZWQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoYm90LndzICYmIGJvdC53cy5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgYm90LndzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICB0eXBlOiAndHlwaW5nJ1xuICAgICAgICAgICAgfSksIGVyciA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBlcnJvcihgc3RhcnRUeXBpbmcgZmFpbGVkOiAke2Vyci5tZXNzYWdlfWApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yKCdTb2NrZXQgY2xvc2VkISBDYW5ub3Qgc2VuZCBtZXNzYWdlJylcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGVycm9yKCdzdGFydFR5cGluZyBmYWlsZWQ6ICcsIGVycilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGJvdC50eXBpbmdEZWxheSA9ICh7IHR5cGluZ0RlbGF5LCB0ZXh0IH0pID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgbGV0IHR5cGluZ0xlbmd0aCA9IDBcbiAgICAgIGlmICh0eXBpbmdEZWxheSkge1xuICAgICAgICB0eXBpbmdMZW5ndGggPSB0eXBpbmdEZWxheVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHRleHRMZW5ndGhcbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICB0ZXh0TGVuZ3RoID0gdGV4dC5sZW5ndGhcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXh0TGVuZ3RoID0gODAgLy8gZGVmYXVsdCBhdHRhY2htZW50IHRleHQgbGVuZ3RoXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhdmdXUE0gPSAxNTBcbiAgICAgICAgY29uc3QgYXZnQ1BNID0gYXZnV1BNICogN1xuXG4gICAgICAgIHR5cGluZ0xlbmd0aCA9IE1hdGgubWluKE1hdGguZmxvb3IodGV4dExlbmd0aCAvIChhdmdDUE0gLyA2MCkpICogMTAwMCwgMjAwMCkgKiBjb250cm9sbGVyLmNvbmZpZy50eXBpbmdEZWxheUZhY3RvclxuICAgICAgfVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9LCB0eXBpbmdMZW5ndGgpXG4gICAgfSlcblxuICAgIGJvdC5yZXBseVdpdGhUeXBpbmcgPSAoeyB1c2VyLCBjaGFubmVsIH0sIHJlc3AsIGNiKSA9PiB7XG4gICAgICBib3Quc3RhcnRUeXBpbmcoKVxuICAgICAgYm90LnR5cGluZ0RlbGF5KHJlc3ApLnRoZW4oKCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIChyZXNwKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICByZXNwID0ge1xuICAgICAgICAgICAgdGV4dDogcmVzcFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3AudXNlciA9IHVzZXJcbiAgICAgICAgcmVzcC5jaGFubmVsID0gY2hhbm5lbFxuICAgICAgICByZXNwLnRvID0gdXNlclxuXG4gICAgICAgIGJvdC5zYXkocmVzcCwgY2IpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGJvdC5yZXBseSA9IChzcmMsIHJlc3AsIGNiKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIChyZXNwKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVzcCA9IHtcbiAgICAgICAgICB0ZXh0OiByZXNwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKCdSRVNQT05TRSBJUycpXG4gICAgICBjb25zb2xlLmxvZyhyZXNwKVxuXG4gICAgICByZXNwLnVzZXIgPSBzcmMudXNlclxuICAgICAgcmVzcC5jaGFubmVsID0gc3JjLmNoYW5uZWxcbiAgICAgIHJlc3AudG8gPSBzcmMudXNlclxuXG4gICAgICBpZiAocmVzcC50eXBpbmcgfHwgcmVzcC50eXBpbmdEZWxheSB8fCBjb250cm9sbGVyLmNvbmZpZy5yZXBseVdpdGhUeXBpbmcpIHtcbiAgICAgICAgYm90LnJlcGx5V2l0aFR5cGluZyhzcmMsIHJlc3AsIGNiKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm90LnNheShyZXNwLCBjYilcbiAgICAgIH1cbiAgICB9XG5cbiAgICBib3QuZmluZENvbnZlcnNhdGlvbiA9ICh7IHVzZXIsIGNoYW5uZWwsIHR5cGUgfSwgY2IpID0+IHtcbiAgICAgIGJvdGtpdC5kZWJ1ZygnQ1VTVE9NIEZJTkQgQ09OVk8nLCB1c2VyLCBjaGFubmVsKVxuICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCBib3RraXQudGFza3MubGVuZ3RoOyB0KyspIHtcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBib3RraXQudGFza3NbdF0uY29udm9zLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgYm90a2l0LnRhc2tzW3RdLmNvbnZvc1tjXS5pc0FjdGl2ZSgpICYmXG4gICAgICAgICAgICBib3RraXQudGFza3NbdF0uY29udm9zW2NdLnNvdXJjZV9tZXNzYWdlLnVzZXIgPT0gdXNlciAmJlxuICAgICAgICAgICAgIWJvdGtpdC5leGNsdWRlZEV2ZW50cy5pbmNsdWRlcyh0eXBlKSAvLyB0aGlzIHR5cGUgb2YgbWVzc2FnZSBzaG91bGQgbm90IGJlIGluY2x1ZGVkXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBib3RraXQuZGVidWcoJ0ZPVU5EIEVYSVNUSU5HIENPTlZPIScpXG4gICAgICAgICAgICBjYihib3RraXQudGFza3NbdF0uY29udm9zW2NdKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNiKClcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIHJldHVybiBpbmZvIGFib3V0IHRoZSBzcGVjaWZpYyBpbnN0YW5jZSBvZiB0aGlzIGJvdFxuICAgICAqIGluY2x1ZGluZyBpZGVudGl0eSBpbmZvcm1hdGlvbiwgYW5kIGFueSBvdGhlciBpbmZvIHRoYXQgaXMgcmVsZXZhbnRcbiAgICAgKi9cbiAgICBib3QuZ2V0SW5zdGFuY2VJbmZvID0gY2IgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHtcbiAgICAgICAgaWRlbnRpdHk6IHt9LFxuICAgICAgICB0ZWFtOiB7fVxuICAgICAgfVxuXG4gICAgICBpZiAoYm90LmlkZW50aXR5KSB7XG4gICAgICAgIGluc3RhbmNlLmlkZW50aXR5Lm5hbWUgPSBib3QuaWRlbnRpdHkubmFtZVxuICAgICAgICBpbnN0YW5jZS5pZGVudGl0eS5pZCA9IGJvdC5pZGVudGl0eS5pZFxuXG4gICAgICAgIGluc3RhbmNlLnRlYW0ubmFtZSA9IGJvdC5pZGVudGl0eS5uYW1lXG4gICAgICAgIGluc3RhbmNlLnRlYW0udXJsID0gYm90LmlkZW50aXR5LnJvb3RfdXJsXG4gICAgICAgIGluc3RhbmNlLnRlYW0uaWQgPSBib3QuaWRlbnRpdHkubmFtZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdGFuY2UuaWRlbnRpdHkubmFtZSA9ICdCb3RraXQgV2ViJ1xuICAgICAgICBpbnN0YW5jZS5pZGVudGl0eS5pZCA9ICd3ZWInXG4gICAgICB9XG5cbiAgICAgIGlmIChjYikgY2IobnVsbCwgaW5zdGFuY2UpXG4gICAgICByZXNvbHZlKGluc3RhbmNlKVxuICAgIH0pXG5cbiAgICBib3QuZ2V0TWVzc2FnZVVzZXIgPSAobWVzc2FnZSwgY2IpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgLy8gbm9ybWFsaXplIHRoaXMgaW50byB3aGF0IGJvdGtpdCB3YW50cyB0byBzZWVcbiAgICAgIGNvbnRyb2xsZXIuc3RvcmFnZS51c2Vycy5nZXQobWVzc2FnZS51c2VyLCAoZXJyLCB1c2VyKSA9PiB7XG4gICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgIHVzZXIgPSB7XG4gICAgICAgICAgICBpZDogbWVzc2FnZS51c2VyLFxuICAgICAgICAgICAgbmFtZTogJ1Vua25vd24nLFxuICAgICAgICAgICAgYXR0cmlidXRlczoge31cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9maWxlID0ge1xuICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgIHVzZXJuYW1lOiB1c2VyLm5hbWUsXG4gICAgICAgICAgZmlyc3RfbmFtZTogdXNlci5hdHRyaWJ1dGVzLmZpcnN0X25hbWUgfHwgJycsXG4gICAgICAgICAgbGFzdF9uYW1lOiB1c2VyLmF0dHJpYnV0ZXMubGFzdF9uYW1lIHx8ICcnLFxuICAgICAgICAgIGZ1bGxfbmFtZTogdXNlci5hdHRyaWJ1dGVzLmZ1bGxfbmFtZSB8fCAnJyxcbiAgICAgICAgICBlbWFpbDogdXNlci5hdHRyaWJ1dGVzLmVtYWlsLCAvLyBtYXkgYmUgYmxhbmtcbiAgICAgICAgICBnZW5kZXI6IHVzZXIuYXR0cmlidXRlcy5nZW5kZXIsIC8vIG5vIHNvdXJjZSBmb3IgdGhpcyBpbmZvXG4gICAgICAgICAgdGltZXpvbmVfb2Zmc2V0OiB1c2VyLmF0dHJpYnV0ZXMudGltZXpvbmVfb2Zmc2V0LFxuICAgICAgICAgIHRpbWV6b25lOiB1c2VyLmF0dHJpYnV0ZXMudGltZXpvbmVcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYikge1xuICAgICAgICAgIGNiKG51bGwsIHByb2ZpbGUpXG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShwcm9maWxlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIGJvdFxuICB9KVxuXG4gIGNvbnRyb2xsZXIuaGFuZGxlV2ViaG9va1BheWxvYWQgPSAoeyBib2R5IH0sIHJlcykgPT4ge1xuICAgIGNvbnN0IHBheWxvYWQgPSBib2R5XG4gICAgY29udHJvbGxlci5pbmdlc3QoY29udHJvbGxlci5zcGF3bih7fSksIHBheWxvYWQsIHJlcylcbiAgfVxuXG4gIC8vIGNoYW5nZSB0aGUgc3BlZWQgb2YgdHlwaW5nIGEgcmVwbHkgaW4gYSBjb252ZXJzYXRpb25cbiAgY29udHJvbGxlci5zZXRUeXBpbmdEZWxheUZhY3RvciA9IGRlbGF5RmFjdG9yID0+IHtcbiAgICBjb250cm9sbGVyLmNvbmZpZy50eXBpbmdEZWxheUZhY3RvciA9IGRlbGF5RmFjdG9yXG4gIH1cblxuICAvLyBTdWJzdGFudGlhbGx5IHNob3J0ZW4gdGhlIGRlbGF5IGZvciBwcm9jZXNzaW5nIG1lc3NhZ2VzIGluIGNvbnZlcnNhdGlvbnNcbiAgY29udHJvbGxlci5zZXRUaWNrRGVsYXkoMTApXG5cbiAgcmV0dXJuIGNvbnRyb2xsZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgV2ViQm90XG5cbiJdfQ==