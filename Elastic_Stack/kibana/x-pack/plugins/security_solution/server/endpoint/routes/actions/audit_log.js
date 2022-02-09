"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerActionAuditLogRoutes = registerActionAuditLogRoutes;

var _constants = require("../../../../common/endpoint/constants");

var _actions = require("../../../../common/endpoint/schema/actions");

var _audit_log_handler = require("./audit_log_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Registers the endpoint activity_log route
 */


function registerActionAuditLogRoutes(router, endpointContext) {
  router.get({
    path: _constants.ENDPOINT_ACTION_LOG_ROUTE,
    validate: _actions.EndpointActionLogRequestSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, (0, _audit_log_handler.actionsLogRequestHandler)(endpointContext));
}