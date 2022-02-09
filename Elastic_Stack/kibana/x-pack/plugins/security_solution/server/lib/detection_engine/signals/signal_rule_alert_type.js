"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signalRulesAlertType = exports.asTypeSpecificSO = void 0;

var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _constants = require("../../../../common/constants");

var _helpers = require("../../../../common/machine_learning/helpers");

var _utils = require("../../../../common/detection_engine/utils");

var _get_input_output_index = require("./get_input_output_index");

var _utils2 = require("./utils");

var _siem_rule_action_groups = require("./siem_rule_action_groups");

var _schedule_notification_actions = require("../notifications/schedule_notification_actions");

var _rule_messages = require("./rule_messages");

var _utils3 = require("../notifications/utils");

var _eql = require("./executors/eql");

var _query = require("./executors/query");

var _threat_match = require("./executors/threat_match");

var _threshold = require("./executors/threshold");

var _ml = require("./executors/ml");

var _rule_schemas = require("../schemas/rule_schemas");

var _bulk_create_factory = require("./bulk_create_factory");

var _wrap_hits_factory = require("./wrap_hits_factory");

var _wrap_sequences_factory = require("./wrap_sequences_factory");

var _saved_object_references = require("./saved_object_references");

var _rule_execution_log = require("../rule_execution_log");

var _schemas = require("../../../../common/detection_engine/schemas/common/schemas");

