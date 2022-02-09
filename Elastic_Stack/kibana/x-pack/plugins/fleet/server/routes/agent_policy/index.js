"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;

var _constants = require("../../constants");

var _types = require("../../types");

var _handlers = require("./handlers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerRoutes = routers => {
  // List - Fleet Server needs access to run setup
  routers.fleetSetup.get({
    path: _constants.AGENT_POLICY_API_ROUTES.LIST_PATTERN,
    validate: _types.GetAgentPoliciesRequestSchema // Disable this tag and the automatic RBAC support until elastic/fleet-server access is removed in 8.0
    // Required to allow elastic/fleet-server to access this API.
    // options: { tags: [`access:${PLUGIN_ID}-read`] },

  }, _handlers.getAgentPoliciesHandler); // Get one

  routers.superuser.get({
    path: _constants.AGENT_POLICY_API_ROUTES.INFO_PATTERN,
    validate: _types.GetOneAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getOneAgentPolicyHandler); // Create

  routers.superuser.post({
    path: _constants.AGENT_POLICY_API_ROUTES.CREATE_PATTERN,
    validate: _types.CreateAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.createAgentPolicyHandler); // Update

  routers.superuser.put({
    path: _constants.AGENT_POLICY_API_ROUTES.UPDATE_PATTERN,
    validate: _types.UpdateAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.updateAgentPolicyHandler); // Copy

  routers.superuser.post({
    path: _constants.AGENT_POLICY_API_ROUTES.COPY_PATTERN,
    validate: _types.CopyAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.copyAgentPolicyHandler); // Delete

  routers.superuser.post({
    path: _constants.AGENT_POLICY_API_ROUTES.DELETE_PATTERN,
    validate: _types.DeleteAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.deleteAgentPoliciesHandler); // Get one full agent policy

  routers.superuser.get({
    path: _constants.AGENT_POLICY_API_ROUTES.FULL_INFO_PATTERN,
    validate: _types.GetFullAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getFullAgentPolicy); // Download one full agent policy

  routers.superuser.get({
    path: _constants.AGENT_POLICY_API_ROUTES.FULL_INFO_DOWNLOAD_PATTERN,
    validate: _types.GetFullAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.downloadFullAgentPolicy);
};

exports.registerRoutes = registerRoutes;