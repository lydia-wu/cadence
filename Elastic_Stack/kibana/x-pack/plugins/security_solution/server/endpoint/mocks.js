"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockPackageService = exports.createMockMetadataRequestContext = exports.createMockFleetStartContract = exports.createMockEndpointAppContextServiceStartContract = exports.createMockEndpointAppContextServiceSetupContract = exports.createMockEndpointAppContextService = exports.createMockEndpointAppContext = void 0;
exports.createRouteHandlerContext = createRouteHandlerContext;

var _mocks = require("../../../../../src/core/server/mocks");

var _mocks2 = require("../../../lists/server/mocks");

var _mocks3 = require("../../../security/server/mocks");

var _mocks4 = require("../../../alerting/server/mocks");

var _fixtures = require("../fixtures");

var _mocks5 = require("../../../fleet/server/mocks");

var _mocks__ = require("../lib/detection_engine/routes/__mocks__");

var _manifest_manager = require("./services/artifacts/manifest_manager/manifest_manager.mock");

var _license = require("../../common/license");

var _experimental_features = require("../../common/experimental_features");

var _mocks6 = require("../../../cases/server/client/mocks");

var _request_context_factory = require("../request_context_factory.mock");

var _metadata = require("./services/metadata");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// A TS error (TS2403) is thrown when attempting to export the mock function below from Cases
// plugin server `index.ts`. Its unclear what is actually causing the error. Since this is a Mock
// file and not bundled with the application, adding a eslint disable below and using import from
// a restricted path.
// eslint-disable-next-line @kbn/eslint/no-restricted-paths

/**
 * Creates a mocked EndpointAppContext.
 */


const createMockEndpointAppContext = mockManifestManager => {
  return {
    logFactory: _mocks.loggingSystemMock.create(),
    config: () => Promise.resolve((0, _mocks__.createMockConfig)()),
    service: createMockEndpointAppContextService(mockManifestManager),
    experimentalFeatures: (0, _experimental_features.parseExperimentalConfigValue)((0, _mocks__.createMockConfig)().enableExperimental)
  };
};
/**
 * Creates a mocked EndpointAppContextService
 */


exports.createMockEndpointAppContext = createMockEndpointAppContext;

const createMockEndpointAppContextService = mockManifestManager => {
  return {
    start: jest.fn(),
    stop: jest.fn(),
    getExperimentalFeatures: jest.fn(),
    getAgentService: jest.fn(),
    getAgentPolicyService: jest.fn(),
    getManifestManager: jest.fn().mockReturnValue(mockManifestManager !== null && mockManifestManager !== void 0 ? mockManifestManager : jest.fn())
  };
};
/**
 * Creates a mocked input contract for the `EndpointAppContextService#setup()` method
 */


exports.createMockEndpointAppContextService = createMockEndpointAppContextService;

const createMockEndpointAppContextServiceSetupContract = () => {
  return {
    securitySolutionRequestContextFactory: _request_context_factory.requestContextFactoryMock.create()
  };
};
/**
 * Creates a mocked input contract for the `EndpointAppContextService#start()` method
 */


exports.createMockEndpointAppContextServiceSetupContract = createMockEndpointAppContextServiceSetupContract;

const createMockEndpointAppContextServiceStartContract = () => {
  const config = (0, _mocks__.createMockConfig)();
  const casesClientMock = (0, _mocks6.createCasesClientMock)();

  const savedObjectsStart = _mocks.savedObjectsServiceMock.createStartContract();

  const agentService = (0, _mocks5.createMockAgentService)();
  const agentPolicyService = (0, _mocks5.createMockAgentPolicyService)();
  const endpointMetadataService = new _metadata.EndpointMetadataService(savedObjectsStart, agentService, agentPolicyService);
  return {
    agentService,
    agentPolicyService,
    endpointMetadataService,
    packageService: createMockPackageService(),
    logger: _mocks.loggingSystemMock.create().get('mock_endpoint_app_context'),
    manifestManager: (0, _manifest_manager.getManifestManagerMock)(),
    security: _mocks3.securityMock.createStart(),
    alerting: _mocks4.alertsMock.createStart(),
    config,
    licenseService: new _license.LicenseService(),
    registerIngestCallback: jest.fn(),
    exceptionListsClient: _mocks2.listMock.getExceptionListClient(),
    packagePolicyService: (0, _mocks5.createPackagePolicyServiceMock)(),
    cases: {
      getCasesClientWithRequest: jest.fn(async () => casesClientMock)
    }
  };
};
/**
 * Create mock PackageService
 */


exports.createMockEndpointAppContextServiceStartContract = createMockEndpointAppContextServiceStartContract;

const createMockPackageService = () => {
  return {
    getInstallation: jest.fn(),
    ensureInstalledPackage: jest.fn()
  };
};
/**
 * Creates a mock IndexPatternService for use in tests that need to interact with the Fleet's
 * ESIndexPatternService.
 *
 * @param indexPattern a string index pattern to return when called by a test
 * @returns the same value as `indexPattern` parameter
 */


exports.createMockPackageService = createMockPackageService;

const createMockFleetStartContract = indexPattern => {
  return {
    fleetSetupCompleted: jest.fn().mockResolvedValue(undefined),
    esIndexPatternService: {
      getESIndexPattern: jest.fn().mockResolvedValue(indexPattern)
    },
    agentService: (0, _mocks5.createMockAgentService)(),
    packageService: createMockPackageService(),
    agentPolicyService: (0, _mocks5.createMockAgentPolicyService)(),
    registerExternalCallback: jest.fn((...args) => {}),
    packagePolicyService: (0, _mocks5.createPackagePolicyServiceMock)(),
    createArtifactsClient: jest.fn().mockReturnValue((0, _mocks5.createArtifactsClientMock)())
  };
};

exports.createMockFleetStartContract = createMockFleetStartContract;

const createMockMetadataRequestContext = () => {
  return {
    endpointAppContextService: createMockEndpointAppContextService(),
    logger: _mocks.loggingSystemMock.create().get('mock_endpoint_app_context'),
    requestHandlerContext: _fixtures.xpackMocks.createRequestHandlerContext()
  };
};

exports.createMockMetadataRequestContext = createMockMetadataRequestContext;

function createRouteHandlerContext(dataClient, savedObjectsClient) {
  const context = _fixtures.xpackMocks.createRequestHandlerContext();

  context.core.elasticsearch.client = dataClient;
  context.core.savedObjects.client = savedObjectsClient;
  return context;
}