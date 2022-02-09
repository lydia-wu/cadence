"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatHostRulesData = void 0;

var _fp = require("lodash/fp");

var _common = require("../../../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const formatHostRulesData = buckets => buckets.map(bucket => ({
  node: {
    _id: bucket.key,
    [_common.HostRulesFields.hits]: bucket.doc_count,
    [_common.HostRulesFields.riskScore]: (0, _fp.getOr)(0, 'risk_score.value', bucket),
    [_common.HostRulesFields.ruleName]: bucket.key,
    [_common.HostRulesFields.ruleType]: (0, _fp.getOr)(0, 'rule_type.buckets[0].key', bucket)
  },
  cursor: {
    value: bucket.key,
    tiebreaker: null
  }
}));

exports.formatHostRulesData = formatHostRulesData;