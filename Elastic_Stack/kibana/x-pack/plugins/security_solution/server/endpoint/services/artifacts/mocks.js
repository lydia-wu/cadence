"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getManifestClientMock = exports.createEndpointArtifactClientMock = void 0;

var _mocks = require("src/core/server/mocks");

var _manifest_client = require("./manifest_client");

var _artifact_client = require("./artifact_client");

var _mocks2 = require("../../../../../../../src/core/server/mocks");

var _services = require("../../../../../fleet/server/services");

var _mocks3 = require("../../../../../fleet/server/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Because mocks are for testing only, should be ok to import the FleetArtifactsClient directly
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


const getManifestClientMock = savedObjectsClient => {
  if (savedObjectsClient !== undefined) {
    return new _manifest_client.ManifestClient(savedObjectsClient, 'v1');
  }

  return new _manifest_client.ManifestClient(_mocks.savedObjectsClientMock.create(), 'v1');
};
/**
 * Returns back a mocked EndpointArtifactClient along with the internal FleetArtifactsClient and the Es Clients that are being used
 * @param esClient
 */


exports.getManifestClientMock = getManifestClientMock;

const createEndpointArtifactClientMock = (esClient = _mocks2.elasticsearchServiceMock.createScopedClusterClient().asInternalUser) => {
  const fleetArtifactClientMocked = (0, _mocks3.createArtifactsClientMock)();
  const endpointArtifactClientMocked = new _artifact_client.EndpointArtifactClient(fleetArtifactClientMocked); // Return the interface mocked with jest.fn() that fowards calls to the real instance

  return {
    createArtifact: jest.fn(async (...args) => {
      const fleetArtifactClient = new _services.FleetArtifactsClient(esClient, 'endpoint');
      const endpointArtifactClient = new _artifact_client.EndpointArtifactClient(fleetArtifactClient);
      const response = await endpointArtifactClient.createArtifact(...args);
      return response;
    }),
    listArtifacts: jest.fn((...args) => endpointArtifactClientMocked.listArtifacts(...args)),
    getArtifact: jest.fn((...args) => endpointArtifactClientMocked.getArtifact(...args)),
    deleteArtifact: jest.fn((...args) => endpointArtifactClientMocked.deleteArtifact(...args)),
    _esClient: esClient
  };
};

exports.createEndpointArtifactClientMock = createEndpointArtifactClientMock;