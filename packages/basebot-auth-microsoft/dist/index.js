"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _simpleOauth = _interopRequireDefault(require("simple-oauth2"));
var _cryptr = _interopRequireDefault(require("cryptr"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

var oauth2 = oAuthInit();var _default =

function _default(logger) {
  var requiredValues = [
  'MS_APP_ID',
  'MS_APP_PASSWORD',
  'MS_APP_SCOPES',
  'MS_REDIRECT_URI'];


  requiredValues.forEach(function (key) {
    if (!process.env[key]) {
      throw new Error("Config Error: ".concat(key, " is required"));
    }
  });

  if (!process.env.CRYPTR_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('CRYPTR_SECRET is required in production');
  }

  var debug = logger('auth', 'debug');
  var info = logger('auth', 'info');
  var error = logger('auth', 'error');
  var cryptr = new _cryptr["default"](process.env.CRYPTR_SECRET || 'unsecure_secret');

  function registerEndpoints(server, storage) {var onAuthorize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function noop() {};
    info('registering GET /authorize/microsoft');
    server.get('/authorize/microsoft', /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {var _req$query, code, state, token;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_req$query =
                req.query, code = _req$query.code, state = _req$query.state;_context.prev = 1;_context.next = 4;return (

                  getTokenFromCode(code, res));case 4:token = _context.sent;if (
                token) {_context.next = 7;break;}throw new Error('Could not retrieve token');case 7:
                debug("storing token");_context.next = 10;return (
                  storage.users.save({ id: state, microsoft_token: cryptr.encrypt(JSON.stringify(token)) }));case 10:
                onAuthorize(null, state);_context.next = 17;break;case 13:_context.prev = 13;_context.t0 = _context["catch"](1);

                error(_context.t0);
                onAuthorize(_context.t0, state);case 17:

                res.redirect('/login_success.html');case 18:case "end":return _context.stop();}}}, _callee, null, [[1, 13]]);}));return function (_x, _x2) {return _ref.apply(this, arguments);};}());

  }function

  refreshToken(_x3) {return _refreshToken.apply(this, arguments);}function _refreshToken() {_refreshToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(refreshToken) {var token;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                oauth2.accessToken.create({ refresh_token: refreshToken }).refresh());case 2:token = _context2.sent;return _context2.abrupt("return",
              {
                token: token.token.access_token,
                refreshToken: token.token.refresh_token,
                tokenExpires: token.token.expires_at.getTime() });case 4:case "end":return _context2.stop();}}}, _callee2);}));return _refreshToken.apply(this, arguments);}



  function getAuthUrl(userId) {
    var url = oauth2.authorizationCode.authorizeURL({
      redirect_uri: process.env.MS_REDIRECT_URI,
      scope: process.env.MS_APP_SCOPES,
      state: userId });

    debug("Generated auth url: ".concat(url));
    return url;
  }

  return {
    getAuthUrl: getAuthUrl,
    registerEndpoints: registerEndpoints,
    refreshToken: refreshToken };

};exports["default"] = _default;

function oAuthInit() {
  var credentials = {
    client: {
      id: process.env.MS_APP_ID,
      secret: process.env.MS_APP_PASSWORD },

    auth: {
      tokenHost: 'https://login.microsoftonline.com',
      authorizePath: 'common/oauth2/v2.0/authorize',
      tokenPath: 'common/oauth2/v2.0/token' } };


  return _simpleOauth["default"].create(credentials);
}function

