"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  PLUGIN_ID: true,
  PLUGIN_NAME: true
};
exports.PLUGIN_NAME = exports.PLUGIN_ID = void 0;

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

var _search_strategy = require("./search_strategy");

Object.keys(_search_strategy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _search_strategy[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _search_strategy[key];
    }
  });
});

var _accessibility = require("./utils/accessibility");

Object.keys(_accessibility).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _accessibility[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _accessibility[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO: https://github.com/elastic/kibana/issues/110904

/* eslint-disable @kbn/eslint/no_export_all */

const PLUGIN_ID = 'timelines';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN_NAME = 'timelines';
exports.PLUGIN_NAME = PLUGIN_NAME;