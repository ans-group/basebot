"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _util = require("util");
var _CoreBot = _interopRequireDefault(require("botkit/lib/CoreBot"));
var _v = _interopRequireDefault(require("uuid/v1"));
var _http = _interopRequireDefault(require("http2"));
var _aws = _interopRequireDefault(require("aws4"));
var _ws = _interopRequireDefault(require("ws"));
var _awsSdk = require("aws-sdk");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

function connectTranscribe() {var _headers;
  var params = {
    service: 'transcribe',
    region: 'eu-west-1',
    method: 'POST',
    path: '/stream-transcription',
    headers: (_headers = {}, _defineProperty(_headers,

    _http["default"].constants.HTTP2_HEADER_METHOD, _http["default"].constants.HTTP2_METHOD_POST), _defineProperty(_headers,

    'content-type', 'application/vnd.amazon.eventstream'), _defineProperty(_headers,
    'x-amz-target', 'com.amazonaws.transcribe.Transcribe.StartStreamTranscription'), _defineProperty(_headers,
    'x-amz-content-sha256', 'STREAMING-AWS4-HMAC-SHA356-EVENTS'), _defineProperty(_headers,
    'x-amz-transcribe-language-code', 'en-GB'), _defineProperty(_headers,
    'x-amz-transcribe-sample-rate', 44100), _headers) };




  var urlObj = _aws["default"].sign(params);
  console.log(urlObj.headers.Authorization);
  console.log(urlObj.headers['X-Amz-Date']);
  var client = _http["default"].connect('https://transcribestreaming.eu-west-1.amazonaws.com');

  client.on('error', function (err) {
    console.error(err);
  });

  delete urlObj.headers.Host;

  var req = client.request(urlObj.headers);

  req.setEncoding('utf8');

  req.on('data', function (chunk) {
    console.log('DATA RECEIVED');
    console.log(chunk);
  });

  return req;
}