getTokenFromCode(_x4) {return _getTokenFromCode.apply(this, arguments);}function _getTokenFromCode() {_getTokenFromCode = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(code) {var result, payload;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.next = 2;return (
              oauth2.authorizationCode.getToken({
                code: code,
                redirect_uri: process.env.MS_REDIRECT_URI,
                scope: process.env.MS_APP_SCOPES }));case 2:result = _context3.sent;

            payload = oauth2.accessToken.create(result);return _context3.abrupt("return",
            {
              token: payload.token.access_token,
              refresh: payload.token.refresh_token,
              expires: payload.token.expires_at.getTime() });case 5:case "end":return _context3.stop();}}}, _callee3);}));return _getTokenFromCode.apply(this, arguments);}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbIm9hdXRoMiIsIm9BdXRoSW5pdCIsImxvZ2dlciIsInJlcXVpcmVkVmFsdWVzIiwiZm9yRWFjaCIsImtleSIsInByb2Nlc3MiLCJlbnYiLCJFcnJvciIsIkNSWVBUUl9TRUNSRVQiLCJOT0RFX0VOViIsImRlYnVnIiwiaW5mbyIsImVycm9yIiwiY3J5cHRyIiwiQ3J5cHRyIiwicmVnaXN0ZXJFbmRwb2ludHMiLCJzZXJ2ZXIiLCJzdG9yYWdlIiwib25BdXRob3JpemUiLCJub29wIiwiZ2V0IiwicmVxIiwicmVzIiwicXVlcnkiLCJjb2RlIiwic3RhdGUiLCJnZXRUb2tlbkZyb21Db2RlIiwidG9rZW4iLCJ1c2VycyIsInNhdmUiLCJpZCIsIm1pY3Jvc29mdF90b2tlbiIsImVuY3J5cHQiLCJKU09OIiwic3RyaW5naWZ5IiwicmVkaXJlY3QiLCJyZWZyZXNoVG9rZW4iLCJhY2Nlc3NUb2tlbiIsImNyZWF0ZSIsInJlZnJlc2hfdG9rZW4iLCJyZWZyZXNoIiwiYWNjZXNzX3Rva2VuIiwidG9rZW5FeHBpcmVzIiwiZXhwaXJlc19hdCIsImdldFRpbWUiLCJnZXRBdXRoVXJsIiwidXNlcklkIiwidXJsIiwiYXV0aG9yaXphdGlvbkNvZGUiLCJhdXRob3JpemVVUkwiLCJyZWRpcmVjdF91cmkiLCJNU19SRURJUkVDVF9VUkkiLCJzY29wZSIsIk1TX0FQUF9TQ09QRVMiLCJjcmVkZW50aWFscyIsImNsaWVudCIsIk1TX0FQUF9JRCIsInNlY3JldCIsIk1TX0FQUF9QQVNTV09SRCIsImF1dGgiLCJ0b2tlbkhvc3QiLCJhdXRob3JpemVQYXRoIiwidG9rZW5QYXRoIiwiT2F1dGgyIiwiZ2V0VG9rZW4iLCJyZXN1bHQiLCJwYXlsb2FkIiwiZXhwaXJlcyJdLCJtYXBwaW5ncyI6InVHQUFBO0FBQ0Esd0Q7O0FBRUEsSUFBTUEsTUFBTSxHQUFHQyxTQUFTLEVBQXhCLEM7O0FBRWUsa0JBQUNDLE1BQUQsRUFBWTtBQUN6QixNQUFNQyxjQUFjLEdBQUc7QUFDckIsYUFEcUI7QUFFckIsbUJBRnFCO0FBR3JCLGlCQUhxQjtBQUlyQixtQkFKcUIsQ0FBdkI7OztBQU9BQSxFQUFBQSxjQUFjLENBQUNDLE9BQWYsQ0FBdUIsVUFBQUMsR0FBRyxFQUFJO0FBQzVCLFFBQUksQ0FBQ0MsT0FBTyxDQUFDQyxHQUFSLENBQVlGLEdBQVosQ0FBTCxFQUF1QjtBQUNyQixZQUFNLElBQUlHLEtBQUoseUJBQTJCSCxHQUEzQixrQkFBTjtBQUNEO0FBQ0YsR0FKRDs7QUFNQSxNQUFJLENBQUNDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRSxhQUFiLElBQThCSCxPQUFPLENBQUNDLEdBQVIsQ0FBWUcsUUFBWixLQUF5QixZQUEzRCxFQUF5RTtBQUN2RSxVQUFNLElBQUlGLEtBQUosQ0FBVSx5Q0FBVixDQUFOO0FBQ0Q7O0FBRUQsTUFBTUcsS0FBSyxHQUFHVCxNQUFNLENBQUMsTUFBRCxFQUFTLE9BQVQsQ0FBcEI7QUFDQSxNQUFNVSxJQUFJLEdBQUdWLE1BQU0sQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUFuQjtBQUNBLE1BQU1XLEtBQUssR0FBR1gsTUFBTSxDQUFDLE1BQUQsRUFBUyxPQUFULENBQXBCO0FBQ0EsTUFBTVksTUFBTSxHQUFHLElBQUlDLGtCQUFKLENBQVdULE9BQU8sQ0FBQ0MsR0FBUixDQUFZRSxhQUFaLElBQTZCLGlCQUF4QyxDQUFmOztBQUVBLFdBQVNPLGlCQUFULENBQTJCQyxNQUEzQixFQUFtQ0MsT0FBbkMsRUFBOEUsS0FBbENDLFdBQWtDLHVFQUFwQixTQUFTQyxJQUFULEdBQWdCLENBQUUsQ0FBRTtBQUM1RVIsSUFBQUEsSUFBSSxDQUFDLHNDQUFELENBQUo7QUFDQUssSUFBQUEsTUFBTSxDQUFDSSxHQUFQLENBQVcsc0JBQVgsK0ZBQW1DLGlCQUFlQyxHQUFmLEVBQW9CQyxHQUFwQjtBQUNURCxnQkFBQUEsR0FBRyxDQUFDRSxLQURLLEVBQ3pCQyxJQUR5QixjQUN6QkEsSUFEeUIsRUFDbkJDLEtBRG1CLGNBQ25CQSxLQURtQjs7QUFHWEMsa0JBQUFBLGdCQUFnQixDQUFDRixJQUFELEVBQU9GLEdBQVAsQ0FITCxTQUd6QkssS0FIeUI7QUFJMUJBLGdCQUFBQSxLQUowQixrQ0FJYixJQUFJcEIsS0FBSixDQUFVLDBCQUFWLENBSmE7QUFLL0JHLGdCQUFBQSxLQUFLLGlCQUFMLENBTCtCO0FBTXpCTyxrQkFBQUEsT0FBTyxDQUFDVyxLQUFSLENBQWNDLElBQWQsQ0FBbUIsRUFBRUMsRUFBRSxFQUFFTCxLQUFOLEVBQWFNLGVBQWUsRUFBRWxCLE1BQU0sQ0FBQ21CLE9BQVAsQ0FBZUMsSUFBSSxDQUFDQyxTQUFMLENBQWVQLEtBQWYsQ0FBZixDQUE5QixFQUFuQixDQU55QjtBQU8vQlQsZ0JBQUFBLFdBQVcsQ0FBQyxJQUFELEVBQU9PLEtBQVAsQ0FBWCxDQVArQjs7QUFTL0JiLGdCQUFBQSxLQUFLLGFBQUw7QUFDQU0sZ0JBQUFBLFdBQVcsY0FBTU8sS0FBTixDQUFYLENBVitCOztBQVlqQ0gsZ0JBQUFBLEdBQUcsQ0FBQ2EsUUFBSixDQUFhLHFCQUFiLEVBWmlDLDBFQUFuQzs7QUFjRCxHQXZDd0I7O0FBeUNWQyxFQUFBQSxZQXpDVSxzSkF5Q3pCLGtCQUE0QkEsWUFBNUI7QUFDc0JyQyxnQkFBQUEsTUFBTSxDQUFDc0MsV0FBUCxDQUFtQkMsTUFBbkIsQ0FBMEIsRUFBRUMsYUFBYSxFQUFFSCxZQUFqQixFQUExQixFQUEyREksT0FBM0QsRUFEdEIsU0FDUWIsS0FEUjtBQUVTO0FBQ0xBLGdCQUFBQSxLQUFLLEVBQUVBLEtBQUssQ0FBQ0EsS0FBTixDQUFZYyxZQURkO0FBRUxMLGdCQUFBQSxZQUFZLEVBQUVULEtBQUssQ0FBQ0EsS0FBTixDQUFZWSxhQUZyQjtBQUdMRyxnQkFBQUEsWUFBWSxFQUFFZixLQUFLLENBQUNBLEtBQU4sQ0FBWWdCLFVBQVosQ0FBdUJDLE9BQXZCLEVBSFQsRUFGVCw0REF6Q3lCOzs7O0FBa0R6QixXQUFTQyxVQUFULENBQW9CQyxNQUFwQixFQUE0QjtBQUMxQixRQUFNQyxHQUFHLEdBQUdoRCxNQUFNLENBQUNpRCxpQkFBUCxDQUF5QkMsWUFBekIsQ0FBc0M7QUFDaERDLE1BQUFBLFlBQVksRUFBRTdDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZNkMsZUFEc0I7QUFFaERDLE1BQUFBLEtBQUssRUFBRS9DLE9BQU8sQ0FBQ0MsR0FBUixDQUFZK0MsYUFGNkI7QUFHaEQ1QixNQUFBQSxLQUFLLEVBQUVxQixNQUh5QyxFQUF0QyxDQUFaOztBQUtBcEMsSUFBQUEsS0FBSywrQkFBd0JxQyxHQUF4QixFQUFMO0FBQ0EsV0FBT0EsR0FBUDtBQUNEOztBQUVELFNBQU87QUFDTEYsSUFBQUEsVUFBVSxFQUFWQSxVQURLO0FBRUw5QixJQUFBQSxpQkFBaUIsRUFBakJBLGlCQUZLO0FBR0xxQixJQUFBQSxZQUFZLEVBQVpBLFlBSEssRUFBUDs7QUFLRCxDOztBQUVELFNBQVNwQyxTQUFULEdBQXFCO0FBQ25CLE1BQU1zRCxXQUFXLEdBQUc7QUFDbEJDLElBQUFBLE1BQU0sRUFBRTtBQUNOekIsTUFBQUEsRUFBRSxFQUFFekIsT0FBTyxDQUFDQyxHQUFSLENBQVlrRCxTQURWO0FBRU5DLE1BQUFBLE1BQU0sRUFBRXBELE9BQU8sQ0FBQ0MsR0FBUixDQUFZb0QsZUFGZCxFQURVOztBQUtsQkMsSUFBQUEsSUFBSSxFQUFFO0FBQ0pDLE1BQUFBLFNBQVMsRUFBRSxtQ0FEUDtBQUVKQyxNQUFBQSxhQUFhLEVBQUUsOEJBRlg7QUFHSkMsTUFBQUEsU0FBUyxFQUFFLDBCQUhQLEVBTFksRUFBcEI7OztBQVdBLFNBQU9DLHdCQUFPekIsTUFBUCxDQUFjZ0IsV0FBZCxDQUFQO0FBQ0QsQzs7QUFFYzVCLGdCLGtLQUFmLGtCQUFnQ0YsSUFBaEM7QUFDdUJ6QixjQUFBQSxNQUFNLENBQUNpRCxpQkFBUCxDQUF5QmdCLFFBQXpCLENBQWtDO0FBQ3JEeEMsZ0JBQUFBLElBQUksRUFBSkEsSUFEcUQ7QUFFckQwQixnQkFBQUEsWUFBWSxFQUFFN0MsT0FBTyxDQUFDQyxHQUFSLENBQVk2QyxlQUYyQjtBQUdyREMsZ0JBQUFBLEtBQUssRUFBRS9DLE9BQU8sQ0FBQ0MsR0FBUixDQUFZK0MsYUFIa0MsRUFBbEMsQ0FEdkIsU0FDUVksTUFEUjs7QUFNUUMsWUFBQUEsT0FOUixHQU1rQm5FLE1BQU0sQ0FBQ3NDLFdBQVAsQ0FBbUJDLE1BQW5CLENBQTBCMkIsTUFBMUIsQ0FObEI7QUFPUztBQUNMdEMsY0FBQUEsS0FBSyxFQUFFdUMsT0FBTyxDQUFDdkMsS0FBUixDQUFjYyxZQURoQjtBQUVMRCxjQUFBQSxPQUFPLEVBQUUwQixPQUFPLENBQUN2QyxLQUFSLENBQWNZLGFBRmxCO0FBR0w0QixjQUFBQSxPQUFPLEVBQUVELE9BQU8sQ0FBQ3ZDLEtBQVIsQ0FBY2dCLFVBQWQsQ0FBeUJDLE9BQXpCLEVBSEosRUFQVCw0RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPYXV0aDIgZnJvbSAnc2ltcGxlLW9hdXRoMidcbmltcG9ydCBDcnlwdHIgZnJvbSAnY3J5cHRyJ1xuXG5jb25zdCBvYXV0aDIgPSBvQXV0aEluaXQoKVxuXG5leHBvcnQgZGVmYXVsdCAobG9nZ2VyKSA9PiB7XG4gIGNvbnN0IHJlcXVpcmVkVmFsdWVzID0gW1xuICAgICdNU19BUFBfSUQnLFxuICAgICdNU19BUFBfUEFTU1dPUkQnLFxuICAgICdNU19BUFBfU0NPUEVTJyxcbiAgICAnTVNfUkVESVJFQ1RfVVJJJ1xuICBdXG5cbiAgcmVxdWlyZWRWYWx1ZXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmICghcHJvY2Vzcy5lbnZba2V5XSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb25maWcgRXJyb3I6ICR7a2V5fSBpcyByZXF1aXJlZGApXG4gICAgfVxuICB9KVxuXG4gIGlmICghcHJvY2Vzcy5lbnYuQ1JZUFRSX1NFQ1JFVCAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDUllQVFJfU0VDUkVUIGlzIHJlcXVpcmVkIGluIHByb2R1Y3Rpb24nKVxuICB9XG5cbiAgY29uc3QgZGVidWcgPSBsb2dnZXIoJ2F1dGgnLCAnZGVidWcnKVxuICBjb25zdCBpbmZvID0gbG9nZ2VyKCdhdXRoJywgJ2luZm8nKVxuICBjb25zdCBlcnJvciA9IGxvZ2dlcignYXV0aCcsICdlcnJvcicpXG4gIGNvbnN0IGNyeXB0ciA9IG5ldyBDcnlwdHIocHJvY2Vzcy5lbnYuQ1JZUFRSX1NFQ1JFVCB8fCAndW5zZWN1cmVfc2VjcmV0JylcblxuICBmdW5jdGlvbiByZWdpc3RlckVuZHBvaW50cyhzZXJ2ZXIsIHN0b3JhZ2UsIG9uQXV0aG9yaXplID0gZnVuY3Rpb24gbm9vcCgpIHt9KSB7XG4gICAgaW5mbygncmVnaXN0ZXJpbmcgR0VUIC9hdXRob3JpemUvbWljcm9zb2Z0JylcbiAgICBzZXJ2ZXIuZ2V0KCcvYXV0aG9yaXplL21pY3Jvc29mdCcsIGFzeW5jIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGNvZGUsIHN0YXRlIH0gPSByZXEucXVlcnlcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgZ2V0VG9rZW5Gcm9tQ29kZShjb2RlLCByZXMpXG4gICAgICAgIGlmICghdG9rZW4pIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IHJldHJpZXZlIHRva2VuJylcbiAgICAgICAgZGVidWcoYHN0b3JpbmcgdG9rZW5gKVxuICAgICAgICBhd2FpdCBzdG9yYWdlLnVzZXJzLnNhdmUoeyBpZDogc3RhdGUsIG1pY3Jvc29mdF90b2tlbjogY3J5cHRyLmVuY3J5cHQoSlNPTi5zdHJpbmdpZnkodG9rZW4pKSB9KVxuICAgICAgICBvbkF1dGhvcml6ZShudWxsLCBzdGF0ZSlcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBlcnJvcihlcnIpXG4gICAgICAgIG9uQXV0aG9yaXplKGVyciwgc3RhdGUpXG4gICAgICB9XG4gICAgICByZXMucmVkaXJlY3QoJy9sb2dpbl9zdWNjZXNzLmh0bWwnKVxuICAgIH0pXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiByZWZyZXNoVG9rZW4ocmVmcmVzaFRva2VuKSB7XG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCBvYXV0aDIuYWNjZXNzVG9rZW4uY3JlYXRlKHsgcmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuIH0pLnJlZnJlc2goKVxuICAgIHJldHVybiB7XG4gICAgICB0b2tlbjogdG9rZW4udG9rZW4uYWNjZXNzX3Rva2VuLFxuICAgICAgcmVmcmVzaFRva2VuOiB0b2tlbi50b2tlbi5yZWZyZXNoX3Rva2VuLFxuICAgICAgdG9rZW5FeHBpcmVzOiB0b2tlbi50b2tlbi5leHBpcmVzX2F0LmdldFRpbWUoKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEF1dGhVcmwodXNlcklkKSB7XG4gICAgY29uc3QgdXJsID0gb2F1dGgyLmF1dGhvcml6YXRpb25Db2RlLmF1dGhvcml6ZVVSTCh7XG4gICAgICByZWRpcmVjdF91cmk6IHByb2Nlc3MuZW52Lk1TX1JFRElSRUNUX1VSSSxcbiAgICAgIHNjb3BlOiBwcm9jZXNzLmVudi5NU19BUFBfU0NPUEVTLFxuICAgICAgc3RhdGU6IHVzZXJJZFxuICAgIH0pXG4gICAgZGVidWcoYEdlbmVyYXRlZCBhdXRoIHVybDogJHt1cmx9YClcbiAgICByZXR1cm4gdXJsXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldEF1dGhVcmwsXG4gICAgcmVnaXN0ZXJFbmRwb2ludHMsXG4gICAgcmVmcmVzaFRva2VuXG4gIH1cbn1cblxuZnVuY3Rpb24gb0F1dGhJbml0KCkge1xuICBjb25zdCBjcmVkZW50aWFscyA9IHtcbiAgICBjbGllbnQ6IHtcbiAgICAgIGlkOiBwcm9jZXNzLmVudi5NU19BUFBfSUQsXG4gICAgICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk1TX0FQUF9QQVNTV09SRFxuICAgIH0sXG4gICAgYXV0aDoge1xuICAgICAgdG9rZW5Ib3N0OiAnaHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29tJyxcbiAgICAgIGF1dGhvcml6ZVBhdGg6ICdjb21tb24vb2F1dGgyL3YyLjAvYXV0aG9yaXplJyxcbiAgICAgIHRva2VuUGF0aDogJ2NvbW1vbi9vYXV0aDIvdjIuMC90b2tlbidcbiAgICB9XG4gIH1cbiAgcmV0dXJuIE9hdXRoMi5jcmVhdGUoY3JlZGVudGlhbHMpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFRva2VuRnJvbUNvZGUoY29kZSkge1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYXV0aDIuYXV0aG9yaXphdGlvbkNvZGUuZ2V0VG9rZW4oe1xuICAgIGNvZGUsXG4gICAgcmVkaXJlY3RfdXJpOiBwcm9jZXNzLmVudi5NU19SRURJUkVDVF9VUkksXG4gICAgc2NvcGU6IHByb2Nlc3MuZW52Lk1TX0FQUF9TQ09QRVNcbiAgfSlcbiAgY29uc3QgcGF5bG9hZCA9IG9hdXRoMi5hY2Nlc3NUb2tlbi5jcmVhdGUocmVzdWx0KVxuICByZXR1cm4ge1xuICAgIHRva2VuOiBwYXlsb2FkLnRva2VuLmFjY2Vzc190b2tlbixcbiAgICByZWZyZXNoOiBwYXlsb2FkLnRva2VuLnJlZnJlc2hfdG9rZW4sXG4gICAgZXhwaXJlczogcGF5bG9hZC50b2tlbi5leHBpcmVzX2F0LmdldFRpbWUoKVxuICB9XG59XG4iXX0=