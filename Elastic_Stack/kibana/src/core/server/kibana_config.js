"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const deprecations = () => [(settings, fromPath, addDeprecation) => {
  const kibana = settings[fromPath];

  if (kibana !== null && kibana !== void 0 && kibana.index) {
    addDeprecation({
      configPath: 'kibana.index',
      level: 'critical',
      title: _i18n.i18n.translate('core.kibana.index.deprecationTitle', {
        defaultMessage: `Setting "kibana.index" is deprecated`
      }),
      message: _i18n.i18n.translate('core.kibana.index.deprecationMessage', {
        defaultMessage: `"kibana.index" is deprecated. Multitenancy by changing "kibana.index" will not be supported starting in 8.0. See https://ela.st/kbn-remove-legacy-multitenancy for more details`
      }),
      documentationUrl: 'https://ela.st/kbn-remove-legacy-multitenancy',
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('core.kibana.index.deprecationManualStep1', {
          defaultMessage: `If you rely on this setting to achieve multitenancy you should use Spaces, cross-cluster replication, or cross-cluster search instead.`
        }), _i18n.i18n.translate('core.kibana.index.deprecationManualStep2', {
          defaultMessage: `To migrate to Spaces, we encourage using saved object management to export your saved objects from a tenant into the default tenant in a space.`
        })]
      }
    });
  }

  return settings;
}];

const config = {
  path: 'kibana',
  schema: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    index: _configSchema.schema.string({
      defaultValue: '.kibana'
    })
  }),
  deprecations
};
exports.config = config;