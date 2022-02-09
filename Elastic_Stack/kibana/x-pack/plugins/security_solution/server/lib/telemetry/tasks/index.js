"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetryTaskConfigs = createTelemetryTaskConfigs;

var _diagnostic = require("./diagnostic");

var _endpoint = require("./endpoint");

var _security_lists = require("./security_lists");

var _detection_rule = require("./detection_rule");

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createTelemetryTaskConfigs() {
  return [(0, _diagnostic.createTelemetryDiagnosticsTaskConfig)(), (0, _endpoint.createTelemetryEndpointTaskConfig)(_constants.MAX_SECURITY_LIST_TELEMETRY_BATCH), (0, _security_lists.createTelemetrySecurityListTaskConfig)(_constants.MAX_ENDPOINT_TELEMETRY_BATCH), (0, _detection_rule.createTelemetryDetectionRuleListsTaskConfig)(_constants.MAX_DETECTION_RULE_TELEMETRY_BATCH)];
}