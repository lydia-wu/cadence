"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndicatorMatchAlertType = void 0;

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _constants = require("../../../../../common/constants");

var _rule_schemas = require("../../schemas/rule_schemas");

var _threat_match = require("../../signals/executors/threat_match");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createIndicatorMatchAlertType = createOptions => {
  const {
    experimentalFeatures,
    logger,
    version
  } = createOptions;
  return {
    id: _constants.INDICATOR_RULE_TYPE_ID,
    name: 'Indicator Match Rule',
    validate: {
      params: {
        validate: object => {
          const [validated, errors] = (0, _securitysolutionIoTsUtils.validateNonExact)(object, _rule_schemas.threatRuleParams);

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
          listClient,
          rule,
          searchAfterSize,
          tuple,
          wrapHits
        },
        services,
        state
      } = execOptions;
      const result = await (0, _threat_match.threatMatchExecutor)({
        buildRuleMessage,
        bulkCreate,
        exceptionItems,
        experimentalFeatures,
        eventsTelemetry: undefined,
        listClient,
        logger,
        rule,
        searchAfterSize,
        services,
        tuple,
        version,
        wrapHits
      });
      return { ...result,
        state
      };
    }

  };
};

exports.createIndicatorMatchAlertType = createIndicatorMatchAlertType;