"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchRules = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _fp = require("lodash/fp");

var _transform_actions = require("../../../../common/detection_engine/transform_actions");

var _utils = require("../../../../common/detection_engine/utils");

var _rule_schemas = require("../schemas/rule_schemas");

var _add_tags = require("./add_tags");

var _enable_rule = require("./enable_rule");

var _utils2 = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class PatchError extends Error {
  constructor(message, statusCode) {
    super(message);
    (0, _defineProperty2.default)(this, "statusCode", void 0);
    this.statusCode = statusCode;
  }

}

const patchRules = async ({
  rulesClient,
  savedObjectsClient,
  author,
  buildingBlockType,
  ruleStatusClient,
  spaceId,
  description,
  eventCategoryOverride,
  falsePositives,
  enabled,
  query,
  language,
  license,
  outputIndex,
  savedId,
  timelineId,
  timelineTitle,
  meta,
  filters,
  from,
  index,
  interval,
  maxSignals,
  riskScore,
  riskScoreMapping,
  ruleNameOverride,
  rule,
  name,
  severity,
  severityMapping,
  tags,
  threat,
  threshold,
  threatFilters,
  threatIndex,
  threatQuery,
  threatMapping,
  threatLanguage,
  concurrentSearches,
  itemsPerSearch,
  timestampOverride,
  throttle,
  to,
  type,
  references,
  namespace,
  note,
  version,
  exceptionsList,
  anomalyThreshold,
  machineLearningJobId,
  actions
}) => {
  var _actions$map;

  if (rule == null) {
    return null;
  }

  const calculatedVersion = (0, _utils2.calculateVersion)(rule.params.immutable, rule.params.version, {
    author,
    buildingBlockType,
    description,
    eventCategoryOverride,
    falsePositives,
    query,
    language,
    license,
    outputIndex,
    savedId,
    timelineId,
    timelineTitle,
    meta,
    filters,
    from,
    index,
    interval,
    maxSignals,
    riskScore,
    riskScoreMapping,
    ruleNameOverride,
    name,
    severity,
    severityMapping,
    tags,
    threat,
    threshold,
    threatFilters,
    threatIndex,
    threatQuery,
    threatMapping,
    threatLanguage,
    concurrentSearches,
    itemsPerSearch,
    timestampOverride,
    to,
    type,
    references,
    version,
    namespace,
    note,
    exceptionsList,
    anomalyThreshold,
    machineLearningJobId
  });
  const nextParams = (0, _fp.defaults)({ ...rule.params
  }, {
    author,
    buildingBlockType,
    description,
    falsePositives,
    from,
    query,
    language,
    license,
    outputIndex,
    savedId,
    timelineId,
    timelineTitle,
    meta,
    filters,
    index,
    maxSignals,
    riskScore,
    riskScoreMapping,
    ruleNameOverride,
    severity,
    severityMapping,
    threat,
    threshold: threshold ? (0, _utils.normalizeThresholdObject)(threshold) : undefined,
    threatFilters,
    threatIndex,
    threatQuery,
    threatMapping,
    threatLanguage,
    concurrentSearches,
    itemsPerSearch,
    timestampOverride,
    to,
    type,
    references,
    namespace,
    note,
    version: calculatedVersion,
    exceptionsList,
    anomalyThreshold,
    machineLearningJobId: machineLearningJobId ? (0, _utils.normalizeMachineLearningJobIds)(machineLearningJobId) : undefined
  });
  const newRule = {
    tags: (0, _add_tags.addTags)(tags !== null && tags !== void 0 ? tags : rule.tags, rule.params.ruleId, rule.params.immutable),
    name: (0, _utils2.calculateName)({
      updatedName: name,
      originalName: rule.name
    }),
    schedule: {
      interval: (0, _utils2.calculateInterval)(interval, rule.schedule.interval)
    },
    params: (0, _utils2.removeUndefined)(nextParams),
    actions: (_actions$map = actions === null || actions === void 0 ? void 0 : actions.map(_transform_actions.transformRuleToAlertAction)) !== null && _actions$map !== void 0 ? _actions$map : rule.actions,
    throttle: throttle !== undefined ? (0, _utils2.transformToAlertThrottle)(throttle) : rule.throttle,
    notifyWhen: throttle !== undefined ? (0, _utils2.transformToNotifyWhen)(throttle) : rule.notifyWhen
  };
  const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(newRule, _rule_schemas.internalRuleUpdate);

  if (errors != null || validated === null) {
    throw new PatchError(`Applying patch would create invalid rule: ${errors}`, 400);
  }

  const update = await rulesClient.update({
    id: rule.id,
    data: validated
  });

  if (throttle !== undefined) {
    await (0, _utils2.maybeMute)({
      rulesClient,
      muteAll: rule.muteAll,
      throttle,
      id: update.id
    });
  }

  if (rule.enabled && enabled === false) {
    await rulesClient.disable({
      id: rule.id
    });
  } else if (!rule.enabled && enabled === true) {
    await (0, _enable_rule.enableRule)({
      rule,
      rulesClient
    });
  } else {// enabled is null or undefined and we do not touch the rule
  }

  if (enabled != null) {
    return { ...update,
      enabled
    };
  } else {
    return update;
  }
};

exports.patchRules = patchRules;