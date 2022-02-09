"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _heatmap_grid = require("./heatmap_grid");

Object.keys(_heatmap_grid).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _heatmap_grid[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _heatmap_grid[key];
    }
  });
});

var _heatmap_legend = require("./heatmap_legend");

Object.keys(_heatmap_legend).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _heatmap_legend[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _heatmap_legend[key];
    }
  });
});

var _heatmap_chart = require("./heatmap_chart");

Object.keys(_heatmap_chart).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _heatmap_chart[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _heatmap_chart[key];
    }
  });
});