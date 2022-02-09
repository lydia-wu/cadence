"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getMetadataForEndpoints: true
};
Object.defineProperty(exports, "getMetadataForEndpoints", {
  enumerable: true,
  get: function () {
    return _metadata.getMetadataForEndpoints;
  }
});

var _artifacts = require("./artifacts");

Object.keys(_artifacts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _artifacts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _artifacts[key];
    }
  });
});

var _metadata = require("./metadata/metadata");

var _actions = require("./actions");

Object.keys(_actions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _actions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _actions[key];
    }
  });
});