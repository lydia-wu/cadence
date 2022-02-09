"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uebaFactory = void 0;

var _security_solution = require("../../../../../common/search_strategy/security_solution");

var _host_rules = require("./host_rules");

var _host_tactics = require("./host_tactics");

var _risk_score = require("./risk_score");

var _user_rules = require("./user_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const uebaFactory = {
  [_security_solution.UebaQueries.hostRules]: _host_rules.hostRules,
  [_security_solution.UebaQueries.hostTactics]: _host_tactics.hostTactics,
  [_security_solution.UebaQueries.riskScore]: _risk_score.riskScore,
  [_security_solution.UebaQueries.userRules]: _user_rules.userRules
};
exports.uebaFactory = uebaFactory;