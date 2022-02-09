"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteRulesRoute = void 0;

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _query_rules_type_dependents = require("../../../../../common/detection_engine/schemas/request/query_rules_type_dependents");

var _query_rules_schema = require("../../../../../common/detection_engine/schemas/request/query_rules_schema");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _constants = require("../../../../../common/constants");

var _delete_rules = require("../../rules/delete_rules");

var _utils = require("./utils");

var _utils2 = require("../utils");

var _read_rules = require("../../rules/read_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteRulesRoute = (router, isRuleRegistryEnabled) => {
  router.delete({
    path: _constants.DETECTION_ENGINE_RULES_URL,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(_query_rules_schema.queryRulesSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils2.buildSiemResponse)(response);
    const validationErrors = (0, _query_rules_type_dependents.queryRuleValidateTypeDependents)(request.query);

    if (validationErrors.length) {
      return siemResponse.error({
        statusCode: 400,
        body: validationErrors
      });
    }

    try {
      var _context$alerting;

      const {
        id,
        rule_id: ruleId
      } = request.query;
      const rulesClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getRulesClient();

      if (!rulesClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      const ruleStatusClient = context.securitySolution.getExecutionLogClient();
      const rule = await (0, _read_rules.readRules)({
        isRuleRegistryEnabled,
        rulesClient,
        id,
        ruleId
      });

      if (!rule) {
        const error = (0, _utils.getIdError)({
          id,
          ruleId
        });
        return siemResponse.error({
          body: error.message,
          statusCode: error.statusCode
        });
      }

      const ruleStatuses = await ruleStatusClient.find({
        logsCount: 6,
        ruleId: rule.id,
        spaceId: context.securitySolution.getSpaceId()
      });
      await (0, _delete_rules.deleteRules)({
        rulesClient,
        ruleStatusClient,
        ruleStatuses,
        id: rule.id
      });
      const transformed = (0, _utils.transform)(rule, ruleStatuses[0], isRuleRegistryEnabled);

      if (transformed == null) {
        return siemResponse.error({
          statusCode: 500,
          body: 'failed to transform alert'
        });
      } else {
        return response.ok({
          body: transformed !== null && transformed !== void 0 ? transformed : {}
        });
      }
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.deleteRulesRoute = deleteRulesRoute;