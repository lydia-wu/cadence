"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetadataForEndpoints = getMetadataForEndpoints;

var _query_builders = require("../../routes/metadata/query_builders");

var _query_strategies = require("../../routes/metadata/support/query_strategies");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// FIXME: fold this function into the EndpointMetadaService


async function getMetadataForEndpoints(endpointIDs, requestHandlerContext) {
  const query = (0, _query_builders.getESQueryHostMetadataByIDs)(endpointIDs);
  const esClient = requestHandlerContext.core.elasticsearch.client.asCurrentUser;
  const {
    body
  } = await esClient.search(query);
  const hosts = (0, _query_strategies.queryResponseToHostListResult)(body);
  return hosts.resultList;
}