"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _awsSdk = require("aws-sdk");function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

var lex = new _awsSdk.LexRuntime({
  region: process.env.AWS_REGION });var _default =


function _default(logger) {
  var error = logger('middleware:lex', 'error');
  var debug = logger('middleware:lex', 'debug');

  if (!process.env.AWS_REGION || !process.env.BOT_NAME) {
    error('AWS_REGION and BOT_NAME must be set');
  }

  return {
    receive: receive,
    heard: heard };


  function receive(bot, message, next) {
    if (!message.text) {
      next();
      return;
    }

    if (message.is_echo || message.type === 'self_message' || message.alexa) {
      next();
      return;
    }
    debug("userId: ".concat(message.user));
    var params = {
      botAlias: process.env.BOT_NAME || 'Basebot',
      botName: process.env.BOT_NAME || 'Basebot',
      inputText: message.text,
      // FIXME - alexa provides a UID with > 200 characters - this will be massively truncated as a result and could even lead to unintentional session hijacking
      userId: message.user && message.user.substr(0, 100),
      requestAttributes: message.requestAttributes,
      sessionAttributes: message.sessionAttributes };

    if (message.text) {
      var request = lex.postText(params, function (err, data) {
        if (err) {
          next(err);
        } else {
          message.lex = {
            intent: data.intentName,
            slots: data.slots,
            session: data.sessionAttributes,
            response: data.message,
            dialogState: data.dialogState,
            slotToElicit: data.slotToElicit };

          debug('response received from Lex:', message.lex);
          if (data.intentName) {
            message.intent === data.intentName;
          }
          next();
        }
      });
    } else {
      next();
    }
  }

  function heard(bot, message, next) {
    if (message.lex && message.lex.dialogState === 'Fulfilled' && message.lex.intentName !== null) {
      return bot.reply(message, _objectSpread({}, message.lex.response, { intentName: message.lex.intentName }));
    }
    next();
  }
};exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbImxleCIsIkxleFJ1bnRpbWUiLCJyZWdpb24iLCJwcm9jZXNzIiwiZW52IiwiQVdTX1JFR0lPTiIsImxvZ2dlciIsImVycm9yIiwiZGVidWciLCJCT1RfTkFNRSIsInJlY2VpdmUiLCJoZWFyZCIsImJvdCIsIm1lc3NhZ2UiLCJuZXh0IiwidGV4dCIsImlzX2VjaG8iLCJ0eXBlIiwiYWxleGEiLCJ1c2VyIiwicGFyYW1zIiwiYm90QWxpYXMiLCJib3ROYW1lIiwiaW5wdXRUZXh0IiwidXNlcklkIiwic3Vic3RyIiwicmVxdWVzdEF0dHJpYnV0ZXMiLCJzZXNzaW9uQXR0cmlidXRlcyIsInJlcXVlc3QiLCJwb3N0VGV4dCIsImVyciIsImRhdGEiLCJpbnRlbnQiLCJpbnRlbnROYW1lIiwic2xvdHMiLCJzZXNzaW9uIiwicmVzcG9uc2UiLCJkaWFsb2dTdGF0ZSIsInNsb3RUb0VsaWNpdCIsInJlcGx5Il0sIm1hcHBpbmdzIjoidUdBQUEsaUM7O0FBRUEsSUFBTUEsR0FBRyxHQUFHLElBQUlDLGtCQUFKLENBQWU7QUFDekJDLEVBQUFBLE1BQU0sRUFBRUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFVBREssRUFBZixDQUFaLEM7OztBQUllLGtCQUFDQyxNQUFELEVBQVk7QUFDekIsTUFBTUMsS0FBSyxHQUFHRCxNQUFNLENBQUMsZ0JBQUQsRUFBbUIsT0FBbkIsQ0FBcEI7QUFDQSxNQUFNRSxLQUFLLEdBQUdGLE1BQU0sQ0FBQyxnQkFBRCxFQUFtQixPQUFuQixDQUFwQjs7QUFFQSxNQUFJLENBQUNILE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxVQUFiLElBQTJCLENBQUNGLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSyxRQUE1QyxFQUFzRDtBQUNwREYsSUFBQUEsS0FBSyxDQUFDLHFDQUFELENBQUw7QUFDRDs7QUFFRCxTQUFPO0FBQ0xHLElBQUFBLE9BQU8sRUFBUEEsT0FESztBQUVMQyxJQUFBQSxLQUFLLEVBQUxBLEtBRkss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ZGsnXG5cbmNvbnN0IGxleCA9IG5ldyBMZXhSdW50aW1lKHtcbiAgcmVnaW9uOiBwcm9jZXNzLmVudi5BV1NfUkVHSU9OXG59KVxuXG5leHBvcnQgZGVmYXVsdCAobG9nZ2VyKSA9PiB7XG4gIGNvbnN0IGVycm9yID0gbG9nZ2VyKCdtaWRkbGV3YXJlOmxleCcsICdlcnJvcicpXG4gIGNvbnN0IGRlYnVnID0gbG9nZ2VyKCdtaWRkbGV3YXJlOmxleCcsICdkZWJ1ZycpXG5cbiAgaWYgKCFwcm9jZXNzLmVudi5BV1NfUkVHSU9OIHx8ICFwcm9jZXNzLmVudi5CT1RfTkFNRSkge1xuICAgIGVycm9yKCdBV1NfUkVHSU9OIGFuZCBCT1RfTkFNRSBtdXN0IGJlIHNldCcpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHJlY2VpdmUsXG4gICAgaGVhcmRcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmUoYm90LCBtZXNzYWdlLCBuZXh0KSB7XG4gICAgaWYgKCFtZXNzYWdlLnRleHQpIHtcbiAgICAgIG5leHQoKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UuaXNfZWNobyB8fCBtZXNzYWdlLnR5cGUgPT09ICdzZWxmX21lc3NhZ2UnIHx8IG1lc3NhZ2UuYWxleGEpIHtcbiAgICAgIG5leHQoKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGRlYnVnKGB1c2VySWQ6ICR7bWVzc2FnZS51c2VyfWApXG4gICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgIGJvdEFsaWFzOiBwcm9jZXNzLmVudi5CT1RfTkFNRSB8fCAnQmFzZWJvdCcsXG4gICAgICBib3ROYW1lOiBwcm9jZXNzLmVudi5CT1RfTkFNRSB8fCAnQmFzZWJvdCcsXG4gICAgICBpbnB1dFRleHQ6IG1lc3NhZ2UudGV4dCxcbiAgICAgIC8vIEZJWE1FIC0gYWxleGEgcHJvdmlkZXMgYSBVSUQgd2l0aCA+IDIwMCBjaGFyYWN0ZXJzIC0gdGhpcyB3aWxsIGJlIG1hc3NpdmVseSB0cnVuY2F0ZWQgYXMgYSByZXN1bHQgYW5kIGNvdWxkIGV2ZW4gbGVhZCB0byB1bmludGVudGlvbmFsIHNlc3Npb24gaGlqYWNraW5nXG4gICAgICB1c2VySWQ6IG1lc3NhZ2UudXNlciAmJiBtZXNzYWdlLnVzZXIuc3Vic3RyKDAsIDEwMCksXG4gICAgICByZXF1ZXN0QXR0cmlidXRlczogbWVzc2FnZS5yZXF1ZXN0QXR0cmlidXRlcyxcbiAgICAgIHNlc3Npb25BdHRyaWJ1dGVzOiBtZXNzYWdlLnNlc3Npb25BdHRyaWJ1dGVzXG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnRleHQpIHtcbiAgICAgIHZhciByZXF1ZXN0ID0gbGV4LnBvc3RUZXh0KHBhcmFtcywgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgbmV4dChlcnIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVzc2FnZS5sZXggPSB7XG4gICAgICAgICAgICBpbnRlbnQ6IGRhdGEuaW50ZW50TmFtZSxcbiAgICAgICAgICAgIHNsb3RzOiBkYXRhLnNsb3RzLFxuICAgICAgICAgICAgc2Vzc2lvbjogZGF0YS5zZXNzaW9uQXR0cmlidXRlcyxcbiAgICAgICAgICAgIHJlc3BvbnNlOiBkYXRhLm1lc3NhZ2UsXG4gICAgICAgICAgICBkaWFsb2dTdGF0ZTogZGF0YS5kaWFsb2dTdGF0ZSxcbiAgICAgICAgICAgIHNsb3RUb0VsaWNpdDogZGF0YS5zbG90VG9FbGljaXRcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVidWcoJ3Jlc3BvbnNlIHJlY2VpdmVkIGZyb20gTGV4OicsIG1lc3NhZ2UubGV4KVxuICAgICAgICAgIGlmIChkYXRhLmludGVudE5hbWUpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UuaW50ZW50ID09PSBkYXRhLmludGVudE5hbWVcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV4dCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHQoKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhlYXJkKGJvdCwgbWVzc2FnZSwgbmV4dCkge1xuICAgIGlmIChtZXNzYWdlLmxleCAmJiBtZXNzYWdlLmxleC5kaWFsb2dTdGF0ZSA9PT0gJ0Z1bGZpbGxlZCcgJiYgbWVzc2FnZS5sZXguaW50ZW50TmFtZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGJvdC5yZXBseShtZXNzYWdlLCB7Li4ubWVzc2FnZS5sZXgucmVzcG9uc2UsIGludGVudE5hbWU6IG1lc3NhZ2UubGV4LmludGVudE5hbWV9KVxuICAgIH1cbiAgICBuZXh0KClcbiAgfVxufVxuIl19