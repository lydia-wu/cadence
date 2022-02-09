"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Kibana configuration schema
 */


const transformConfigSchema = _configSchema.schema.object({
  auto_start: _configSchema.schema.boolean(),
  auto_create: _configSchema.schema.boolean(),
  enabled: _configSchema.schema.boolean(),
  query: _configSchema.schema.maybe(_configSchema.schema.object({}, {
    unknowns: 'allow'
  })),
  retention_policy: _configSchema.schema.maybe(_configSchema.schema.object({
    time: _configSchema.schema.object({
      field: _configSchema.schema.string(),
      max_age: _configSchema.schema.string()
    })
  })),
  docs_per_second: _configSchema.schema.maybe(_configSchema.schema.number({
    min: 1
  })),
  max_page_search_size: _configSchema.schema.maybe(_configSchema.schema.number({
    min: 1,
    max: 10000
  })),
  settings: _configSchema.schema.arrayOf(_configSchema.schema.object({
    prefix: _configSchema.schema.string(),
    indices: _configSchema.schema.arrayOf(_configSchema.schema.string()),
    data_sources: _configSchema.schema.arrayOf(_configSchema.schema.arrayOf(_configSchema.schema.string())),
    disable_widgets: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
    disable_transforms: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
  }))
});

exports.transformConfigSchema = transformConfigSchema;