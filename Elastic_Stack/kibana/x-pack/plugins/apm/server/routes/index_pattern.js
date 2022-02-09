"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexPatternRouteRepository = void 0;

var _create_static_index_pattern = require("../lib/index_pattern/create_static_index_pattern");

var _create_apm_server_route_repository = require("./create_apm_server_route_repository");

var _setup_request = require("../lib/helpers/setup_request");

var _get_dynamic_index_pattern = require("../lib/index_pattern/get_dynamic_index_pattern");

var _create_apm_server_route = require("./create_apm_server_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const staticIndexPatternRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/index_pattern/static',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      request,
      core,
      plugins: {
        spaces
      },
      config
    } = resources;
    const [setup, savedObjectsClient] = await Promise.all([(0, _setup_request.setupRequest)(resources), core.start().then(coreStart => coreStart.savedObjects.createInternalRepository())]);
    const spaceId = spaces === null || spaces === void 0 ? void 0 : spaces.setup.spacesService.getSpaceId(request);
    const didCreateIndexPattern = await (0, _create_static_index_pattern.createStaticIndexPattern)({
      setup,
      config,
      savedObjectsClient,
      spaceId
    });
    return {
      created: didCreateIndexPattern
    };
  }
});
const dynamicIndexPatternRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/index_pattern/dynamic',
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    config,
    logger
  }) => {
    const dynamicIndexPattern = await (0, _get_dynamic_index_pattern.getDynamicIndexPattern)({
      context,
      config,
      logger
    });
    return {
      dynamicIndexPattern
    };
  }
});
const indexPatternRouteRepository = (0, _create_apm_server_route_repository.createApmServerRouteRepository)().add(staticIndexPatternRoute).add(dynamicIndexPatternRoute);
exports.indexPatternRouteRepository = indexPatternRouteRepository;