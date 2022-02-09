"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRulesRoute = void 0;

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _request = require("../../../../../common/detection_engine/schemas/request");

var _update_rules_type_dependents = require("../../../../../common/detection_engine/schemas/request/update_rules_type_dependents");

var _constants = require("../../../../../common/constants");

var _authz = require("../../../machine_learning/authz");

var _validation = require("../../../machine_learning/validation");

var _utils = require("../utils");

var _utils2 = require("./utils");

var _validate = require("./validate");

var _update_rules = require("../../rules/update_rules");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _utils3 = require("../../rules/utils");

var _read_rules = require("../../rules/read_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateRulesRoute = (router, ml, isRuleRegistryEnabled) => {
  router.put({
    path: _constants.DETECTION_ENGINE_RULES_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_request.updateRulesSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const validationErrors = (0, _update_rules_type_dependents.updateRuleValidateTypeDependents)(request.body);

    if (validationErrors.length) {
      return siemResponse.error({
        statusCode: 400,
        body: validationErrors
      });
    }

    try {
      var _context$alerting, _context$securitySolu;

      const rulesClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getRulesClient();
      const savedObjectsClient = context.core.savedObjects.client;
      const siemClient = (_context$securitySolu = context.securitySolution) === null || _context$securitySolu === void 0 ? void 0 : _context$securitySolu.getAppClient();

      if (!siemClient || !rulesClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      const mlAuthz = (0, _authz.buildMlAuthz)({
        license: context.licensing.license,
        ml,
        request,
        savedObjectsClient
      });
      (0, _validation.throwHttpError)(await mlAuthz.validateRuleType(request.body.type));
      const ruleStatusClient = context.securitySolution.getExecutionLogClient();
      const existingRule = await (0, _read_rules.readRules)({
        isRuleRegistryEnabled,
        rulesClient,
        ruleId: request.body.rule_id,
        id: request.body.id
      });
      const migratedRule = await (0, _utils3.legacyMigrate)({
        rulesClient,
        savedObjectsClient,
        rule: existingRule
      });
      const rule = await (0, _update_rules.updateRules)({
        defaultOutputIndex: siemClient.getSignalsIndex(),
        isRuleRegistryEnabled,
        rulesClient,
        ruleStatusClient,
        existingRule: migratedRule,
        ruleUpdate: request.body,
        spaceId: context.securitySolution.getSpaceId()
      });

      if (rule != null) {
        const ruleStatuses = await ruleStatusClient.find({
          logsCount: 1,
          ruleId: rule.id,
          spaceId: context.securitySolution.getSpaceId()
        });
        const [validated, errors] = (0, _validate.transformValidate)(rule, ruleStatuses[0], isRuleRegistryEnabled);

        if (errors != null) {
          return siemResponse.error({
            statusCode: 500,
            body: errors
          });
        } else {
          return response.ok({
            body: validated !== null && validated !== void 0 ? validated : {}
          });
        }
      } else {
        const error = (0, _utils2.getIdError)({
          id: request.body.id,
          ruleId: request.body.rule_id
        });
        return siemResponse.error({
          body: error.message,
          statusCode: error.statusCode
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

exports.updateRulesRoute = updateRulesRoute;