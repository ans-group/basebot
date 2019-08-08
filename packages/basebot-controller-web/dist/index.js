"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _util = require("util");
var _CoreBot = _interopRequireDefault(require("botkit/lib/CoreBot"));
var _v = _interopRequireDefault(require("uuid/v1"));
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

  controller.excludeFromConversations(['hello', 'welcome_back', 'reconnect']);

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
      // search through all the convos, if a bot matches, update its ws
      var bot = controller.spawn();
      bot.ws = ws;
      bot.connected = true;
      ws.isAlive = true;
      ws.on('pong', heartbeat.bind(ws));

      ws.on('message', /*#__PURE__*/function () {var _incoming = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(message) {var alert;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!(
                  message === 'ping')) {_context.next = 2;break;}return _context.abrupt("return",
                  ws.send(JSON.stringify({ type: 'heartbeat', event: 'pong' })));case 2:

                  try {
                    message = JSON.parse(message);
                    controller.ingest(bot, message, ws);
                  } catch (e) {
                    alert = ["Error parsing incoming message from websocket.", "Message must be JSON, and should be in the format documented here:", "https://botkit.ai/docs/readme-web.html#message-objects"];




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
        if (typeof resp == 'string') {
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
      if (typeof resp == 'string') {
        resp = {
          text: resp };

      }
      console.log("RESPONSE IS");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbIldlYkJvdCIsImNvbmZpZ3VyYXRpb24iLCJjb250cm9sbGVyIiwiZXJyb3IiLCJsb2dnZXIiLCJjb25zb2xlIiwiZGVidWciLCJsb2ciLCJjb25maWciLCJ0eXBpbmdEZWxheUZhY3RvciIsInVuZGVmaW5lZCIsImV4Y2x1ZGVGcm9tQ29udmVyc2F0aW9ucyIsIm9wZW5Tb2NrZXRTZXJ2ZXIiLCJzZXJ2ZXIiLCJ3c2NvbmZpZyIsIndzcyIsIldlYlNvY2tldCIsIlNlcnZlciIsImNsaWVudFRyYWNraW5nIiwibm9vcCIsImhlYXJ0YmVhdCIsImlzQWxpdmUiLCJvbiIsImNvbm5lY3Rpb24iLCJ3cyIsImJvdCIsInNwYXduIiwiY29ubmVjdGVkIiwiYmluZCIsIm1lc3NhZ2UiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsInR5cGUiLCJldmVudCIsInBhcnNlIiwiaW5nZXN0IiwiZSIsImFsZXJ0Iiwiam9pbiIsImluY29taW5nIiwiZXJyIiwiaW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImNsaWVudHMiLCJmb3JFYWNoIiwiZWFjaCIsInRlcm1pbmF0ZSIsInBpbmciLCJtaWRkbGV3YXJlIiwidXNlIiwicmVwbHlfY2hhbm5lbCIsIm5leHQiLCJodHRwX3Jlc3BvbnNlIiwiZmluZENvbnZlcnNhdGlvbiIsInVzZXIiLCJjaGFubmVsIiwiY29udm8iLCJ0YXNrIiwiY2F0ZWdvcml6ZSIsImZvcm1hdCIsInBsYXRmb3JtX21lc3NhZ2UiLCJrZXkiLCJkZWZpbmVCb3QiLCJib3RraXQiLCJ1dHRlcmFuY2VzIiwic3RhcnRDb252ZXJzYXRpb24iLCJjYiIsImNyZWF0ZUNvbnZlcnNhdGlvbiIsInJlYWR5U3RhdGUiLCJPUEVOIiwianNvbiIsInNldFRpbWVvdXQiLCJzdGFydFR5cGluZyIsInR5cGluZ0RlbGF5IiwidGV4dCIsIlByb21pc2UiLCJyZXNvbHZlIiwidHlwaW5nTGVuZ3RoIiwidGV4dExlbmd0aCIsImxlbmd0aCIsImF2Z1dQTSIsImF2Z0NQTSIsIk1hdGgiLCJtaW4iLCJmbG9vciIsInJlcGx5V2l0aFR5cGluZyIsInJlc3AiLCJ0aGVuIiwidG8iLCJzYXkiLCJyZXBseSIsInNyYyIsInR5cGluZyIsInQiLCJ0YXNrcyIsImMiLCJjb252b3MiLCJpc0FjdGl2ZSIsInNvdXJjZV9tZXNzYWdlIiwiZXhjbHVkZWRFdmVudHMiLCJpbmNsdWRlcyIsImdldEluc3RhbmNlSW5mbyIsImluc3RhbmNlIiwiaWRlbnRpdHkiLCJ0ZWFtIiwibmFtZSIsImlkIiwidXJsIiwicm9vdF91cmwiLCJnZXRNZXNzYWdlVXNlciIsInN0b3JhZ2UiLCJ1c2VycyIsImdldCIsImF0dHJpYnV0ZXMiLCJwcm9maWxlIiwidXNlcm5hbWUiLCJmaXJzdF9uYW1lIiwibGFzdF9uYW1lIiwiZnVsbF9uYW1lIiwiZW1haWwiLCJnZW5kZXIiLCJ0aW1lem9uZV9vZmZzZXQiLCJ0aW1lem9uZSIsImhhbmRsZVdlYmhvb2tQYXlsb2FkIiwicmVzIiwiYm9keSIsInBheWxvYWQiLCJzZXRUeXBpbmdEZWxheUZhY3RvciIsImRlbGF5RmFjdG9yIiwic2V0VGlja0RlbGF5Il0sIm1hcHBpbmdzIjoidUdBQUE7QUFDQTtBQUNBO0FBQ0EsZ0Q7O0FBRUEsU0FBU0EsTUFBVCxDQUFnQkMsYUFBaEIsRUFBK0I7QUFDN0IsTUFBTUMsVUFBVSxHQUFHLHlCQUFPRCxhQUFhLElBQUksRUFBeEIsQ0FBbkI7QUFDQSxNQUFNRSxLQUFLLEdBQUdGLGFBQWEsQ0FBQ0csTUFBZDtBQUNWSCxFQUFBQSxhQUFhLENBQUNHLE1BQWQsQ0FBcUIsZ0JBQXJCLEVBQXVDLE9BQXZDLENBRFU7QUFFVkMsRUFBQUEsT0FBTyxDQUFDRixLQUZaO0FBR0EsTUFBTUcsS0FBSyxHQUFHTCxhQUFhLENBQUNHLE1BQWQ7QUFDVkgsRUFBQUEsYUFBYSxDQUFDRyxNQUFkLENBQXFCLGdCQUFyQixFQUF1QyxPQUF2QyxDQURVO0FBRVZDLEVBQUFBLE9BQU8sQ0FBQ0UsR0FGWjs7QUFJ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QUFlLEVBQUVuRSxJQUFJLENBQUMyRCxVQUFMLENBQWdCUSxlQVJuQjtBQVNkQyxZQUFBQSxRQUFRLEVBQUVwRSxJQUFJLENBQUMyRCxVQUFMLENBQWdCUyxRQVRaLEVBQWhCOzs7QUFZQSxjQUFJeEQsRUFBSixFQUFRO0FBQ05BLFlBQUFBLEVBQUUsQ0FBQyxJQUFELEVBQU9nRCxPQUFQLENBQUY7QUFDRDtBQUNEdEMsVUFBQUEsT0FBTyxDQUFDc0MsT0FBRCxDQUFQO0FBQ0QsU0F6QkQ7QUEwQkQsT0E1QnFDLENBQWpCLEVBQXJCOztBQThCQSxXQUFPMUYsR0FBUDtBQUNELEdBak5EOztBQW1OQXZCLEVBQUFBLFVBQVUsQ0FBQzBILG9CQUFYLEdBQWtDLGlCQUFXQyxHQUFYLEVBQW1CLEtBQWhCQyxJQUFnQixTQUFoQkEsSUFBZ0I7QUFDbkQsUUFBTUMsT0FBTyxHQUFHRCxJQUFoQjtBQUNBNUgsSUFBQUEsVUFBVSxDQUFDa0MsTUFBWCxDQUFrQmxDLFVBQVUsQ0FBQ3dCLEtBQVgsQ0FBaUIsRUFBakIsQ0FBbEIsRUFBd0NxRyxPQUF4QyxFQUFpREYsR0FBakQ7QUFDRCxHQUhEOztBQUtBO0FBQ0EzSCxFQUFBQSxVQUFVLENBQUM4SCxvQkFBWCxHQUFrQyxVQUFBQyxXQUFXLEVBQUk7QUFDL0MvSCxJQUFBQSxVQUFVLENBQUNNLE1BQVgsQ0FBa0JDLGlCQUFsQixHQUFzQ3dILFdBQXRDO0FBQ0QsR0FGRDs7QUFJQTtBQUNBL0gsRUFBQUEsVUFBVSxDQUFDZ0ksWUFBWCxDQUF3QixFQUF4Qjs7QUFFQSxTQUFPaEksVUFBUDtBQUNELEM7O0FBRWNGLE0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJ1xuaW1wb3J0IEJvdGtpdCBmcm9tICdib3RraXQvbGliL0NvcmVCb3QnXG5pbXBvcnQgdXVpZCBmcm9tICd1dWlkL3YxJ1xuaW1wb3J0IFdlYlNvY2tldCBmcm9tICd3cyc7XG5cbmZ1bmN0aW9uIFdlYkJvdChjb25maWd1cmF0aW9uKSB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBCb3RraXQoY29uZmlndXJhdGlvbiB8fCB7fSk7XG4gIGNvbnN0IGVycm9yID0gY29uZmlndXJhdGlvbi5sb2dnZXJcbiAgICA/IGNvbmZpZ3VyYXRpb24ubG9nZ2VyKCdjb250cm9sbGVyOndlYicsICdlcnJvcicpXG4gICAgOiBjb25zb2xlLmVycm9yXG4gIGNvbnN0IGRlYnVnID0gY29uZmlndXJhdGlvbi5sb2dnZXJcbiAgICA/IGNvbmZpZ3VyYXRpb24ubG9nZ2VyKCdjb250cm9sbGVyOndlYicsICdkZWJ1ZycpXG4gICAgOiBjb25zb2xlLmxvZ1xuXG4gIGlmIChjb250cm9sbGVyLmNvbmZpZy50eXBpbmdEZWxheUZhY3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29udHJvbGxlci5jb25maWcudHlwaW5nRGVsYXlGYWN0b3IgPSAxXG4gIH1cblxuICBjb250cm9sbGVyLmV4Y2x1ZGVGcm9tQ29udmVyc2F0aW9ucyhbJ2hlbGxvJywgJ3dlbGNvbWVfYmFjaycsICdyZWNvbm5lY3QnXSlcblxuICBjb250cm9sbGVyLm9wZW5Tb2NrZXRTZXJ2ZXIgPSAoc2VydmVyLCB3c2NvbmZpZyA9IHt9KSA9PiB7XG5cbiAgICAvLyBjcmVhdGUgdGhlIHNvY2tldCBzZXJ2ZXIgYWxvbmcgc2lkZSB0aGUgZXhpc3Rpbmcgd2Vic2VydmVyLlxuICAgIGNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQuU2VydmVyKHtcbiAgICAgIHNlcnZlcixcbiAgICAgIC4uLndzY29uZmlnLFxuICAgICAgY2xpZW50VHJhY2tpbmc6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBFeHBvc2UgdGhlIHdlYiBzb2NrZXQgc2VydmVyIG9iamVjdCB0byB0aGUgY29udHJvbGxlciBzbyBpdCBjYW4gYmUgdXNlZCBsYXRlci5cbiAgICBjb250cm9sbGVyLndzcyA9IHdzc1xuXG4gICAgZnVuY3Rpb24gbm9vcCgpIHsgfVxuXG4gICAgZnVuY3Rpb24gaGVhcnRiZWF0KCkge1xuICAgICAgdGhpcy5pc0FsaXZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB3c3Mub24oJ2Nvbm5lY3Rpb24nLCBmdW5jdGlvbiBjb25uZWN0aW9uKHdzKSB7XG4gICAgICAvLyBzZWFyY2ggdGhyb3VnaCBhbGwgdGhlIGNvbnZvcywgaWYgYSBib3QgbWF0Y2hlcywgdXBkYXRlIGl0cyB3c1xuICAgICAgY29uc3QgYm90ID0gY29udHJvbGxlci5zcGF3bigpO1xuICAgICAgYm90LndzID0gd3NcbiAgICAgIGJvdC5jb25uZWN0ZWQgPSB0cnVlXG4gICAgICB3cy5pc0FsaXZlID0gdHJ1ZTtcbiAgICAgIHdzLm9uKCdwb25nJywgaGVhcnRiZWF0LmJpbmQod3MpKTtcblxuICAgICAgd3Mub24oJ21lc3NhZ2UnLCBhc3luYyBmdW5jdGlvbiBpbmNvbWluZyhtZXNzYWdlKSB7XG4gICAgICAgIGlmIChtZXNzYWdlID09PSAncGluZycpIHtcbiAgICAgICAgICByZXR1cm4gd3Muc2VuZChKU09OLnN0cmluZ2lmeSh7IHR5cGU6ICdoZWFydGJlYXQnLCBldmVudDogJ3BvbmcnIH0pKVxuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIG1lc3NhZ2UgPSBKU09OLnBhcnNlKG1lc3NhZ2UpXG4gICAgICAgICAgY29udHJvbGxlci5pbmdlc3QoYm90LCBtZXNzYWdlLCB3cylcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnN0IGFsZXJ0ID0gW1xuICAgICAgICAgICAgYEVycm9yIHBhcnNpbmcgaW5jb21pbmcgbWVzc2FnZSBmcm9tIHdlYnNvY2tldC5gLFxuICAgICAgICAgICAgYE1lc3NhZ2UgbXVzdCBiZSBKU09OLCBhbmQgc2hvdWxkIGJlIGluIHRoZSBmb3JtYXQgZG9jdW1lbnRlZCBoZXJlOmAsXG4gICAgICAgICAgICBgaHR0cHM6Ly9ib3RraXQuYWkvZG9jcy9yZWFkbWUtd2ViLmh0bWwjbWVzc2FnZS1vYmplY3RzYFxuICAgICAgICAgIF07XG4gICAgICAgICAgZXJyb3IoYWxlcnQuam9pbignXFxuJykpXG4gICAgICAgICAgZXJyb3IoZSlcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgd3Mub24oJ2Vycm9yJywgKGVycikgPT4gZXJyb3IoJ1dlYnNvY2tldCBFcnJvcjogJywgZXJyKSlcblxuICAgICAgd3Mub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgICBib3QuY29ubmVjdGVkID0gZmFsc2VcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgd3NzLmNsaWVudHMuZm9yRWFjaChmdW5jdGlvbiBlYWNoKHdzKSB7XG4gICAgICAgIGlmICh3cy5pc0FsaXZlID09PSBmYWxzZSkgcmV0dXJuIHdzLnRlcm1pbmF0ZSgpO1xuXG4gICAgICAgIHdzLmlzQWxpdmUgPSBmYWxzZTtcbiAgICAgICAgd3MucGluZyhub29wKTtcbiAgICAgIH0pO1xuICAgIH0sIDMwMDAwKTtcbiAgfVxuXG5cbiAgY29udHJvbGxlci5taWRkbGV3YXJlLmluZ2VzdC51c2UoKGJvdCwgbWVzc2FnZSwgcmVwbHlfY2hhbm5lbCwgbmV4dCkgPT4ge1xuXG4gICAgLypcbiAgICAgKiB0aGlzIGNvdWxkIGJlIGEgbWVzc2FnZSBmcm9tIHRoZSBXZWJTb2NrZXRcbiAgICAgKiBvciBpdCBtaWdodCBiZSBjb21pbmcgZnJvbSBhIHdlYmhvb2suXG4gICAgICogY29uZmlndXJlIHRoZSBib3QgYXBwcm9wcmlhdGVseSBzbyB0aGUgcmVwbHkgZ29lcyB0byB0aGUgcmlnaHQgcGxhY2UhXG4gICAgICovXG4gICAgaWYgKCFib3Qud3MpIHtcbiAgICAgIGJvdC5odHRwX3Jlc3BvbnNlID0gcmVwbHlfY2hhbm5lbFxuICAgIH1cblxuICAgIC8qXG4gICAgICogbG9vayBmb3IgYW4gZXhpc3RpbmcgY29udmVyc2F0aW9uIGZvciB0aGlzIHVzZXIvY2hhbm5lbCBjb21ib1xuICAgICAqIHdoeSBub3QganVzdCBwYXNzIGluIG1lc3NhZ2U/IGJlY2F1c2Ugd2Ugb25seSBjYXJlIGlmIHRoZXJlIGlzIGEgY29udmVyc2F0aW9uICBvbmdvaW5nXG4gICAgICogYW5kIHdlIG1pZ2h0IGJlIGRlYWxpbmcgd2l0aCBcInNpbGVudFwiIG1lc3NhZ2UgdGhhdCB3b3VsZCBub3Qgb3RoZXJ3aXNlIG1hdGNoIGEgY29udmVyc2F0aW9uXG4gICAgICovXG4gICAgYm90LmZpbmRDb252ZXJzYXRpb24oe1xuICAgICAgdXNlcjogbWVzc2FnZS51c2VyLFxuICAgICAgY2hhbm5lbDogbWVzc2FnZS5jaGFubmVsXG4gICAgfSwgY29udm8gPT4ge1xuICAgICAgaWYgKGNvbnZvKSB7XG4gICAgICAgIGlmIChib3Qud3MpIHtcbiAgICAgICAgICAvLyByZXBsYWNlIHRoZSB3ZWJzb2NrZXQgY29ubmVjdGlvblxuICAgICAgICAgIGNvbnZvLnRhc2suYm90LndzID0gYm90LndzXG4gICAgICAgICAgY29udm8udGFzay5ib3QuY29ubmVjdGVkID0gdHJ1ZVxuICAgICAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT0gJ2hlbGxvJyB8fCBtZXNzYWdlLnR5cGUgPT0gJ3dlbGNvbWVfYmFjaycpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UudHlwZSA9ICdyZWNvbm5lY3QnXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgLypcbiAgICAgICAgICAgKiByZXBsYWNlIHRoZSByZXBseSBjaGFubmVsIGluIHRoZSBhY3RpdmUgY29udmVyc2F0aW9uXG4gICAgICAgICAgICogdGhpcyBpcyB0aGUgb25lIHRoYXQgZ2V0cyB1c2VkIHRvIHNlbmQgdGhlIGFjdHVhbCByZXBseVxuICAgICAgICAgICAqL1xuICAgICAgICAgIGNvbnZvLnRhc2suYm90Lmh0dHBfcmVzcG9uc2UgPSBib3QuaHR0cF9yZXNwb25zZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBuZXh0KClcbiAgICB9KVxuICB9KVxuXG4gIGNvbnRyb2xsZXIubWlkZGxld2FyZS5jYXRlZ29yaXplLnVzZSgoYm90LCBtZXNzYWdlLCBuZXh0KSA9PiB7XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PSAnbWVzc2FnZScpIHtcbiAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXNzYWdlX3JlY2VpdmVkJ1xuICAgIH1cblxuICAgIG5leHQoKVxuICB9KVxuXG4gIC8vIHNpbXBsZSBtZXNzYWdlIGNsb25lIGJlY2F1c2UgaXRzIGFscmVhZHkgaW4gdGhlIHJpZ2h0IGZvcm1hdCFcbiAgY29udHJvbGxlci5taWRkbGV3YXJlLmZvcm1hdC51c2UoKGJvdCwgbWVzc2FnZSwgcGxhdGZvcm1fbWVzc2FnZSwgbmV4dCkgPT4ge1xuICAgIGZvciAoY29uc3Qga2V5IGluIG1lc3NhZ2UpIHtcbiAgICAgIHBsYXRmb3JtX21lc3NhZ2Vba2V5XSA9IG1lc3NhZ2Vba2V5XVxuICAgIH1cbiAgICBpZiAoIXBsYXRmb3JtX21lc3NhZ2UudHlwZSkge1xuICAgICAgcGxhdGZvcm1fbWVzc2FnZS50eXBlID0gJ21lc3NhZ2UnXG4gICAgfVxuICAgIG5leHQoKVxuICB9KVxuXG4gIGNvbnRyb2xsZXIuZGVmaW5lQm90KChib3RraXQsIGNvbmZpZykgPT4ge1xuICAgIGNvbnN0IGJvdCA9IHtcbiAgICAgIHR5cGU6ICdzb2NrZXQnLFxuICAgICAgYm90a2l0LFxuICAgICAgY29uZmlnOiBjb25maWcgfHwge30sXG4gICAgICB1dHRlcmFuY2VzOiBib3RraXQudXR0ZXJhbmNlc1xuICAgIH07XG5cbiAgICBib3Quc3RhcnRDb252ZXJzYXRpb24gPSBmdW5jdGlvbiAobWVzc2FnZSwgY2IpIHtcbiAgICAgIGJvdGtpdC5zdGFydENvbnZlcnNhdGlvbih0aGlzLCBtZXNzYWdlLCBjYilcbiAgICB9XG5cbiAgICBib3QuY3JlYXRlQ29udmVyc2F0aW9uID0gZnVuY3Rpb24gKG1lc3NhZ2UsIGNiKSB7XG4gICAgICBib3RraXQuY3JlYXRlQ29udmVyc2F0aW9uKHRoaXMsIG1lc3NhZ2UsIGNiKVxuICAgIH1cblxuICAgIGJvdC5zZW5kID0gKG1lc3NhZ2UsIGNiKSA9PiB7XG4gICAgICBpZiAoYm90LmNvbm5lY3RlZCB8fCAhYm90LndzKSB7XG4gICAgICAgIGlmIChib3Qud3MpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGJvdC53cyAmJiBib3Qud3MucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgICAgYm90LndzLnNlbmQoSlNPTi5zdHJpbmdpZnkobWVzc2FnZSksIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyLCBtZXNzYWdlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVycm9yKCdDYW5ub3Qgc2VuZCBtZXNzYWdlIHRvIGNsb3NlZCBzb2NrZXQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNiKGVycilcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGJvdC5odHRwX3Jlc3BvbnNlLmpzb24obWVzc2FnZSlcbiAgICAgICAgICAgIGlmIChjYikge1xuICAgICAgICAgICAgICBjYihudWxsLCBtZXNzYWdlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihlcnIsIG1lc3NhZ2UpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlcnJvcignRVJST1IgU0VORElORycsIGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGJvdC5zZW5kKG1lc3NhZ2UsIGNiKVxuICAgICAgICB9LCAzMDAwKVxuICAgICAgfVxuICAgIH1cblxuICAgIGJvdC5zdGFydFR5cGluZyA9ICgpID0+IHtcbiAgICAgIGlmIChib3QuY29ubmVjdGVkKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGJvdC53cyAmJiBib3Qud3MucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgIGJvdC53cy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgdHlwZTogJ3R5cGluZydcbiAgICAgICAgICAgIH0pLCBlcnIgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IoYHN0YXJ0VHlwaW5nIGZhaWxlZDogJHtlcnIubWVzc2FnZX1gKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvcignU29ja2V0IGNsb3NlZCEgQ2Fubm90IHNlbmQgbWVzc2FnZScpXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBlcnJvcignc3RhcnRUeXBpbmcgZmFpbGVkOiAnLCBlcnIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBib3QudHlwaW5nRGVsYXkgPSAoeyB0eXBpbmdEZWxheSwgdGV4dCB9KSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGxldCB0eXBpbmdMZW5ndGggPSAwO1xuICAgICAgaWYgKHR5cGluZ0RlbGF5KSB7XG4gICAgICAgIHR5cGluZ0xlbmd0aCA9IHR5cGluZ0RlbGF5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgdGV4dExlbmd0aDtcbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICB0ZXh0TGVuZ3RoID0gdGV4dC5sZW5ndGhcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXh0TGVuZ3RoID0gODAgLy8gZGVmYXVsdCBhdHRhY2htZW50IHRleHQgbGVuZ3RoXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhdmdXUE0gPSAxNTA7XG4gICAgICAgIGNvbnN0IGF2Z0NQTSA9IGF2Z1dQTSAqIDc7XG5cbiAgICAgICAgdHlwaW5nTGVuZ3RoID0gTWF0aC5taW4oTWF0aC5mbG9vcih0ZXh0TGVuZ3RoIC8gKGF2Z0NQTSAvIDYwKSkgKiAxMDAwLCAyMDAwKSAqIGNvbnRyb2xsZXIuY29uZmlnLnR5cGluZ0RlbGF5RmFjdG9yXG4gICAgICB9XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0sIHR5cGluZ0xlbmd0aClcbiAgICB9KVxuXG4gICAgYm90LnJlcGx5V2l0aFR5cGluZyA9ICh7IHVzZXIsIGNoYW5uZWwgfSwgcmVzcCwgY2IpID0+IHtcbiAgICAgIGJvdC5zdGFydFR5cGluZygpXG4gICAgICBib3QudHlwaW5nRGVsYXkocmVzcCkudGhlbigoKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgKHJlc3ApID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcmVzcCA9IHtcbiAgICAgICAgICAgIHRleHQ6IHJlc3BcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXNwLnVzZXIgPSB1c2VyXG4gICAgICAgIHJlc3AuY2hhbm5lbCA9IGNoYW5uZWxcbiAgICAgICAgcmVzcC50byA9IHVzZXJcblxuICAgICAgICBib3Quc2F5KHJlc3AsIGNiKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBib3QucmVwbHkgPSAoc3JjLCByZXNwLCBjYikgPT4ge1xuICAgICAgaWYgKHR5cGVvZiAocmVzcCkgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVzcCA9IHtcbiAgICAgICAgICB0ZXh0OiByZXNwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKFwiUkVTUE9OU0UgSVNcIilcbiAgICAgIGNvbnNvbGUubG9nKHJlc3ApXG5cbiAgICAgIHJlc3AudXNlciA9IHNyYy51c2VyXG4gICAgICByZXNwLmNoYW5uZWwgPSBzcmMuY2hhbm5lbFxuICAgICAgcmVzcC50byA9IHNyYy51c2VyXG5cbiAgICAgIGlmIChyZXNwLnR5cGluZyB8fCByZXNwLnR5cGluZ0RlbGF5IHx8IGNvbnRyb2xsZXIuY29uZmlnLnJlcGx5V2l0aFR5cGluZykge1xuICAgICAgICBib3QucmVwbHlXaXRoVHlwaW5nKHNyYywgcmVzcCwgY2IpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib3Quc2F5KHJlc3AsIGNiKVxuICAgICAgfVxuICAgIH1cblxuICAgIGJvdC5maW5kQ29udmVyc2F0aW9uID0gKHsgdXNlciwgY2hhbm5lbCwgdHlwZSB9LCBjYikgPT4ge1xuICAgICAgYm90a2l0LmRlYnVnKCdDVVNUT00gRklORCBDT05WTycsIHVzZXIsIGNoYW5uZWwpXG4gICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IGJvdGtpdC50YXNrcy5sZW5ndGg7IHQrKykge1xuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IGJvdGtpdC50YXNrc1t0XS5jb252b3MubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBib3RraXQudGFza3NbdF0uY29udm9zW2NdLmlzQWN0aXZlKCkgJiZcbiAgICAgICAgICAgIGJvdGtpdC50YXNrc1t0XS5jb252b3NbY10uc291cmNlX21lc3NhZ2UudXNlciA9PSB1c2VyICYmXG4gICAgICAgICAgICAhYm90a2l0LmV4Y2x1ZGVkRXZlbnRzLmluY2x1ZGVzKHR5cGUpIC8vIHRoaXMgdHlwZSBvZiBtZXNzYWdlIHNob3VsZCBub3QgYmUgaW5jbHVkZWRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJvdGtpdC5kZWJ1ZygnRk9VTkQgRVhJU1RJTkcgQ09OVk8hJylcbiAgICAgICAgICAgIGNiKGJvdGtpdC50YXNrc1t0XS5jb252b3NbY10pXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2IoKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogcmV0dXJuIGluZm8gYWJvdXQgdGhlIHNwZWNpZmljIGluc3RhbmNlIG9mIHRoaXMgYm90XG4gICAgICogaW5jbHVkaW5nIGlkZW50aXR5IGluZm9ybWF0aW9uLCBhbmQgYW55IG90aGVyIGluZm8gdGhhdCBpcyByZWxldmFudFxuICAgICAqL1xuICAgIGJvdC5nZXRJbnN0YW5jZUluZm8gPSBjYiA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0ge1xuICAgICAgICBpZGVudGl0eToge30sXG4gICAgICAgIHRlYW06IHt9XG4gICAgICB9O1xuXG4gICAgICBpZiAoYm90LmlkZW50aXR5KSB7XG4gICAgICAgIGluc3RhbmNlLmlkZW50aXR5Lm5hbWUgPSBib3QuaWRlbnRpdHkubmFtZVxuICAgICAgICBpbnN0YW5jZS5pZGVudGl0eS5pZCA9IGJvdC5pZGVudGl0eS5pZFxuXG4gICAgICAgIGluc3RhbmNlLnRlYW0ubmFtZSA9IGJvdC5pZGVudGl0eS5uYW1lXG4gICAgICAgIGluc3RhbmNlLnRlYW0udXJsID0gYm90LmlkZW50aXR5LnJvb3RfdXJsXG4gICAgICAgIGluc3RhbmNlLnRlYW0uaWQgPSBib3QuaWRlbnRpdHkubmFtZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdGFuY2UuaWRlbnRpdHkubmFtZSA9ICdCb3RraXQgV2ViJ1xuICAgICAgICBpbnN0YW5jZS5pZGVudGl0eS5pZCA9ICd3ZWInXG4gICAgICB9XG5cbiAgICAgIGlmIChjYikgY2IobnVsbCwgaW5zdGFuY2UpXG4gICAgICByZXNvbHZlKGluc3RhbmNlKVxuICAgIH0pXG5cbiAgICBib3QuZ2V0TWVzc2FnZVVzZXIgPSAobWVzc2FnZSwgY2IpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgLy8gbm9ybWFsaXplIHRoaXMgaW50byB3aGF0IGJvdGtpdCB3YW50cyB0byBzZWVcbiAgICAgIGNvbnRyb2xsZXIuc3RvcmFnZS51c2Vycy5nZXQobWVzc2FnZS51c2VyLCAoZXJyLCB1c2VyKSA9PiB7XG4gICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgIHVzZXIgPSB7XG4gICAgICAgICAgICBpZDogbWVzc2FnZS51c2VyLFxuICAgICAgICAgICAgbmFtZTogJ1Vua25vd24nLFxuICAgICAgICAgICAgYXR0cmlidXRlczoge31cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9maWxlID0ge1xuICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgIHVzZXJuYW1lOiB1c2VyLm5hbWUsXG4gICAgICAgICAgZmlyc3RfbmFtZTogdXNlci5hdHRyaWJ1dGVzLmZpcnN0X25hbWUgfHwgJycsXG4gICAgICAgICAgbGFzdF9uYW1lOiB1c2VyLmF0dHJpYnV0ZXMubGFzdF9uYW1lIHx8ICcnLFxuICAgICAgICAgIGZ1bGxfbmFtZTogdXNlci5hdHRyaWJ1dGVzLmZ1bGxfbmFtZSB8fCAnJyxcbiAgICAgICAgICBlbWFpbDogdXNlci5hdHRyaWJ1dGVzLmVtYWlsLCAvLyBtYXkgYmUgYmxhbmtcbiAgICAgICAgICBnZW5kZXI6IHVzZXIuYXR0cmlidXRlcy5nZW5kZXIsIC8vIG5vIHNvdXJjZSBmb3IgdGhpcyBpbmZvXG4gICAgICAgICAgdGltZXpvbmVfb2Zmc2V0OiB1c2VyLmF0dHJpYnV0ZXMudGltZXpvbmVfb2Zmc2V0LFxuICAgICAgICAgIHRpbWV6b25lOiB1c2VyLmF0dHJpYnV0ZXMudGltZXpvbmVcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICBjYihudWxsLCBwcm9maWxlKVxuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUocHJvZmlsZSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiBib3RcbiAgfSlcblxuICBjb250cm9sbGVyLmhhbmRsZVdlYmhvb2tQYXlsb2FkID0gKHsgYm9keSB9LCByZXMpID0+IHtcbiAgICBjb25zdCBwYXlsb2FkID0gYm9keTtcbiAgICBjb250cm9sbGVyLmluZ2VzdChjb250cm9sbGVyLnNwYXduKHt9KSwgcGF5bG9hZCwgcmVzKVxuICB9XG5cbiAgLy8gY2hhbmdlIHRoZSBzcGVlZCBvZiB0eXBpbmcgYSByZXBseSBpbiBhIGNvbnZlcnNhdGlvblxuICBjb250cm9sbGVyLnNldFR5cGluZ0RlbGF5RmFjdG9yID0gZGVsYXlGYWN0b3IgPT4ge1xuICAgIGNvbnRyb2xsZXIuY29uZmlnLnR5cGluZ0RlbGF5RmFjdG9yID0gZGVsYXlGYWN0b3JcbiAgfVxuXG4gIC8vIFN1YnN0YW50aWFsbHkgc2hvcnRlbiB0aGUgZGVsYXkgZm9yIHByb2Nlc3NpbmcgbWVzc2FnZXMgaW4gY29udmVyc2F0aW9uc1xuICBjb250cm9sbGVyLnNldFRpY2tEZWxheSgxMClcblxuICByZXR1cm4gY29udHJvbGxlclxufVxuXG5leHBvcnQgZGVmYXVsdCBXZWJCb3Q7XG4iXX0=