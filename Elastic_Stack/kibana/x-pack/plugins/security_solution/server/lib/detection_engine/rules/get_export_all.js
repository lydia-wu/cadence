"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExportAll = void 0;

var _securitysolutionUtils = require("@kbn/securitysolution-utils");

var _get_existing_prepackaged_rules = require("./get_existing_prepackaged_rules");

var _get_export_details_ndjson = require("./get_export_details_ndjson");

var _utils = require("../routes/rules/utils");

var _get_export_rule_exceptions = require("./get_export_rule_exceptions");

var _legacy_get_bulk_rule_actions_saved_object = require("../rule_actions/legacy_get_bulk_rule_actions_saved_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line no-restricted-imports


const getExportAll = async (rulesClient, exceptionsClient, savedObjectsClient, logger, isRuleRegistryEnabled) => {
  const ruleAlertTypes = await (0, _get_existing_prepackaged_rules.getNonPackagedRules)({
    rulesClient,
    isRuleRegistryEnabled
  });
  const alertIds = ruleAlertTypes.map(rule => rule.id); // Gather actions

  const legacyActions = await (0, _legacy_get_bulk_rule_actions_saved_object.legacyGetBulkRuleActionsSavedObject)({
    alertIds,
    savedObjectsClient,
    logger
  });
  const rules = (0, _utils.transformAlertsToRules)(ruleAlertTypes, legacyActions); // Gather exceptions

  const exceptions = rules.flatMap(rule => {
    var _rule$exceptions_list;

    return (_rule$exceptions_list = rule.exceptions_list) !== null && _rule$exceptions_list !== void 0 ? _rule$exceptions_list : [];
  });
  const {
    exportData: exceptionLists,
    exportDetails: exceptionDetails
  } = await (0, _get_export_rule_exceptions.getRuleExceptionsForExport)(exceptions, exceptionsClient);
  const rulesNdjson = (0, _securitysolutionUtils.transformDataToNdjson)(rules);
  const exportDetails = (0, _get_export_details_ndjson.getExportDetailsNdjson)(rules, [], exceptionDetails);
  return {
    rulesNdjson,
    exportDetails,
    exceptionLists
  };
};

exports.getExportAll = getExportAll;