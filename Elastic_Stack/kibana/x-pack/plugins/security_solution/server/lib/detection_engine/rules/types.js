"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRuleStatusSavedObjectType = exports.isAlertTypes = exports.isAlertType = void 0;

var _fp = require("lodash/fp");

var _constants = require("../../../../common/constants");

var _utils = require("../signals/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isAlertTypes = (isRuleRegistryEnabled, partialAlert) => {
  return partialAlert.every(rule => isAlertType(isRuleRegistryEnabled, rule));
};

exports.isAlertTypes = isAlertTypes;

const isAlertType = (isRuleRegistryEnabled, partialAlert) => {
  const ruleTypeValues = Object.values(_utils.ruleTypeMappings);
  return isRuleRegistryEnabled ? ruleTypeValues.includes(partialAlert.alertTypeId) : partialAlert.alertTypeId === _constants.SIGNALS_ID;
};

exports.isAlertType = isAlertType;

const isRuleStatusSavedObjectType = obj => {
  return (0, _fp.get)('attributes', obj) != null;
};

exports.isRuleStatusSavedObjectType = isRuleStatusSavedObjectType;