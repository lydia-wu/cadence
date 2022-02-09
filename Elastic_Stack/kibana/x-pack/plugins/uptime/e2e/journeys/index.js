"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _uptime = require("./uptime.journey");

Object.keys(_uptime).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _uptime[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _uptime[key];
    }
  });
});