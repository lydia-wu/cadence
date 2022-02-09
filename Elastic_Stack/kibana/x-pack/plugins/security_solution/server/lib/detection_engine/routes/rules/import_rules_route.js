"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importRulesRoute = void 0;

var _fp = require("lodash/fp");

var _path = require("path");

var _configSchema = require("@kbn/config-schema");

var _utils = require("@kbn/utils");

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _import_rules_schema = require("../../../../../common/detection_engine/schemas/request/import_rules_schema");

var _import_rules_schema2 = require("../../../../../common/detection_engine/schemas/response/import_rules_schema");

var _helpers = require("../../../../../common/machine_learning/helpers");

var _constants = require("../../../../../common/constants");

var _authz = require("../../../machine_learning/authz");

var _validation = require("../../../machine_learning/validation");

var _create_rules = require("../../rules/create_rules");

var _read_rules = require("../../rules/read_rules");

var _utils2 = require("../utils");

var _patch_rules = require("../../rules/patch_rules");

var _utils3 = require("../../rules/utils");

var _utils4 = require("./utils");

var _create_rules_stream_from_ndjson = require("../../rules/create_rules_stream_from_ndjson");

var _route_validation = require("../../../../utils/build_validation/route_validation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CHUNK_PARSED_OBJECT_SIZE = 50;

const importRulesRoute = (router, config, ml, isRuleRegistryEnabled) => {
  router.post({
    path: `${_constants.DETECTION_ENGINE_RULES_URL}/_import`,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(_import_rules_schema.importRulesQuerySchema),
      body: _configSchema.schema.any() // validation on file object is accomplished later in the handler.

    },
    options: {
      tags: ['access:securitySolution'],
      body: {
        maxBytes: config.maxRuleImportPayloadBytes,
        output: 'stream'
      }
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils2.buildSiemResponse)(response);

    try {
      const rulesClient = context.alerting.getRulesClient();
      const actionsClient = context.actions.getActionsClient();
      const esClient = context.core.elasticsearch.client;
      const savedObjectsClient = context.core.savedObjects.client;
      const siemClient = context.securitySolution.getAppClient();
      const mlAuthz = (0, _authz.buildMlAuthz)({
        license: context.licensing.license,
        ml,
        request,
        savedObjectsClient
      });
      const ruleStatusClient = context.securitySolution.getExecutionLogClient();
      const {
        filename
      } = request.body.file.hapi;
      const fileExtension = (0, _path.extname)(filename).toLowerCase();

      if (fileExtension !== '.ndjson') {
        return siemResponse.error({
          statusCode: 400,
          body: `Invalid file extension ${fileExtension}`
        });
      }

      const signalsIndex = siemClient.getSignalsIndex();
      const indexExists = await (0, _securitysolutionEsUtils.getIndexExists)(esClient.asCurrentUser, signalsIndex);

      if (!isRuleRegistryEnabled && !indexExists) {
        return siemResponse.error({
          statusCode: 400,
          body: `To create a rule, the index must exist first. Index ${signalsIndex} does not exist`
        });
      }

      const objectLimit = config.maxRuleImportExportSize;
      const readStream = (0, _create_rules_stream_from_ndjson.createRulesStreamFromNdJson)(objectLimit);
      const parsedObjects = await (0, _utils.createPromiseFromStreams)([request.body.file, ...readStream]);
      const [duplicateIdErrors, parsedObjectsWithoutDuplicateErrors] = (0, _utils4.getTupleDuplicateErrorsAndUniqueRules)(parsedObjects, request.query.overwrite);
      const [nonExistentActionErrors, uniqueParsedObjects] = await (0, _utils4.getInvalidConnectors)(parsedObjectsWithoutDuplicateErrors, actionsClient);
      const chunkParseObjects = (0, _fp.chunk)(CHUNK_PARSED_OBJECT_SIZE, uniqueParsedObjects);
      let importRuleResponse = []; // If we had 100% errors and no successful rule could be imported we still have to output an error.
      // otherwise we would output we are success importing 0 rules.

      if (chunkParseObjects.length === 0) {
        importRuleResponse = [...nonExistentActionErrors, ...duplicateIdErrors];
      }

      while (chunkParseObjects.length) {
        var _chunkParseObjects$sh;

        const batchParseObjects = (_chunkParseObjects$sh = chunkParseObjects.shift()) !== null && _chunkParseObjects$sh !== void 0 ? _chunkParseObjects$sh : [];
        const newImportRuleResponse = await Promise.all(batchParseObjects.reduce((accum, parsedRule) => {
          const importsWorkerPromise = new Promise(async (resolve, reject) => {
            try {
              if (parsedRule instanceof Error) {
                // If the JSON object had a validation or parse error then we return
                // early with the error and an (unknown) for the ruleId
                resolve((0, _utils2.createBulkErrorObject)({
                  statusCode: 400,
                  message: parsedRule.message
                }));
                return null;
              }

              const {
                anomaly_threshold: anomalyThreshold,
                author,
                building_block_type: buildingBlockType,
                description,
                enabled,
                event_category_override: eventCategoryOverride,
                false_positives: falsePositives,
                from,
                immutable,
                query: queryOrUndefined,
                language: languageOrUndefined,
                license,
                machine_learning_job_id: machineLearningJobId,
                output_index: outputIndex,
                saved_id: savedId,
                meta,
                filters: filtersRest,
                rule_id: ruleId,
                index,
                interval,
                max_signals: maxSignals,
                risk_score: riskScore,
                risk_score_mapping: riskScoreMapping,
                rule_name_override: ruleNameOverride,
                name,
                severity,
                severity_mapping: severityMapping,
                tags,
                threat,
                threat_filters: threatFilters,
                threat_index: threatIndex,
                threat_query: threatQuery,
                threat_mapping: threatMapping,
                threat_language: threatLanguage,
                threat_indicator_path: threatIndicatorPath,
                concurrent_searches: concurrentSearches,
                items_per_search: itemsPerSearch,
                threshold,
                timestamp_override: timestampOverride,
                to,
                type,
                references,
                note,
                timeline_id: timelineId,
                timeline_title: timelineTitle,
                throttle,
                version,
                exceptions_list: exceptionsList,
                actions
              } = parsedRule;

              try {
                const query = !(0, _helpers.isMlRule)(type) && queryOrUndefined == null ? '' : queryOrUndefined;
                const language = !(0, _helpers.isMlRule)(type) && languageOrUndefined == null ? 'kuery' : languageOrUndefined; // TODO: Fix these either with an is conversion or by better typing them within io-ts

                const filters = filtersRest;
                (0, _validation.throwHttpError)(await mlAuthz.validateRuleType(type));
                const rule = await (0, _read_rules.readRules)({
                  isRuleRegistryEnabled,
                  rulesClient,
                  ruleId,
                  id: undefined
                });

                if (rule == null) {
                  await (0, _create_rules.createRules)({
                    isRuleRegistryEnabled,
                    rulesClient,
                    anomalyThreshold,
                    author,
                    buildingBlockType,
                    description,
                    enabled,
                    eventCategoryOverride,
                    falsePositives,
                    from,
                    immutable,
                    query,
                    language,
                    license,
                    machineLearningJobId,
                    outputIndex: signalsIndex,
                    savedId,
                    timelineId,
                    timelineTitle,
                    meta,
                    filters,
                    ruleId,
                    index,
                    interval,
                    maxSignals,
                    name,
                    riskScore,
                    riskScoreMapping,
                    ruleNameOverride,
                    severity,
                    severityMapping,
                    tags,
                    throttle,
                    to,
                    type,
                    threat,
                    threshold,
                    threatFilters,
                    threatIndex,
                    threatIndicatorPath,
                    threatQuery,
                    threatMapping,
                    threatLanguage,
                    concurrentSearches,
                    itemsPerSearch,
                    timestampOverride,
                    references,
                    note,
                    version,
                    exceptionsList,
                    actions
                  });
                  resolve({
                    rule_id: ruleId,
                    status_code: 200
                  });
                } else if (rule != null && request.query.overwrite) {
                  const migratedRule = await (0, _utils3.legacyMigrate)({
                    rulesClient,
                    savedObjectsClient,
                    rule
                  });
                  await (0, _patch_rules.patchRules)({
                    rulesClient,
                    savedObjectsClient,
                    author,
                    buildingBlockType,
                    spaceId: context.securitySolution.getSpaceId(),
                    ruleStatusClient,
                    description,
                    enabled,
                    eventCategoryOverride,
                    falsePositives,
                    from,
                    query,
                    language,
                    license,
                    outputIndex,
                    savedId,
                    timelineId,
                    timelineTitle,
                    meta,
                    filters,
                    rule: migratedRule,
                    index,
                    interval,
                    maxSignals,
                    riskScore,
                    riskScoreMapping,
                    ruleNameOverride,
                    name,
                    severity,
                    severityMapping,
                    tags,
                    timestampOverride,
                    throttle,
                    to,
                    type,
                    threat,
                    threshold,
                    threatFilters,
                    threatIndex,
                    threatQuery,
                    threatMapping,
                    threatLanguage,
                    concurrentSearches,
                    itemsPerSearch,
                    references,
                    note,
                    version,
                    exceptionsList,
                    anomalyThreshold,
                    machineLearningJobId,
                    actions
                  });
                  resolve({
                    rule_id: ruleId,
                    status_code: 200
                  });
                } else if (rule != null) {
                  resolve((0, _utils2.createBulkErrorObject)({
                    ruleId,
                    statusCode: 409,
                    message: `rule_id: "${ruleId}" already exists`
                  }));
                }
              } catch (err) {
                var _err$statusCode;

                resolve((0, _utils2.createBulkErrorObject)({
                  ruleId,
                  statusCode: (_err$statusCode = err.statusCode) !== null && _err$statusCode !== void 0 ? _err$statusCode : 400,
                  message: err.message
                }));
              }
            } catch (error) {
              reject(error);
            }
          });
          return [...accum, importsWorkerPromise];
        }, []));
        importRuleResponse = [...nonExistentActionErrors, ...duplicateIdErrors, ...importRuleResponse, ...newImportRuleResponse];
      }

      const errorsResp = importRuleResponse.filter(resp => (0, _utils2.isBulkError)(resp));
      const successes = importRuleResponse.filter(resp => {
        if ((0, _utils2.isImportRegular)(resp)) {
          return resp.status_code === 200;
        } else {
          return false;
        }
      });
      const importRules = {
        success: errorsResp.length === 0,
        success_count: successes.length,
        errors: errorsResp
      };
      const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(importRules, _import_rules_schema2.importRulesSchema);

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
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.importRulesRoute = importRulesRoute;