var _schedule_throttle_notification_actions = require("../notifications/schedule_throttle_notification_actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable complexity */


const signalRulesAlertType = ({
  logger,
  eventsTelemetry,
  experimentalFeatures,
  version,
  ml,
  lists,
  config,
  eventLogService
}) => {
  const {
    alertMergeStrategy: mergeStrategy,
    alertIgnoreFields: ignoreFields
  } = config;
  return {
    id: _constants.SIGNALS_ID,
    name: 'SIEM signal',
    actionGroups: _siem_rule_action_groups.siemRuleActionGroups,
    defaultActionGroupId: 'default',
    useSavedObjectReferences: {
      extractReferences: params => (0, _saved_object_references.extractReferences)({
        logger,
        params
      }),
      injectReferences: (params, savedObjectReferences) => (0, _saved_object_references.injectReferences)({
        logger,
        params,
        savedObjectReferences
      })
    },
    validate: {
      params: {
        validate: object => {
          const [validated, errors] = (0, _securitysolutionIoTsUtils.validateNonExact)(object, _rule_schemas.ruleParams);

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
    producer: _constants.SERVER_APP_ID,
    minimumLicenseRequired: 'basic',
    isExportable: false,

    async executor({
      previousStartedAt,
      startedAt,
      state,
      alertId,
      services,
      params,
      spaceId,
      updatedBy: updatedByUser
    }) {
      const {
        ruleId,
        maxSignals,
        meta,
        outputIndex,
        timestampOverride,
        type
      } = params;
      const searchAfterSize = Math.min(maxSignals, _constants.DEFAULT_SEARCH_AFTER_PAGE_SIZE);
      let hasError = false;
      let result = (0, _utils2.createSearchAfterReturnType)();
      const ruleStatusClient = new _rule_execution_log.RuleExecutionLogClient({
        eventLogService,
        savedObjectsClient: services.savedObjectsClient,
        underlyingClient: config.ruleExecutionLog.underlyingClient
      });
      const savedObject = await services.savedObjectsClient.get('alert', alertId);
      const {
        actions,
        name,
        alertTypeId,
        schedule: {
          interval
        }
      } = savedObject.attributes;
      const refresh = actions.length ? 'wait_for' : false;
      const buildRuleMessage = (0, _rule_messages.buildRuleMessageFactory)({
        id: alertId,
        ruleId,
        name,
        index: outputIndex
      });
      logger.debug(buildRuleMessage('[+] Starting Signal Rule execution'));
      logger.debug(buildRuleMessage(`interval: ${interval}`));
      let wroteWarningStatus = false;
      const basicLogArguments = {
        spaceId,
        ruleId: alertId,
        ruleName: name,
        ruleType: alertTypeId
      };
      await ruleStatusClient.logStatusChange({ ...basicLogArguments,
        newStatus: _schemas.RuleExecutionStatus['going to run']
      });
      const notificationRuleParams = { ...params,
        name,
        id: savedObject.id
      }; // check if rule has permissions to access given index pattern
      // move this collection of lines into a function in utils
      // so that we can use it in create rules route, bulk, etc.

      try {
        if (!(0, _utils2.isMachineLearningParams)(params)) {
          const index = params.index;
          const hasTimestampOverride = timestampOverride != null && !(0, _isEmpty.default)(timestampOverride);
          const inputIndices = await (0, _get_input_output_index.getInputIndex)({
            services,
            version,
            index,
            experimentalFeatures
          });
          const privileges = await (0, _utils2.checkPrivileges)(services, inputIndices);
          wroteWarningStatus = await (0, _utils2.hasReadIndexPrivileges)({ ...basicLogArguments,
            privileges,
            logger,
            buildRuleMessage,
            ruleStatusClient
          });

          if (!wroteWarningStatus) {
            const timestampFieldCaps = await services.scopedClusterClient.asCurrentUser.fieldCaps({
              index,
              fields: hasTimestampOverride ? ['@timestamp', timestampOverride] : ['@timestamp'],
              include_unmapped: true
            });
            wroteWarningStatus = await (0, _utils2.hasTimestampFields)({ ...basicLogArguments,
              timestampField: hasTimestampOverride ? timestampOverride : '@timestamp',
              timestampFieldCapsResponse: timestampFieldCaps,
              inputIndices,
              ruleStatusClient,
              logger,
              buildRuleMessage
            });
          }
        }
      } catch (exc) {
        const errorMessage = buildRuleMessage(`Check privileges failed to execute ${exc}`);
        logger.error(errorMessage);
        await ruleStatusClient.logStatusChange({ ...basicLogArguments,
          message: errorMessage,
          newStatus: _schemas.RuleExecutionStatus['partial failure']
        });
        wroteWarningStatus = true;
      }

      const {
        tuples,
        remainingGap
      } = (0, _utils2.getRuleRangeTuples)({
        logger,
        previousStartedAt,
        from: params.from,
        to: params.to,
        interval,
        maxSignals,
        buildRuleMessage
      });

      if (remainingGap.asMilliseconds() > 0) {
        const gapString = remainingGap.humanize();
        const gapMessage = buildRuleMessage(`${gapString} (${remainingGap.asMilliseconds()}ms) were not queried between this rule execution and the last execution, so signals may have been missed.`, 'Consider increasing your look behind time or adding more Kibana instances.');
        logger.warn(gapMessage);
        hasError = true;
        await ruleStatusClient.logStatusChange({ ...basicLogArguments,
          newStatus: _schemas.RuleExecutionStatus.failed,
          message: gapMessage,
          metrics: {
            executionGap: remainingGap
          }
        });
      }

      try {
        var _params$exceptionsLis;

        const {
          listClient,
          exceptionsClient
        } = (0, _utils2.getListsClient)({
          services,
          updatedByUser,
          spaceId,
          lists,
          savedObjectClient: services.savedObjectsClient
        });
        const exceptionItems = await (0, _utils2.getExceptions)({
          client: exceptionsClient,
          lists: (_params$exceptionsLis = params.exceptionsList) !== null && _params$exceptionsLis !== void 0 ? _params$exceptionsLis : []
        });
        const bulkCreate = (0, _bulk_create_factory.bulkCreateFactory)(logger, services.scopedClusterClient.asCurrentUser, buildRuleMessage, refresh);
        const wrapHits = (0, _wrap_hits_factory.wrapHitsFactory)({
          ruleSO: savedObject,
          signalsIndex: params.outputIndex,
          mergeStrategy,
          ignoreFields
        });
        const wrapSequences = (0, _wrap_sequences_factory.wrapSequencesFactory)({
          ruleSO: savedObject,
          signalsIndex: params.outputIndex,
          mergeStrategy,
          ignoreFields
        });

        if ((0, _helpers.isMlRule)(type)) {
          const mlRuleSO = asTypeSpecificSO(savedObject, _rule_schemas.machineLearningRuleParams);

          for (const tuple of tuples) {
            result = await (0, _ml.mlExecutor)({
              rule: mlRuleSO,
              tuple,
              ml,
              listClient,
              exceptionItems,
              services,
              logger,
              buildRuleMessage,
              bulkCreate,
              wrapHits
            });
          }
        } else if ((0, _utils.isThresholdRule)(type)) {
          const thresholdRuleSO = asTypeSpecificSO(savedObject, _rule_schemas.thresholdRuleParams);

          for (const tuple of tuples) {
            result = await (0, _threshold.thresholdExecutor)({
              rule: thresholdRuleSO,
              tuple,
              exceptionItems,
              experimentalFeatures,
              services,
              version,
              logger,
              buildRuleMessage,
              startedAt,
              state: state,
              bulkCreate,
              wrapHits
            });
          }
        } else if ((0, _utils.isThreatMatchRule)(type)) {
          const threatRuleSO = asTypeSpecificSO(savedObject, _rule_schemas.threatRuleParams);

          for (const tuple of tuples) {
            result = await (0, _threat_match.threatMatchExecutor)({
              rule: threatRuleSO,
              tuple,
              listClient,
              exceptionItems,
              experimentalFeatures,
              services,
              version,
              searchAfterSize,
              logger,
              eventsTelemetry,
              buildRuleMessage,
              bulkCreate,
              wrapHits
            });
          }
        } else if ((0, _utils.isQueryRule)(type)) {
          const queryRuleSO = validateQueryRuleTypes(savedObject);

          for (const tuple of tuples) {
            result = await (0, _query.queryExecutor)({
              rule: queryRuleSO,
              tuple,
              listClient,
              exceptionItems,
              experimentalFeatures,
              services,
              version,
              searchAfterSize,
              logger,
              eventsTelemetry,
              buildRuleMessage,
              bulkCreate,
              wrapHits
            });
          }
        } else if ((0, _utils.isEqlRule)(type)) {
          const eqlRuleSO = asTypeSpecificSO(savedObject, _rule_schemas.eqlRuleParams);

          for (const tuple of tuples) {
            result = await (0, _eql.eqlExecutor)({
              rule: eqlRuleSO,
              tuple,
              exceptionItems,
              experimentalFeatures,
              services,
              version,
              searchAfterSize,
              bulkCreate,
              logger,
              wrapHits,
              wrapSequences
            });
          }
        } else {
          throw new Error(`unknown rule type ${type}`);
        }

        if (result.warningMessages.length) {
          const warningMessage = buildRuleMessage((0, _rule_execution_log.truncateMessageList)(result.warningMessages).join());
          await ruleStatusClient.logStatusChange({ ...basicLogArguments,
            newStatus: _schemas.RuleExecutionStatus['partial failure'],
            message: warningMessage
          });
        }

        if (result.success) {
          if (actions.length) {
            var _parseScheduleDates, _parseScheduleDates2;

            const fromInMs = (_parseScheduleDates = (0, _securitysolutionIoTsUtils.parseScheduleDates)(`now-${interval}`)) === null || _parseScheduleDates === void 0 ? void 0 : _parseScheduleDates.format('x');
            const toInMs = (_parseScheduleDates2 = (0, _securitysolutionIoTsUtils.parseScheduleDates)('now')) === null || _parseScheduleDates2 === void 0 ? void 0 : _parseScheduleDates2.format('x');
            const resultsLink = (0, _utils3.getNotificationResultsLink)({
              from: fromInMs,
              to: toInMs,
              id: savedObject.id,
              kibanaSiemAppUrl: meta === null || meta === void 0 ? void 0 : meta.kibana_siem_app_url
            });
            logger.debug(buildRuleMessage(`Found ${result.createdSignalsCount} signals for notification.`));

            if (savedObject.attributes.throttle != null) {
              await (0, _schedule_throttle_notification_actions.scheduleThrottledNotificationActions)({
                alertInstance: services.alertInstanceFactory(alertId),
                throttle: savedObject.attributes.throttle,
                startedAt,
                id: savedObject.id,
                kibanaSiemAppUrl: meta === null || meta === void 0 ? void 0 : meta.kibana_siem_app_url,
                outputIndex,
                ruleId,
                signals: result.createdSignals,
                esClient: services.scopedClusterClient.asCurrentUser,
                notificationRuleParams,
                logger
              });
            } else if (result.createdSignalsCount) {
              const alertInstance = services.alertInstanceFactory(alertId);
              (0, _schedule_notification_actions.scheduleNotificationActions)({
                alertInstance,
                signalsCount: result.createdSignalsCount,
                signals: result.createdSignals,
                resultsLink,
                ruleParams: notificationRuleParams
              });
            }
          }

          logger.debug(buildRuleMessage('[+] Signal Rule execution completed.'));
          logger.debug(buildRuleMessage(`[+] Finished indexing ${result.createdSignalsCount} signals into ${outputIndex}`));

          if (!hasError && !wroteWarningStatus && !result.warning) {
            var _result$lastLookBackD;

            await ruleStatusClient.logStatusChange({ ...basicLogArguments,
              newStatus: _schemas.RuleExecutionStatus.succeeded,
              message: 'succeeded',
              metrics: {
                indexingDurations: result.bulkCreateTimes,
                searchDurations: result.searchAfterTimes,
                lastLookBackDate: (_result$lastLookBackD = result.lastLookBackDate) === null || _result$lastLookBackD === void 0 ? void 0 : _result$lastLookBackD.toISOString()
              }
            });
          }

          logger.debug(buildRuleMessage(`[+] Finished indexing ${result.createdSignalsCount}  ${!(0, _isEmpty.default)(tuples) ? `signals searched between date ranges ${JSON.stringify(tuples, null, 2)}` : ''}`));
        } else {
          var _result$lastLookBackD2; // NOTE: Since this is throttled we have to call it even on an error condition, otherwise it will "reset" the throttle and fire early


          if (savedObject.attributes.throttle != null) {
            await (0, _schedule_throttle_notification_actions.scheduleThrottledNotificationActions)({
              alertInstance: services.alertInstanceFactory(alertId),
              throttle: savedObject.attributes.throttle,
              startedAt,
              id: savedObject.id,
              kibanaSiemAppUrl: meta === null || meta === void 0 ? void 0 : meta.kibana_siem_app_url,
              outputIndex,
              ruleId,
              signals: result.createdSignals,
              esClient: services.scopedClusterClient.asCurrentUser,
              notificationRuleParams,
              logger
            });
          }

          const errorMessage = buildRuleMessage('Bulk Indexing of signals failed:', (0, _rule_execution_log.truncateMessageList)(result.errors).join());
          logger.error(errorMessage);
          await ruleStatusClient.logStatusChange({ ...basicLogArguments,
            newStatus: _schemas.RuleExecutionStatus.failed,
            message: errorMessage,
            metrics: {
              indexingDurations: result.bulkCreateTimes,
              searchDurations: result.searchAfterTimes,
              lastLookBackDate: (_result$lastLookBackD2 = result.lastLookBackDate) === null || _result$lastLookBackD2 === void 0 ? void 0 : _result$lastLookBackD2.toISOString()
            }
          });
        }
      } catch (error) {
        var _error$message, _result$lastLookBackD3; // NOTE: Since this is throttled we have to call it even on an error condition, otherwise it will "reset" the throttle and fire early


        if (savedObject.attributes.throttle != null) {
          await (0, _schedule_throttle_notification_actions.scheduleThrottledNotificationActions)({
            alertInstance: services.alertInstanceFactory(alertId),
            throttle: savedObject.attributes.throttle,
            startedAt,
            id: savedObject.id,
            kibanaSiemAppUrl: meta === null || meta === void 0 ? void 0 : meta.kibana_siem_app_url,
            outputIndex,
            ruleId,
            signals: result.createdSignals,
            esClient: services.scopedClusterClient.asCurrentUser,
            notificationRuleParams,
            logger
          });
        }

        const errorMessage = (_error$message = error.message) !== null && _error$message !== void 0 ? _error$message : '(no error message given)';
        const message = buildRuleMessage('An error occurred during rule execution:', `message: "${errorMessage}"`);
        logger.error(message);
        await ruleStatusClient.logStatusChange({ ...basicLogArguments,
          newStatus: _schemas.RuleExecutionStatus.failed,
          message,
          metrics: {
            indexingDurations: result.bulkCreateTimes,
            searchDurations: result.searchAfterTimes,
            lastLookBackDate: (_result$lastLookBackD3 = result.lastLookBackDate) === null || _result$lastLookBackD3 === void 0 ? void 0 : _result$lastLookBackD3.toISOString()
          }
        });
      }
    }

  };
};

exports.signalRulesAlertType = signalRulesAlertType;

const validateQueryRuleTypes = ruleSO => {
  if (ruleSO.attributes.params.type === 'query') {
    return asTypeSpecificSO(ruleSO, _rule_schemas.queryRuleParams);
  } else {
    return asTypeSpecificSO(ruleSO, _rule_schemas.savedQueryRuleParams);
  }
};
/**
 * This function takes a generic rule SavedObject and a type-specific schema for the rule params
 * and validates the SavedObject params against the schema. If they validate, it returns a SavedObject
 * where the params have been replaced with the validated params. This eliminates the need for logic that
 * checks if the required type specific fields actually exist on the SO and prevents rule executors from
 * accessing fields that only exist on other rule types.
 *
 * @param ruleSO SavedObject typed as an object with all fields from all different rule types
 * @param schema io-ts schema for the specific rule type the SavedObject claims to be
 */


const asTypeSpecificSO = (ruleSO, schema) => {
  const [validated, errors] = (0, _securitysolutionIoTsUtils.validateNonExact)(ruleSO.attributes.params, schema);

  if (validated == null || errors != null) {
    throw new Error(`Rule attempted to execute with invalid params: ${errors}`);
  }

  return { ...ruleSO,
    attributes: { ...ruleSO.attributes,
      params: validated
    }
  };
};

exports.asTypeSpecificSO = asTypeSpecificSO;