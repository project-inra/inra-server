"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Router = require("./lib/Router");

Object.keys(_Router).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Router[key];
    }
  });
});

var _Server = require("./lib/Server");

var _Server2 = _interopRequireDefault(_Server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Server2.default;
module.exports = exports["default"];