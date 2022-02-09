"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.performBulkActionRoute = void 0;

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _constants = require("../../../../../common/constants");

var _schemas = require("../../../../../common/detection_engine/schemas/common/schemas");

var _perform_bulk_action_schema = require("../../../../../common/detection_engine/schemas/request/perform_bulk_action_schema");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _authz = require("../../../machine_learning/authz");

var _validation = require("../../../machine_learning/validation");

var _delete_rules = require("../../rules/delete_rules");

var _duplicate_rule = require("../../rules/duplicate_rule");

var _enable_rule = require("../../rules/enable_rule");

var _find_rules = require("../../rules/find_rules");

var _get_export_by_object_ids = require("../../rules/get_export_by_object_ids");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const BULK_ACTION_RULES_LIMIT = 10000;

const performBulkActionRoute = (router, ml, logger, isRuleRegistryEnabled) => {
  router.post({
    path: _constants.DETECTION_ENGINE_RULES_BULK_ACTION,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_perform_bulk_action_schema.performBulkActionSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const {
      body
    } = request;
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      var _context$alerting, _context$lists;

      const rulesClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getRulesClient();
      const exceptionsClient = (_context$lists = context.lists) === null || _context$lists === void 0 ? void 0 : _context$lists.getExceptionListClient();
      const savedObjectsClient = context.core.savedObjects.client;
      const ruleStatusClient = context.securitySolution.getExecutionLogClient();
      const mlAuthz = (0, _authz.buildMlAuthz)({
        license: context.licensing.license,
        ml,
        request,
        savedObjectsClient
      });

      if (!rulesClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      const rules = await (0, _find_rules.findRules)({
        isRuleRegistryEnabled,
        rulesClient,
        perPage: BULK_ACTION_RULES_LIMIT,
        filter: body.query !== '' ? body.query : undefined,
        page: undefined,
        sortField: undefined,
        sortOrder: undefined,
        fields: undefined
      });

      if (rules.total > BULK_ACTION_RULES_LIMIT) {
        return siemResponse.error({
          body: `More than ${BULK_ACTION_RULES_LIMIT} rules matched the filter query. Try to narrow it down.`,
          statusCode: 400
        });
      }

      switch (body.action) {
        case _schemas.BulkAction.enable:
          await Promise.all(rules.data.map(async rule => {
            if (!rule.enabled) {
              (0, _validation.throwHttpError)(await mlAuthz.validateRuleType(rule.params.type));
              await (0, _enable_rule.enableRule)({
                rule,
                rulesClient
              });
            }
          }));
          break;

        case _schemas.BulkAction.disable:
          await Promise.all(rules.data.map(async rule => {
            if (rule.enabled) {
              (0, _validation.throwHttpError)(await mlAuthz.validateRuleType(rule.params.type));
              await rulesClient.disable({
                id: rule.id
              });
            }
          }));
          break;

        case _schemas.BulkAction.delete:
          await Promise.all(rules.data.map(async rule => {
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
          }));
          break;

        case _schemas.BulkAction.duplicate:
          await Promise.all(rules.data.map(async rule => {
            (0, _validation.throwHttpError)(await mlAuthz.validateRuleType(rule.params.type));
            await rulesClient.create({
              data: (0, _duplicate_rule.duplicateRule)(rule)
            });
          }));
          break;

        case _schemas.BulkAction.export:
          const exported = await (0, _get_export_by_object_ids.getExportByObjectIds)(rulesClient, exceptionsClient, savedObjectsClient, rules.data.map(({
            params
          }) => ({
            rule_id: params.ruleId
          })), logger, isRuleRegistryEnabled);
          const responseBody = `${exported.rulesNdjson}${exported.exceptionLists}${exported.exportDetails}`;
          return response.ok({
            headers: {
              'Content-Disposition': `attachment; filename="rules_export.ndjson"`,
              'Content-Type': 'application/ndjson'
            },
            body: responseBody
          });
      }

      return response.ok({
        body: {
          success: true,
          rules_count: rules.data.length
        }
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

exports.performBulkActionRoute = performBulkActionRoute;