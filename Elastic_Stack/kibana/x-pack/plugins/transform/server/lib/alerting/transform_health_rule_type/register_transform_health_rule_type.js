"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRANSFORM_ISSUE_DETECTED = exports.TRANSFORM_ISSUE = void 0;
exports.getTransformHealthRuleType = getTransformHealthRuleType;
exports.registerTransformHealthRuleType = registerTransformHealthRuleType;

var _i18n = require("@kbn/i18n");

var _constants = require("../../../../common/constants");

var _schema = require("./schema");

var _transform_health_service = require("./transform_health_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const TRANSFORM_ISSUE = 'transform_issue';
exports.TRANSFORM_ISSUE = TRANSFORM_ISSUE;
const TRANSFORM_ISSUE_DETECTED = {
  id: TRANSFORM_ISSUE,
  name: _i18n.i18n.translate('xpack.transform.alertingRuleTypes.transformHealth.actionGroupName', {
    defaultMessage: 'Issue detected'
  })
};
exports.TRANSFORM_ISSUE_DETECTED = TRANSFORM_ISSUE_DETECTED;

function registerTransformHealthRuleType(params) {
  const {
    alerting
  } = params;
  alerting.registerType(getTransformHealthRuleType());
}

function getTransformHealthRuleType() {
  return {
    id: _constants.TRANSFORM_RULE_TYPE.TRANSFORM_HEALTH,
    name: _i18n.i18n.translate('xpack.transform.alertingRuleTypes.transformHealth.name', {
      defaultMessage: 'Transform health'
    }),
    actionGroups: [TRANSFORM_ISSUE_DETECTED],
    defaultActionGroupId: TRANSFORM_ISSUE,
    validate: {
      params: _schema.transformHealthRuleParams
    },
    actionVariables: {
      context: [{
        name: 'results',
        description: _i18n.i18n.translate('xpack.transform.alertTypes.transformHealth.alertContext.resultsDescription', {
          defaultMessage: 'Rule execution results'
        })
      }, {
        name: 'message',
        description: _i18n.i18n.translate('xpack.transform.alertTypes.transformHealth.alertContext.messageDescription', {
          defaultMessage: 'Alert info message'
        })
      }]
    },
    producer: 'stackAlerts',
    minimumLicenseRequired: _constants.PLUGIN.MINIMUM_LICENSE_REQUIRED,
    isExportable: true,

    async executor(options) {
      const {
        services: {
          scopedClusterClient,
          alertInstanceFactory
        },
        params
      } = options;
      const transformHealthService = (0, _transform_health_service.transformHealthServiceProvider)(scopedClusterClient.asInternalUser);
      const executionResult = await transformHealthService.getHealthChecksResults(params);

      if (executionResult.length > 0) {
        executionResult.forEach(({
          name: alertInstanceName,
          context
        }) => {
          const alertInstance = alertInstanceFactory(alertInstanceName);
          alertInstance.scheduleActions(TRANSFORM_ISSUE, context);
        });
      }
    }

  };
}