"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findRulesStatusesRoute = void 0;

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _constants = require("../../../../../common/constants");

var _utils = require("../utils");

var _find_rule_statuses_schema = require("../../../../../common/detection_engine/schemas/request/find_rule_statuses_schema");

var _rule_converters = require("../../schemas/rule_converters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given a list of rule ids, return the current status and
 * last five errors for each associated rule.
 *
 * @param router
 * @returns RuleStatusResponse
 */


const findRulesStatusesRoute = router => {
  router.post({
    path: `${_constants.DETECTION_ENGINE_RULES_URL}/_find_statuses`,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_find_rule_statuses_schema.findRulesStatusesSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _context$alerting;

    const {
      body
    } = request;
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const rulesClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getRulesClient();

    if (!rulesClient) {
      return siemResponse.error({
        statusCode: 404
      });
    }

    const ids = body.ids;

    try {
      const ruleStatusClient = context.securitySolution.getExecutionLogClient();
      const [statusesById, failingRules] = await Promise.all([ruleStatusClient.findBulk({
        ruleIds: ids,
        logsCount: 6,
        spaceId: context.securitySolution.getSpaceId()
      }), (0, _utils.getFailingRules)(ids, rulesClient)]);
      const statuses = ids.reduce((acc, id) => {
        const lastFiveErrorsForId = statusesById[id];

        if (lastFiveErrorsForId == null || lastFiveErrorsForId.length === 0) {
          return acc;
        }

        const failingRule = failingRules[id];

        if (failingRule != null) {
          const currentStatus = (0, _rule_converters.mergeAlertWithSidecarStatus)(failingRule, lastFiveErrorsForId[0]);
          const updatedLastFiveErrorsSO = [currentStatus, ...lastFiveErrorsForId.slice(1)];
          return (0, _utils.mergeStatuses)(id, updatedLastFiveErrorsSO, acc);
        }

        return (0, _utils.mergeStatuses)(id, [...lastFiveErrorsForId], acc);
      }, {});
      return response.ok({
        body: statuses
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.findRulesStatusesRoute = findRulesStatusesRoute;