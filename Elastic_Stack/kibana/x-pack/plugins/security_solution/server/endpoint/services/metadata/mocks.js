"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEndpointMetadataServiceTestContextMock = void 0;

var _endpoint_metadata_service = require("./endpoint_metadata_service");

var _mocks = require("../../../../../../../src/core/server/mocks");

var _mocks2 = require("../../../../../fleet/server/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createEndpointMetadataServiceTestContextMock = (savedObjectsStart = _mocks.savedObjectsServiceMock.createStartContract(), agentService = (0, _mocks2.createMockAgentService)(), agentPolicyService = (0, _mocks2.createMockAgentPolicyService)()) => {
  const endpointMetadataService = new _endpoint_metadata_service.EndpointMetadataService(savedObjectsStart, agentService, agentPolicyService);
  return {
    savedObjectsStart,
    agentService,
    agentPolicyService,
    endpointMetadataService
  };
};

exports.createEndpointMetadataServiceTestContextMock = createEndpointMetadataServiceTestContextMock;