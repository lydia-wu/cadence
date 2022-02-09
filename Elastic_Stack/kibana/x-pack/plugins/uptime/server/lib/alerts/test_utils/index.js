"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleTypeMocks = exports.bootstrapDependencies = void 0;

var _mocks = require("../../../../../rule_registry/server/mocks");

var _helper = require("../../requests/helper");

var _mocks2 = require("../../../../../alerting/server/mocks");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The alert takes some dependencies as parameters; these are things like
 * kibana core services and plugins. This function helps reduce the amount of
 * boilerplate required.
 * @param customRequests client tests can use this paramter to provide their own request mocks,
 * so we don't have to mock them all for each test.
 */


const bootstrapDependencies = (customRequests, customPlugins = {}) => {
  const router = {}; // these server/libs parameters don't have any functionality, which is fine
  // because we aren't testing them here

  const server = {
    router
  };
  const plugins = customPlugins;
  const libs = {
    requests: {}
  };
  libs.requests = { ...libs.requests,
    ...customRequests
  };
  return {
    server,
    libs,
    plugins
  };
};

exports.bootstrapDependencies = bootstrapDependencies;

const createRuleTypeMocks = (dynamicCertSettings = {
  certAgeThreshold: _constants.DYNAMIC_SETTINGS_DEFAULTS.certAgeThreshold,
  certExpirationThreshold: _constants.DYNAMIC_SETTINGS_DEFAULTS.certExpirationThreshold
}) => {
  const loggerMock = {
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
  const scheduleActions = jest.fn();
  const replaceState = jest.fn();
  const services = { ...(0, _helper.getUptimeESMockClient)(),
    ..._mocks2.alertsMock.createAlertServices(),
    alertWithLifecycle: jest.fn().mockReturnValue({
      scheduleActions,
      replaceState
    }),
    logger: loggerMock
  };
  return {
    dependencies: {
      logger: loggerMock,
      ruleDataClient: _mocks.ruleRegistryMocks.createRuleDataClient('.alerts-observability.uptime.alerts')
    },
    services,
    scheduleActions,
    replaceState
  };
};

exports.createRuleTypeMocks = createRuleTypeMocks;