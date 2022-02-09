"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "INDEX_THRESHOLD_ID", {
  enumerable: true,
  get: function () {
    return _alert_type.ID;
  }
});
exports.plugin = exports.config = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _plugin = require("./plugin");

var _config = require("../common/config");

var _alert_type = require("./alert_types/index_threshold/alert_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  exposeToBrowser: {},
  schema: _config.configSchema,
  deprecations: () => [(settings, fromPath, addDeprecation) => {
    const stackAlerts = (0, _lodash.get)(settings, fromPath);

    if ((stackAlerts === null || stackAlerts === void 0 ? void 0 : stackAlerts.enabled) === false || (stackAlerts === null || stackAlerts === void 0 ? void 0 : stackAlerts.enabled) === true) {
      addDeprecation({
        level: 'critical',
        configPath: 'xpack.stack_alerts.enabled',
        title: _i18n.i18n.translate('xpack.stackAlerts.deprecations.enabledTitle', {
          defaultMessage: 'Setting "xpack.stack_alerts.enabled" is deprecated'
        }),
        message: _i18n.i18n.translate('xpack.stackAlerts.deprecations.enabledMessage', {
          defaultMessage: 'This setting will be removed in 8.0 and the Stack Rules plugin will always be enabled.'
        }),
        documentationUrl: `https://www.elastic.co/guide/en/kibana/current/kibana-privileges.html#kibana-feature-privileges`,
        correctiveActions: {
          manualSteps: [_i18n.i18n.translate('xpack.stackAlerts.deprecations.enabled.manualStepOneMessage', {
            defaultMessage: 'Remove "xpack.stack_alerts.enabled" from kibana.yml.'
          }), _i18n.i18n.translate('xpack.stackAlerts.deprecations.enabled.manualStepTwoMessage', {
            defaultMessage: 'Use Kibana feature privileges to restrict access to Stack Rules.'
          })]
        }
      });
    }
  }]
};
exports.config = config;

const plugin = ctx => new _plugin.AlertingBuiltinsPlugin(ctx);

exports.plugin = plugin;