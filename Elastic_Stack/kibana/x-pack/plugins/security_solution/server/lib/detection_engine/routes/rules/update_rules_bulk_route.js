"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRulesBulkRoute = void 0;

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _update_rules_type_dependents = require("../../../../../common/detection_engine/schemas/request/update_rules_type_dependents");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _update_rules_bulk_schema = require("../../../../../common/detection_engine/schemas/request/update_rules_bulk_schema");

var _rules_bulk_schema = require("../../../../../common/detection_engine/schemas/response/rules_bulk_schema");

var _constants = require("../../../../../common/constants");

var _authz = require("../../../machine_learning/authz");

var _validation = require("../../../machine_learning/validation");

var _utils = require("./utils");

var _validate = require("./validate");

var _utils2 = require("../utils");

var _update_rules = require("../../rules/update_rules");

var _utils3 = require("../../rules/utils");

var _read_rules = require("../../rules/read_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateRulesBulkRoute = (router, ml, isRuleRegistryEnabled) => {
  router.put({
    path: `${_constants.DETECTION_ENGINE_RULES_URL}/_bulk_update`,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_update_rules_bulk_schema.updateRulesBulkSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _context$alerting, _context$securitySolu;

    const siemResponse = (0, _utils2.buildSiemResponse)(response);
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
    const ruleStatusClient = context.securitySolution.getExecutionLogClient();
    const rules = await Promise.all(request.body.map(async payloadRule => {
      var _ref, _payloadRule$id;

      const idOrRuleIdOrUnknown = (_ref = (_payloadRule$id = payloadRule.id) !== null && _payloadRule$id !== void 0 ? _payloadRule$id : payloadRule.rule_id) !== null && _ref !== void 0 ? _ref : '(unknown id)';

      try {
        const validationErrors = (0, _update_rules_type_dependents.updateRuleValidateTypeDependents)(payloadRule);

        if (validationErrors.length) {
          return (0, _utils2.createBulkErrorObject)({
            ruleId: payloadRule.rule_id,
            statusCode: 400,
            message: validationErrors.join()
          });
        }

        (0, _validation.throwHttpError)(await mlAuthz.validateRuleType(payloadRule.type));
        const existingRule = await (0, _read_rules.readRules)({
          isRuleRegistryEnabled,
          rulesClient,
          ruleId: payloadRule.rule_id,
          id: payloadRule.id
        });
        const migratedRule = await (0, _utils3.legacyMigrate)({
          rulesClient,
          savedObjectsClient,
          rule: existingRule
        });
        const rule = await (0, _update_rules.updateRules)({
          spaceId: context.securitySolution.getSpaceId(),
          rulesClient,
          ruleStatusClient,
          defaultOutputIndex: siemClient.getSignalsIndex(),
          existingRule: migratedRule,
          ruleUpdate: payloadRule,
          isRuleRegistryEnabled
        });

        if (rule != null) {
          const ruleStatuses = await ruleStatusClient.find({
            logsCount: 1,
            ruleId: rule.id,
            spaceId: context.securitySolution.getSpaceId()
          });
          return (0, _validate.transformValidateBulkError)(rule.id, rule, ruleStatuses, isRuleRegistryEnabled);
        } else {
          return (0, _utils.getIdBulkError)({
            id: payloadRule.id,
            ruleId: payloadRule.rule_id
          });
        }
      } catch (err) {
        return (0, _utils2.transformBulkError)(idOrRuleIdOrUnknown, err);
      }
    }));
    const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(rules, _rules_bulk_schema.rulesBulkSchema);

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
  });
};

exports.updateRulesBulkRoute = updateRulesBulkRoute;