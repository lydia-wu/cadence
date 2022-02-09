"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index_data_visualizer_schemas = require("./index_data_visualizer_schemas");

Object.keys(_index_data_visualizer_schemas).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index_data_visualizer_schemas[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index_data_visualizer_schemas[key];
    }
  });
});