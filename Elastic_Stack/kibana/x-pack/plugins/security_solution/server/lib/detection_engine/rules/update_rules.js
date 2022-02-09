"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRules = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _constants = require("../../../../common/constants");

var _transform_actions = require("../../../../common/detection_engine/transform_actions");

var _add_tags = require("./add_tags");

var _rule_converters = require("../schemas/rule_converters");

var _rule_schemas = require("../schemas/rule_schemas");

var _enable_rule = require("./enable_rule");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable complexity */


class UpdateError extends Error {
  constructor(message, statusCode) {
    super(message);
    (0, _defineProperty2.default)(this, "statusCode", void 0);
    this.statusCode = statusCode;
  }

}

const updateRules = async ({
  spaceId,
  rulesClient,
  ruleStatusClient,
  defaultOutputIndex,
  existingRule,
  ruleUpdate
}) => {
  var _ruleUpdate$enabled, _ruleUpdate$tags, _ruleUpdate$author, _ruleUpdate$false_pos, _ruleUpdate$from, _ruleUpdate$output_in, _ruleUpdate$max_signa, _ruleUpdate$risk_scor, _ruleUpdate$severity_, _ruleUpdate$threat, _ruleUpdate$to, _ruleUpdate$reference, _ruleUpdate$version, _ruleUpdate$exception, _ruleUpdate$interval;

  if (existingRule == null) {
    return null;
  }

  const typeSpecificParams = (0, _rule_converters.typeSpecificSnakeToCamel)(ruleUpdate);
  const enabled = (_ruleUpdate$enabled = ruleUpdate.enabled) !== null && _ruleUpdate$enabled !== void 0 ? _ruleUpdate$enabled : true;
  const newInternalRule = {
    name: ruleUpdate.name,
    tags: (0, _add_tags.addTags)((_ruleUpdate$tags = ruleUpdate.tags) !== null && _ruleUpdate$tags !== void 0 ? _ruleUpdate$tags : [], existingRule.params.ruleId, existingRule.params.immutable),
    params: {
      author: (_ruleUpdate$author = ruleUpdate.author) !== null && _ruleUpdate$author !== void 0 ? _ruleUpdate$author : [],
      buildingBlockType: ruleUpdate.building_block_type,
      description: ruleUpdate.description,
      ruleId: existingRule.params.ruleId,
      falsePositives: (_ruleUpdate$false_pos = ruleUpdate.false_positives) !== null && _ruleUpdate$false_pos !== void 0 ? _ruleUpdate$false_pos : [],
      from: (_ruleUpdate$from = ruleUpdate.from) !== null && _ruleUpdate$from !== void 0 ? _ruleUpdate$from : 'now-6m',
      // Unlike the create route, immutable comes from the existing rule here
      immutable: existingRule.params.immutable,
      license: ruleUpdate.license,
      outputIndex: (_ruleUpdate$output_in = ruleUpdate.output_index) !== null && _ruleUpdate$output_in !== void 0 ? _ruleUpdate$output_in : defaultOutputIndex,
      timelineId: ruleUpdate.timeline_id,
      timelineTitle: ruleUpdate.timeline_title,
      meta: ruleUpdate.meta,
      maxSignals: (_ruleUpdate$max_signa = ruleUpdate.max_signals) !== null && _ruleUpdate$max_signa !== void 0 ? _ruleUpdate$max_signa : _constants.DEFAULT_MAX_SIGNALS,
      riskScore: ruleUpdate.risk_score,
      riskScoreMapping: (_ruleUpdate$risk_scor = ruleUpdate.risk_score_mapping) !== null && _ruleUpdate$risk_scor !== void 0 ? _ruleUpdate$risk_scor : [],
      ruleNameOverride: ruleUpdate.rule_name_override,
      severity: ruleUpdate.severity,
      severityMapping: (_ruleUpdate$severity_ = ruleUpdate.severity_mapping) !== null && _ruleUpdate$severity_ !== void 0 ? _ruleUpdate$severity_ : [],
      threat: (_ruleUpdate$threat = ruleUpdate.threat) !== null && _ruleUpdate$threat !== void 0 ? _ruleUpdate$threat : [],
      timestampOverride: ruleUpdate.timestamp_override,
      to: (_ruleUpdate$to = ruleUpdate.to) !== null && _ruleUpdate$to !== void 0 ? _ruleUpdate$to : 'now',
      references: (_ruleUpdate$reference = ruleUpdate.references) !== null && _ruleUpdate$reference !== void 0 ? _ruleUpdate$reference : [],
      namespace: ruleUpdate.namespace,
      note: ruleUpdate.note,
      // Always use the version from the request if specified. If it isn't specified, leave immutable rules alone and
      // increment the version of mutable rules by 1.
      version: ((_ruleUpdate$version = ruleUpdate.version) !== null && _ruleUpdate$version !== void 0 ? _ruleUpdate$version : existingRule.params.immutable) ? existingRule.params.version : existingRule.params.version + 1,
      exceptionsList: (_ruleUpdate$exception = ruleUpdate.exceptions_list) !== null && _ruleUpdate$exception !== void 0 ? _ruleUpdate$exception : [],
      ...typeSpecificParams
    },
    schedule: {
      interval: (_ruleUpdate$interval = ruleUpdate.interval) !== null && _ruleUpdate$interval !== void 0 ? _ruleUpdate$interval : '5m'
    },
    actions: ruleUpdate.actions != null ? ruleUpdate.actions.map(_transform_actions.transformRuleToAlertAction) : [],
    throttle: (0, _utils.transformToAlertThrottle)(ruleUpdate.throttle),
    notifyWhen: (0, _utils.transformToNotifyWhen)(ruleUpdate.throttle)
  };
  const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(newInternalRule, _rule_schemas.internalRuleUpdate);

  if (errors != null || validated === null) {
    throw new UpdateError(`Applying update would create invalid rule: ${errors}`, 400);
  }

  const update = await rulesClient.update({
    id: existingRule.id,
    data: validated
  });
  await (0, _utils.maybeMute)({
    rulesClient,
    muteAll: existingRule.muteAll,
    throttle: ruleUpdate.throttle,
    id: update.id
  });

  if (existingRule.enabled && enabled === false) {
    await rulesClient.disable({
      id: existingRule.id
    });
  } else if (!existingRule.enabled && enabled === true) {
    await (0, _enable_rule.enableRule)({
      rule: existingRule,
      rulesClient
    });
  }

  return { ...update,
    enabled
  };
};

exports.updateRules = updateRules;