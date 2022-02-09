"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "RuleDataServiceMock", {
  enumerable: true,
  get: function () {
    return _rule_data_plugin_service.RuleDataServiceMock;
  }
});
exports.ruleRegistryMocks = void 0;

var _alerts_client = require("./alert_data_client/alerts_client.mock");

var _rule_data_client = require("./rule_data_client/rule_data_client.mock");

var _rule_data_plugin_service = require("./rule_data_plugin_service/rule_data_plugin_service.mock");

var _lifecycle_alert_services_mock = require("./utils/lifecycle_alert_services_mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ruleRegistryMocks = {
  createLifecycleAlertServices: _lifecycle_alert_services_mock.createLifecycleAlertServicesMock,
  createRuleDataService: _rule_data_plugin_service.ruleDataServiceMock.create,
  createRuleDataClient: _rule_data_client.createRuleDataClientMock,
  createAlertsClientMock: _alerts_client.alertsClientMock
};
exports.ruleRegistryMocks = ruleRegistryMocks;