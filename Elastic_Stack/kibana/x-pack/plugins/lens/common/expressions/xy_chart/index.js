"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axis_config = require("./axis_config");

Object.keys(_axis_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _axis_config[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _axis_config[key];
    }
  });
});

var _fitting_function = require("./fitting_function");

Object.keys(_fitting_function).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _fitting_function[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fitting_function[key];
    }
  });
});

var _grid_lines_config = require("./grid_lines_config");

Object.keys(_grid_lines_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _grid_lines_config[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _grid_lines_config[key];
    }
  });
});

var _layer_config = require("./layer_config");

Object.keys(_layer_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _layer_config[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _layer_config[key];
    }
  });
});

var _legend_config = require("./legend_config");

Object.keys(_legend_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _legend_config[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _legend_config[key];
    }
  });
});

var _series_type = require("./series_type");

Object.keys(_series_type).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _series_type[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _series_type[key];
    }
  });
});

var _tick_labels_config = require("./tick_labels_config");

Object.keys(_tick_labels_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _tick_labels_config[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tick_labels_config[key];
    }
  });
});

var _xy_args = require("./xy_args");

Object.keys(_xy_args).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _xy_args[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _xy_args[key];
    }
  });
});

var _xy_chart = require("./xy_chart");

Object.keys(_xy_chart).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _xy_chart[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _xy_chart[key];
    }
  });
});

var _labels_orientation_config = require("./labels_orientation_config");

Object.keys(_labels_orientation_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _labels_orientation_config[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _labels_orientation_config[key];
    }
  });
});