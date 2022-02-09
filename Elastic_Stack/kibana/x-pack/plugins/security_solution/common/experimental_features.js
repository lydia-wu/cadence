"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseExperimentalConfigValue = exports.isValidExperimentalValue = exports.getExperimentalAllowedValues = exports.allowedExperimentalValues = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A list of allowed values that can be used in `xpack.securitySolution.enableExperimental`.
 * This object is then used to validate and parse the value entered.
 */

const allowedExperimentalValues = Object.freeze({
  metricsEntitiesEnabled: false,
  ruleRegistryEnabled: false,
  tGridEnabled: true,
  tGridEventRenderedViewEnabled: true,
  trustedAppsByPolicyEnabled: true,
  excludePoliciesInFilterEnabled: false,
  uebaEnabled: false,
  disableIsolationUIPendingStatuses: false,
  riskyHostsEnabled: false,
  pendingActionResponsesWithAck: true
});
exports.allowedExperimentalValues = allowedExperimentalValues;
const SecuritySolutionInvalidExperimentalValue = class extends Error {};
const allowedKeys = Object.keys(allowedExperimentalValues);
/**
 * Parses the string value used in `xpack.securitySolution.enableExperimental` kibana configuration,
 * which should be a string of values delimited by a comma (`,`)
 *
 * @param configValue
 * @throws SecuritySolutionInvalidExperimentalValue
 */

const parseExperimentalConfigValue = configValue => {
  const enabledFeatures = {};

  for (const value of configValue) {
    if (!isValidExperimentalValue(value)) {
      throw new SecuritySolutionInvalidExperimentalValue(`[${value}] is not valid.`);
    }

    enabledFeatures[value] = true;
  }

  return { ...allowedExperimentalValues,
    ...enabledFeatures
  };
};

exports.parseExperimentalConfigValue = parseExperimentalConfigValue;

const isValidExperimentalValue = value => {
  return allowedKeys.includes(value);
};

exports.isValidExperimentalValue = isValidExperimentalValue;

const getExperimentalAllowedValues = () => [...allowedKeys];

exports.getExperimentalAllowedValues = getExperimentalAllowedValues;