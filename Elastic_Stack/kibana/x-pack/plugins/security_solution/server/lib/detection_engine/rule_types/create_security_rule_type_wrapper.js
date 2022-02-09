"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSecurityRuleTypeWrapper = void 0;

var _lodash = require("lodash");

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _server = require("../../../../../rule_registry/server");

var _build_rule_message_factory = require("./factories/build_rule_message_factory");

var _utils = require("../signals/utils");

var _constants = require("../../../../common/constants");

var _get_list_client = require("./utils/get_list_client");

var _schedule_notification_actions = require("../notifications/schedule_notification_actions");

var _utils2 = require("../notifications/utils");

var _utils3 = require("./utils");

var _factories = require("./factories");

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


const createSecurityRuleTypeWrapper = ({
  lists,
  logger,
  config,
  ruleDataClient,
  eventLogService
}) => type => {
  const {
    alertIgnoreFields: ignoreFields,
    alertMergeStrategy: mergeStrategy
  } = config;
  const persistenceRuleType = (0, _server.createPersistenceRuleTypeWrapper)({
    ruleDataClient,
    logger
  });
  return persistenceRuleType({ ...type,

    async executor(options) {
      const {
        alertId,
        params,
        previousStartedAt,
        startedAt,
        services,
        spaceId,
        state,
        updatedBy: updatedByUser
      } = options;
      let runState = state;
      const {
        from,
        maxSignals,
        meta,
        ruleId,
        timestampOverride,
        to
      } = params;
      const {
        alertWithPersistence,
        savedObjectsClient,
        scopedClusterClient
      } = services;
      const searchAfterSize = Math.min(maxSignals, _constants.DEFAULT_SEARCH_AFTER_PAGE_SIZE);
      const esClient = scopedClusterClient.asCurrentUser;
      const ruleStatusClient = new _rule_execution_log.RuleExecutionLogClient({
        savedObjectsClient,
        eventLogService,
        underlyingClient: config.ruleExecutionLog.underlyingClient
      });
      const ruleSO = await savedObjectsClient.get('alert', alertId);
      const {
        actions,
        name,
        alertTypeId,
        schedule: {
          interval
        }
      } = ruleSO.attributes;
      const refresh = actions.length ? 'wait_for' : false;
      const buildRuleMessage = (0, _build_rule_message_factory.buildRuleMessageFactory)({
        id: alertId,
        ruleId,
        name,
        index: ruleDataClient.indexName
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
      let result = (0, _utils3.createResultObject)(state);
      const notificationRuleParams = { ...params,
        name: name,
        id: ruleSO.id
      }; // check if rule has permissions to access given index pattern
      // move this collection of lines into a function in utils
      // so that we can use it in create rules route, bulk, etc.

      try {
        // Typescript 4.1.3 can't figure out that `!isMachineLearningParams(params)` also excludes the only rule type
        // of rule params that doesn't include `params.index`, but Typescript 4.3.5 does compute the stricter type correctly.
        // When we update Typescript to >= 4.3.5, we can replace this logic with `!isMachineLearningParams(params)` again.
        if ((0, _utils.isEqlParams)(params) || (0, _utils.isThresholdParams)(params) || (0, _utils.isQueryParams)(params) || (0, _utils.isSavedQueryParams)(params) || (0, _utils.isThreatParams)(params)) {
          var _params$index;

          const index = params.index;
          const hasTimestampOverride = !!timestampOverride;
          const inputIndices = (_params$index = params.index) !== null && _params$index !== void 0 ? _params$index : [];
          const privileges = await (0, _utils.checkPrivilegesFromEsClient)(esClient, inputIndices);
          wroteWarningStatus = await (0, _utils.hasReadIndexPrivileges)({ ...basicLogArguments,
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
            wroteWarningStatus = await (0, _utils.hasTimestampFields)({ ...basicLogArguments,
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

      let hasError = false;
      const {
        tuples,
        remainingGap
      } = (0, _utils.getRuleRangeTuples)({
        logger,
        previousStartedAt,
        from: from,
        to: to,
        interval,
        maxSignals: _constants.DEFAULT_MAX_SIGNALS,
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
        var _ref;

        const {
          listClient,
          exceptionsClient
        } = (0, _get_list_client.getListClient)({
          esClient: services.scopedClusterClient.asCurrentUser,
          updatedByUser,
          spaceId,
          lists,
          savedObjectClient: options.services.savedObjectsClient
        });
        const exceptionItems = await (0, _utils.getExceptions)({
          client: exceptionsClient,
          lists: (_ref = params.exceptionsList) !== null && _ref !== void 0 ? _ref : []
        });
        const bulkCreate = (0, _factories.bulkCreateFactory)(logger, alertWithPersistence, buildRuleMessage, refresh);
        const wrapHits = (0, _factories.wrapHitsFactory)({
          logger,
          ignoreFields,
          mergeStrategy,
          ruleSO,
          spaceId
        });
        const wrapSequences = (0, _factories.wrapSequencesFactory)({
          logger,
          ignoreFields,
          mergeStrategy,
          ruleSO,
          spaceId
        });

        for (const tuple of tuples) {
          const runResult = await type.executor({ ...options,
            services,
            state: runState,
            runOpts: {
              buildRuleMessage,
              bulkCreate,
              exceptionItems,
              listClient,
              rule: ruleSO,
              searchAfterSize,
              tuple,
              wrapHits,
              wrapSequences
            }
          });
          const createdSignals = result.createdSignals.concat(runResult.createdSignals);
          const warningMessages = result.warningMessages.concat(runResult.warningMessages);
          result = {
            bulkCreateTimes: result.bulkCreateTimes.concat(runResult.bulkCreateTimes),
            createdSignals,
            createdSignalsCount: createdSignals.length,
            errors: result.errors.concat(runResult.errors),
            lastLookbackDate: runResult.lastLookBackDate,
            searchAfterTimes: result.searchAfterTimes.concat(runResult.searchAfterTimes),
            state: runState,
            success: result.success && runResult.success,
            warning: warningMessages.length > 0,
            warningMessages
          };
          runState = runResult.state;
        }

        if (result.warningMessages.length) {
          const warningMessage = buildRuleMessage((0, _rule_execution_log.truncateMessageList)(result.warningMessages).join());
          await ruleStatusClient.logStatusChange({ ...basicLogArguments,
            newStatus: _schemas.RuleExecutionStatus['partial failure'],
            message: warningMessage
          });
        }

        if (result.success) {
          const createdSignalsCount = result.createdSignals.length;

          if (actions.length) {
            var _parseScheduleDates, _parseScheduleDates2;

            const fromInMs = (_parseScheduleDates = (0, _securitysolutionIoTsUtils.parseScheduleDates)(`now-${interval}`)) === null || _parseScheduleDates === void 0 ? void 0 : _parseScheduleDates.format('x');
            const toInMs = (_parseScheduleDates2 = (0, _securitysolutionIoTsUtils.parseScheduleDates)('now')) === null || _parseScheduleDates2 === void 0 ? void 0 : _parseScheduleDates2.format('x');
            const resultsLink = (0, _utils2.getNotificationResultsLink)({
              from: fromInMs,
              to: toInMs,
              id: ruleSO.id,
              kibanaSiemAppUrl: meta === null || meta === void 0 ? void 0 : meta.kibana_siem_app_url
            });
            logger.debug(buildRuleMessage(`Found ${createdSignalsCount} signals for notification.`));

            if (ruleSO.attributes.throttle != null) {
              await (0, _schedule_throttle_notification_actions.scheduleThrottledNotificationActions)({
                alertInstance: services.alertInstanceFactory(alertId),
                throttle: ruleSO.attributes.throttle,
                startedAt,
                id: ruleSO.id,
                kibanaSiemAppUrl: meta === null || meta === void 0 ? void 0 : meta.kibana_siem_app_url,
                outputIndex: ruleDataClient.indexName,
                ruleId,
                esClient: services.scopedClusterClient.asCurrentUser,
                notificationRuleParams,
                signals: result.createdSignals,
                logger
              });
            } else if (createdSignalsCount) {
              const alertInstance = services.alertInstanceFactory(alertId);
              (0, _schedule_notification_actions.scheduleNotificationActions)({
                alertInstance,
                signalsCount: createdSignalsCount,
                signals: result.createdSignals,
                resultsLink,
                ruleParams: notificationRuleParams
              });
            }
          }

          logger.debug(buildRuleMessage('[+] Signal Rule execution completed.'));
          logger.debug(buildRuleMessage(`[+] Finished indexing ${createdSignalsCount} signals into ${ruleDataClient.indexName}`));

          if (!hasError && !wroteWarningStatus && !result.warning) {
            var _result$lastLookbackD;

            await ruleStatusClient.logStatusChange({ ...basicLogArguments,
              newStatus: _schemas.RuleExecutionStatus.succeeded,
              message: 'succeeded',
              metrics: {
                indexingDurations: result.bulkCreateTimes,
                searchDurations: result.searchAfterTimes,
                lastLookBackDate: (_result$lastLookbackD = result.lastLookbackDate) === null || _result$lastLookbackD === void 0 ? void 0 : _result$lastLookbackD.toISOString()
              }
            });
          }

          logger.debug(buildRuleMessage(`[+] Finished indexing ${createdSignalsCount} ${!(0, _lodash.isEmpty)(tuples) ? `signals searched between date ranges ${JSON.stringify(tuples, null, 2)}` : ''}`));
        } else {
          var _result$lastLookbackD2; // NOTE: Since this is throttled we have to call it even on an error condition, otherwise it will "reset" the throttle and fire early


          if (ruleSO.attributes.throttle != null) {
            await (0, _schedule_throttle_notification_actions.scheduleThrottledNotificationActions)({
              alertInstance: services.alertInstanceFactory(alertId),
              throttle: ruleSO.attributes.throttle,
              startedAt,
              id: ruleSO.id,
              kibanaSiemAppUrl: meta === null || meta === void 0 ? void 0 : meta.kibana_siem_app_url,
              outputIndex: ruleDataClient.indexName,
              ruleId,
              esClient: services.scopedClusterClient.asCurrentUser,
              notificationRuleParams,
              signals: result.createdSignals,
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
              lastLookBackDate: (_result$lastLookbackD2 = result.lastLookbackDate) === null || _result$lastLookbackD2 === void 0 ? void 0 : _result$lastLookbackD2.toISOString()
            }
          });
        }
      } catch (error) {
        var _error$message, _result$lastLookbackD3; // NOTE: Since this is throttled we have to call it even on an error condition, otherwise it will "reset" the throttle and fire early


        if (ruleSO.attributes.throttle != null) {
          await (0, _schedule_throttle_notification_actions.scheduleThrottledNotificationActions)({
            alertInstance: services.alertInstanceFactory(alertId),
            throttle: ruleSO.attributes.throttle,
            startedAt,
            id: ruleSO.id,
            kibanaSiemAppUrl: meta === null || meta === void 0 ? void 0 : meta.kibana_siem_app_url,
            outputIndex: ruleDataClient.indexName,
            ruleId,
            esClient: services.scopedClusterClient.asCurrentUser,
            notificationRuleParams,
            signals: result.createdSignals,
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
            lastLookBackDate: (_result$lastLookbackD3 = result.lastLookbackDate) === null || _result$lastLookbackD3 === void 0 ? void 0 : _result$lastLookbackD3.toISOString()
          }
        });
      }

      return result.state;
    }

  });
};

exports.createSecurityRuleTypeWrapper = createSecurityRuleTypeWrapper;