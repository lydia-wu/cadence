"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.batchTelemetryRecords = void 0;
exports.createUsageCounterLabel = createUsageCounterLabel;
exports.getPreviousDiagTaskTimestamp = exports.getPreviousDailyTaskTimestamp = exports.exceptionListItemToTelemetryEntry = void 0;
exports.isPackagePolicyList = isPackagePolicyList;
exports.trustedApplicationToTelemetryEntry = exports.templateExceptionList = exports.ruleExceptionListItemToTelemetryEvent = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _filters = require("./filters");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Determines the when the last run was in order to execute to.
 *
 * @param executeTo
 * @param lastExecutionTimestamp
 * @returns the timestamp to search from
 */


const getPreviousDiagTaskTimestamp = (executeTo, lastExecutionTimestamp) => {
  if (lastExecutionTimestamp === undefined) {
    return (0, _moment.default)(executeTo).subtract(5, 'minutes').toISOString();
  }

  if ((0, _moment.default)(executeTo).diff(lastExecutionTimestamp, 'minutes') >= 10) {
    return (0, _moment.default)(executeTo).subtract(10, 'minutes').toISOString();
  }

  return lastExecutionTimestamp;
};
/**
 * Determines the when the last run was in order to execute to.
 *
 * @param executeTo
 * @param lastExecutionTimestamp
 * @returns the timestamp to search from
 */


exports.getPreviousDiagTaskTimestamp = getPreviousDiagTaskTimestamp;

const getPreviousDailyTaskTimestamp = (executeTo, lastExecutionTimestamp) => {
  if (lastExecutionTimestamp === undefined) {
    return (0, _moment.default)(executeTo).subtract(24, 'hours').toISOString();
  }

  if ((0, _moment.default)(executeTo).diff(lastExecutionTimestamp, 'hours') >= 24) {
    return (0, _moment.default)(executeTo).subtract(24, 'hours').toISOString();
  }

  return lastExecutionTimestamp;
};
/**
 * Chunks an Array<T> into an Array<Array<T>>
 * This is to prevent overloading the telemetry channel + user resources
 *
 * @param telemetryRecords
 * @param batchSize
 * @returns the batch of records
 */


exports.getPreviousDailyTaskTimestamp = getPreviousDailyTaskTimestamp;

const batchTelemetryRecords = (telemetryRecords, batchSize) => [...Array(Math.ceil(telemetryRecords.length / batchSize))].map(_ => telemetryRecords.splice(0, batchSize));
/**
 * User defined type guard for PackagePolicy
 *
 * @param data the union type of package policies
 * @returns type confirmation
 */


exports.batchTelemetryRecords = batchTelemetryRecords;

function isPackagePolicyList(data) {
  if (data === undefined || data.length < 1) {
    return false;
  }

  return data[0].inputs !== undefined;
}
/**
 * Maps trusted application to shared telemetry object
 *
 * @param exceptionListItem
 * @returns collection of trusted applications
 */


const trustedApplicationToTelemetryEntry = trustedApplication => {
  return {
    id: trustedApplication.id,
    name: trustedApplication.name,
    created_at: trustedApplication.created_at,
    updated_at: trustedApplication.updated_at,
    entries: trustedApplication.entries,
    os_types: [trustedApplication.os],
    scope: trustedApplication.effectScope
  };
};
/**
 * Maps endpoint lists to shared telemetry object
 *
 * @param exceptionListItem
 * @returns collection of endpoint exceptions
 */


exports.trustedApplicationToTelemetryEntry = trustedApplicationToTelemetryEntry;

const exceptionListItemToTelemetryEntry = exceptionListItem => {
  return {
    id: exceptionListItem.id,
    name: exceptionListItem.name,
    created_at: exceptionListItem.created_at,
    updated_at: exceptionListItem.updated_at,
    entries: exceptionListItem.entries,
    os_types: exceptionListItem.os_types
  };
};
/**
 * Maps detection rule exception list items to shared telemetry object
 *
 * @param exceptionListItem
 * @param ruleVersion
 * @returns collection of detection rule exceptions
 */


exports.exceptionListItemToTelemetryEntry = exceptionListItemToTelemetryEntry;

const ruleExceptionListItemToTelemetryEvent = (exceptionListItem, ruleVersion) => {
  return {
    id: exceptionListItem.item_id,
    name: exceptionListItem.description,
    rule_version: ruleVersion,
    created_at: exceptionListItem.created_at,
    updated_at: exceptionListItem.updated_at,
    entries: exceptionListItem.entries,
    os_types: exceptionListItem.os_types
  };
};
/**
 * Consructs the list telemetry schema from a collection of endpoint exceptions
 *
 * @param listData
 * @param listType
 * @returns lists telemetry schema
 */


exports.ruleExceptionListItemToTelemetryEvent = ruleExceptionListItemToTelemetryEvent;

const templateExceptionList = (listData, listType) => {
  return listData.map(item => {
    const template = {
      '@timestamp': (0, _moment.default)().toISOString()
    }; // cast exception list type to a TelemetryEvent for allowlist filtering

    const filteredListItem = (0, _filters.copyAllowlistedFields)(_filters.exceptionListEventFields, item);

    if (listType === _constants.LIST_DETECTION_RULE_EXCEPTION) {
      template.detection_rule = filteredListItem;
      return template;
    }

    if (listType === _constants.LIST_TRUSTED_APPLICATION) {
      template.trusted_application = filteredListItem;
      return template;
    }

    if (listType === _constants.LIST_ENDPOINT_EXCEPTION) {
      template.endpoint_exception = filteredListItem;
      return template;
    }

    if (listType === _constants.LIST_ENDPOINT_EVENT_FILTER) {
      template.endpoint_event_filter = filteredListItem;
      return template;
    }

    return null;
  });
};
/**
 * Convert counter label list to kebab case
 *
 * @param label_list the list of labels to create standardized UsageCounter from
 * @returns a string label for usage in the UsageCounter
 */


exports.templateExceptionList = templateExceptionList;

function createUsageCounterLabel(labelList) {
  return labelList.join('-');
}