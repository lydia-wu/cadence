"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertingAuthorizationClientFactory = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _common = require("../common");

var _alerting_authorization = require("./authorization/alerting_authorization");

var _audit_logger = require("./authorization/audit_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class AlertingAuthorizationClientFactory {
  constructor() {
    (0, _defineProperty2.default)(this, "isInitialized", false);
    (0, _defineProperty2.default)(this, "ruleTypeRegistry", void 0);
    (0, _defineProperty2.default)(this, "securityPluginStart", void 0);
    (0, _defineProperty2.default)(this, "securityPluginSetup", void 0);
    (0, _defineProperty2.default)(this, "features", void 0);
    (0, _defineProperty2.default)(this, "getSpace", void 0);
    (0, _defineProperty2.default)(this, "getSpaceId", void 0);
  }

  initialize(options) {
    if (this.isInitialized) {
      throw new Error('AlertingAuthorizationClientFactory already initialized');
    }

    this.isInitialized = true;
    this.getSpace = options.getSpace;
    this.ruleTypeRegistry = options.ruleTypeRegistry;
    this.securityPluginSetup = options.securityPluginSetup;
    this.securityPluginStart = options.securityPluginStart;
    this.features = options.features;
    this.getSpaceId = options.getSpaceId;
  }

  create(request) {
    const {
      securityPluginSetup,
      securityPluginStart,
      features
    } = this;
    return new _alerting_authorization.AlertingAuthorization({
      authorization: securityPluginStart === null || securityPluginStart === void 0 ? void 0 : securityPluginStart.authz,
      request,
      getSpace: this.getSpace,
      getSpaceId: this.getSpaceId,
      ruleTypeRegistry: this.ruleTypeRegistry,
      features: features,
      auditLogger: new _audit_logger.AlertingAuthorizationAuditLogger(securityPluginSetup === null || securityPluginSetup === void 0 ? void 0 : securityPluginSetup.audit.getLogger(_common.ALERTS_FEATURE_ID))
    });
  }

}

exports.AlertingAuthorizationClientFactory = AlertingAuthorizationClientFactory;