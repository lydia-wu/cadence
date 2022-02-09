"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.INDEX_PREFIX_FOR_BACKING_INDICES = exports.INDEX_PREFIX = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  deprecations: ({
    deprecate,
    unused
  }) => [deprecate('enabled', '8.0.0', {
    level: 'critical'
  }), unused('unsafe.indexUpgrade.enabled', {
    level: 'warning'
  })],
  schema: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    write: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      })
    }),
    unsafe: _configSchema.schema.object({
      legacyMultiTenancy: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        })
      }),
      indexUpgrade: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    })
  })
};
exports.config = config;
const INDEX_PREFIX = '.alerts';
exports.INDEX_PREFIX = INDEX_PREFIX;
const INDEX_PREFIX_FOR_BACKING_INDICES = '.internal.alerts';
exports.INDEX_PREFIX_FOR_BACKING_INDICES = INDEX_PREFIX_FOR_BACKING_INDICES;