function WebBot(configuration) {
  var s3 = new _awsSdk.S3();
  var transcribeService = new _awsSdk.TranscribeService();
  var uploadS3 = autoRetry(s3.upload, s3);
  var startTranscriptionJob = autoRetry(transcribeService.startTranscriptionJob, transcribeService);
  var getTranscriptionJob = autoRetry(transcribeService.getTranscriptionJob, transcribeService);
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

  controller.openSocketServer = function (server) {var wsconfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { port: 3001 };

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

      ws.on('message', /*#__PURE__*/function () {var _incoming = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(message) {var url, alert;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!
                  Buffer.isBuffer(message)) {_context.next = 7;break;}_context.next = 3;return (
                    transcribe(message));case 3:url = _context.sent;
                  console.log('Transcription URL:');
                  console.log(url);return _context.abrupt("return");case 7:if (!(


                  message === 'ping')) {_context.next = 9;break;}return _context.abrupt("return",
                  ws.send(JSON.stringify({ type: 'heartbeat', event: 'pong' })));case 9:

                  try {
                    message = JSON.parse(message);
                    controller.ingest(bot, message, ws);
                  } catch (e) {
                    alert = ["Error parsing incoming message from websocket.", "Message must be JSON, and should be in the format documented here:", "https://botkit.ai/docs/readme-web.html#message-objects"];




                    error(alert.join('\n'));
                    error(e);
                  }case 10:case "end":return _context.stop();}}}, _callee);}));function incoming(_x) {return _incoming.apply(this, arguments);}return incoming;}());


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
  };function

  transcribe(_x2) {return _transcribe.apply(this, arguments);}function _transcribe() {_transcribe = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(buffer) {var key, transcriptUri;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:if (
              process.env.AWS_SECRET_ACCESS_KEY) {_context4.next = 2;break;}return _context4.abrupt("return");case 2:_context4.next = 4;return (


                uploadMp3(buffer));case 4:key = _context4.sent;_context4.next = 7;return (
                getTranscript(key));case 7:transcriptUri = _context4.sent;
              console.log(transcriptUri);return _context4.abrupt("return",
              transcriptUri);case 10:case "end":return _context4.stop();}}}, _callee4);}));return _transcribe.apply(this, arguments);}function


  uploadMp3(_x3) {return _uploadMp.apply(this, arguments);}function _uploadMp() {_uploadMp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(buffer) {var params, _ref7, Key;return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
              params = {
                Bucket: process.env.S3_BUCKET_NAME || 'basebot',
                Body: buffer,
                ContentType: 'audio/mp3',
                Key: (0, _v["default"])() + '.mp3' };_context5.prev = 1;_context5.next = 4;return (


                uploadS3(params));case 4:_ref7 = _context5.sent;Key = _ref7.Key;return _context5.abrupt("return",
              Key);case 9:_context5.prev = 9;_context5.t0 = _context5["catch"](1);

              error(_context5.t0);case 12:case "end":return _context5.stop();}}}, _callee5, null, [[1, 9]]);}));return _uploadMp.apply(this, arguments);}function



  getTranscript(_x4) {return _getTranscript.apply(this, arguments);}function _getTranscript() {_getTranscript = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(key) {var region, bucket, params, transcript;return regeneratorRuntime.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
              region = process.env.AWS_REGION || 'eu-west-1';
              bucket = process.env.S3_BUCKET_NAME || 'basebot';
              console.log("https://s3-".concat(region, ".amazonaws.com/").concat(bucket, "/").concat(key));
              params = {
                LanguageCode: 'en-GB',
                Media: {
                  MediaFileUri: "https://".concat(bucket, ".s3-").concat(region, ".amazonaws.com/").concat(key) },

                MediaFormat: 'wav',
                TranscriptionJobName: key };_context6.prev = 4;_context6.next = 7;return (


                startTranscriptionJob(params));case 7:_context6.next = 9;return (
                pollTranscription(key));case 9:transcript = _context6.sent;return _context6.abrupt("return",
              transcript);case 13:_context6.prev = 13;_context6.t0 = _context6["catch"](4);

              error(_context6.t0);case 16:case "end":return _context6.stop();}}}, _callee6, null, [[4, 13]]);}));return _getTranscript.apply(this, arguments);}function




  pollTranscription(_x5) {return _pollTranscription.apply(this, arguments);}function _pollTranscription() {_pollTranscription = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(TranscriptionJobName) {var _ref8, TranscriptionJob;return regeneratorRuntime.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:_context7.next = 2;return (
                delay());case 2:
              debug('polling transcription...');_context7.next = 5;return (
                getTranscriptionJob({ TranscriptionJobName: TranscriptionJobName }));case 5:_ref8 = _context7.sent;TranscriptionJob = _ref8.TranscriptionJob;if (!(
              TranscriptionJob.TranscriptionJobStatus === 'FAILED')) {_context7.next = 9;break;}throw (
                new Error(TranscriptionJob.FailureReason));case 9:if (!(

              TranscriptionJob.TranscriptionJobStatus === 'COMPLETED')) {_context7.next = 11;break;}return _context7.abrupt("return",
              TranscriptionJob.Transcript.TranscriptFileUri);case 11:_context7.next = 13;return (

                pollTranscription(TranscriptionJobName));case 13:return _context7.abrupt("return", _context7.sent);case 14:case "end":return _context7.stop();}}}, _callee7);}));return _pollTranscription.apply(this, arguments);}


  function delay() {var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
    return new Promise(function (resolve) {return setTimeout(resolve, interval);});
  }


  function autoRetry(fn, parent) {
    return (/*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {var _len,args,_key,attempt,_args3 = arguments;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:for (_len = _args3.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = _args3[_key];}
                attempt = /*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {var attempts,res,_args2 = arguments;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:attempts = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 0;if (!(
                            attempts > 5)) {_context2.next = 5;break;}throw (
                              'Something went wrong, please try again');case 5:_context2.prev = 5;_context2.next = 8;return (


                              (0, _util.promisify)(fn.bind(parent)).apply(null, args));case 8:res = _context2.sent;return _context2.abrupt("return",
                            res);case 12:_context2.prev = 12;_context2.t0 = _context2["catch"](5);if (!

                            _context2.t0.toString().includes('LimitExceededException')) {_context2.next = 19;break;}
                            debug('Rate limit hit, retrying in 5 seconds...');_context2.next = 18;return (
                              delay(5000));case 18:return _context2.abrupt("return",
                            attempt(attempts + 1));case 19:throw _context2.t0;case 20:case "end":return _context2.stop();}}}, _callee2, null, [[5, 12]]);}));return function attempt() {return _ref2.apply(this, arguments);};}();_context3.next = 4;return (





                  attempt());case 4:return _context3.abrupt("return", _context3.sent);case 5:case "end":return _context3.stop();}}}, _callee3);})));

  }


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

    bot.typingDelay = function (_ref3) {var typingDelay = _ref3.typingDelay,text = _ref3.text;return new Promise(function (resolve) {
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

    bot.replyWithTyping = function (_ref4, resp, cb) {var user = _ref4.user,channel = _ref4.channel;
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

    bot.findConversation = function (_ref5, cb) {var user = _ref5.user,channel = _ref5.channel,type = _ref5.type;
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

  controller.handleWebhookPayload = function (_ref6, res) {var body = _ref6.body;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbImNvbm5lY3RUcmFuc2NyaWJlIiwicGFyYW1zIiwic2VydmljZSIsInJlZ2lvbiIsIm1ldGhvZCIsInBhdGgiLCJoZWFkZXJzIiwiaHR0cDIiLCJjb25zdGFudHMiLCJIVFRQMl9IRUFERVJfTUVUSE9EIiwiSFRUUDJfTUVUSE9EX1BPU1QiLCJ1cmxPYmoiLCJhd3M0Iiwic2lnbiIsImNvbnNvbGUiLCJsb2ciLCJBdXRob3JpemF0aW9uIiwiY2xpZW50IiwiY29ubmVjdCIsIm9uIiwiZXJyIiwiZXJyb3IiLCJIb3N0IiwicmVxIiwicmVxdWVzdCIsInNldEVuY29kaW5nIiwiY2h1bmsiLCJXZWJCb3QiLCJjb25maWd1cmF0aW9uIiwiczMiLCJTMyIsInRyYW5zY3JpYmVTZXJ2aWNlIiwiVHJhbnNjcmliZVNlcnZpY2UiLCJ1cGxvYWRTMyIsImF1dG9SZXRyeSIsInVwbG9hZCIsInN0YXJ0VHJhbnNjcmlwdGlvbkpvYiIsImdldFRyYW5zY3JpcHRpb25Kb2IiLCJjb250cm9sbGVyIiwibG9nZ2VyIiwiZGVidWciLCJjb25maWciLCJ0eXBpbmdEZWxheUZhY3RvciIsInVuZGVmaW5lZCIsImV4Y2x1ZGVGcm9tQ29udmVyc2F0aW9ucyIsIm9wZW5Tb2NrZXRTZXJ2ZXIiLCJzZXJ2ZXIiLCJ3c2NvbmZpZyIsInBvcnQiLCJ3c3MiLCJXZWJTb2NrZXQiLCJTZXJ2ZXIiLCJjbGllbnRUcmFja2luZyIsIm5vb3AiLCJoZWFydGJlYXQiLCJpc0FsaXZlIiwiY29ubmVjdGlvbiIsIndzIiwiYm90Iiwic3Bhd24iLCJjb25uZWN0ZWQiLCJiaW5kIiwibWVzc2FnZSIsIkJ1ZmZlciIsImlzQnVmZmVyIiwidHJhbnNjcmliZSIsInVybCIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwidHlwZSIsImV2ZW50IiwicGFyc2UiLCJpbmdlc3QiLCJlIiwiYWxlcnQiLCJqb2luIiwiaW5jb21pbmciLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwiY2xpZW50cyIsImZvckVhY2giLCJlYWNoIiwidGVybWluYXRlIiwicGluZyIsImJ1ZmZlciIsInByb2Nlc3MiLCJlbnYiLCJBV1NfU0VDUkVUX0FDQ0VTU19LRVkiLCJ1cGxvYWRNcDMiLCJrZXkiLCJnZXRUcmFuc2NyaXB0IiwidHJhbnNjcmlwdFVyaSIsIkJ1Y2tldCIsIlMzX0JVQ0tFVF9OQU1FIiwiQm9keSIsIkNvbnRlbnRUeXBlIiwiS2V5IiwiQVdTX1JFR0lPTiIsImJ1Y2tldCIsIkxhbmd1YWdlQ29kZSIsIk1lZGlhIiwiTWVkaWFGaWxlVXJpIiwiTWVkaWFGb3JtYXQiLCJUcmFuc2NyaXB0aW9uSm9iTmFtZSIsInBvbGxUcmFuc2NyaXB0aW9uIiwidHJhbnNjcmlwdCIsImRlbGF5IiwiVHJhbnNjcmlwdGlvbkpvYiIsIlRyYW5zY3JpcHRpb25Kb2JTdGF0dXMiLCJFcnJvciIsIkZhaWx1cmVSZWFzb24iLCJUcmFuc2NyaXB0IiwiVHJhbnNjcmlwdEZpbGVVcmkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiLCJmbiIsInBhcmVudCIsImFyZ3MiLCJhdHRlbXB0IiwiYXR0ZW1wdHMiLCJhcHBseSIsInJlcyIsInRvU3RyaW5nIiwiaW5jbHVkZXMiLCJtaWRkbGV3YXJlIiwidXNlIiwicmVwbHlfY2hhbm5lbCIsIm5leHQiLCJodHRwX3Jlc3BvbnNlIiwiZmluZENvbnZlcnNhdGlvbiIsInVzZXIiLCJjaGFubmVsIiwiY29udm8iLCJ0YXNrIiwiY2F0ZWdvcml6ZSIsImZvcm1hdCIsInBsYXRmb3JtX21lc3NhZ2UiLCJkZWZpbmVCb3QiLCJib3RraXQiLCJ1dHRlcmFuY2VzIiwic3RhcnRDb252ZXJzYXRpb24iLCJjYiIsImNyZWF0ZUNvbnZlcnNhdGlvbiIsInJlYWR5U3RhdGUiLCJPUEVOIiwianNvbiIsInN0YXJ0VHlwaW5nIiwidHlwaW5nRGVsYXkiLCJ0ZXh0IiwidHlwaW5nTGVuZ3RoIiwidGV4dExlbmd0aCIsImxlbmd0aCIsImF2Z1dQTSIsImF2Z0NQTSIsIk1hdGgiLCJtaW4iLCJmbG9vciIsInJlcGx5V2l0aFR5cGluZyIsInJlc3AiLCJ0aGVuIiwidG8iLCJzYXkiLCJyZXBseSIsInNyYyIsInR5cGluZyIsInQiLCJ0YXNrcyIsImMiLCJjb252b3MiLCJpc0FjdGl2ZSIsInNvdXJjZV9tZXNzYWdlIiwiZXhjbHVkZWRFdmVudHMiLCJnZXRJbnN0YW5jZUluZm8iLCJpbnN0YW5jZSIsImlkZW50aXR5IiwidGVhbSIsIm5hbWUiLCJpZCIsInJvb3RfdXJsIiwiZ2V0TWVzc2FnZVVzZXIiLCJzdG9yYWdlIiwidXNlcnMiLCJnZXQiLCJhdHRyaWJ1dGVzIiwicHJvZmlsZSIsInVzZXJuYW1lIiwiZmlyc3RfbmFtZSIsImxhc3RfbmFtZSIsImZ1bGxfbmFtZSIsImVtYWlsIiwiZ2VuZGVyIiwidGltZXpvbmVfb2Zmc2V0IiwidGltZXpvbmUiLCJoYW5kbGVXZWJob29rUGF5bG9hZCIsImJvZHkiLCJwYXlsb2FkIiwic2V0VHlwaW5nRGVsYXlGYWN0b3IiLCJkZWxheUZhY3RvciIsInNldFRpY2tEZWxheSJdLCJtYXBwaW5ncyI6InVHQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDOztBQUVBLFNBQVNBLGlCQUFULEdBQTZCO0FBQzNCLE1BQU1DLE1BQU0sR0FBRztBQUNiQyxJQUFBQSxPQUFPLEVBQUUsWUFESTtBQUViQyxJQUFBQSxNQUFNLEVBQUUsV0FGSztBQUdiQyxJQUFBQSxNQUFNLEVBQUUsTUFISztBQUliQyxJQUFBQSxJQUFJLEVBQUUsdUJBSk87QUFLYkMsSUFBQUEsT0FBTzs7QUFFSkMscUJBQU1DLFNBQU4sQ0FBZ0JDLG1CQUZaLEVBRWtDRixpQkFBTUMsU0FBTixDQUFnQkUsaUJBRmxEOztBQUlMLGtCQUpLLEVBSVcsb0NBSlg7QUFLTCxrQkFMSyxFQUtXLDhEQUxYO0FBTUwsMEJBTkssRUFNbUIsbUNBTm5CO0FBT0wsb0NBUEssRUFPNkIsT0FQN0I7QUFRTCxrQ0FSSyxFQVEyQixLQVIzQixZQUxNLEVBQWY7Ozs7O0FBa0JB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U0FBT2xLLFVBQVA7QUFDRCxDOztBQUVjWCxNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCdcbmltcG9ydCBCb3RraXQgZnJvbSAnYm90a2l0L2xpYi9Db3JlQm90J1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZC92MSdcbmltcG9ydCBodHRwMiBmcm9tICdodHRwMidcbmltcG9ydCBhd3M0IGZyb20gJ2F3czQnXG5pbXBvcnQgV2ViU29ja2V0IGZyb20gJ3dzJztcbmltcG9ydCB7IFMzLCBUcmFuc2NyaWJlU2VydmljZSB9IGZyb20gJ2F3cy1zZGsnXG5cbmZ1bmN0aW9uIGNvbm5lY3RUcmFuc2NyaWJlKCkge1xuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgc2VydmljZTogJ3RyYW5zY3JpYmUnLFxuICAgIHJlZ2lvbjogJ2V1LXdlc3QtMScsXG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgcGF0aDogJy9zdHJlYW0tdHJhbnNjcmlwdGlvbicsXG4gICAgaGVhZGVyczoge1xuICAgICAgLy8gW2h0dHAyLmNvbnN0YW50cy5IVFRQMl9IRUFERVJfU0NIRU1FXTogXCJodHRwc1wiLFxuICAgICAgW2h0dHAyLmNvbnN0YW50cy5IVFRQMl9IRUFERVJfTUVUSE9EXTogaHR0cDIuY29uc3RhbnRzLkhUVFAyX01FVEhPRF9QT1NULFxuICAgICAgLy8gW2h0dHAyLmNvbnN0YW50cy5IVFRQMl9IRUFERVJfUEFUSF06ICcvc3RyZWFtLXRyYW5zY3JpcHRpb24nLFxuICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi92bmQuYW1hem9uLmV2ZW50c3RyZWFtJyxcbiAgICAgICd4LWFtei10YXJnZXQnOiAnY29tLmFtYXpvbmF3cy50cmFuc2NyaWJlLlRyYW5zY3JpYmUuU3RhcnRTdHJlYW1UcmFuc2NyaXB0aW9uJyxcbiAgICAgICd4LWFtei1jb250ZW50LXNoYTI1Nic6ICdTVFJFQU1JTkctQVdTNC1ITUFDLVNIQTM1Ni1FVkVOVFMnLFxuICAgICAgJ3gtYW16LXRyYW5zY3JpYmUtbGFuZ3VhZ2UtY29kZSc6ICdlbi1HQicsXG4gICAgICAneC1hbXotdHJhbnNjcmliZS1zYW1wbGUtcmF0ZSc6IDQ0MTAwXG4gICAgfVxuICB9XG5cblxuICBjb25zdCB1cmxPYmogPSBhd3M0LnNpZ24ocGFyYW1zKVxuICBjb25zb2xlLmxvZyh1cmxPYmouaGVhZGVycy5BdXRob3JpemF0aW9uKVxuICBjb25zb2xlLmxvZyh1cmxPYmouaGVhZGVyc1snWC1BbXotRGF0ZSddKVxuICBjb25zdCBjbGllbnQgPSBodHRwMi5jb25uZWN0KCdodHRwczovL3RyYW5zY3JpYmVzdHJlYW1pbmcuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb20nKVxuXG4gIGNsaWVudC5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICB9KVxuXG4gIGRlbGV0ZSB1cmxPYmouaGVhZGVycy5Ib3N0XG5cbiAgY29uc3QgcmVxID0gY2xpZW50LnJlcXVlc3QodXJsT2JqLmhlYWRlcnMpXG5cbiAgcmVxLnNldEVuY29kaW5nKCd1dGY4JylcblxuICByZXEub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgY29uc29sZS5sb2coJ0RBVEEgUkVDRUlWRUQnKVxuICAgIGNvbnNvbGUubG9nKGNodW5rKVxuICB9KVxuXG4gIHJldHVybiByZXFcbn1cblxuZnVuY3Rpb24gV2ViQm90KGNvbmZpZ3VyYXRpb24pIHtcbiAgY29uc3QgczMgPSBuZXcgUzMoKVxuICBjb25zdCB0cmFuc2NyaWJlU2VydmljZSA9IG5ldyBUcmFuc2NyaWJlU2VydmljZSgpXG4gIGNvbnN0IHVwbG9hZFMzID0gYXV0b1JldHJ5KHMzLnVwbG9hZCwgczMpXG4gIGNvbnN0IHN0YXJ0VHJhbnNjcmlwdGlvbkpvYiA9IGF1dG9SZXRyeSh0cmFuc2NyaWJlU2VydmljZS5zdGFydFRyYW5zY3JpcHRpb25Kb2IsIHRyYW5zY3JpYmVTZXJ2aWNlKVxuICBjb25zdCBnZXRUcmFuc2NyaXB0aW9uSm9iID0gYXV0b1JldHJ5KHRyYW5zY3JpYmVTZXJ2aWNlLmdldFRyYW5zY3JpcHRpb25Kb2IsIHRyYW5zY3JpYmVTZXJ2aWNlKVxuICBjb25zdCBjb250cm9sbGVyID0gQm90a2l0KGNvbmZpZ3VyYXRpb24gfHwge30pO1xuICBjb25zdCBlcnJvciA9IGNvbmZpZ3VyYXRpb24ubG9nZ2VyXG4gICAgPyBjb25maWd1cmF0aW9uLmxvZ2dlcignY29udHJvbGxlcjp3ZWInLCAnZXJyb3InKVxuICAgIDogY29uc29sZS5lcnJvclxuICBjb25zdCBkZWJ1ZyA9IGNvbmZpZ3VyYXRpb24ubG9nZ2VyXG4gICAgPyBjb25maWd1cmF0aW9uLmxvZ2dlcignY29udHJvbGxlcjp3ZWInLCAnZGVidWcnKVxuICAgIDogY29uc29sZS5sb2dcblxuICBpZiAoY29udHJvbGxlci5jb25maWcudHlwaW5nRGVsYXlGYWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnRyb2xsZXIuY29uZmlnLnR5cGluZ0RlbGF5RmFjdG9yID0gMVxuICB9XG5cbiAgY29udHJvbGxlci5leGNsdWRlRnJvbUNvbnZlcnNhdGlvbnMoWydoZWxsbycsICd3ZWxjb21lX2JhY2snLCAncmVjb25uZWN0J10pXG5cbiAgY29udHJvbGxlci5vcGVuU29ja2V0U2VydmVyID0gKHNlcnZlciwgd3Njb25maWcgPSB7IHBvcnQ6IDMwMDEgfSkgPT4ge1xuXG4gICAgLy8gY3JlYXRlIHRoZSBzb2NrZXQgc2VydmVyIGFsb25nIHNpZGUgdGhlIGV4aXN0aW5nIHdlYnNlcnZlci5cbiAgICBjb25zdCB3c3MgPSBuZXcgV2ViU29ja2V0LlNlcnZlcih7XG4gICAgICBzZXJ2ZXIsXG4gICAgICAuLi53c2NvbmZpZyxcbiAgICAgIGNsaWVudFRyYWNraW5nOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gRXhwb3NlIHRoZSB3ZWIgc29ja2V0IHNlcnZlciBvYmplY3QgdG8gdGhlIGNvbnRyb2xsZXIgc28gaXQgY2FuIGJlIHVzZWQgbGF0ZXIuXG4gICAgY29udHJvbGxlci53c3MgPSB3c3NcblxuICAgIGZ1bmN0aW9uIG5vb3AoKSB7IH1cblxuICAgIGZ1bmN0aW9uIGhlYXJ0YmVhdCgpIHtcbiAgICAgIHRoaXMuaXNBbGl2ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgd3NzLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24gY29ubmVjdGlvbih3cykge1xuICAgICAgLy8gc2VhcmNoIHRocm91Z2ggYWxsIHRoZSBjb252b3MsIGlmIGEgYm90IG1hdGNoZXMsIHVwZGF0ZSBpdHMgd3NcbiAgICAgIGNvbnN0IGJvdCA9IGNvbnRyb2xsZXIuc3Bhd24oKTtcbiAgICAgIGJvdC53cyA9IHdzXG4gICAgICBib3QuY29ubmVjdGVkID0gdHJ1ZVxuICAgICAgd3MuaXNBbGl2ZSA9IHRydWU7XG4gICAgICB3cy5vbigncG9uZycsIGhlYXJ0YmVhdC5iaW5kKHdzKSk7XG5cbiAgICAgIHdzLm9uKCdtZXNzYWdlJywgYXN5bmMgZnVuY3Rpb24gaW5jb21pbmcobWVzc2FnZSkge1xuICAgICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKG1lc3NhZ2UpKSB7XG4gICAgICAgICAgY29uc3QgdXJsID0gYXdhaXQgdHJhbnNjcmliZShtZXNzYWdlKVxuICAgICAgICAgIGNvbnNvbGUubG9nKCdUcmFuc2NyaXB0aW9uIFVSTDonKVxuICAgICAgICAgIGNvbnNvbGUubG9nKHVybClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAobWVzc2FnZSA9PT0gJ3BpbmcnKSB7XG4gICAgICAgICAgcmV0dXJuIHdzLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiAnaGVhcnRiZWF0JywgZXZlbnQ6ICdwb25nJyB9KSlcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBtZXNzYWdlID0gSlNPTi5wYXJzZShtZXNzYWdlKVxuICAgICAgICAgIGNvbnRyb2xsZXIuaW5nZXN0KGJvdCwgbWVzc2FnZSwgd3MpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zdCBhbGVydCA9IFtcbiAgICAgICAgICAgIGBFcnJvciBwYXJzaW5nIGluY29taW5nIG1lc3NhZ2UgZnJvbSB3ZWJzb2NrZXQuYCxcbiAgICAgICAgICAgIGBNZXNzYWdlIG11c3QgYmUgSlNPTiwgYW5kIHNob3VsZCBiZSBpbiB0aGUgZm9ybWF0IGRvY3VtZW50ZWQgaGVyZTpgLFxuICAgICAgICAgICAgYGh0dHBzOi8vYm90a2l0LmFpL2RvY3MvcmVhZG1lLXdlYi5odG1sI21lc3NhZ2Utb2JqZWN0c2BcbiAgICAgICAgICBdO1xuICAgICAgICAgIGVycm9yKGFsZXJ0LmpvaW4oJ1xcbicpKVxuICAgICAgICAgIGVycm9yKGUpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHdzLm9uKCdlcnJvcicsIChlcnIpID0+IGVycm9yKCdXZWJzb2NrZXQgRXJyb3I6ICcsIGVycikpXG5cbiAgICAgIHdzLm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgICAgYm90LmNvbm5lY3RlZCA9IGZhbHNlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHdzcy5jbGllbnRzLmZvckVhY2goZnVuY3Rpb24gZWFjaCh3cykge1xuICAgICAgICBpZiAod3MuaXNBbGl2ZSA9PT0gZmFsc2UpIHJldHVybiB3cy50ZXJtaW5hdGUoKTtcblxuICAgICAgICB3cy5pc0FsaXZlID0gZmFsc2U7XG4gICAgICAgIHdzLnBpbmcobm9vcCk7XG4gICAgICB9KTtcbiAgICB9LCAzMDAwMCk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiB0cmFuc2NyaWJlKGJ1ZmZlcikge1xuICAgIGlmICghcHJvY2Vzcy5lbnYuQVdTX1NFQ1JFVF9BQ0NFU1NfS0VZKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3Qga2V5ID0gYXdhaXQgdXBsb2FkTXAzKGJ1ZmZlcilcbiAgICBjb25zdCB0cmFuc2NyaXB0VXJpID0gYXdhaXQgZ2V0VHJhbnNjcmlwdChrZXkpXG4gICAgY29uc29sZS5sb2codHJhbnNjcmlwdFVyaSlcbiAgICByZXR1cm4gdHJhbnNjcmlwdFVyaVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gdXBsb2FkTXAzKGJ1ZmZlcikge1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIEJ1Y2tldDogcHJvY2Vzcy5lbnYuUzNfQlVDS0VUX05BTUUgfHwgJ2Jhc2Vib3QnLFxuICAgICAgQm9keTogYnVmZmVyLFxuICAgICAgQ29udGVudFR5cGU6ICdhdWRpby9tcDMnLFxuICAgICAgS2V5OiB1dWlkKCkgKyAnLm1wMydcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgS2V5IH0gPSBhd2FpdCB1cGxvYWRTMyhwYXJhbXMpXG4gICAgICByZXR1cm4gS2V5XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBlcnJvcihlcnIpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gZ2V0VHJhbnNjcmlwdChrZXkpIHtcbiAgICBjb25zdCByZWdpb24gPSBwcm9jZXNzLmVudi5BV1NfUkVHSU9OIHx8ICdldS13ZXN0LTEnXG4gICAgY29uc3QgYnVja2V0ID0gcHJvY2Vzcy5lbnYuUzNfQlVDS0VUX05BTUUgfHwgJ2Jhc2Vib3QnXG4gICAgY29uc29sZS5sb2coYGh0dHBzOi8vczMtJHtyZWdpb259LmFtYXpvbmF3cy5jb20vJHtidWNrZXR9LyR7a2V5fWApXG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgTGFuZ3VhZ2VDb2RlOiAnZW4tR0InLFxuICAgICAgTWVkaWE6IHtcbiAgICAgICAgTWVkaWFGaWxlVXJpOiBgaHR0cHM6Ly8ke2J1Y2tldH0uczMtJHtyZWdpb259LmFtYXpvbmF3cy5jb20vJHtrZXl9YFxuICAgICAgfSxcbiAgICAgIE1lZGlhRm9ybWF0OiAnd2F2JyxcbiAgICAgIFRyYW5zY3JpcHRpb25Kb2JOYW1lOiBrZXlcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHN0YXJ0VHJhbnNjcmlwdGlvbkpvYihwYXJhbXMpXG4gICAgICBjb25zdCB0cmFuc2NyaXB0ID0gYXdhaXQgcG9sbFRyYW5zY3JpcHRpb24oa2V5KVxuICAgICAgcmV0dXJuIHRyYW5zY3JpcHRcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGVycm9yKGVycilcbiAgICB9XG4gIH1cblxuXG4gIGFzeW5jIGZ1bmN0aW9uIHBvbGxUcmFuc2NyaXB0aW9uKFRyYW5zY3JpcHRpb25Kb2JOYW1lKSB7XG4gICAgYXdhaXQgZGVsYXkoKVxuICAgIGRlYnVnKCdwb2xsaW5nIHRyYW5zY3JpcHRpb24uLi4nKVxuICAgIGNvbnN0IHsgVHJhbnNjcmlwdGlvbkpvYiB9ID0gYXdhaXQgZ2V0VHJhbnNjcmlwdGlvbkpvYih7IFRyYW5zY3JpcHRpb25Kb2JOYW1lIH0pXG4gICAgaWYgKFRyYW5zY3JpcHRpb25Kb2IuVHJhbnNjcmlwdGlvbkpvYlN0YXR1cyA9PT0gJ0ZBSUxFRCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihUcmFuc2NyaXB0aW9uSm9iLkZhaWx1cmVSZWFzb24pXG4gICAgfVxuICAgIGlmIChUcmFuc2NyaXB0aW9uSm9iLlRyYW5zY3JpcHRpb25Kb2JTdGF0dXMgPT09ICdDT01QTEVURUQnKSB7XG4gICAgICByZXR1cm4gVHJhbnNjcmlwdGlvbkpvYi5UcmFuc2NyaXB0LlRyYW5zY3JpcHRGaWxlVXJpXG4gICAgfVxuICAgIHJldHVybiBhd2FpdCBwb2xsVHJhbnNjcmlwdGlvbihUcmFuc2NyaXB0aW9uSm9iTmFtZSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlbGF5KGludGVydmFsID0gMTAwMCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgaW50ZXJ2YWwpKVxuICB9XG5cblxuICBmdW5jdGlvbiBhdXRvUmV0cnkoZm4sIHBhcmVudCkge1xuICAgIHJldHVybiBhc3luYyBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgY29uc3QgYXR0ZW1wdCA9IGFzeW5jIChhdHRlbXB0cyA9IDApID0+IHtcbiAgICAgICAgaWYgKGF0dGVtcHRzID4gNSkge1xuICAgICAgICAgIHRocm93ICdTb21ldGhpbmcgd2VudCB3cm9uZywgcGxlYXNlIHRyeSBhZ2FpbidcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgcHJvbWlzaWZ5KGZuLmJpbmQocGFyZW50KSkuYXBwbHkobnVsbCwgYXJncylcbiAgICAgICAgICAgIHJldHVybiByZXNcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIudG9TdHJpbmcoKS5pbmNsdWRlcygnTGltaXRFeGNlZWRlZEV4Y2VwdGlvbicpKSB7XG4gICAgICAgICAgICAgIGRlYnVnKCdSYXRlIGxpbWl0IGhpdCwgcmV0cnlpbmcgaW4gNSBzZWNvbmRzLi4uJylcbiAgICAgICAgICAgICAgYXdhaXQgZGVsYXkoNTAwMClcbiAgICAgICAgICAgICAgcmV0dXJuIGF0dGVtcHQoYXR0ZW1wdHMgKyAxKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYXdhaXQgYXR0ZW1wdCgpXG4gICAgfVxuICB9XG5cblxuICBjb250cm9sbGVyLm1pZGRsZXdhcmUuaW5nZXN0LnVzZSgoYm90LCBtZXNzYWdlLCByZXBseV9jaGFubmVsLCBuZXh0KSA9PiB7XG5cbiAgICAvKlxuICAgICAqIHRoaXMgY291bGQgYmUgYSBtZXNzYWdlIGZyb20gdGhlIFdlYlNvY2tldFxuICAgICAqIG9yIGl0IG1pZ2h0IGJlIGNvbWluZyBmcm9tIGEgd2ViaG9vay5cbiAgICAgKiBjb25maWd1cmUgdGhlIGJvdCBhcHByb3ByaWF0ZWx5IHNvIHRoZSByZXBseSBnb2VzIHRvIHRoZSByaWdodCBwbGFjZSFcbiAgICAgKi9cbiAgICBpZiAoIWJvdC53cykge1xuICAgICAgYm90Lmh0dHBfcmVzcG9uc2UgPSByZXBseV9jaGFubmVsXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBsb29rIGZvciBhbiBleGlzdGluZyBjb252ZXJzYXRpb24gZm9yIHRoaXMgdXNlci9jaGFubmVsIGNvbWJvXG4gICAgICogd2h5IG5vdCBqdXN0IHBhc3MgaW4gbWVzc2FnZT8gYmVjYXVzZSB3ZSBvbmx5IGNhcmUgaWYgdGhlcmUgaXMgYSBjb252ZXJzYXRpb24gIG9uZ29pbmdcbiAgICAgKiBhbmQgd2UgbWlnaHQgYmUgZGVhbGluZyB3aXRoIFwic2lsZW50XCIgbWVzc2FnZSB0aGF0IHdvdWxkIG5vdCBvdGhlcndpc2UgbWF0Y2ggYSBjb252ZXJzYXRpb25cbiAgICAgKi9cbiAgICBib3QuZmluZENvbnZlcnNhdGlvbih7XG4gICAgICB1c2VyOiBtZXNzYWdlLnVzZXIsXG4gICAgICBjaGFubmVsOiBtZXNzYWdlLmNoYW5uZWxcbiAgICB9LCBjb252byA9PiB7XG4gICAgICBpZiAoY29udm8pIHtcbiAgICAgICAgaWYgKGJvdC53cykge1xuICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIHdlYnNvY2tldCBjb25uZWN0aW9uXG4gICAgICAgICAgY29udm8udGFzay5ib3Qud3MgPSBib3Qud3NcbiAgICAgICAgICBjb252by50YXNrLmJvdC5jb25uZWN0ZWQgPSB0cnVlXG4gICAgICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PSAnaGVsbG8nIHx8IG1lc3NhZ2UudHlwZSA9PSAnd2VsY29tZV9iYWNrJykge1xuICAgICAgICAgICAgbWVzc2FnZS50eXBlID0gJ3JlY29ubmVjdCdcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAvKlxuICAgICAgICAgICAqIHJlcGxhY2UgdGhlIHJlcGx5IGNoYW5uZWwgaW4gdGhlIGFjdGl2ZSBjb252ZXJzYXRpb25cbiAgICAgICAgICAgKiB0aGlzIGlzIHRoZSBvbmUgdGhhdCBnZXRzIHVzZWQgdG8gc2VuZCB0aGUgYWN0dWFsIHJlcGx5XG4gICAgICAgICAgICovXG4gICAgICAgICAgY29udm8udGFzay5ib3QuaHR0cF9yZXNwb25zZSA9IGJvdC5odHRwX3Jlc3BvbnNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG5leHQoKVxuICAgIH0pXG4gIH0pXG5cbiAgY29udHJvbGxlci5taWRkbGV3YXJlLmNhdGVnb3JpemUudXNlKChib3QsIG1lc3NhZ2UsIG5leHQpID0+IHtcbiAgICBpZiAobWVzc2FnZS50eXBlID09ICdtZXNzYWdlJykge1xuICAgICAgbWVzc2FnZS50eXBlID0gJ21lc3NhZ2VfcmVjZWl2ZWQnXG4gICAgfVxuXG4gICAgbmV4dCgpXG4gIH0pXG5cbiAgLy8gc2ltcGxlIG1lc3NhZ2UgY2xvbmUgYmVjYXVzZSBpdHMgYWxyZWFkeSBpbiB0aGUgcmlnaHQgZm9ybWF0IVxuICBjb250cm9sbGVyLm1pZGRsZXdhcmUuZm9ybWF0LnVzZSgoYm90LCBtZXNzYWdlLCBwbGF0Zm9ybV9tZXNzYWdlLCBuZXh0KSA9PiB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gbWVzc2FnZSkge1xuICAgICAgcGxhdGZvcm1fbWVzc2FnZVtrZXldID0gbWVzc2FnZVtrZXldXG4gICAgfVxuICAgIGlmICghcGxhdGZvcm1fbWVzc2FnZS50eXBlKSB7XG4gICAgICBwbGF0Zm9ybV9tZXNzYWdlLnR5cGUgPSAnbWVzc2FnZSdcbiAgICB9XG4gICAgbmV4dCgpXG4gIH0pXG5cbiAgY29udHJvbGxlci5kZWZpbmVCb3QoKGJvdGtpdCwgY29uZmlnKSA9PiB7XG4gICAgY29uc3QgYm90ID0ge1xuICAgICAgdHlwZTogJ3NvY2tldCcsXG4gICAgICBib3RraXQsXG4gICAgICBjb25maWc6IGNvbmZpZyB8fCB7fSxcbiAgICAgIHV0dGVyYW5jZXM6IGJvdGtpdC51dHRlcmFuY2VzXG4gICAgfTtcblxuICAgIGJvdC5zdGFydENvbnZlcnNhdGlvbiA9IGZ1bmN0aW9uIChtZXNzYWdlLCBjYikge1xuICAgICAgYm90a2l0LnN0YXJ0Q29udmVyc2F0aW9uKHRoaXMsIG1lc3NhZ2UsIGNiKVxuICAgIH1cblxuICAgIGJvdC5jcmVhdGVDb252ZXJzYXRpb24gPSBmdW5jdGlvbiAobWVzc2FnZSwgY2IpIHtcbiAgICAgIGJvdGtpdC5jcmVhdGVDb252ZXJzYXRpb24odGhpcywgbWVzc2FnZSwgY2IpXG4gICAgfVxuXG4gICAgYm90LnNlbmQgPSAobWVzc2FnZSwgY2IpID0+IHtcbiAgICAgIGlmIChib3QuY29ubmVjdGVkIHx8ICFib3Qud3MpIHtcbiAgICAgICAgaWYgKGJvdC53cykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoYm90LndzICYmIGJvdC53cy5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICBib3Qud3Muc2VuZChKU09OLnN0cmluZ2lmeShtZXNzYWdlKSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIsIG1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXJyb3IoJ0Nhbm5vdCBzZW5kIG1lc3NhZ2UgdG8gY2xvc2VkIHNvY2tldCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2IoZXJyKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgYm90Lmh0dHBfcmVzcG9uc2UuanNvbihtZXNzYWdlKVxuICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgIGNiKG51bGwsIG1lc3NhZ2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKGVyciwgbWVzc2FnZSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVycm9yKCdFUlJPUiBTRU5ESU5HJywgZXJyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYm90LnNlbmQobWVzc2FnZSwgY2IpXG4gICAgICAgIH0sIDMwMDApXG4gICAgICB9XG4gICAgfVxuXG4gICAgYm90LnN0YXJ0VHlwaW5nID0gKCkgPT4ge1xuICAgICAgaWYgKGJvdC5jb25uZWN0ZWQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoYm90LndzICYmIGJvdC53cy5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgYm90LndzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICB0eXBlOiAndHlwaW5nJ1xuICAgICAgICAgICAgfSksIGVyciA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBlcnJvcihgc3RhcnRUeXBpbmcgZmFpbGVkOiAke2Vyci5tZXNzYWdlfWApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yKCdTb2NrZXQgY2xvc2VkISBDYW5ub3Qgc2VuZCBtZXNzYWdlJylcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGVycm9yKCdzdGFydFR5cGluZyBmYWlsZWQ6ICcsIGVycilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGJvdC50eXBpbmdEZWxheSA9ICh7IHR5cGluZ0RlbGF5LCB0ZXh0IH0pID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgbGV0IHR5cGluZ0xlbmd0aCA9IDA7XG4gICAgICBpZiAodHlwaW5nRGVsYXkpIHtcbiAgICAgICAgdHlwaW5nTGVuZ3RoID0gdHlwaW5nRGVsYXlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB0ZXh0TGVuZ3RoO1xuICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgIHRleHRMZW5ndGggPSB0ZXh0Lmxlbmd0aFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHRMZW5ndGggPSA4MCAvLyBkZWZhdWx0IGF0dGFjaG1lbnQgdGV4dCBsZW5ndGhcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGF2Z1dQTSA9IDE1MDtcbiAgICAgICAgY29uc3QgYXZnQ1BNID0gYXZnV1BNICogNztcblxuICAgICAgICB0eXBpbmdMZW5ndGggPSBNYXRoLm1pbihNYXRoLmZsb29yKHRleHRMZW5ndGggLyAoYXZnQ1BNIC8gNjApKSAqIDEwMDAsIDIwMDApICogY29udHJvbGxlci5jb25maWcudHlwaW5nRGVsYXlGYWN0b3JcbiAgICAgIH1cblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSwgdHlwaW5nTGVuZ3RoKVxuICAgIH0pXG5cbiAgICBib3QucmVwbHlXaXRoVHlwaW5nID0gKHsgdXNlciwgY2hhbm5lbCB9LCByZXNwLCBjYikgPT4ge1xuICAgICAgYm90LnN0YXJ0VHlwaW5nKClcbiAgICAgIGJvdC50eXBpbmdEZWxheShyZXNwKS50aGVuKCgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiAocmVzcCkgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICByZXNwID0ge1xuICAgICAgICAgICAgdGV4dDogcmVzcFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3AudXNlciA9IHVzZXJcbiAgICAgICAgcmVzcC5jaGFubmVsID0gY2hhbm5lbFxuICAgICAgICByZXNwLnRvID0gdXNlclxuXG4gICAgICAgIGJvdC5zYXkocmVzcCwgY2IpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGJvdC5yZXBseSA9IChzcmMsIHJlc3AsIGNiKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIChyZXNwKSA9PSAnc3RyaW5nJykge1xuICAgICAgICByZXNwID0ge1xuICAgICAgICAgIHRleHQ6IHJlc3BcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coXCJSRVNQT05TRSBJU1wiKVxuICAgICAgY29uc29sZS5sb2cocmVzcClcblxuICAgICAgcmVzcC51c2VyID0gc3JjLnVzZXJcbiAgICAgIHJlc3AuY2hhbm5lbCA9IHNyYy5jaGFubmVsXG4gICAgICByZXNwLnRvID0gc3JjLnVzZXJcblxuICAgICAgaWYgKHJlc3AudHlwaW5nIHx8IHJlc3AudHlwaW5nRGVsYXkgfHwgY29udHJvbGxlci5jb25maWcucmVwbHlXaXRoVHlwaW5nKSB7XG4gICAgICAgIGJvdC5yZXBseVdpdGhUeXBpbmcoc3JjLCByZXNwLCBjYilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvdC5zYXkocmVzcCwgY2IpXG4gICAgICB9XG4gICAgfVxuXG4gICAgYm90LmZpbmRDb252ZXJzYXRpb24gPSAoeyB1c2VyLCBjaGFubmVsLCB0eXBlIH0sIGNiKSA9PiB7XG4gICAgICBib3RraXQuZGVidWcoJ0NVU1RPTSBGSU5EIENPTlZPJywgdXNlciwgY2hhbm5lbClcbiAgICAgIGZvciAobGV0IHQgPSAwOyB0IDwgYm90a2l0LnRhc2tzLmxlbmd0aDsgdCsrKSB7XG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgYm90a2l0LnRhc2tzW3RdLmNvbnZvcy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGJvdGtpdC50YXNrc1t0XS5jb252b3NbY10uaXNBY3RpdmUoKSAmJlxuICAgICAgICAgICAgYm90a2l0LnRhc2tzW3RdLmNvbnZvc1tjXS5zb3VyY2VfbWVzc2FnZS51c2VyID09IHVzZXIgJiZcbiAgICAgICAgICAgICFib3RraXQuZXhjbHVkZWRFdmVudHMuaW5jbHVkZXModHlwZSkgLy8gdGhpcyB0eXBlIG9mIG1lc3NhZ2Ugc2hvdWxkIG5vdCBiZSBpbmNsdWRlZFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYm90a2l0LmRlYnVnKCdGT1VORCBFWElTVElORyBDT05WTyEnKVxuICAgICAgICAgICAgY2IoYm90a2l0LnRhc2tzW3RdLmNvbnZvc1tjXSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjYigpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiByZXR1cm4gaW5mbyBhYm91dCB0aGUgc3BlY2lmaWMgaW5zdGFuY2Ugb2YgdGhpcyBib3RcbiAgICAgKiBpbmNsdWRpbmcgaWRlbnRpdHkgaW5mb3JtYXRpb24sIGFuZCBhbnkgb3RoZXIgaW5mbyB0aGF0IGlzIHJlbGV2YW50XG4gICAgICovXG4gICAgYm90LmdldEluc3RhbmNlSW5mbyA9IGNiID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSB7XG4gICAgICAgIGlkZW50aXR5OiB7fSxcbiAgICAgICAgdGVhbToge31cbiAgICAgIH07XG5cbiAgICAgIGlmIChib3QuaWRlbnRpdHkpIHtcbiAgICAgICAgaW5zdGFuY2UuaWRlbnRpdHkubmFtZSA9IGJvdC5pZGVudGl0eS5uYW1lXG4gICAgICAgIGluc3RhbmNlLmlkZW50aXR5LmlkID0gYm90LmlkZW50aXR5LmlkXG5cbiAgICAgICAgaW5zdGFuY2UudGVhbS5uYW1lID0gYm90LmlkZW50aXR5Lm5hbWVcbiAgICAgICAgaW5zdGFuY2UudGVhbS51cmwgPSBib3QuaWRlbnRpdHkucm9vdF91cmxcbiAgICAgICAgaW5zdGFuY2UudGVhbS5pZCA9IGJvdC5pZGVudGl0eS5uYW1lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnN0YW5jZS5pZGVudGl0eS5uYW1lID0gJ0JvdGtpdCBXZWInXG4gICAgICAgIGluc3RhbmNlLmlkZW50aXR5LmlkID0gJ3dlYidcbiAgICAgIH1cblxuICAgICAgaWYgKGNiKSBjYihudWxsLCBpbnN0YW5jZSlcbiAgICAgIHJlc29sdmUoaW5zdGFuY2UpXG4gICAgfSlcblxuICAgIGJvdC5nZXRNZXNzYWdlVXNlciA9IChtZXNzYWdlLCBjYikgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAvLyBub3JtYWxpemUgdGhpcyBpbnRvIHdoYXQgYm90a2l0IHdhbnRzIHRvIHNlZVxuICAgICAgY29udHJvbGxlci5zdG9yYWdlLnVzZXJzLmdldChtZXNzYWdlLnVzZXIsIChlcnIsIHVzZXIpID0+IHtcbiAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgdXNlciA9IHtcbiAgICAgICAgICAgIGlkOiBtZXNzYWdlLnVzZXIsXG4gICAgICAgICAgICBuYW1lOiAnVW5rbm93bicsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb2ZpbGUgPSB7XG4gICAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgdXNlcm5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgICBmaXJzdF9uYW1lOiB1c2VyLmF0dHJpYnV0ZXMuZmlyc3RfbmFtZSB8fCAnJyxcbiAgICAgICAgICBsYXN0X25hbWU6IHVzZXIuYXR0cmlidXRlcy5sYXN0X25hbWUgfHwgJycsXG4gICAgICAgICAgZnVsbF9uYW1lOiB1c2VyLmF0dHJpYnV0ZXMuZnVsbF9uYW1lIHx8ICcnLFxuICAgICAgICAgIGVtYWlsOiB1c2VyLmF0dHJpYnV0ZXMuZW1haWwsIC8vIG1heSBiZSBibGFua1xuICAgICAgICAgIGdlbmRlcjogdXNlci5hdHRyaWJ1dGVzLmdlbmRlciwgLy8gbm8gc291cmNlIGZvciB0aGlzIGluZm9cbiAgICAgICAgICB0aW1lem9uZV9vZmZzZXQ6IHVzZXIuYXR0cmlidXRlcy50aW1lem9uZV9vZmZzZXQsXG4gICAgICAgICAgdGltZXpvbmU6IHVzZXIuYXR0cmlidXRlcy50aW1lem9uZVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChjYikge1xuICAgICAgICAgIGNiKG51bGwsIHByb2ZpbGUpXG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShwcm9maWxlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIGJvdFxuICB9KVxuXG4gIGNvbnRyb2xsZXIuaGFuZGxlV2ViaG9va1BheWxvYWQgPSAoeyBib2R5IH0sIHJlcykgPT4ge1xuICAgIGNvbnN0IHBheWxvYWQgPSBib2R5O1xuICAgIGNvbnRyb2xsZXIuaW5nZXN0KGNvbnRyb2xsZXIuc3Bhd24oe30pLCBwYXlsb2FkLCByZXMpXG4gIH1cblxuICAvLyBjaGFuZ2UgdGhlIHNwZWVkIG9mIHR5cGluZyBhIHJlcGx5IGluIGEgY29udmVyc2F0aW9uXG4gIGNvbnRyb2xsZXIuc2V0VHlwaW5nRGVsYXlGYWN0b3IgPSBkZWxheUZhY3RvciA9PiB7XG4gICAgY29udHJvbGxlci5jb25maWcudHlwaW5nRGVsYXlGYWN0b3IgPSBkZWxheUZhY3RvclxuICB9XG5cbiAgLy8gU3Vic3RhbnRpYWxseSBzaG9ydGVuIHRoZSBkZWxheSBmb3IgcHJvY2Vzc2luZyBtZXNzYWdlcyBpbiBjb252ZXJzYXRpb25zXG4gIGNvbnRyb2xsZXIuc2V0VGlja0RlbGF5KDEwKVxuXG4gIHJldHVybiBjb250cm9sbGVyXG59XG5cbmV4cG9ydCBkZWZhdWx0IFdlYkJvdDtcbiJdfQ==