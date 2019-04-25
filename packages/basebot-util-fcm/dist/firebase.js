"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var admin = _interopRequireWildcard(require("firebase-admin"));function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj["default"] = obj;return newObj;}}

if (!process.env.FIREBASE) {
  throw new Error('FIREBASE env settings are required');
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE)) });var _default =


admin.messaging();exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2ZpcmViYXNlLmpzIl0sIm5hbWVzIjpbInByb2Nlc3MiLCJlbnYiLCJGSVJFQkFTRSIsIkVycm9yIiwiYWRtaW4iLCJpbml0aWFsaXplQXBwIiwiY3JlZGVudGlhbCIsImNlcnQiLCJKU09OIiwicGFyc2UiLCJtZXNzYWdpbmciXSwibWFwcGluZ3MiOiJ1R0FBQSwrRDs7QUFFQSxJQUFJLENBQUNBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUFqQixFQUEyQjtBQUN6QixRQUFNLElBQUlDLEtBQUosQ0FBVSxvQ0FBVixDQUFOO0FBQ0Q7O0FBRURDLEtBQUssQ0FBQ0MsYUFBTixDQUFvQjtBQUNsQkMsRUFBQUEsVUFBVSxFQUFFRixLQUFLLENBQUNFLFVBQU4sQ0FBaUJDLElBQWpCLENBQXNCQyxJQUFJLENBQUNDLEtBQUwsQ0FBV1QsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFFBQXZCLENBQXRCLENBRE0sRUFBcEIsRTs7O0FBSWVFLEtBQUssQ0FBQ00sU0FBTixFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYWRtaW4gZnJvbSAnZmlyZWJhc2UtYWRtaW4nXG5cbmlmICghcHJvY2Vzcy5lbnYuRklSRUJBU0UpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdGSVJFQkFTRSBlbnYgc2V0dGluZ3MgYXJlIHJlcXVpcmVkJylcbn1cblxuYWRtaW4uaW5pdGlhbGl6ZUFwcCh7XG4gIGNyZWRlbnRpYWw6IGFkbWluLmNyZWRlbnRpYWwuY2VydChKU09OLnBhcnNlKHByb2Nlc3MuZW52LkZJUkVCQVNFKSlcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGFkbWluLm1lc3NhZ2luZygpXG4iXX0=