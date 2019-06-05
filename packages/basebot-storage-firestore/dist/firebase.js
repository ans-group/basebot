"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var admin = _interopRequireWildcard(require("firebase-admin"));function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj["default"] = obj;return newObj;}}

if (!process.env.FIREBASE) {
  throw new Error('FIREBASE env settings are required');
}
if (!process.env.DB_URL) {
  throw new Error('DB_URL is not set');
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE)),
  databaseURL: process.env.DB_URL });var _default =


admin.firestore();exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2ZpcmViYXNlLmpzIl0sIm5hbWVzIjpbInByb2Nlc3MiLCJlbnYiLCJGSVJFQkFTRSIsIkVycm9yIiwiREJfVVJMIiwiYWRtaW4iLCJpbml0aWFsaXplQXBwIiwiY3JlZGVudGlhbCIsImNlcnQiLCJKU09OIiwicGFyc2UiLCJkYXRhYmFzZVVSTCIsImZpcmVzdG9yZSJdLCJtYXBwaW5ncyI6InVHQUFBLCtEOztBQUVBLElBQUksQ0FBQ0EsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFFBQWpCLEVBQTJCO0FBQ3pCLFFBQU0sSUFBSUMsS0FBSixDQUFVLG9DQUFWLENBQU47QUFDRDtBQUNELElBQUksQ0FBQ0gsT0FBTyxDQUFDQyxHQUFSLENBQVlHLE1BQWpCLEVBQXlCO0FBQ3ZCLFFBQU0sSUFBSUQsS0FBSixDQUFVLG1CQUFWLENBQU47QUFDRDs7QUFFREUsS0FBSyxDQUFDQyxhQUFOLENBQW9CO0FBQ2xCQyxFQUFBQSxVQUFVLEVBQUVGLEtBQUssQ0FBQ0UsVUFBTixDQUFpQkMsSUFBakIsQ0FBc0JDLElBQUksQ0FBQ0MsS0FBTCxDQUFXVixPQUFPLENBQUNDLEdBQVIsQ0FBWUMsUUFBdkIsQ0FBdEIsQ0FETTtBQUVsQlMsRUFBQUEsV0FBVyxFQUFFWCxPQUFPLENBQUNDLEdBQVIsQ0FBWUcsTUFGUCxFQUFwQixFOzs7QUFLZUMsS0FBSyxDQUFDTyxTQUFOLEUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhZG1pbiBmcm9tICdmaXJlYmFzZS1hZG1pbidcblxuaWYgKCFwcm9jZXNzLmVudi5GSVJFQkFTRSkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0ZJUkVCQVNFIGVudiBzZXR0aW5ncyBhcmUgcmVxdWlyZWQnKVxufVxuaWYgKCFwcm9jZXNzLmVudi5EQl9VUkwpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdEQl9VUkwgaXMgbm90IHNldCcpXG59XG5cbmFkbWluLmluaXRpYWxpemVBcHAoe1xuICBjcmVkZW50aWFsOiBhZG1pbi5jcmVkZW50aWFsLmNlcnQoSlNPTi5wYXJzZShwcm9jZXNzLmVudi5GSVJFQkFTRSkpLFxuICBkYXRhYmFzZVVSTDogcHJvY2Vzcy5lbnYuREJfVVJMXG59KVxuXG5leHBvcnQgZGVmYXVsdCBhZG1pbi5maXJlc3RvcmUoKVxuIl19