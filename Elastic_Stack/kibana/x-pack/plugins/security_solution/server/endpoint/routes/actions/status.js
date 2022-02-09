"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionStatusRequestHandler = void 0;
exports.registerActionStatusRoutes = registerActionStatusRoutes;

var _actions = require("../../../../common/endpoint/schema/actions");

var _constants = require("../../../../common/endpoint/constants");

var _services = require("../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Registers routes for checking status of endpoints based on pending actions
 */


function registerActionStatusRoutes(router, endpointContext) {
  router.get({
    path: _constants.ACTION_STATUS_ROUTE,
    validate: _actions.ActionStatusRequestSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, actionStatusRequestHandler(endpointContext));
}

const actionStatusRequestHandler = function (endpointContext) {
  return async (context, req, res) => {
    const esClient = context.core.elasticsearch.client.asCurrentUser;
    const agentIDs = Array.isArray(req.query.agent_ids) ? [...new Set(req.query.agent_ids)] : [req.query.agent_ids];
    const response = await (0, _services.getPendingActionCounts)(esClient, endpointContext.service.getEndpointMetadataService(), agentIDs, endpointContext.experimentalFeatures.pendingActionResponsesWithAck);
    return res.ok({
      body: {
        data: response
      }
    });
  };
};

exports.actionStatusRequestHandler = actionStatusRequestHandler;