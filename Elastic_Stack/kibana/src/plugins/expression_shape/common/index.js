"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getAvailableShapes: true,
  getAvailableProgressShapes: true
};
Object.defineProperty(exports, "getAvailableProgressShapes", {
  enumerable: true,
  get: function () {
    return _available_shapes.getAvailableProgressShapes;
  }
});
Object.defineProperty(exports, "getAvailableShapes", {
  enumerable: true,
  get: function () {
    return _available_shapes.getAvailableShapes;
  }
});

var _constants = require("./constants");

Object.keys(_constants).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _constants[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _constants[key];
    }
  });
});

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _available_shapes = require("./lib/available_shapes");