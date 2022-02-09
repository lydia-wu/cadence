"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const apmConfigSchema = _configSchema.schema.object({
  url: _configSchema.schema.maybe(_configSchema.schema.string()),
  secret_token: _configSchema.schema.maybe(_configSchema.schema.string()),
  ui: _configSchema.schema.maybe(_configSchema.schema.object({
    url: _configSchema.schema.maybe(_configSchema.schema.string())
  }))
});

const fullStoryConfigSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: false
  }),
  org_id: _configSchema.schema.conditional(_configSchema.schema.siblingRef('enabled'), true, _configSchema.schema.string({
    minLength: 1
  }), _configSchema.schema.maybe(_configSchema.schema.string()))
});

const configSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  id: _configSchema.schema.maybe(_configSchema.schema.string()),
  apm: _configSchema.schema.maybe(apmConfigSchema),
  cname: _configSchema.schema.maybe(_configSchema.schema.string()),
  base_url: _configSchema.schema.maybe(_configSchema.schema.string()),
  profile_url: _configSchema.schema.maybe(_configSchema.schema.string()),
  deployment_url: _configSchema.schema.maybe(_configSchema.schema.string()),
  organization_url: _configSchema.schema.maybe(_configSchema.schema.string()),
  full_story: fullStoryConfigSchema
});

const config = {
  exposeToBrowser: {
    id: true,
    cname: true,
    base_url: true,
    profile_url: true,
    deployment_url: true,
    organization_url: true,
    full_story: true
  },
  deprecations: ({
    deprecate
  }) => [deprecate('enabled', '8.0.0')],
  schema: configSchema
};
exports.config = config;