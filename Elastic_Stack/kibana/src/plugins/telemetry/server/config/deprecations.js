"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deprecateEndpointConfigs = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const deprecateEndpointConfigs = (rawConfig, fromPath, addDeprecation) => {
  const telemetryConfig = rawConfig[fromPath];

  if (!telemetryConfig) {
    return;
  }

  const unset = [];
  const endpointConfigPaths = ['url', 'optInStatusUrl'];
  let useStaging = telemetryConfig.sendUsageTo === 'staging' ? true : false;

  for (const configPath of endpointConfigPaths) {
    const configValue = telemetryConfig[configPath];
    const fullConfigPath = `telemetry.${configPath}`;

    if (typeof configValue !== 'undefined') {
      unset.push({
        path: fullConfigPath
      });

      if (/telemetry-staging\.elastic\.co/i.test(configValue)) {
        useStaging = true;
      }

      addDeprecation({
        configPath: fullConfigPath,
        level: 'critical',
        title: _i18n.i18n.translate('telemetry.endpointConfigs.deprecationTitle', {
          defaultMessage: 'Setting "{configPath}" is deprecated',
          values: {
            configPath: fullConfigPath
          }
        }),
        message: _i18n.i18n.translate('telemetry.endpointConfigs.deprecationMessage', {
          defaultMessage: '"{configPath}" has been deprecated. Set "telemetry.sendUsageTo: staging" to the Kibana configurations to send usage to the staging endpoint.',
          values: {
            configPath: fullConfigPath
          }
        }),
        correctiveActions: {
          manualSteps: [_i18n.i18n.translate('telemetry.endpointConfigs.deprecationManualStep1', {
            defaultMessage: 'Remove "{configPath}" from the Kibana configuration.',
            values: {
              configPath: fullConfigPath
            }
          }), _i18n.i18n.translate('telemetry.endpointConfigs.deprecationManualStep2', {
            defaultMessage: 'To send usage to the staging endpoint add "telemetry.sendUsageTo: staging" to the Kibana configuration.'
          })]
        }
      });
    }
  }

  return {
    set: [{
      path: 'telemetry.sendUsageTo',
      value: useStaging ? 'staging' : 'prod'
    }],
    unset
  };
};

exports.deprecateEndpointConfigs = deprecateEndpointConfigs;