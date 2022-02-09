"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetryDetectionRuleListsTaskConfig = createTelemetryDetectionRuleListsTaskConfig;

var _constants = require("../constants");

var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createTelemetryDetectionRuleListsTaskConfig(maxTelemetryBatch) {
  return {
    type: 'security:telemetry-detection-rules',
    title: 'Security Solution Detection Rule Lists Telemetry',
    interval: '24h',
    timeout: '10m',
    version: '1.0.0',
    runTask: async (taskId, logger, receiver, sender, taskExecutionPeriod) => {
      // Lists Telemetry: Detection Rules
      const {
        body: prebuiltRules
      } = await receiver.fetchDetectionRules();

      if (!prebuiltRules) {
        logger.debug('no prebuilt rules found');
        return 0;
      }

      const cacheArray = prebuiltRules.hits.hits.reduce((cache, searchHit) => {
        var _searchHit$_source;

        const rule = searchHit._source;
        const ruleId = rule.alert.params.ruleId;
        const shouldNotProcess = rule === null || rule === undefined || ruleId === null || ruleId === undefined || ((_searchHit$_source = searchHit._source) === null || _searchHit$_source === void 0 ? void 0 : _searchHit$_source.alert.params.exceptionsList.length) === 0;

        if (shouldNotProcess) {
          return cache;
        }

        cache.push(rule);
        return cache;
      }, []);
      const detectionRuleExceptions = [];

      for (const item of cacheArray) {
        const ruleVersion = item.alert.params.version;

        for (const ex of item.alert.params.exceptionsList) {
          const listItem = await receiver.fetchDetectionExceptionList(ex.list_id, ruleVersion);

          for (const exceptionItem of listItem.data) {
            detectionRuleExceptions.push(exceptionItem);
          }
        }
      }

      const detectionRuleExceptionsJson = (0, _helpers.templateExceptionList)(detectionRuleExceptions, _constants.LIST_DETECTION_RULE_EXCEPTION);
      (0, _helpers.batchTelemetryRecords)(detectionRuleExceptionsJson, maxTelemetryBatch).forEach(batch => {
        sender.sendOnDemand(_constants.TELEMETRY_CHANNEL_LISTS, batch);
      });
      return detectionRuleExceptions.length;
    }
  };
}