"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndpointAppContextService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fleet_integration = require("../fleet_integration/fleet_integration");

var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A singleton that holds shared services that are initialized during the start up phase
 * of the plugin lifecycle. And stop during the stop phase, if needed.
 */


class EndpointAppContextService {
  constructor() {
    (0, _defineProperty2.default)(this, "setupDependencies", null);
    (0, _defineProperty2.default)(this, "startDependencies", null);
    (0, _defineProperty2.default)(this, "security", void 0);
  }

  setup(dependencies) {
    this.setupDependencies = dependencies;
  }

  start(dependencies) {
    if (!this.setupDependencies) {
      throw new _errors.EndpointAppContentServicesNotSetUpError();
    }

    this.startDependencies = dependencies;
    this.security = dependencies.security;

    if (dependencies.registerIngestCallback && dependencies.manifestManager) {
      dependencies.registerIngestCallback('packagePolicyCreate', (0, _fleet_integration.getPackagePolicyCreateCallback)(dependencies.logger, dependencies.manifestManager, this.setupDependencies.securitySolutionRequestContextFactory, dependencies.alerting, dependencies.licenseService, dependencies.exceptionListsClient));
      dependencies.registerIngestCallback('packagePolicyUpdate', (0, _fleet_integration.getPackagePolicyUpdateCallback)(dependencies.logger, dependencies.licenseService));
      dependencies.registerIngestCallback('postPackagePolicyDelete', (0, _fleet_integration.getPackagePolicyDeleteCallback)(dependencies.exceptionListsClient, dependencies.config.experimentalFeatures));
    }
  }

  stop() {}

  getExperimentalFeatures() {
    var _this$startDependenci;

    return (_this$startDependenci = this.startDependencies) === null || _this$startDependenci === void 0 ? void 0 : _this$startDependenci.config.experimentalFeatures;
  }

  getEndpointMetadataService() {
    if (this.startDependencies == null) {
      throw new _errors.EndpointAppContentServicesNotStartedError();
    }

    return this.startDependencies.endpointMetadataService;
  }

  getAgentService() {
    var _this$startDependenci2;

    return (_this$startDependenci2 = this.startDependencies) === null || _this$startDependenci2 === void 0 ? void 0 : _this$startDependenci2.agentService;
  }

  getPackagePolicyService() {
    var _this$startDependenci3;

    return (_this$startDependenci3 = this.startDependencies) === null || _this$startDependenci3 === void 0 ? void 0 : _this$startDependenci3.packagePolicyService;
  }

  getAgentPolicyService() {
    var _this$startDependenci4;

    return (_this$startDependenci4 = this.startDependencies) === null || _this$startDependenci4 === void 0 ? void 0 : _this$startDependenci4.agentPolicyService;
  }

  getManifestManager() {
    var _this$startDependenci5;

    return (_this$startDependenci5 = this.startDependencies) === null || _this$startDependenci5 === void 0 ? void 0 : _this$startDependenci5.manifestManager;
  }

  getLicenseService() {
    if (this.startDependencies == null) {
      throw new _errors.EndpointAppContentServicesNotStartedError();
    }

    return this.startDependencies.licenseService;
  }

  async getCasesClient(req) {
    var _this$startDependenci6;

    if (((_this$startDependenci6 = this.startDependencies) === null || _this$startDependenci6 === void 0 ? void 0 : _this$startDependenci6.cases) == null) {
      throw new _errors.EndpointAppContentServicesNotStartedError();
    }

    return this.startDependencies.cases.getCasesClientWithRequest(req);
  }

}

exports.EndpointAppContextService = EndpointAppContextService;