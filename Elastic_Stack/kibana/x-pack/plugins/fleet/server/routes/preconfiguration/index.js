"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePreconfigurationHandler = exports.registerRoutes = void 0;

var _constants = require("../../constants");

var _types = require("../../types");

var _errors = require("../../errors");

var _services = require("../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updatePreconfigurationHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;
  const defaultOutput = await _services.outputService.ensureDefaultOutput(soClient);
  const {
    agentPolicies,
    packages
  } = request.body;

  try {
    var _ref;

    const body = await (0, _services.ensurePreconfiguredPackagesAndPolicies)(soClient, esClient, (_ref = agentPolicies) !== null && _ref !== void 0 ? _ref : [], packages !== null && packages !== void 0 ? packages : [], defaultOutput);
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.updatePreconfigurationHandler = updatePreconfigurationHandler;

const registerRoutes = router => {
  router.put({
    path: _constants.PRECONFIGURATION_API_ROUTES.UPDATE_PATTERN,
    validate: _types.PutPreconfigurationSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, updatePreconfigurationHandler);
};

exports.registerRoutes = registerRoutes;