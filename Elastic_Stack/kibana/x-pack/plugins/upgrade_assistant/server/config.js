"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _semver = require("semver");

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const kibanaVersion = new _semver.SemVer(_constants.MAJOR_VERSION); // -------------------------------
// >= 8.x
// -------------------------------

const schemaLatest = _configSchema.schema.object({
  ui: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    })
  }),

  /*
   * This will default to true up until the last minor before the next major.
   * In readonly mode, the user will not be able to perform any actions in the UI
   * and will be presented with a message indicating as such.
   */
  readonly: _configSchema.schema.boolean({
    defaultValue: true
  })
});

const configLatest = {
  exposeToBrowser: {
    ui: true,
    readonly: true
  },
  schema: schemaLatest,
  deprecations: () => []
}; // -------------------------------
// 7.x
// -------------------------------

const schema7x = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  ui: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    })
  }),

  /*
   * This will default to true up until the last minor before the next major.
   * In readonly mode, the user will not be able to perform any actions in the UI
   * and will be presented with a message indicating as such.
   */
  readonly: _configSchema.schema.boolean({
    defaultValue: false
  })
});

const config7x = {
  exposeToBrowser: {
    ui: true,
    readonly: true
  },
  schema: schema7x,
  deprecations: () => [(completeConfig, rootPath, addDeprecation) => {
    if ((0, _lodash.get)(completeConfig, 'xpack.upgrade_assistant.enabled') === undefined) {
      return completeConfig;
    }

    addDeprecation({
      configPath: 'xpack.upgrade_assistant.enabled',
      level: 'critical',
      title: _i18n.i18n.translate('xpack.upgradeAssistant.deprecations.enabledTitle', {
        defaultMessage: 'Setting "xpack.upgrade_assistant.enabled" is deprecated'
      }),
      message: _i18n.i18n.translate('xpack.upgradeAssistant.deprecations.enabledMessage', {
        defaultMessage: 'To disallow users from accessing the Upgrade Assistant UI, use the "xpack.upgrade_assistant.ui.enabled" setting instead of "xpack.upgrade_assistant.enabled".'
      }),
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.upgradeAssistant.deprecations.enabled.manualStepOneMessage', {
          defaultMessage: 'Open the kibana.yml config file.'
        }), _i18n.i18n.translate('xpack.upgradeAssistant.deprecations.enabled.manualStepTwoMessage', {
          defaultMessage: 'Change the "xpack.upgrade_assistant.enabled" setting to "xpack.upgrade_assistant.ui.enabled".'
        })]
      }
    });
    return completeConfig;
  }]
};
const config = kibanaVersion.major < 8 ? config7x : configLatest;
exports.config = config;