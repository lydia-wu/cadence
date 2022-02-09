"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserRulesFields = exports.RiskScoreFields = exports.HostTacticsFields = exports.HostRulesFields = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let RiskScoreFields;
exports.RiskScoreFields = RiskScoreFields;

(function (RiskScoreFields) {
  RiskScoreFields["hostName"] = "host_name";
  RiskScoreFields["riskKeyword"] = "risk_keyword";
  RiskScoreFields["riskScore"] = "risk_score";
})(RiskScoreFields || (exports.RiskScoreFields = RiskScoreFields = {}));

let HostRulesFields;
exports.HostRulesFields = HostRulesFields;

(function (HostRulesFields) {
  HostRulesFields["hits"] = "hits";
  HostRulesFields["riskScore"] = "risk_score";
  HostRulesFields["ruleName"] = "rule_name";
  HostRulesFields["ruleType"] = "rule_type";
})(HostRulesFields || (exports.HostRulesFields = HostRulesFields = {}));

let UserRulesFields;
exports.UserRulesFields = UserRulesFields;

(function (UserRulesFields) {
  UserRulesFields["userName"] = "user_name";
  UserRulesFields["riskScore"] = "risk_score";
  UserRulesFields["rules"] = "rules";
  UserRulesFields["ruleCount"] = "rule_count";
})(UserRulesFields || (exports.UserRulesFields = UserRulesFields = {}));

let HostTacticsFields;
exports.HostTacticsFields = HostTacticsFields;

(function (HostTacticsFields) {
  HostTacticsFields["hits"] = "hits";
  HostTacticsFields["riskScore"] = "risk_score";
  HostTacticsFields["tactic"] = "tactic";
  HostTacticsFields["technique"] = "technique";
})(HostTacticsFields || (exports.HostTacticsFields = HostTacticsFields = {}));