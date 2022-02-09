"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetryDiagnosticsTaskConfig = createTelemetryDiagnosticsTaskConfig;

var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createTelemetryDiagnosticsTaskConfig() {
  return {
    type: 'security:endpoint-diagnostics',
    title: 'Security Solution Telemetry Diagnostics task',
    interval: '5m',
    timeout: '1m',
    version: '1.0.0',
    getLastExecutionTime: _helpers.getPreviousDiagTaskTimestamp,
    runTask: async (taskId, logger, receiver, sender, taskExecutionPeriod) => {
      var _response$hits;

      if (!taskExecutionPeriod.last) {
        throw new Error('last execution timestamp is required');
      }

      const response = await receiver.fetchDiagnosticAlerts(taskExecutionPeriod.last, taskExecutionPeriod.current);
      const hits = ((_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits) || [];

      if (!Array.isArray(hits) || !hits.length) {
        logger.debug('no diagnostic alerts retrieved');
        return 0;
      }

      logger.debug(`Received ${hits.length} diagnostic alerts`);
      const diagAlerts = hits.flatMap(h => h._source != null ? [h._source] : []);
      sender.queueTelemetryEvents(diagAlerts);
      return diagAlerts.length;
    }
  };
}