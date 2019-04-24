/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module './firebase'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n\n\nconst teamsRef = !(function webpackMissingModule() { var e = new Error(\"Cannot find module './firebase'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).collection('teams')\nconst usersRef = !(function webpackMissingModule() { var e = new Error(\"Cannot find module './firebase'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).collection('users')\nconst channelsRef = !(function webpackMissingModule() { var e = new Error(\"Cannot find module './firebase'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).collection('channels')\n\nconst driver = {\n  teams: {\n    get: get(teamsRef),\n    save: save(teamsRef),\n    all: all(teamsRef)\n  },\n  channels: {\n    get: get(channelsRef),\n    save: save(channelsRef),\n    all: all(channelsRef)\n  },\n  users: {\n    get: get(usersRef),\n    save: save(usersRef),\n    all: all(usersRef)\n  }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (driver);\n\nfunction get (firebaseRef) {\n  return id => new Promise((resolve, reject) => firebaseRef.doc(id).get().then(doc => {\n    if (!doc.exists) {\n      reject(Error('Document not found'))\n    } else {\n      resolve(doc.data())\n    }\n  }).catch(reject))\n}\n\nfunction save (firebaseRef) {\n  return data => firebaseRef.doc(data.id).set(data, { merge: true })\n}\n\nfunction all (firebaseRef) {\n  return () => new Promise((resolve, reject) => firebaseRef.get().then(snapshot => {\n    resolve(snapshot.toArray().map(doc => doc.data()))\n  }).catch(reject))\n}\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });