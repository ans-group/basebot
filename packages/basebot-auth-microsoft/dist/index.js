"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _simpleOauth = _interopRequireDefault(require("simple-oauth2"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

var requiredValues = [
'MS_APP_ID',
'MS_APP_PASSWORD',
'MS_APP_SCOPES',
'MS_REDIRECT_URI'];


requiredValues.forEach(function (key) {
  if (!process.env[key]) {
    throw new Error("Config Error: ".concat(key, " is required"));
  }
});var _default =

function _default(logger) {
  var debug = logger('auth', 'debug');
  var error = logger('auth', 'error');

  var credentials = {
    client: {
      id: process.env.MS_APP_ID,
      secret: process.env.MS_APP_PASSWORD },

    auth: {
      tokenHost: 'https://login.microsoftonline.com',
      authorizePath: 'common/oauth2/v2.0/authorize',
      tokenPath: 'common/oauth2/v2.0/token' } };


  var oauth2 = _simpleOauth["default"].create(credentials);

  var getAuthUrl = function getAuthUrl(userId) {
    var url = oauth2.authorizationCode.authorizeURL({
      redirect_uri: process.env.MS_REDIRECT_URI,
      scope: process.env.MS_APP_SCOPES,
      state: userId });

    debug("Generated auth url: ".concat(url));
    return url;
  };

  var getTokenFromCode = /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(code) {var result, payload;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                oauth2.authorizationCode.getToken({
                  code: code,
                  redirect_uri: process.env.MS_REDIRECT_URI,
                  scope: process.env.MS_APP_SCOPES }));case 2:result = _context.sent;


              payload = oauth2.accessToken.create(result);
              debug('Token created');return _context.abrupt("return",

              {
                token: payload.token.access_token,
                refresh: payload.token.refresh_token,
                expires: payload.token.expires_at.getTime() });case 6:case "end":return _context.stop();}}}, _callee);}));return function getTokenFromCode(_x) {return _ref.apply(this, arguments);};}();



  var refreshToken = /*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_refreshToken) {var token;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                oauth2.accessToken.create({ refresh_token: _refreshToken }).refresh());case 2:token = _context2.sent;return _context2.abrupt("return",
              {
                token: token.token.access_token,
                refreshToken: token.token.refresh_token,
                tokenExpires: token.token.expires_at.getTime() });case 4:case "end":return _context2.stop();}}}, _callee2);}));return function refreshToken(_x2) {return _ref2.apply(this, arguments);};}();



  return {
    getAuthUrl: getAuthUrl,
    getTokenFromCode: getTokenFromCode,
    refreshToken: refreshToken,
    getUserToken: getUserToken };

};exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbInJlcXVpcmVkVmFsdWVzIiwiZm9yRWFjaCIsImtleSIsInByb2Nlc3MiLCJlbnYiLCJFcnJvciIsImxvZ2dlciIsImRlYnVnIiwiZXJyb3IiLCJjcmVkZW50aWFscyIsImNsaWVudCIsImlkIiwiTVNfQVBQX0lEIiwic2VjcmV0IiwiTVNfQVBQX1BBU1NXT1JEIiwiYXV0aCIsInRva2VuSG9zdCIsImF1dGhvcml6ZVBhdGgiLCJ0b2tlblBhdGgiLCJvYXV0aDIiLCJPYXV0aDIiLCJjcmVhdGUiLCJnZXRBdXRoVXJsIiwidXNlcklkIiwidXJsIiwiYXV0aG9yaXphdGlvbkNvZGUiLCJhdXRob3JpemVVUkwiLCJyZWRpcmVjdF91cmkiLCJNU19SRURJUkVDVF9VUkkiLCJzY29wZSIsIk1TX0FQUF9TQ09QRVMiLCJzdGF0ZSIsImdldFRva2VuRnJvbUNvZGUiLCJjb2RlIiwiZ2V0VG9rZW4iLCJyZXN1bHQiLCJwYXlsb2FkIiwiYWNjZXNzVG9rZW4iLCJ0b2tlbiIsImFjY2Vzc190b2tlbiIsInJlZnJlc2giLCJyZWZyZXNoX3Rva2VuIiwiZXhwaXJlcyIsImV4cGlyZXNfYXQiLCJnZXRUaW1lIiwicmVmcmVzaFRva2VuIiwidG9rZW5FeHBpcmVzIiwiZ2V0VXNlclRva2VuIl0sIm1hcHBpbmdzIjoidUdBQUEsb0U7O0FBRUEsSUFBTUEsY0FBYyxHQUFHO0FBQ3JCLFdBRHFCO0FBRXJCLGlCQUZxQjtBQUdyQixlQUhxQjtBQUlyQixpQkFKcUIsQ0FBdkI7OztBQU9BQSxjQUFjLENBQUNDLE9BQWYsQ0FBdUIsVUFBQUMsR0FBRyxFQUFJO0FBQzVCLE1BQUksQ0FBQ0MsT0FBTyxDQUFDQyxHQUFSLENBQVlGLEdBQVosQ0FBTCxFQUF1QjtBQUNyQixVQUFNLElBQUlHLEtBQUoseUJBQTJCSCxHQUEzQixrQkFBTjtBQUNEO0FBQ0YsQ0FKRCxFOztBQU1lLGtCQUFBSSxNQUFNLEVBQUk7QUFDdkIsTUFBTUMsS0FBSyxHQUFHRCxNQUFNLENBQUMsTUFBRCxFQUFTLE9BQVQsQ0FBcEI7QUFDQSxNQUFNRSxLQUFLLEdBQUdGLE1BQU0sQ0FBQyxNQUFELEVBQVMsT0FBVCxDQUFwQjs7QUFFQSxNQUFNRyxXQUFXLEdBQUc7QUFDbEJDLElBQUFBLE1BQU0sRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUVSLE9BQU8sQ0FBQ0MsR0FBUixDQUFZUSxTQURWO0FBRU5DLE1BQUFBLE1BQU0sRUFBRVYsT0FBTyxDQUFDQyxHQUFSLENBQVlVLGVBRmQsRUFEVTs7QUFLbEJDLElBQUFBLElBQUksRUFBRTtBQUNKQyxNQUFBQSxTQUFTLEVBQUUsbUNBRFA7QUFFSkMsTUFBQUEsYUFBYSxFQUFFLDhCQUZYO0FBR0pDLE1BQUFBLFNBQVMsRUFBRSwwQkFIUCxFQUxZLEVBQXBCOzs7QUFXQSxNQUFNQyxNQUFNLEdBQUdDLHdCQUFPQyxNQUFQLENBQWNaLFdBQWQsQ0FBZjs7QUFFQSxNQUFNYSxVQUFVLEdBQUcsU0FBYkEsVUFBYSxDQUFBQyxNQUFNLEVBQUk7QUFDM0IsUUFBTUMsR0FBRyxHQUFHTCxNQUFNLENBQUNNLGlCQUFQLENBQXlCQyxZQUF6QixDQUFzQztBQUNoREMsTUFBQUEsWUFBWSxFQUFFeEIsT0FBTyxDQUFDQyxHQUFSLENBQVl3QixlQURzQjtBQUVoREMsTUFBQUEsS0FBSyxFQUFFMUIsT0FBTyxDQUFDQyxHQUFSLENBQVkwQixhQUY2QjtBQUdoREMsTUFBQUEsS0FBSyxFQUFFUixNQUh5QyxFQUF0QyxDQUFaOztBQUtBaEIsSUFBQUEsS0FBSywrQkFBd0JpQixHQUF4QixFQUFMO0FBQ0EsV0FBT0EsR0FBUDtBQUNELEdBUkQ7O0FBVUEsTUFBTVEsZ0JBQWdCLGdHQUFHLGlCQUFNQyxJQUFOO0FBQ0ZkLGdCQUFBQSxNQUFNLENBQUNNLGlCQUFQLENBQXlCUyxRQUF6QixDQUFrQztBQUNyREQsa0JBQUFBLElBQUksRUFBSkEsSUFEcUQ7QUFFckROLGtCQUFBQSxZQUFZLEVBQUV4QixPQUFPLENBQUNDLEdBQVIsQ0FBWXdCLGVBRjJCO0FBR3JEQyxrQkFBQUEsS0FBSyxFQUFFMUIsT0FBTyxDQUFDQyxHQUFSLENBQVkwQixhQUhrQyxFQUFsQyxDQURFLFNBQ2pCSyxNQURpQjs7O0FBT2pCQyxjQUFBQSxPQVBpQixHQU9QakIsTUFBTSxDQUFDa0IsV0FBUCxDQUFtQmhCLE1BQW5CLENBQTBCYyxNQUExQixDQVBPO0FBUXZCNUIsY0FBQUEsS0FBSyxDQUFDLGVBQUQsQ0FBTCxDQVJ1Qjs7QUFVaEI7QUFDTCtCLGdCQUFBQSxLQUFLLEVBQUVGLE9BQU8sQ0FBQ0UsS0FBUixDQUFjQyxZQURoQjtBQUVMQyxnQkFBQUEsT0FBTyxFQUFFSixPQUFPLENBQUNFLEtBQVIsQ0FBY0csYUFGbEI7QUFHTEMsZ0JBQUFBLE9BQU8sRUFBRU4sT0FBTyxDQUFDRSxLQUFSLENBQWNLLFVBQWQsQ0FBeUJDLE9BQXpCLEVBSEosRUFWZ0IsMERBQUgsbUJBQWhCWixnQkFBZ0IsOENBQXRCOzs7O0FBaUJBLE1BQU1hLFlBQVksaUdBQUcsa0JBQU1BLGFBQU47QUFDQzFCLGdCQUFBQSxNQUFNLENBQUNrQixXQUFQLENBQW1CaEIsTUFBbkIsQ0FBMEIsRUFBRW9CLGFBQWEsRUFBRUksYUFBakIsRUFBMUIsRUFBMkRMLE9BQTNELEVBREQsU0FDYkYsS0FEYTtBQUVaO0FBQ0xBLGdCQUFBQSxLQUFLLEVBQUVBLEtBQUssQ0FBQ0EsS0FBTixDQUFZQyxZQURkO0FBRUxNLGdCQUFBQSxZQUFZLEVBQUVQLEtBQUssQ0FBQ0EsS0FBTixDQUFZRyxhQUZyQjtBQUdMSyxnQkFBQUEsWUFBWSxFQUFFUixLQUFLLENBQUNBLEtBQU4sQ0FBWUssVUFBWixDQUF1QkMsT0FBdkIsRUFIVCxFQUZZLDREQUFILCtFQUFsQjs7OztBQVNBLFNBQU87QUFDTHRCLElBQUFBLFVBQVUsRUFBVkEsVUFESztBQUVMVSxJQUFBQSxnQkFBZ0IsRUFBaEJBLGdCQUZLO0FBR0xhLElBQUFBLFlBQVksRUFBWkEsWUFISztBQUlMRSxJQUFBQSxZQUFZLEVBQVpBLFlBSkssRUFBUDs7QUFNRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9hdXRoMiBmcm9tICdzaW1wbGUtb2F1dGgyJ1xuXG5jb25zdCByZXF1aXJlZFZhbHVlcyA9IFtcbiAgJ01TX0FQUF9JRCcsXG4gICdNU19BUFBfUEFTU1dPUkQnLFxuICAnTVNfQVBQX1NDT1BFUycsXG4gICdNU19SRURJUkVDVF9VUkknXG5dXG5cbnJlcXVpcmVkVmFsdWVzLmZvckVhY2goa2V5ID0+IHtcbiAgaWYgKCFwcm9jZXNzLmVudltrZXldKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb25maWcgRXJyb3I6ICR7a2V5fSBpcyByZXF1aXJlZGApXG4gIH1cbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGxvZ2dlciA9PiB7XG4gIGNvbnN0IGRlYnVnID0gbG9nZ2VyKCdhdXRoJywgJ2RlYnVnJylcbiAgY29uc3QgZXJyb3IgPSBsb2dnZXIoJ2F1dGgnLCAnZXJyb3InKVxuXG4gIGNvbnN0IGNyZWRlbnRpYWxzID0ge1xuICAgIGNsaWVudDoge1xuICAgICAgaWQ6IHByb2Nlc3MuZW52Lk1TX0FQUF9JRCxcbiAgICAgIHNlY3JldDogcHJvY2Vzcy5lbnYuTVNfQVBQX1BBU1NXT1JEXG4gICAgfSxcbiAgICBhdXRoOiB7XG4gICAgICB0b2tlbkhvc3Q6ICdodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20nLFxuICAgICAgYXV0aG9yaXplUGF0aDogJ2NvbW1vbi9vYXV0aDIvdjIuMC9hdXRob3JpemUnLFxuICAgICAgdG9rZW5QYXRoOiAnY29tbW9uL29hdXRoMi92Mi4wL3Rva2VuJ1xuICAgIH1cbiAgfVxuICBjb25zdCBvYXV0aDIgPSBPYXV0aDIuY3JlYXRlKGNyZWRlbnRpYWxzKVxuXG4gIGNvbnN0IGdldEF1dGhVcmwgPSB1c2VySWQgPT4ge1xuICAgIGNvbnN0IHVybCA9IG9hdXRoMi5hdXRob3JpemF0aW9uQ29kZS5hdXRob3JpemVVUkwoe1xuICAgICAgcmVkaXJlY3RfdXJpOiBwcm9jZXNzLmVudi5NU19SRURJUkVDVF9VUkksXG4gICAgICBzY29wZTogcHJvY2Vzcy5lbnYuTVNfQVBQX1NDT1BFUyxcbiAgICAgIHN0YXRlOiB1c2VySWRcbiAgICB9KVxuICAgIGRlYnVnKGBHZW5lcmF0ZWQgYXV0aCB1cmw6ICR7dXJsfWApXG4gICAgcmV0dXJuIHVybFxuICB9XG5cbiAgY29uc3QgZ2V0VG9rZW5Gcm9tQ29kZSA9IGFzeW5jIGNvZGUgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9hdXRoMi5hdXRob3JpemF0aW9uQ29kZS5nZXRUb2tlbih7XG4gICAgICBjb2RlLFxuICAgICAgcmVkaXJlY3RfdXJpOiBwcm9jZXNzLmVudi5NU19SRURJUkVDVF9VUkksXG4gICAgICBzY29wZTogcHJvY2Vzcy5lbnYuTVNfQVBQX1NDT1BFU1xuICAgIH0pXG5cbiAgICBjb25zdCBwYXlsb2FkID0gb2F1dGgyLmFjY2Vzc1Rva2VuLmNyZWF0ZShyZXN1bHQpXG4gICAgZGVidWcoJ1Rva2VuIGNyZWF0ZWQnKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRva2VuOiBwYXlsb2FkLnRva2VuLmFjY2Vzc190b2tlbixcbiAgICAgIHJlZnJlc2g6IHBheWxvYWQudG9rZW4ucmVmcmVzaF90b2tlbixcbiAgICAgIGV4cGlyZXM6IHBheWxvYWQudG9rZW4uZXhwaXJlc19hdC5nZXRUaW1lKClcbiAgICB9XG4gIH1cblxuICBjb25zdCByZWZyZXNoVG9rZW4gPSBhc3luYyByZWZyZXNoVG9rZW4gPT4ge1xuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgb2F1dGgyLmFjY2Vzc1Rva2VuLmNyZWF0ZSh7IHJlZnJlc2hfdG9rZW46IHJlZnJlc2hUb2tlbiB9KS5yZWZyZXNoKClcbiAgICByZXR1cm4ge1xuICAgICAgdG9rZW46IHRva2VuLnRva2VuLmFjY2Vzc190b2tlbixcbiAgICAgIHJlZnJlc2hUb2tlbjogdG9rZW4udG9rZW4ucmVmcmVzaF90b2tlbixcbiAgICAgIHRva2VuRXhwaXJlczogdG9rZW4udG9rZW4uZXhwaXJlc19hdC5nZXRUaW1lKClcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldEF1dGhVcmwsXG4gICAgZ2V0VG9rZW5Gcm9tQ29kZSxcbiAgICByZWZyZXNoVG9rZW4sXG4gICAgZ2V0VXNlclRva2VuXG4gIH1cbn0iXX0=