"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetrySecurityListTaskConfig = createTelemetrySecurityListTaskConfig;

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

var _constants = require("../constants");

var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createTelemetrySecurityListTaskConfig(maxTelemetryBatch) {
  return {
    type: 'security:telemetry-lists',
    title: 'Security Solution Lists Telemetry',
    interval: '24h',
    timeout: '3m',
    version: '1.0.0',
    runTask: async (taskId, logger, receiver, sender, taskExecutionPeriod) => {
      let count = 0; // Lists Telemetry: Trusted Applications

      const trustedApps = await receiver.fetchTrustedApplications();

      if (trustedApps !== null && trustedApps !== void 0 && trustedApps.data) {
        const trustedAppsJson = (0, _helpers.templateExceptionList)(trustedApps.data, _constants.LIST_TRUSTED_APPLICATION);
        logger.debug(`Trusted Apps: ${trustedAppsJson}`);
        count += trustedAppsJson.length;
        (0, _helpers.batchTelemetryRecords)(trustedAppsJson, maxTelemetryBatch).forEach(batch => sender.sendOnDemand(_constants.TELEMETRY_CHANNEL_LISTS, batch));
      } // Lists Telemetry: Endpoint Exceptions


      const epExceptions = await receiver.fetchEndpointList(_securitysolutionListConstants.ENDPOINT_LIST_ID);

      if (epExceptions !== null && epExceptions !== void 0 && epExceptions.data) {
        const epExceptionsJson = (0, _helpers.templateExceptionList)(epExceptions.data, _constants.LIST_ENDPOINT_EXCEPTION);
        logger.debug(`EP Exceptions: ${epExceptionsJson}`);
        count += epExceptionsJson.length;
        (0, _helpers.batchTelemetryRecords)(epExceptionsJson, maxTelemetryBatch).forEach(batch => sender.sendOnDemand(_constants.TELEMETRY_CHANNEL_LISTS, batch));
      } // Lists Telemetry: Endpoint Event Filters


      const epFilters = await receiver.fetchEndpointList(_securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_ID);

      if (epFilters !== null && epFilters !== void 0 && epFilters.data) {
        const epFiltersJson = (0, _helpers.templateExceptionList)(epFilters.data, _constants.LIST_ENDPOINT_EVENT_FILTER);
        logger.debug(`EP Event Filters: ${epFiltersJson}`);
        count += epFiltersJson.length;
        (0, _helpers.batchTelemetryRecords)(epFiltersJson, maxTelemetryBatch).forEach(batch => sender.sendOnDemand(_constants.TELEMETRY_CHANNEL_LISTS, batch));
      }

      return count;
    }
  };
}