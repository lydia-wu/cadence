"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleExecutionLogAction = exports.RULE_EXECUTION_LOG_PROVIDER = exports.ALERT_SAVED_OBJECT_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const RULE_EXECUTION_LOG_PROVIDER = 'securitySolution.ruleExecution';
exports.RULE_EXECUTION_LOG_PROVIDER = RULE_EXECUTION_LOG_PROVIDER;
const ALERT_SAVED_OBJECT_TYPE = 'alert';
exports.ALERT_SAVED_OBJECT_TYPE = ALERT_SAVED_OBJECT_TYPE;
let RuleExecutionLogAction;
exports.RuleExecutionLogAction = RuleExecutionLogAction;

(function (RuleExecutionLogAction) {
  RuleExecutionLogAction["status-change"] = "status-change";
  RuleExecutionLogAction["execution-metrics"] = "execution-metrics";
})(RuleExecutionLogAction || (exports.RuleExecutionLogAction = RuleExecutionLogAction = {}));