"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRuleWithoutOverrides = exports.buildRuleWithOverrides = exports.applyRuleOverrides = void 0;

var _build_risk_score_from_mapping = require("./mappings/build_risk_score_from_mapping");

var _build_severity_from_mapping = require("./mappings/build_severity_from_mapping");

var _build_rule_name_from_mapping = require("./mappings/build_rule_name_from_mapping");

var _rule_converters = require("../schemas/rule_converters");

var _utils = require("../routes/rules/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildRuleWithoutOverrides = ruleSO => {
  var _ruleSO$updated_at;

  const ruleParams = ruleSO.attributes.params;
  return {
    id: ruleSO.id,
    actions: ruleSO.attributes.actions,
    interval: ruleSO.attributes.schedule.interval,
    name: ruleSO.attributes.name,
    tags: (0, _utils.transformTags)(ruleSO.attributes.tags),
    enabled: ruleSO.attributes.enabled,
    created_by: ruleSO.attributes.createdBy,
    updated_by: ruleSO.attributes.updatedBy,
    throttle: ruleSO.attributes.throttle,
    created_at: ruleSO.attributes.createdAt,
    updated_at: (_ruleSO$updated_at = ruleSO.updated_at) !== null && _ruleSO$updated_at !== void 0 ? _ruleSO$updated_at : '',
    ...(0, _rule_converters.commonParamsCamelToSnake)(ruleParams),
    ...(0, _rule_converters.typeSpecificCamelToSnake)(ruleParams)
  };
};

exports.buildRuleWithoutOverrides = buildRuleWithoutOverrides;

const buildRuleWithOverrides = (ruleSO, eventSource) => {
  const ruleWithoutOverrides = buildRuleWithoutOverrides(ruleSO);
  return applyRuleOverrides(ruleWithoutOverrides, eventSource, ruleSO.attributes.params);
};

exports.buildRuleWithOverrides = buildRuleWithOverrides;

const applyRuleOverrides = (rule, eventSource, ruleParams) => {
  var _ruleParams$riskScore, _ruleParams$severityM;

  const {
    riskScore,
    riskScoreMeta
  } = (0, _build_risk_score_from_mapping.buildRiskScoreFromMapping)({
    eventSource,
    riskScore: ruleParams.riskScore,
    riskScoreMapping: ruleParams.riskScoreMapping
  });
  const {
    severity,
    severityMeta
  } = (0, _build_severity_from_mapping.buildSeverityFromMapping)({
    eventSource,
    severity: ruleParams.severity,
    severityMapping: ruleParams.severityMapping
  });
  const {
    ruleName,
    ruleNameMeta
  } = (0, _build_rule_name_from_mapping.buildRuleNameFromMapping)({
    eventSource,
    ruleName: rule.name,
    ruleNameMapping: ruleParams.ruleNameOverride
  });
  const meta = { ...ruleParams.meta,
    ...riskScoreMeta,
    ...severityMeta,
    ...ruleNameMeta
  };
  return { ...rule,
    risk_score: riskScore,
    risk_score_mapping: (_ruleParams$riskScore = ruleParams.riskScoreMapping) !== null && _ruleParams$riskScore !== void 0 ? _ruleParams$riskScore : [],
    severity,
    severity_mapping: (_ruleParams$severityM = ruleParams.severityMapping) !== null && _ruleParams$severityM !== void 0 ? _ruleParams$severityM : [],
    name: ruleName,
    rule_name_override: ruleParams.ruleNameOverride,
    meta: Object.keys(meta).length > 0 ? meta : undefined
  };
};

exports.applyRuleOverrides = applyRuleOverrides;