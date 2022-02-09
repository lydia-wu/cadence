"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ROUTE_TAG_CAN_REDIRECT", {
  enumerable: true,
  get: function () {
    return _tags.ROUTE_TAG_CAN_REDIRECT;
  }
});
exports.plugin = exports.config = void 0;

var _config = require("./config");

var _config_deprecations = require("./config_deprecations");

var _plugin = require("./plugin");

var _tags = require("./routes/tags");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _config.ConfigSchema,
  deprecations: _config_deprecations.securityConfigDeprecationProvider,
  exposeToBrowser: {
    loginAssistanceMessage: true,
    showInsecureClusterWarning: true,
    sameSiteCookies: true
  }
};
exports.config = config;

const plugin = initializerContext => new _plugin.SecurityPlugin(initializerContext);

exports.plugin = plugin;