"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.messaging = exports.getSingle = exports.db = exports.auth = void 0;var admin = _interopRequireWildcard(require("firebase-admin"));
var _fs = _interopRequireDefault(require("fs"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj["default"] = obj;return newObj;}}
var serviceAccount = function () {
  if (_fs["default"].existsSync("".concat(__dirname, "/../firebase.json"))) {
    return require('../firebase.json');
  } else {
    return JSON.parse(process.env.FIREBASE);
  }
}();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL });


var auth = admin.auth();exports.auth = auth;
var db = admin.firestore();exports.db = db;
var messaging = admin.messaging();

/**
                                    * Utility function to simplify grabbing a single document from firestore by ID
                                    * @param {String} collection the collection name in which the document is stored
                                    * @param {String} docId the ID of the document to fetch
                                    * @returns {Object} firebase doc (or empty object)
                                    */exports.messaging = messaging;
var getSingle = function getSingle(collection, docId) {return new Promise(function (resolve, reject) {
    db.collection(collection).doc(docId).get().then(function (doc) {
      if (doc.exists) {
        resolve(doc.data());
      } else {
        resolve({});
      }
    })["catch"](function () {return resolve({});});
  });};exports.getSingle = getSingle;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbInNlcnZpY2VBY2NvdW50IiwiZnMiLCJleGlzdHNTeW5jIiwiX19kaXJuYW1lIiwicmVxdWlyZSIsIkpTT04iLCJwYXJzZSIsInByb2Nlc3MiLCJlbnYiLCJGSVJFQkFTRSIsImFkbWluIiwiaW5pdGlhbGl6ZUFwcCIsImNyZWRlbnRpYWwiLCJjZXJ0IiwiZGF0YWJhc2VVUkwiLCJEQl9VUkwiLCJhdXRoIiwiZGIiLCJmaXJlc3RvcmUiLCJtZXNzYWdpbmciLCJnZXRTaW5nbGUiLCJjb2xsZWN0aW9uIiwiZG9jSWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImRvYyIsImdldCIsInRoZW4iLCJleGlzdHMiLCJkYXRhIl0sIm1hcHBpbmdzIjoic0pBQUE7QUFDQSxnRDtBQUNBLElBQU1BLGNBQWMsR0FBSSxZQUFNO0FBQzVCLE1BQUlDLGVBQUdDLFVBQUgsV0FBaUJDLFNBQWpCLHVCQUFKLEVBQW9EO0FBQ2xELFdBQU9DLE9BQU8sQ0FBQyxrQkFBRCxDQUFkO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBT0MsSUFBSSxDQUFDQyxLQUFMLENBQVdDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUF2QixDQUFQO0FBQ0Q7QUFDRixDQU5zQixFQUF2Qjs7QUFRQUMsS0FBSyxDQUFDQyxhQUFOLENBQW9CO0FBQ2xCQyxFQUFBQSxVQUFVLEVBQUVGLEtBQUssQ0FBQ0UsVUFBTixDQUFpQkMsSUFBakIsQ0FBc0JiLGNBQXRCLENBRE07QUFFbEJjLEVBQUFBLFdBQVcsRUFBRVAsT0FBTyxDQUFDQyxHQUFSLENBQVlPLE1BRlAsRUFBcEI7OztBQUtBLElBQU1DLElBQUksR0FBR04sS0FBSyxDQUFDTSxJQUFOLEVBQWIsQztBQUNBLElBQU1DLEVBQUUsR0FBR1AsS0FBSyxDQUFDUSxTQUFOLEVBQVgsQztBQUNBLElBQU1DLFNBQVMsR0FBR1QsS0FBSyxDQUFDUyxTQUFOLEVBQWxCOztBQUVBOzs7Ozs7QUFNQSxJQUFNQyxTQUFTLEdBQUcsU0FBWkEsU0FBWSxDQUFDQyxVQUFELEVBQWFDLEtBQWIsVUFBdUIsSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN4RVIsSUFBQUEsRUFBRSxDQUFDSSxVQUFILENBQWNBLFVBQWQsRUFBMEJLLEdBQTFCLENBQThCSixLQUE5QixFQUFxQ0ssR0FBckMsR0FBMkNDLElBQTNDLENBQWdELFVBQUFGLEdBQUcsRUFBSTtBQUNyRCxVQUFJQSxHQUFHLENBQUNHLE1BQVIsRUFBZ0I7QUFDZEwsUUFBQUEsT0FBTyxDQUFDRSxHQUFHLENBQUNJLElBQUosRUFBRCxDQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0xOLFFBQUFBLE9BQU8sQ0FBQyxFQUFELENBQVA7QUFDRDtBQUNGLEtBTkQsV0FNUyxvQkFBTUEsT0FBTyxDQUFDLEVBQUQsQ0FBYixFQU5UO0FBT0QsR0FSd0MsQ0FBdkIsRUFBbEIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFkbWluIGZyb20gJ2ZpcmViYXNlLWFkbWluJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuY29uc3Qgc2VydmljZUFjY291bnQgPSAoKCkgPT4ge1xuICBpZiAoZnMuZXhpc3RzU3luYyhgJHtfX2Rpcm5hbWV9Ly4uL2ZpcmViYXNlLmpzb25gKSkge1xuICAgIHJldHVybiByZXF1aXJlKCcuLi9maXJlYmFzZS5qc29uJylcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShwcm9jZXNzLmVudi5GSVJFQkFTRSlcbiAgfVxufSkoKVxuXG5hZG1pbi5pbml0aWFsaXplQXBwKHtcbiAgY3JlZGVudGlhbDogYWRtaW4uY3JlZGVudGlhbC5jZXJ0KHNlcnZpY2VBY2NvdW50KSxcbiAgZGF0YWJhc2VVUkw6IHByb2Nlc3MuZW52LkRCX1VSTFxufSlcblxuY29uc3QgYXV0aCA9IGFkbWluLmF1dGgoKVxuY29uc3QgZGIgPSBhZG1pbi5maXJlc3RvcmUoKVxuY29uc3QgbWVzc2FnaW5nID0gYWRtaW4ubWVzc2FnaW5nKClcblxuLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIHNpbXBsaWZ5IGdyYWJiaW5nIGEgc2luZ2xlIGRvY3VtZW50IGZyb20gZmlyZXN0b3JlIGJ5IElEXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sbGVjdGlvbiB0aGUgY29sbGVjdGlvbiBuYW1lIGluIHdoaWNoIHRoZSBkb2N1bWVudCBpcyBzdG9yZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBkb2NJZCB0aGUgSUQgb2YgdGhlIGRvY3VtZW50IHRvIGZldGNoXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBmaXJlYmFzZSBkb2MgKG9yIGVtcHR5IG9iamVjdClcbiAqL1xuY29uc3QgZ2V0U2luZ2xlID0gKGNvbGxlY3Rpb24sIGRvY0lkKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gIGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbikuZG9jKGRvY0lkKS5nZXQoKS50aGVuKGRvYyA9PiB7XG4gICAgaWYgKGRvYy5leGlzdHMpIHtcbiAgICAgIHJlc29sdmUoZG9jLmRhdGEoKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSh7fSlcbiAgICB9XG4gIH0pLmNhdGNoKCgpID0+IHJlc29sdmUoe30pKVxufSlcblxuZXhwb3J0IHsgYXV0aCwgZGIsIGdldFNpbmdsZSwgbWVzc2FnaW5nIH1cbiJdfQ==