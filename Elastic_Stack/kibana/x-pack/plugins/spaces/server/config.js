"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigSchema = void 0;
exports.createConfig$ = createConfig$;
exports.spacesConfigDeprecationProvider = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ConfigSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  maxSpaces: _configSchema.schema.number({
    defaultValue: 1000
  })
});

exports.ConfigSchema = ConfigSchema;

function createConfig$(context) {
  return context.config.create();
}

const disabledDeprecation = (config, fromPath, addDeprecation) => {
  var _config$xpack;

  if ('enabled' in ((config === null || config === void 0 ? void 0 : (_config$xpack = config.xpack) === null || _config$xpack === void 0 ? void 0 : _config$xpack.spaces) || {})) {
    addDeprecation({
      configPath: 'xpack.spaces.enabled',
      title: _i18n.i18n.translate('xpack.spaces.deprecations.enabledTitle', {
        defaultMessage: 'Setting "xpack.spaces.enabled" is deprecated'
      }),
      message: _i18n.i18n.translate('xpack.spaces.deprecations.enabledMessage', {
        defaultMessage: 'This setting will be removed in 8.0 and the Spaces plugin will always be enabled.'
      }),
      level: 'critical',
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.spaces.deprecations.enabled.manualStepOneMessage', {
          defaultMessage: `Remove "xpack.spaces.enabled" from kibana.yml.`
        })]
      }
    });
  }
};

const spacesConfigDeprecationProvider = () => {
  return [disabledDeprecation];
};

exports.spacesConfigDeprecationProvider = spacesConfigDeprecationProvider;