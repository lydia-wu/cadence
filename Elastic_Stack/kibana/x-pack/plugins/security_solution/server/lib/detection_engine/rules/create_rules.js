"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRules = void 0;

var _utils = require("../../../../common/detection_engine/utils");

var _transform_actions = require("../../../../common/detection_engine/transform_actions");

var _constants = require("../../../../common/constants");

var _add_tags = require("./add_tags");

var _utils2 = require("./utils");

var _utils3 = require("../signals/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createRules = async ({
  rulesClient,
  anomalyThreshold,
  author,
  buildingBlockType,
  description,
  enabled,
  eventCategoryOverride,
  falsePositives,
  from,
  query,
  language,
  license,
  savedId,
  timelineId,
  timelineTitle,
  meta,
  machineLearningJobId,
  filters,
  ruleId,
  immutable,
  index,
  interval,
  maxSignals,
  riskScore,
  riskScoreMapping,
  ruleNameOverride,
  outputIndex,
  name,
  severity,
  severityMapping,
  tags,
  threat,
  threatFilters,
  threatIndex,
  threatIndicatorPath,
  threatLanguage,
  concurrentSearches,
  itemsPerSearch,
  threatQuery,
  threatMapping,
  threshold,
  timestampOverride,
  throttle,
  to,
  type,
  references,
  namespace,
  note,
  version,
  exceptionsList,
  actions,
  isRuleRegistryEnabled
}) => {
  const rule = await rulesClient.create({
    data: {
      name,
      tags: (0, _add_tags.addTags)(tags, ruleId, immutable),
      alertTypeId: isRuleRegistryEnabled ? _utils3.ruleTypeMappings[type] : _constants.SIGNALS_ID,
      consumer: _constants.SERVER_APP_ID,
      params: {
        anomalyThreshold,
        author,
        buildingBlockType,
        description,
        ruleId,
        index,
        eventCategoryOverride,
        falsePositives,
        from,
        immutable,
        query,
        language,
        license,
        outputIndex,
        savedId,
        timelineId,
        timelineTitle,
        meta,
        machineLearningJobId: machineLearningJobId ? (0, _utils.normalizeMachineLearningJobIds)(machineLearningJobId) : undefined,
        filters,
        maxSignals,
        riskScore,
        riskScoreMapping,
        ruleNameOverride,
        severity,
        severityMapping,
        threat,
        threshold: threshold ? (0, _utils.normalizeThresholdObject)(threshold) : undefined,

        /**
         * TODO: Fix typing inconsistancy between `RuleTypeParams` and `CreateRulesOptions`
         */
        threatFilters: threatFilters,
        threatIndex,
        threatIndicatorPath,
        threatQuery,
        concurrentSearches,
        itemsPerSearch,
        threatMapping,
        threatLanguage,
        timestampOverride,
        to,
        type,
        references,
        namespace,
        note,
        version,
        exceptionsList
      },
      schedule: {
        interval
      },
      enabled,
      actions: actions.map(_transform_actions.transformRuleToAlertAction),
      throttle: (0, _utils2.transformToAlertThrottle)(throttle),
      notifyWhen: (0, _utils2.transformToNotifyWhen)(throttle)
    }
  }); // Mute the rule if it is first created with the explicit no actions

  if (throttle === _constants.NOTIFICATION_THROTTLE_NO_ACTIONS) {
    await rulesClient.muteAll({
      id: rule.id
    });
  }

  return rule;
};

exports.createRules = createRules;