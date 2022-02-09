"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AlertingAuthorization", {
  enumerable: true,
  get: function () {
    return _authorization.AlertingAuthorization;
  }
});
Object.defineProperty(exports, "AlertingAuthorizationEntity", {
  enumerable: true,
  get: function () {
    return _authorization.AlertingAuthorizationEntity;
  }
});
Object.defineProperty(exports, "AlertingAuthorizationFilterType", {
  enumerable: true,
  get: function () {
    return _authorization.AlertingAuthorizationFilterType;
  }
});
Object.defineProperty(exports, "DEFAULT_MAX_EPHEMERAL_ACTIONS_PER_ALERT", {
  enumerable: true,
  get: function () {
    return _config.DEFAULT_MAX_EPHEMERAL_ACTIONS_PER_ALERT;
  }
});
Object.defineProperty(exports, "ReadOperations", {
  enumerable: true,
  get: function () {
    return _authorization.ReadOperations;
  }
});
Object.defineProperty(exports, "WriteOperations", {
  enumerable: true,
  get: function () {
    return _authorization.WriteOperations;
  }
});
exports.config = void 0;
Object.defineProperty(exports, "getEsErrorMessage", {
  enumerable: true,
  get: function () {
    return _errors.getEsErrorMessage;
  }
});
Object.defineProperty(exports, "parseDuration", {
  enumerable: true,
  get: function () {
    return _lib.parseDuration;
  }
});
exports.plugin = void 0;

var _lodash = require("lodash");

var _plugin = require("./plugin");

var _config = require("./config");

var _lib = require("./lib");

var _errors = require("./lib/errors");

var _authorization = require("./authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = initContext => new _plugin.AlertingPlugin(initContext);

exports.plugin = plugin;
const config = {
  schema: _config.configSchema,
  deprecations: ({
    renameFromRoot
  }) => [renameFromRoot('xpack.alerts.healthCheck', 'xpack.alerting.healthCheck', {
    level: 'warning'
  }), renameFromRoot('xpack.alerts.invalidateApiKeysTask.interval', 'xpack.alerting.invalidateApiKeysTask.interval', {
    level: 'warning'
  }), renameFromRoot('xpack.alerts.invalidateApiKeysTask.removalDelay', 'xpack.alerting.invalidateApiKeysTask.removalDelay', {
    level: 'warning'
  }), (settings, fromPath, addDeprecation) => {
    const alerting = (0, _lodash.get)(settings, fromPath);

    if ((alerting === null || alerting === void 0 ? void 0 : alerting.enabled) === false || (alerting === null || alerting === void 0 ? void 0 : alerting.enabled) === true) {
      addDeprecation({
        configPath: 'xpack.alerting.enabled',
        message: `"xpack.alerting.enabled" is deprecated. The ability to disable this plugin will be removed in 8.0.0.`,
        correctiveActions: {
          manualSteps: [`Remove "xpack.alerting.enabled" from your kibana configs.`]
        }
      });
    }
  }]
};
exports.config = config;