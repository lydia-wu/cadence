"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformTags = exports.transformFindAlerts = exports.transformAlertsToRules = exports.transformAlertToRule = exports.transform = exports.getTupleDuplicateErrorsAndUniqueRules = exports.getInvalidConnectors = exports.getIdError = exports.getIdBulkError = exports.getDuplicates = void 0;

var _fp = require("lodash/fp");

var _uuid = _interopRequireDefault(require("uuid"));

var _constants = require("../../../../../common/constants");

var _types = require("../../rules/types");

var _utils = require("../utils");

var _rule_converters = require("../../schemas/rule_converters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getIdError = ({
  id,
  ruleId
}) => {
  if (id != null) {
    return {
      message: `id: "${id}" not found`,
      statusCode: 404
    };
  } else if (ruleId != null) {
    return {
      message: `rule_id: "${ruleId}" not found`,
      statusCode: 404
    };
  } else {
    return {
      message: 'id or rule_id should have been defined',
      statusCode: 404
    };
  }
};

exports.getIdError = getIdError;

const getIdBulkError = ({
  id,
  ruleId
}) => {
  if (id != null && ruleId != null) {
    return (0, _utils.createBulkErrorObject)({
      id,
      ruleId,
      statusCode: 404,
      message: `id: "${id}" and rule_id: "${ruleId}" not found`
    });
  } else if (id != null) {
    return (0, _utils.createBulkErrorObject)({
      id,
      statusCode: 404,
      message: `id: "${id}" not found`
    });
  } else if (ruleId != null) {
    return (0, _utils.createBulkErrorObject)({
      ruleId,
      statusCode: 404,
      message: `rule_id: "${ruleId}" not found`
    });
  } else {
    return (0, _utils.createBulkErrorObject)({
      statusCode: 404,
      message: `id or rule_id should have been defined`
    });
  }
};

exports.getIdBulkError = getIdBulkError;

const transformTags = tags => {
  return tags.filter(tag => !tag.startsWith(_constants.INTERNAL_IDENTIFIER));
}; // Transforms the data but will remove any null or undefined it encounters and not include
// those on the export


exports.transformTags = transformTags;

const transformAlertToRule = (alert, ruleStatus, legacyRuleActions) => {
  return (0, _rule_converters.internalRuleToAPIResponse)(alert, ruleStatus === null || ruleStatus === void 0 ? void 0 : ruleStatus.attributes, legacyRuleActions);
};

exports.transformAlertToRule = transformAlertToRule;

const transformAlertsToRules = (alerts, legacyRuleActions) => {
  return alerts.map(alert => transformAlertToRule(alert, undefined, legacyRuleActions[alert.id]));
};

exports.transformAlertsToRules = transformAlertsToRules;

const transformFindAlerts = (findResults, ruleStatuses, legacyRuleActions) => {
  return {
    page: findResults.page,
    perPage: findResults.perPage,
    total: findResults.total,
    data: findResults.data.map(alert => {
      const statuses = ruleStatuses[alert.id];
      const status = statuses ? statuses[0] : undefined;
      return (0, _rule_converters.internalRuleToAPIResponse)(alert, status, legacyRuleActions[alert.id]);
    })
  };
};

exports.transformFindAlerts = transformFindAlerts;

const transform = (alert, ruleStatus, isRuleRegistryEnabled, legacyRuleActions) => {
  if ((0, _types.isAlertType)(isRuleRegistryEnabled !== null && isRuleRegistryEnabled !== void 0 ? isRuleRegistryEnabled : false, alert)) {
    return transformAlertToRule(alert, (0, _types.isRuleStatusSavedObjectType)(ruleStatus) ? ruleStatus : undefined, legacyRuleActions);
  }

  return null;
};

exports.transform = transform;

const getDuplicates = (ruleDefinitions, by) => {
  const mappedDuplicates = (0, _fp.countBy)(by, ruleDefinitions.filter(r => r[by] != null));
  const hasDuplicates = Object.values(mappedDuplicates).some(i => i > 1);

  if (hasDuplicates) {
    return Object.keys(mappedDuplicates).filter(key => mappedDuplicates[key] > 1);
  }

  return [];
};

exports.getDuplicates = getDuplicates;

const getTupleDuplicateErrorsAndUniqueRules = (rules, isOverwrite) => {
  const {
    errors,
    rulesAcc
  } = rules.reduce((acc, parsedRule) => {
    if (parsedRule instanceof Error) {
      acc.rulesAcc.set(_uuid.default.v4(), parsedRule);
    } else {
      const {
        rule_id: ruleId
      } = parsedRule;

      if (acc.rulesAcc.has(ruleId) && !isOverwrite) {
        acc.errors.set(_uuid.default.v4(), (0, _utils.createBulkErrorObject)({
          ruleId,
          statusCode: 400,
          message: `More than one rule with rule-id: "${ruleId}" found`
        }));
      }

      acc.rulesAcc.set(ruleId, parsedRule);
    }

    return acc;
  }, // using map (preserves ordering)
  {
    errors: new Map(),
    rulesAcc: new Map()
  });
  return [Array.from(errors.values()), Array.from(rulesAcc.values())];
};
/**
 * Given a set of rules and an actions client this will return connectors that are invalid
 * such as missing connectors and filter out the rules that have invalid connectors.
 * @param rules The rules to check for invalid connectors
 * @param actionsClient The actions client to get all the connectors.
 * @returns An array of connector errors if it found any and then the promise stream of valid and invalid connectors.
 */


exports.getTupleDuplicateErrorsAndUniqueRules = getTupleDuplicateErrorsAndUniqueRules;

const getInvalidConnectors = async (rules, actionsClient) => {
  const actionsFind = await actionsClient.getAll();
  const actionIds = new Set(actionsFind.map(action => action.id));
  const {
    errors,
    rulesAcc
  } = rules.reduce((acc, parsedRule) => {
    if (parsedRule instanceof Error) {
      acc.rulesAcc.set(_uuid.default.v4(), parsedRule);
    } else {
      const {
        rule_id: ruleId,
        actions
      } = parsedRule;
      const missingActionIds = actions.flatMap(action => {
        if (!actionIds.has(action.id)) {
          return [action.id];
        } else {
          return [];
        }
      });

      if (missingActionIds.length === 0) {
        acc.rulesAcc.set(ruleId, parsedRule);
      } else {
        const errorMessage = missingActionIds.length > 1 ? 'connectors are missing. Connector ids missing are:' : 'connector is missing. Connector id missing is:';
        acc.errors.set(_uuid.default.v4(), (0, _utils.createBulkErrorObject)({
          ruleId,
          statusCode: 404,
          message: `${missingActionIds.length} ${errorMessage} ${missingActionIds.join(', ')}`
        }));
      }
    }

    return acc;
  }, // using map (preserves ordering)
  {
    errors: new Map(),
    rulesAcc: new Map()
  });
  return [Array.from(errors.values()), Array.from(rulesAcc.values())];
};

exports.getInvalidConnectors = getInvalidConnectors;