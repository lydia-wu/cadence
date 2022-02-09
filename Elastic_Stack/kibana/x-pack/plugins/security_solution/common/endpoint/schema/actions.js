"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HostIsolationRequestSchema = exports.EndpointActionLogRequestSchema = exports.ActionStatusRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const HostIsolationRequestSchema = {
  body: _configSchema.schema.object({
    /** A list of endpoint IDs whose hosts will be isolated (Fleet Agent IDs will be retrieved for these) */
    endpoint_ids: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
      minSize: 1
    }),

    /** If defined, any case associated with the given IDs will be updated */
    alert_ids: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),

    /** Case IDs to be updated */
    case_ids: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
    comment: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.HostIsolationRequestSchema = HostIsolationRequestSchema;
const EndpointActionLogRequestSchema = {
  query: _configSchema.schema.object({
    page: _configSchema.schema.number({
      defaultValue: 1,
      min: 1
    }),
    page_size: _configSchema.schema.number({
      defaultValue: 10,
      min: 1,
      max: 100
    }),
    start_date: _configSchema.schema.string(),
    end_date: _configSchema.schema.string()
  }),
  params: _configSchema.schema.object({
    agent_id: _configSchema.schema.string()
  })
};
exports.EndpointActionLogRequestSchema = EndpointActionLogRequestSchema;
const ActionStatusRequestSchema = {
  query: _configSchema.schema.object({
    agent_ids: _configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string({
      minLength: 1
    }), {
      minSize: 1,
      maxSize: 50
    }), _configSchema.schema.string({
      minLength: 1
    })])
  })
};
exports.ActionStatusRequestSchema = ActionStatusRequestSchema;