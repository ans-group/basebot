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

function _default(_ref5) {var storage = _ref5.storage,logger = _ref5.logger;
  var controller = WebBot({ storage: storage });
  var info = logger('channels:web', 'info');
  return {
    controller: controller,
    name: 'web',
    start: function start(_ref6) {var server = _ref6.server;
      controller.openSocketServer(server, { path: '/socket', port: process.env.PORT || 3001 });
      controller.startTicking();
      info('Web bot online');
    } };

};exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbIldlYkJvdCIsImNvbmZpZ3VyYXRpb24iLCJjb250cm9sbGVyIiwiZXJyb3IiLCJsb2dnZXIiLCJjb25zb2xlIiwiZGVidWciLCJsb2ciLCJjb25maWciLCJ0eXBpbmdEZWxheUZhY3RvciIsInVuZGVmaW5lZCIsImV4Y2x1ZGVGcm9tQ29udmVyc2F0aW9ucyIsIm9wZW5Tb2NrZXRTZXJ2ZXIiLCJzZXJ2ZXIiLCJ3c2NvbmZpZyIsIndzcyIsIldlYlNvY2tldCIsIlNlcnZlciIsImNsaWVudFRyYWNraW5nIiwibm9vcCIsImhlYXJ0YmVhdCIsImlzQWxpdmUiLCJvbiIsImNvbm5lY3Rpb24iLCJ3cyIsImJvdCIsInNwYXduIiwiY29ubmVjdGVkIiwiYmluZCIsIm1lc3NhZ2UiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsInR5cGUiLCJldmVudCIsInBhcnNlZE1lc3NhZ2UiLCJwYXJzZSIsImluZ2VzdCIsImUiLCJhbGVydCIsImpvaW4iLCJpbmNvbWluZyIsImVyciIsImludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjbGllbnRzIiwiZm9yRWFjaCIsImVhY2giLCJ0ZXJtaW5hdGUiLCJwaW5nIiwibWlkZGxld2FyZSIsInVzZSIsInJlcGx5X2NoYW5uZWwiLCJuZXh0IiwiaHR0cF9yZXNwb25zZSIsImZpbmRDb252ZXJzYXRpb24iLCJ1c2VyIiwiY2hhbm5lbCIsImNvbnZvIiwidGFzayIsImNhdGVnb3JpemUiLCJmb3JtYXQiLCJwbGF0Zm9ybV9tZXNzYWdlIiwia2V5IiwiZGVmaW5lQm90IiwiYm90a2l0IiwidXR0ZXJhbmNlcyIsInN0YXJ0Q29udmVyc2F0aW9uIiwiY2IiLCJjcmVhdGVDb252ZXJzYXRpb24iLCJyZWFkeVN0YXRlIiwiT1BFTiIsImpzb24iLCJzZXRUaW1lb3V0Iiwic3RhcnRUeXBpbmciLCJ0eXBpbmdEZWxheSIsInRleHQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInR5cGluZ0xlbmd0aCIsInRleHRMZW5ndGgiLCJsZW5ndGgiLCJhdmdXUE0iLCJhdmdDUE0iLCJNYXRoIiwibWluIiwiZmxvb3IiLCJyZXBseVdpdGhUeXBpbmciLCJyZXNwIiwidGhlbiIsInRvIiwic2F5IiwicmVwbHkiLCJzcmMiLCJ0eXBpbmciLCJ0IiwidGFza3MiLCJjIiwiY29udm9zIiwiaXNBY3RpdmUiLCJzb3VyY2VfbWVzc2FnZSIsImV4Y2x1ZGVkRXZlbnRzIiwiaW5jbHVkZXMiLCJnZXRJbnN0YW5jZUluZm8iLCJpbnN0YW5jZSIsImlkZW50aXR5IiwidGVhbSIsIm5hbWUiLCJpZCIsInVybCIsInJvb3RfdXJsIiwiZ2V0TWVzc2FnZVVzZXIiLCJzdG9yYWdlIiwidXNlcnMiLCJnZXQiLCJhdHRyaWJ1dGVzIiwicHJvZmlsZSIsInVzZXJuYW1lIiwiZmlyc3RfbmFtZSIsImxhc3RfbmFtZSIsImZ1bGxfbmFtZSIsImVtYWlsIiwiZ2VuZGVyIiwidGltZXpvbmVfb2Zmc2V0IiwidGltZXpvbmUiLCJoYW5kbGVXZWJob29rUGF5bG9hZCIsInJlcyIsImJvZHkiLCJwYXlsb2FkIiwic2V0VHlwaW5nRGVsYXlGYWN0b3IiLCJkZWxheUZhY3RvciIsInNldFRpY2tEZWxheSIsImluZm8iLCJzdGFydCIsInBhdGgiLCJwb3J0IiwicHJvY2VzcyIsImVudiIsIlBPUlQiLCJzdGFydFRpY2tpbmciXSwibWFwcGluZ3MiOiJ1R0FBQTtBQUNBO0FBQ0EsZ0Q7O0FBRUEsU0FBU0EsTUFBVCxDQUFnQkMsYUFBaEIsRUFBK0I7QUFDN0IsTUFBTUMsVUFBVSxHQUFHLHlCQUFPRCxhQUFhLElBQUksRUFBeEIsQ0FBbkI7QUFDQSxNQUFNRSxLQUFLLEdBQUdGLGFBQWEsQ0FBQ0csTUFBZDtBQUNWSCxFQUFBQSxhQUFhLENBQUNHLE1BQWQsQ0FBcUIsZ0JBQXJCLEVBQXVDLE9BQXZDLENBRFU7QUFFVkMsRUFBQUEsT0FBTyxDQUFDRixLQUZaO0FBR0EsTUFBTUcsS0FBSyxHQUFHTCxhQUFhLENBQUNHLE1BQWQ7QUFDVkgsRUFBQUEs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RyxNQUFhLFNBQWJBLE1BQWE7QUFDdEMsTUFBTUYsVUFBVSxHQUFHRixNQUFNLENBQUMsRUFBRWdILE9BQU8sRUFBUEEsT0FBRixFQUFELENBQXpCO0FBQ0EsTUFBTW9CLElBQUksR0FBR2hJLE1BQU0sQ0FBQyxjQUFELEVBQWlCLE1BQWpCLENBQW5CO0FBQ0EsU0FBTztBQUNMRixJQUFBQSxVQUFVLEVBQVZBLFVBREs7QUFFTHlHLElBQUFBLElBQUksRUFBRSxLQUZEO0FBR0wwQixJQUFBQSxLQUhLLHdCQUdhLEtBQVZ4SCxNQUFVLFNBQVZBLE1BQVU7QUFDaEJYLE1BQUFBLFVBQVUsQ0FBQ1UsZ0JBQVgsQ0FBNEJDLE1BQTVCLEVBQW9DLEVBQUV5SCxJQUFJLEVBQUUsU0FBUixFQUFtQkMsSUFBSSxFQUFFQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsSUFBWixJQUFvQixJQUE3QyxFQUFwQztBQUNBeEksTUFBQUEsVUFBVSxDQUFDeUksWUFBWDtBQUNBUCxNQUFBQSxJQUFJLENBQUMsZ0JBQUQsQ0FBSjtBQUNELEtBUEksRUFBUDs7QUFTRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCdcbmltcG9ydCBCb3RraXQgZnJvbSAnYm90a2l0L2xpYi9Db3JlQm90J1xuaW1wb3J0IFdlYlNvY2tldCBmcm9tICd3cydcblxuZnVuY3Rpb24gV2ViQm90KGNvbmZpZ3VyYXRpb24pIHtcbiAgY29uc3QgY29udHJvbGxlciA9IEJvdGtpdChjb25maWd1cmF0aW9uIHx8IHt9KVxuICBjb25zdCBlcnJvciA9IGNvbmZpZ3VyYXRpb24ubG9nZ2VyXG4gICAgPyBjb25maWd1cmF0aW9uLmxvZ2dlcignY29udHJvbGxlcjp3ZWInLCAnZXJyb3InKVxuICAgIDogY29uc29sZS5lcnJvclxuICBjb25zdCBkZWJ1ZyA9IGNvbmZpZ3VyYXRpb24ubG9nZ2VyXG4gICAgPyBjb25maWd1cmF0aW9uLmxvZ2dlcignY29udHJvbGxlcjp3ZWInLCAnZGVidWcnKVxuICAgIDogY29uc29sZS5sb2dcblxuICBpZiAoY29udHJvbGxlci5jb25maWcudHlwaW5nRGVsYXlGYWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnRyb2xsZXIuY29uZmlnLnR5cGluZ0RlbGF5RmFjdG9yID0gMVxuICB9XG5cbiAgY29udHJvbGxlci5leGNsdWRlRnJvbUNvbnZlcnNhdGlvbnMoWydoZWxsbycsICd3ZWxjb21lX2JhY2snLCAncmVjb25uZWN0JywgJ3JhdGluZ19yZWNlaXZlZCddKVxuXG4gIGNvbnRyb2xsZXIub3BlblNvY2tldFNlcnZlciA9IChzZXJ2ZXIsIHdzY29uZmlnID0ge30pID0+IHtcbiAgICAvLyBjcmVhdGUgdGhlIHNvY2tldCBzZXJ2ZXIgYWxvbmcgc2lkZSB0aGUgZXhpc3Rpbmcgd2Vic2VydmVyLlxuICAgIGNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQuU2VydmVyKHtcbiAgICAgIHNlcnZlcixcbiAgICAgIC4uLndzY29uZmlnLFxuICAgICAgY2xpZW50VHJhY2tpbmc6IHRydWVcbiAgICB9KVxuXG4gICAgLy8gRXhwb3NlIHRoZSB3ZWIgc29ja2V0IHNlcnZlciBvYmplY3QgdG8gdGhlIGNvbnRyb2xsZXIgc28gaXQgY2FuIGJlIHVzZWQgbGF0ZXIuXG4gICAgY29udHJvbGxlci53c3MgPSB3c3NcblxuICAgIGZ1bmN0aW9uIG5vb3AoKSB7IH1cblxuICAgIGZ1bmN0aW9uIGhlYXJ0YmVhdCgpIHtcbiAgICAgIHRoaXMuaXNBbGl2ZSA9IHRydWVcbiAgICB9XG5cbiAgICB3c3Mub24oJ2Nvbm5lY3Rpb24nLCBmdW5jdGlvbiBjb25uZWN0aW9uKHdzKSB7XG4gICAgICBjb25zb2xlLmxvZygnY29ubmVjdGVkJylcbiAgICAgIC8vIHNlYXJjaCB0aHJvdWdoIGFsbCB0aGUgY29udm9zLCBpZiBhIGJvdCBtYXRjaGVzLCB1cGRhdGUgaXRzIHdzXG4gICAgICBjb25zdCBib3QgPSBjb250cm9sbGVyLnNwYXduKClcbiAgICAgIGJvdC53cyA9IHdzXG4gICAgICBib3QuY29ubmVjdGVkID0gdHJ1ZVxuICAgICAgd3MuaXNBbGl2ZSA9IHRydWVcbiAgICAgIHdzLm9uKCdwb25nJywgaGVhcnRiZWF0LmJpbmQod3MpKVxuXG4gICAgICB3cy5vbignbWVzc2FnZScsIGFzeW5jIGZ1bmN0aW9uIGluY29taW5nKG1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2UgPT09ICdwaW5nJykge1xuICAgICAgICAgIHJldHVybiB3cy5zZW5kKEpTT04uc3RyaW5naWZ5KHsgdHlwZTogJ2hlYXJ0YmVhdCcsIGV2ZW50OiAncG9uZycgfSkpXG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBwYXJzZWRNZXNzYWdlID0gSlNPTi5wYXJzZShtZXNzYWdlKVxuICAgICAgICAgIGNvbnRyb2xsZXIuaW5nZXN0KGJvdCwgcGFyc2VkTWVzc2FnZSwgd3MpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zdCBhbGVydCA9IFtcbiAgICAgICAgICAgICdFcnJvciBwYXJzaW5nIGluY29taW5nIG1lc3NhZ2UgZnJvbSB3ZWJzb2NrZXQuJyxcbiAgICAgICAgICAgICdNZXNzYWdlIG11c3QgYmUgSlNPTiwgYW5kIHNob3VsZCBiZSBpbiB0aGUgZm9ybWF0IGRvY3VtZW50ZWQgaGVyZTonLFxuICAgICAgICAgICAgJ2h0dHBzOi8vYm90a2l0LmFpL2RvY3MvcmVhZG1lLXdlYi5odG1sI21lc3NhZ2Utb2JqZWN0cydcbiAgICAgICAgICBdXG4gICAgICAgICAgZXJyb3IoYWxlcnQuam9pbignXFxuJykpXG4gICAgICAgICAgZXJyb3IoZSlcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgd3Mub24oJ2Vycm9yJywgKGVycikgPT4gZXJyb3IoJ1dlYnNvY2tldCBFcnJvcjogJywgZXJyKSlcblxuICAgICAgd3Mub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgICBib3QuY29ubmVjdGVkID0gZmFsc2VcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgd3NzLmNsaWVudHMuZm9yRWFjaChmdW5jdGlvbiBlYWNoKHdzKSB7XG4gICAgICAgIGlmICh3cy5pc0FsaXZlID09PSBmYWxzZSkgcmV0dXJuIHdzLnRlcm1pbmF0ZSgpXG5cbiAgICAgICAgd3MuaXNBbGl2ZSA9IGZhbHNlXG4gICAgICAgIHdzLnBpbmcobm9vcClcbiAgICAgIH0pXG4gICAgfSwgMzAwMDApXG4gIH1cblxuICBjb250cm9sbGVyLm1pZGRsZXdhcmUuaW5nZXN0LnVzZSgoYm90LCBtZXNzYWdlLCByZXBseV9jaGFubmVsLCBuZXh0KSA9PiB7XG4gICAgLypcbiAgICAgKiB0aGlzIGNvdWxkIGJlIGEgbWVzc2FnZSBmcm9tIHRoZSBXZWJTb2NrZXRcbiAgICAgKiBvciBpdCBtaWdodCBiZSBjb21pbmcgZnJvbSBhIHdlYmhvb2suXG4gICAgICogY29uZmlndXJlIHRoZSBib3QgYXBwcm9wcmlhdGVseSBzbyB0aGUgcmVwbHkgZ29lcyB0byB0aGUgcmlnaHQgcGxhY2UhXG4gICAgICovXG4gICAgaWYgKCFib3Qud3MpIHtcbiAgICAgIGJvdC5odHRwX3Jlc3BvbnNlID0gcmVwbHlfY2hhbm5lbFxuICAgIH1cblxuICAgIC8qXG4gICAgICogbG9vayBmb3IgYW4gZXhpc3RpbmcgY29udmVyc2F0aW9uIGZvciB0aGlzIHVzZXIvY2hhbm5lbCBjb21ib1xuICAgICAqIHdoeSBub3QganVzdCBwYXNzIGluIG1lc3NhZ2U/IGJlY2F1c2Ugd2Ugb25seSBjYXJlIGlmIHRoZXJlIGlzIGEgY29udmVyc2F0aW9uICBvbmdvaW5nXG4gICAgICogYW5kIHdlIG1pZ2h0IGJlIGRlYWxpbmcgd2l0aCBcInNpbGVudFwiIG1lc3NhZ2UgdGhhdCB3b3VsZCBub3Qgb3RoZXJ3aXNlIG1hdGNoIGEgY29udmVyc2F0aW9uXG4gICAgICovXG4gICAgYm90LmZpbmRDb252ZXJzYXRpb24oe1xuICAgICAgdXNlcjogbWVzc2FnZS51c2VyLFxuICAgICAgY2hhbm5lbDogbWVzc2FnZS5jaGFubmVsXG4gICAgfSwgY29udm8gPT4ge1xuICAgICAgaWYgKGNvbnZvKSB7XG4gICAgICAgIGlmIChib3Qud3MpIHtcbiAgICAgICAgICAvLyByZXBsYWNlIHRoZSB3ZWJzb2NrZXQgY29ubmVjdGlvblxuICAgICAgICAgIGNvbnZvLnRhc2suYm90LndzID0gYm90LndzXG4gICAgICAgICAgY29udm8udGFzay5ib3QuY29ubmVjdGVkID0gdHJ1ZVxuICAgICAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT0gJ2hlbGxvJyB8fCBtZXNzYWdlLnR5cGUgPT0gJ3dlbGNvbWVfYmFjaycpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UudHlwZSA9ICdyZWNvbm5lY3QnXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qXG4gICAgICAgICAgICogcmVwbGFjZSB0aGUgcmVwbHkgY2hhbm5lbCBpbiB0aGUgYWN0aXZlIGNvbnZlcnNhdGlvblxuICAgICAgICAgICAqIHRoaXMgaXMgdGhlIG9uZSB0aGF0IGdldHMgdXNlZCB0byBzZW5kIHRoZSBhY3R1YWwgcmVwbHlcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBjb252by50YXNrLmJvdC5odHRwX3Jlc3BvbnNlID0gYm90Lmh0dHBfcmVzcG9uc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbmV4dCgpXG4gICAgfSlcbiAgfSlcblxuICBjb250cm9sbGVyLm1pZGRsZXdhcmUuY2F0ZWdvcml6ZS51c2UoKGJvdCwgbWVzc2FnZSwgbmV4dCkgPT4ge1xuICAgIGlmIChtZXNzYWdlLnR5cGUgPT0gJ21lc3NhZ2UnKSB7XG4gICAgICBtZXNzYWdlLnR5cGUgPSAnbWVzc2FnZV9yZWNlaXZlZCdcbiAgICB9XG5cbiAgICBuZXh0KClcbiAgfSlcblxuICAvLyBzaW1wbGUgbWVzc2FnZSBjbG9uZSBiZWNhdXNlIGl0cyBhbHJlYWR5IGluIHRoZSByaWdodCBmb3JtYXQhXG4gIGNvbnRyb2xsZXIubWlkZGxld2FyZS5mb3JtYXQudXNlKChib3QsIG1lc3NhZ2UsIHBsYXRmb3JtX21lc3NhZ2UsIG5leHQpID0+IHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBtZXNzYWdlKSB7XG4gICAgICBwbGF0Zm9ybV9tZXNzYWdlW2tleV0gPSBtZXNzYWdlW2tleV1cbiAgICB9XG4gICAgaWYgKCFwbGF0Zm9ybV9tZXNzYWdlLnR5cGUpIHtcbiAgICAgIHBsYXRmb3JtX21lc3NhZ2UudHlwZSA9ICdtZXNzYWdlJ1xuICAgIH1cbiAgICBuZXh0KClcbiAgfSlcblxuICBjb250cm9sbGVyLmRlZmluZUJvdCgoYm90a2l0LCBjb25maWcpID0+IHtcbiAgICBjb25zdCBib3QgPSB7XG4gICAgICB0eXBlOiAnc29ja2V0JyxcbiAgICAgIGJvdGtpdCxcbiAgICAgIGNvbmZpZzogY29uZmlnIHx8IHt9LFxuICAgICAgdXR0ZXJhbmNlczogYm90a2l0LnV0dGVyYW5jZXNcbiAgICB9XG5cbiAgICBib3Quc3RhcnRDb252ZXJzYXRpb24gPSBmdW5jdGlvbihtZXNzYWdlLCBjYikge1xuICAgICAgYm90a2l0LnN0YXJ0Q29udmVyc2F0aW9uKHRoaXMsIG1lc3NhZ2UsIGNiKVxuICAgIH1cblxuICAgIGJvdC5jcmVhdGVDb252ZXJzYXRpb24gPSBmdW5jdGlvbihtZXNzYWdlLCBjYikge1xuICAgICAgYm90a2l0LmNyZWF0ZUNvbnZlcnNhdGlvbih0aGlzLCBtZXNzYWdlLCBjYilcbiAgICB9XG5cbiAgICBib3Quc2VuZCA9IChtZXNzYWdlLCBjYikgPT4ge1xuICAgICAgaWYgKGJvdC5jb25uZWN0ZWQgfHwgIWJvdC53cykge1xuICAgICAgICBpZiAoYm90LndzKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChib3Qud3MgJiYgYm90LndzLnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICAgIGJvdC53cy5zZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjYikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVyciwgbWVzc2FnZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlcnJvcignQ2Fubm90IHNlbmQgbWVzc2FnZSB0byBjbG9zZWQgc29ja2V0JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYihlcnIpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBib3QuaHR0cF9yZXNwb25zZS5qc29uKG1lc3NhZ2UpXG4gICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgY2IobnVsbCwgbWVzc2FnZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChjYikge1xuICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyLCBtZXNzYWdlKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXJyb3IoJ0VSUk9SIFNFTkRJTkcnLCBlcnIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBib3Quc2VuZChtZXNzYWdlLCBjYilcbiAgICAgICAgfSwgMzAwMClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBib3Quc3RhcnRUeXBpbmcgPSAoKSA9PiB7XG4gICAgICBpZiAoYm90LmNvbm5lY3RlZCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChib3Qud3MgJiYgYm90LndzLnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICBib3Qud3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIHR5cGU6ICd0eXBpbmcnXG4gICAgICAgICAgICB9KSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGVycm9yKGBzdGFydFR5cGluZyBmYWlsZWQ6ICR7ZXJyLm1lc3NhZ2V9YClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3IoJ1NvY2tldCBjbG9zZWQhIENhbm5vdCBzZW5kIG1lc3NhZ2UnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgZXJyb3IoJ3N0YXJ0VHlwaW5nIGZhaWxlZDogJywgZXJyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgYm90LnR5cGluZ0RlbGF5ID0gKHsgdHlwaW5nRGVsYXksIHRleHQgfSkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgdHlwaW5nTGVuZ3RoID0gMFxuICAgICAgaWYgKHR5cGluZ0RlbGF5KSB7XG4gICAgICAgIHR5cGluZ0xlbmd0aCA9IHR5cGluZ0RlbGF5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgdGV4dExlbmd0aFxuICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgIHRleHRMZW5ndGggPSB0ZXh0Lmxlbmd0aFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHRMZW5ndGggPSA4MCAvLyBkZWZhdWx0IGF0dGFjaG1lbnQgdGV4dCBsZW5ndGhcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGF2Z1dQTSA9IDE1MFxuICAgICAgICBjb25zdCBhdmdDUE0gPSBhdmdXUE0gKiA3XG5cbiAgICAgICAgdHlwaW5nTGVuZ3RoID0gTWF0aC5taW4oTWF0aC5mbG9vcih0ZXh0TGVuZ3RoIC8gKGF2Z0NQTSAvIDYwKSkgKiAxMDAwLCAyMDAwKSAqIGNvbnRyb2xsZXIuY29uZmlnLnR5cGluZ0RlbGF5RmFjdG9yXG4gICAgICB9XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0sIHR5cGluZ0xlbmd0aClcbiAgICB9KVxuXG4gICAgYm90LnJlcGx5V2l0aFR5cGluZyA9ICh7IHVzZXIsIGNoYW5uZWwgfSwgcmVzcCwgY2IpID0+IHtcbiAgICAgIGJvdC5zdGFydFR5cGluZygpXG4gICAgICBib3QudHlwaW5nRGVsYXkocmVzcCkudGhlbigoKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgKHJlc3ApID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJlc3AgPSB7XG4gICAgICAgICAgICB0ZXh0OiByZXNwXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzcC51c2VyID0gdXNlclxuICAgICAgICByZXNwLmNoYW5uZWwgPSBjaGFubmVsXG4gICAgICAgIHJlc3AudG8gPSB1c2VyXG5cbiAgICAgICAgYm90LnNheShyZXNwLCBjYilcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgYm90LnJlcGx5ID0gKHNyYywgcmVzcCwgY2IpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgKHJlc3ApID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXNwID0ge1xuICAgICAgICAgIHRleHQ6IHJlc3BcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJ1JFU1BPTlNFIElTJylcbiAgICAgIGNvbnNvbGUubG9nKHJlc3ApXG5cbiAgICAgIHJlc3AudXNlciA9IHNyYy51c2VyXG4gICAgICByZXNwLmNoYW5uZWwgPSBzcmMuY2hhbm5lbFxuICAgICAgcmVzcC50byA9IHNyYy51c2VyXG5cbiAgICAgIGlmIChyZXNwLnR5cGluZyB8fCByZXNwLnR5cGluZ0RlbGF5IHx8IGNvbnRyb2xsZXIuY29uZmlnLnJlcGx5V2l0aFR5cGluZykge1xuICAgICAgICBib3QucmVwbHlXaXRoVHlwaW5nKHNyYywgcmVzcCwgY2IpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib3Quc2F5KHJlc3AsIGNiKVxuICAgICAgfVxuICAgIH1cblxuICAgIGJvdC5maW5kQ29udmVyc2F0aW9uID0gKHsgdXNlciwgY2hhbm5lbCwgdHlwZSB9LCBjYikgPT4ge1xuICAgICAgYm90a2l0LmRlYnVnKCdDVVNUT00gRklORCBDT05WTycsIHVzZXIsIGNoYW5uZWwpXG4gICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IGJvdGtpdC50YXNrcy5sZW5ndGg7IHQrKykge1xuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IGJvdGtpdC50YXNrc1t0XS5jb252b3MubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBib3RraXQudGFza3NbdF0uY29udm9zW2NdLmlzQWN0aXZlKCkgJiZcbiAgICAgICAgICAgIGJvdGtpdC50YXNrc1t0XS5jb252b3NbY10uc291cmNlX21lc3NhZ2UudXNlciA9PSB1c2VyICYmXG4gICAgICAgICAgICAhYm90a2l0LmV4Y2x1ZGVkRXZlbnRzLmluY2x1ZGVzKHR5cGUpIC8vIHRoaXMgdHlwZSBvZiBtZXNzYWdlIHNob3VsZCBub3QgYmUgaW5jbHVkZWRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJvdGtpdC5kZWJ1ZygnRk9VTkQgRVhJU1RJTkcgQ09OVk8hJylcbiAgICAgICAgICAgIGNiKGJvdGtpdC50YXNrc1t0XS5jb252b3NbY10pXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2IoKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogcmV0dXJuIGluZm8gYWJvdXQgdGhlIHNwZWNpZmljIGluc3RhbmNlIG9mIHRoaXMgYm90XG4gICAgICogaW5jbHVkaW5nIGlkZW50aXR5IGluZm9ybWF0aW9uLCBhbmQgYW55IG90aGVyIGluZm8gdGhhdCBpcyByZWxldmFudFxuICAgICAqL1xuICAgIGJvdC5nZXRJbnN0YW5jZUluZm8gPSBjYiA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0ge1xuICAgICAgICBpZGVudGl0eToge30sXG4gICAgICAgIHRlYW06IHt9XG4gICAgICB9XG5cbiAgICAgIGlmIChib3QuaWRlbnRpdHkpIHtcbiAgICAgICAgaW5zdGFuY2UuaWRlbnRpdHkubmFtZSA9IGJvdC5pZGVudGl0eS5uYW1lXG4gICAgICAgIGluc3RhbmNlLmlkZW50aXR5LmlkID0gYm90LmlkZW50aXR5LmlkXG5cbiAgICAgICAgaW5zdGFuY2UudGVhbS5uYW1lID0gYm90LmlkZW50aXR5Lm5hbWVcbiAgICAgICAgaW5zdGFuY2UudGVhbS51cmwgPSBib3QuaWRlbnRpdHkucm9vdF91cmxcbiAgICAgICAgaW5zdGFuY2UudGVhbS5pZCA9IGJvdC5pZGVudGl0eS5uYW1lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnN0YW5jZS5pZGVudGl0eS5uYW1lID0gJ0JvdGtpdCBXZWInXG4gICAgICAgIGluc3RhbmNlLmlkZW50aXR5LmlkID0gJ3dlYidcbiAgICAgIH1cblxuICAgICAgaWYgKGNiKSBjYihudWxsLCBpbnN0YW5jZSlcbiAgICAgIHJlc29sdmUoaW5zdGFuY2UpXG4gICAgfSlcblxuICAgIGJvdC5nZXRNZXNzYWdlVXNlciA9IChtZXNzYWdlLCBjYikgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAvLyBub3JtYWxpemUgdGhpcyBpbnRvIHdoYXQgYm90a2l0IHdhbnRzIHRvIHNlZVxuICAgICAgY29udHJvbGxlci5zdG9yYWdlLnVzZXJzLmdldChtZXNzYWdlLnVzZXIsIChlcnIsIHVzZXIpID0+IHtcbiAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgdXNlciA9IHtcbiAgICAgICAgICAgIGlkOiBtZXNzYWdlLnVzZXIsXG4gICAgICAgICAgICBuYW1lOiAnVW5rbm93bicsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb2ZpbGUgPSB7XG4gICAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgdXNlcm5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgICBmaXJzdF9uYW1lOiB1c2VyLmF0dHJpYnV0ZXMuZmlyc3RfbmFtZSB8fCAnJyxcbiAgICAgICAgICBsYXN0X25hbWU6IHVzZXIuYXR0cmlidXRlcy5sYXN0X25hbWUgfHwgJycsXG4gICAgICAgICAgZnVsbF9uYW1lOiB1c2VyLmF0dHJpYnV0ZXMuZnVsbF9uYW1lIHx8ICcnLFxuICAgICAgICAgIGVtYWlsOiB1c2VyLmF0dHJpYnV0ZXMuZW1haWwsIC8vIG1heSBiZSBibGFua1xuICAgICAgICAgIGdlbmRlcjogdXNlci5hdHRyaWJ1dGVzLmdlbmRlciwgLy8gbm8gc291cmNlIGZvciB0aGlzIGluZm9cbiAgICAgICAgICB0aW1lem9uZV9vZmZzZXQ6IHVzZXIuYXR0cmlidXRlcy50aW1lem9uZV9vZmZzZXQsXG4gICAgICAgICAgdGltZXpvbmU6IHVzZXIuYXR0cmlidXRlcy50aW1lem9uZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IobnVsbCwgcHJvZmlsZSlcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHByb2ZpbGUpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICByZXR1cm4gYm90XG4gIH0pXG5cbiAgY29udHJvbGxlci5oYW5kbGVXZWJob29rUGF5bG9hZCA9ICh7IGJvZHkgfSwgcmVzKSA9PiB7XG4gICAgY29uc3QgcGF5bG9hZCA9IGJvZHlcbiAgICBjb250cm9sbGVyLmluZ2VzdChjb250cm9sbGVyLnNwYXduKHt9KSwgcGF5bG9hZCwgcmVzKVxuICB9XG5cbiAgLy8gY2hhbmdlIHRoZSBzcGVlZCBvZiB0eXBpbmcgYSByZXBseSBpbiBhIGNvbnZlcnNhdGlvblxuICBjb250cm9sbGVyLnNldFR5cGluZ0RlbGF5RmFjdG9yID0gZGVsYXlGYWN0b3IgPT4ge1xuICAgIGNvbnRyb2xsZXIuY29uZmlnLnR5cGluZ0RlbGF5RmFjdG9yID0gZGVsYXlGYWN0b3JcbiAgfVxuXG4gIC8vIFN1YnN0YW50aWFsbHkgc2hvcnRlbiB0aGUgZGVsYXkgZm9yIHByb2Nlc3NpbmcgbWVzc2FnZXMgaW4gY29udmVyc2F0aW9uc1xuICBjb250cm9sbGVyLnNldFRpY2tEZWxheSgxMClcblxuICByZXR1cm4gY29udHJvbGxlclxufVxuXG5leHBvcnQgZGVmYXVsdCAoeyBzdG9yYWdlLCBsb2dnZXIgfSkgPT4ge1xuICBjb25zdCBjb250cm9sbGVyID0gV2ViQm90KHsgc3RvcmFnZSB9KVxuICBjb25zdCBpbmZvID0gbG9nZ2VyKCdjaGFubmVsczp3ZWInLCAnaW5mbycpXG4gIHJldHVybiB7XG4gICAgY29udHJvbGxlcixcbiAgICBuYW1lOiAnd2ViJyxcbiAgICBzdGFydCh7IHNlcnZlciB9KSB7XG4gICAgICBjb250cm9sbGVyLm9wZW5Tb2NrZXRTZXJ2ZXIoc2VydmVyLCB7IHBhdGg6ICcvc29ja2V0JywgcG9ydDogcHJvY2Vzcy5lbnYuUE9SVCB8fCAzMDAxIH0pXG4gICAgICBjb250cm9sbGVyLnN0YXJ0VGlja2luZygpXG4gICAgICBpbmZvKCdXZWIgYm90IG9ubGluZScpXG4gICAgfVxuICB9XG59XG4iXX0=