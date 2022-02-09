"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createThresholdAlertType = void 0;

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _constants = require("../../../../../common/constants");

var _rule_schemas = require("../../schemas/rule_schemas");

var _threshold = require("../../signals/executors/threshold");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createThresholdAlertType = createOptions => {
  const {
    experimentalFeatures,
    logger,
    version
  } = createOptions;
  return {
    id: _constants.THRESHOLD_RULE_TYPE_ID,
    name: 'Threshold Rule',
    validate: {
      params: {
        validate: object => {
          const [validated, errors] = (0, _securitysolutionIoTsUtils.validateNonExact)(object, _rule_schemas.thresholdRuleParams);

          if (errors != null) {
            throw new Error(errors);
          }

          if (validated == null) {
            throw new Error('Validation of rule params failed');
          }

          return validated;
        }
      }
    },
    actionGroups: [{
      id: 'default',
      name: 'Default'
    }],
    defaultActionGroupId: 'default',
    actionVariables: {
      context: [{
        name: 'server',
        description: 'the server'
      }]
    },
    minimumLicenseRequired: 'basic',
    isExportable: false,
    producer: 'security-solution',

    async executor(execOptions) {
      const {
        runOpts: {
          buildRuleMessage,
          bulkCreate,
          exceptionItems,
          rule,
          tuple,
          wrapHits
        },
        services,
        startedAt,
        state
      } = execOptions;
      const result = await (0, _threshold.thresholdExecutor)({
        buildRuleMessage,
        bulkCreate,
        exceptionItems,
        experimentalFeatures,
        logger,
        rule,
        services,
        startedAt,
        state,
        tuple,
        version,
        wrapHits
      });
      return result;
    }

  };
};

exports.createThresholdAlertType = createThresholdAlertType;