"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "addSpaceIdToPath", {
  enumerable: true,
  get: function () {
    return _common.addSpaceIdToPath;
  }
});
exports.plugin = exports.config = void 0;

var _config = require("./config");

var _plugin = require("./plugin");

var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// These exports are part of public Spaces plugin contract, any change in signature of exported
// functions or removal of exports should be considered as a breaking change. Ideally we should
// reduce number of such exports to zero and provide everything we want to expose via Setup/Start
// run-time contracts.


const config = {
  schema: _config.ConfigSchema,
  deprecations: _config.spacesConfigDeprecationProvider
};
exports.config = config;

const plugin = initializerContext => new _plugin.SpacesPlugin(initializerContext);

exports.plugin = plugin;