"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.endpointFilters = exports.GetMetadataRequestSchema = exports.GetMetadataListRequestSchema = void 0;
exports.registerEndpointRoutes = registerEndpointRoutes;

var _configSchema = require("@kbn/config-schema");

var _types = require("../../../../common/endpoint/types");

var _handlers = require("./handlers");

var _constants = require("../../../../common/endpoint/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* Filters that can be applied to the endpoint fetch route */


const endpointFilters = _configSchema.schema.object({
  kql: _configSchema.schema.nullable(_configSchema.schema.string()),
  host_status: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.literal(_types.HostStatus.HEALTHY.toString()), _configSchema.schema.literal(_types.HostStatus.OFFLINE.toString()), _configSchema.schema.literal(_types.HostStatus.UPDATING.toString()), _configSchema.schema.literal(_types.HostStatus.UNHEALTHY.toString()), _configSchema.schema.literal(_types.HostStatus.INACTIVE.toString())])))
});

exports.endpointFilters = endpointFilters;
const GetMetadataRequestSchema = {
  params: _configSchema.schema.object({
    id: _configSchema.schema.string()
  })
};
exports.GetMetadataRequestSchema = GetMetadataRequestSchema;
const GetMetadataListRequestSchema = {
  body: _configSchema.schema.nullable(_configSchema.schema.object({
    paging_properties: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.oneOf([
    /**
     * the number of results to return for this request per page
     */
    _configSchema.schema.object({
      page_size: _configSchema.schema.number({
        defaultValue: 10,
        min: 1,
        max: 10000
      })
    }),
    /**
     * the zero based page index of the the total number of pages of page size
     */
    _configSchema.schema.object({
      page_index: _configSchema.schema.number({
        defaultValue: 0,
        min: 0
      })
    })]))),
    filters: endpointFilters
  }))
};
exports.GetMetadataListRequestSchema = GetMetadataListRequestSchema;

function registerEndpointRoutes(router, endpointAppContext) {
  const logger = (0, _handlers.getLogger)(endpointAppContext);
  router.post({
    path: `${_constants.HOST_METADATA_LIST_ROUTE}`,
    validate: GetMetadataListRequestSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, (0, _handlers.getMetadataListRequestHandler)(endpointAppContext, logger));
  router.get({
    path: `${_constants.HOST_METADATA_GET_ROUTE}`,
    validate: GetMetadataRequestSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, (0, _handlers.getMetadataRequestHandler)(endpointAppContext, logger));
}