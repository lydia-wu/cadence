"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPrepackagedRules = exports.addPrepackedRulesRoute = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _moment = _interopRequireDefault(require("moment"));

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _prepackaged_rules_schema = require("../../../../../common/detection_engine/schemas/response/prepackaged_rules_schema");

var _timeline = require("../../../../../common/types/timeline");

var _constants = require("../../../../../common/constants");

var _get_prepackaged_rules = require("../../rules/get_prepackaged_rules");

var _install_prepacked_rules = require("../../rules/install_prepacked_rules");

var _update_prepacked_rules = require("../../rules/update_prepacked_rules");

var _get_rules_to_install = require("../../rules/get_rules_to_install");

var _get_rules_to_update = require("../../rules/get_rules_to_update");

var _get_existing_prepackaged_rules = require("../../rules/get_existing_prepackaged_rules");

var _rule_asset_saved_objects_client = require("../../rules/rule_asset/rule_asset_saved_objects_client");

var _utils = require("../utils");

var _install_prepackaged_timelines = require("../../../timeline/routes/prepackaged_timelines/install_prepackaged_timelines");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const addPrepackedRulesRoute = router => {
  router.put({
    path: _constants.DETECTION_ENGINE_PREPACKAGED_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution'],
      timeout: {
        // FUNFACT: If we do not add a very long timeout what will happen
        // is that Chrome which receive a 408 error and then do a retry.
        // This retry can cause lots of connections to happen. Using a very
        // long timeout will ensure that Chrome does not do retries and saturate the connections.
        idleSocket: _moment.default.duration('1', 'hour').asMilliseconds()
      }
    }
  }, async (context, _, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      var _context$alerting, _context$securitySolu;

      const rulesClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getRulesClient();
      const siemClient = (_context$securitySolu = context.securitySolution) === null || _context$securitySolu === void 0 ? void 0 : _context$securitySolu.getAppClient();

      if (!siemClient || !rulesClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      const validated = await createPrepackagedRules(context.securitySolution, rulesClient, undefined);
      return response.ok({
        body: validated !== null && validated !== void 0 ? validated : {}
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

exports.addPrepackedRulesRoute = addPrepackedRulesRoute;

class PrepackagedRulesError extends Error {
  constructor(message, statusCode) {
    super(message);
    (0, _defineProperty2.default)(this, "statusCode", void 0);
    this.statusCode = statusCode;
  }

}

const createPrepackagedRules = async (context, rulesClient, exceptionsClient) => {
  var _context$getException, _prepackagedTimelines, _prepackagedTimelines2;

  const config = context.getConfig();
  const frameworkRequest = context.getFrameworkRequest();
  const esClient = context.core.elasticsearch.client;
  const savedObjectsClient = context.core.savedObjects.client;
  const siemClient = context.getAppClient();
  const exceptionsListClient = (_context$getException = context.getExceptionListClient()) !== null && _context$getException !== void 0 ? _context$getException : exceptionsClient;
  const ruleAssetsClient = (0, _rule_asset_saved_objects_client.ruleAssetSavedObjectsClientFactory)(savedObjectsClient);
  const ruleStatusClient = context.getExecutionLogClient();
  const {
    maxTimelineImportExportSize,
    prebuiltRulesFromFileSystem,
    prebuiltRulesFromSavedObjects,
    experimentalFeatures: {
      ruleRegistryEnabled
    }
  } = config;

  if (!siemClient || !rulesClient) {
    throw new PrepackagedRulesError('', 404);
  } // This will create the endpoint list if it does not exist yet


  if (exceptionsListClient != null) {
    await exceptionsListClient.createEndpointList();
  }

  const latestPrepackagedRules = await (0, _get_prepackaged_rules.getLatestPrepackagedRules)(ruleAssetsClient, prebuiltRulesFromFileSystem, prebuiltRulesFromSavedObjects);
  const prepackagedRules = await (0, _get_existing_prepackaged_rules.getExistingPrepackagedRules)({
    rulesClient,
    isRuleRegistryEnabled: ruleRegistryEnabled
  });
  const rulesToInstall = (0, _get_rules_to_install.getRulesToInstall)(latestPrepackagedRules, prepackagedRules);
  const rulesToUpdate = (0, _get_rules_to_update.getRulesToUpdate)(latestPrepackagedRules, prepackagedRules);
  const signalsIndex = siemClient.getSignalsIndex();

  if (!ruleRegistryEnabled && (rulesToInstall.length !== 0 || rulesToUpdate.length !== 0)) {
    const signalsIndexExists = await (0, _securitysolutionEsUtils.getIndexExists)(esClient.asCurrentUser, signalsIndex);

    if (!signalsIndexExists) {
      throw new PrepackagedRulesError(`Pre-packaged rules cannot be installed until the signals index is created: ${signalsIndex}`, 400);
    }
  }

  await Promise.all((0, _install_prepacked_rules.installPrepackagedRules)(rulesClient, rulesToInstall, signalsIndex, ruleRegistryEnabled));
  const timeline = await (0, _install_prepackaged_timelines.installPrepackagedTimelines)(maxTimelineImportExportSize, frameworkRequest, true);
  const [prepackagedTimelinesResult, timelinesErrors] = (0, _securitysolutionIoTsUtils.validate)(timeline, _timeline.importTimelineResultSchema);
  await (0, _update_prepacked_rules.updatePrepackagedRules)(rulesClient, savedObjectsClient, context.getSpaceId(), ruleStatusClient, rulesToUpdate, signalsIndex, ruleRegistryEnabled);
  const prepackagedRulesOutput = {
    rules_installed: rulesToInstall.length,
    rules_updated: rulesToUpdate.length,
    timelines_installed: (_prepackagedTimelines = prepackagedTimelinesResult === null || prepackagedTimelinesResult === void 0 ? void 0 : prepackagedTimelinesResult.timelines_installed) !== null && _prepackagedTimelines !== void 0 ? _prepackagedTimelines : 0,
    timelines_updated: (_prepackagedTimelines2 = prepackagedTimelinesResult === null || prepackagedTimelinesResult === void 0 ? void 0 : prepackagedTimelinesResult.timelines_updated) !== null && _prepackagedTimelines2 !== void 0 ? _prepackagedTimelines2 : 0
  };
  const [validated, genericErrors] = (0, _securitysolutionIoTsUtils.validate)(prepackagedRulesOutput, _prepackaged_rules_schema.prePackagedRulesAndTimelinesSchema);

  if (genericErrors != null && timelinesErrors != null) {
    throw new PrepackagedRulesError([genericErrors, timelinesErrors].filter(msg => msg != null).join(', '), 500);
  }

  return validated;
};

exports.createPrepackagedRules = createPrepackagedRules;