"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformValidateBulkError = exports.transformValidate = exports.newTransformValidate = void 0;

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _request = require("../../../../../common/detection_engine/schemas/request");

var _rules_schema = require("../../../../../common/detection_engine/schemas/response/rules_schema");

var _types = require("../../rules/types");

var _utils = require("../utils");

var _utils2 = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const transformValidate = (alert, ruleStatus, isRuleRegistryEnabled, legacyRuleActions) => {
  const transformed = (0, _utils2.transform)(alert, ruleStatus, isRuleRegistryEnabled, legacyRuleActions);

  if (transformed == null) {
    return [null, 'Internal error transforming'];
  } else {
    return (0, _securitysolutionIoTsUtils.validateNonExact)(transformed, _rules_schema.rulesSchema);
  }
};

exports.transformValidate = transformValidate;

const newTransformValidate = (alert, ruleStatus, isRuleRegistryEnabled, legacyRuleActions) => {
  const transformed = (0, _utils2.transform)(alert, ruleStatus, isRuleRegistryEnabled, legacyRuleActions);

  if (transformed == null) {
    return [null, 'Internal error transforming'];
  } else {
    return (0, _securitysolutionIoTsUtils.validateNonExact)(transformed, _request.fullResponseSchema);
  }
};

exports.newTransformValidate = newTransformValidate;

const transformValidateBulkError = (ruleId, alert, ruleStatus, isRuleRegistryEnabled) => {
  if ((0, _types.isAlertType)(isRuleRegistryEnabled !== null && isRuleRegistryEnabled !== void 0 ? isRuleRegistryEnabled : false, alert)) {
    if (ruleStatus && (ruleStatus === null || ruleStatus === void 0 ? void 0 : ruleStatus.length) > 0 && (0, _types.isRuleStatusSavedObjectType)(ruleStatus[0])) {
      const transformed = (0, _utils2.transformAlertToRule)(alert, ruleStatus[0]);
      const [validated, errors] = (0, _securitysolutionIoTsUtils.validateNonExact)(transformed, _rules_schema.rulesSchema);

      if (errors != null || validated == null) {
        return (0, _utils.createBulkErrorObject)({
          ruleId,
          statusCode: 500,
          message: errors !== null && errors !== void 0 ? errors : 'Internal error transforming'
        });
      } else {
        return validated;
      }
    } else {
      const transformed = (0, _utils2.transformAlertToRule)(alert);
      const [validated, errors] = (0, _securitysolutionIoTsUtils.validateNonExact)(transformed, _rules_schema.rulesSchema);

      if (errors != null || validated == null) {
        return (0, _utils.createBulkErrorObject)({
          ruleId,
          statusCode: 500,
          message: errors !== null && errors !== void 0 ? errors : 'Internal error transforming'
        });
      } else {
        return validated;
      }
    }
  } else {
    return (0, _utils.createBulkErrorObject)({
      ruleId,
      statusCode: 500,
      message: 'Internal error transforming'
    });
  }
};

exports.transformValidateBulkError = transformValidateBulkError;