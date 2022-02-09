"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatUserRulesData = void 0;

var _fp = require("lodash/fp");

var _common = require("../../../../../../common");

var _helpers = require("../host_rules/helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const formatUserRulesData = buckets => buckets.map(user => ({
  _id: user.key,
  [_common.UserRulesFields.userName]: user.key,
  [_common.UserRulesFields.riskScore]: (0, _fp.getOr)(0, 'risk_score.value', user),
  [_common.UserRulesFields.ruleCount]: (0, _fp.getOr)(0, 'rule_count.value', user),
  [_common.UserRulesFields.rules]: (0, _helpers.formatHostRulesData)((0, _fp.getOr)([], 'rule_name.buckets', user))
}));

exports.formatUserRulesData = formatUserRulesData;