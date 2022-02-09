"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AppClient", {
  enumerable: true,
  get: function () {
    return _types.AppClient;
  }
});
Object.defineProperty(exports, "EndpointError", {
  enumerable: true,
  get: function () {
    return _errors.EndpointError;
  }
});
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _plugin.Plugin;
  }
});
exports.plugin = exports.config = void 0;

var _plugin = require("./plugin");

var _config = require("./config");

var _constants = require("../common/constants");

var _types = require("./types");

var _errors = require("./endpoint/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = context => {
  return new _plugin.Plugin(context);
};

exports.plugin = plugin;
const config = {
  exposeToBrowser: {
    enableExperimental: true
  },
  schema: _config.configSchema,
  deprecations: ({
    deprecate,
    renameFromRoot
  }) => [deprecate('enabled', '8.0.0'), renameFromRoot('xpack.siem.enabled', 'xpack.securitySolution.enabled', {
    level: 'critical'
  }), renameFromRoot('xpack.siem.maxRuleImportExportSize', 'xpack.securitySolution.maxRuleImportExportSize', {
    level: 'critical'
  }), renameFromRoot('xpack.siem.maxRuleImportPayloadBytes', 'xpack.securitySolution.maxRuleImportPayloadBytes', {
    level: 'critical'
  }), renameFromRoot('xpack.siem.maxTimelineImportExportSize', 'xpack.securitySolution.maxTimelineImportExportSize', {
    level: 'critical'
  }), renameFromRoot('xpack.siem.maxTimelineImportPayloadBytes', 'xpack.securitySolution.maxTimelineImportPayloadBytes', {
    level: 'critical'
  }), renameFromRoot(`xpack.siem.${_constants.SIGNALS_INDEX_KEY}`, `xpack.securitySolution.${_constants.SIGNALS_INDEX_KEY}`, {
    level: 'critical'
  })]
};
exports.config = config;