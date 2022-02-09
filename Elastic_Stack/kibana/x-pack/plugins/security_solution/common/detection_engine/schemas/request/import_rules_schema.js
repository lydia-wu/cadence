"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importRulesSchema = exports.importRulesQuerySchema = exports.importRulesPayloadSchema = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _securitysolutionIoTsAlertingTypes = require("@kbn/securitysolution-io-ts-alerting-types");

var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");

var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");

var _schemas = require("../common/schemas");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Differences from this and the createRulesSchema are
 *   - rule_id is required
 *   - id is optional (but ignored in the import code - rule_id is exclusively used for imports)
 *   - immutable is optional but if it is any value other than false it will be rejected
 *   - created_at is optional (but ignored in the import code)
 *   - updated_at is optional (but ignored in the import code)
 *   - created_by is optional (but ignored in the import code)
 *   - updated_by is optional (but ignored in the import code)
 */


const importRulesSchema = t.intersection([t.exact(t.type({
  description: _schemas.description,
  risk_score: _securitysolutionIoTsAlertingTypes.risk_score,
  name: _schemas.name,
  severity: _securitysolutionIoTsAlertingTypes.severity,
  type: _securitysolutionIoTsAlertingTypes.type,
  rule_id: _schemas.rule_id
})), t.exact(t.partial({
  id: _schemas.id,
  // defaults to undefined if not set during decode
  actions: _securitysolutionIoTsAlertingTypes.DefaultActionsArray,
  // defaults to empty actions array if not set during decode
  anomaly_threshold: _schemas.anomaly_threshold,
  // defaults to undefined if not set during decode
  author: _securitysolutionIoTsTypes.DefaultStringArray,
  // defaults to empty array of strings if not set during decode
  building_block_type: _schemas.building_block_type,
  // defaults to undefined if not set during decode
  enabled: _securitysolutionIoTsTypes.DefaultBooleanTrue,
  // defaults to true if not set during decode
  event_category_override: _schemas.event_category_override,
  // defaults to "undefined" if not set during decode
  false_positives: _securitysolutionIoTsTypes.DefaultStringArray,
  // defaults to empty string array if not set during decode
  filters: _schemas.filters,
  // defaults to undefined if not set during decode
  from: _securitysolutionIoTsAlertingTypes.DefaultFromString,
  // defaults to "now-6m" if not set during decode
  index: _schemas.index,
  // defaults to undefined if not set during decode
  immutable: _securitysolutionIoTsTypes.OnlyFalseAllowed,
  // defaults to "false" if not set during decode
  interval: _securitysolutionIoTsAlertingTypes.DefaultIntervalString,
  // defaults to "5m" if not set during decode
  query: _schemas.query,
  // defaults to undefined if not set during decode
  language: _securitysolutionIoTsAlertingTypes.language,
  // defaults to undefined if not set during decode
  license: _schemas.license,
  // defaults to "undefined" if not set during decode
  // TODO: output_index: This should be removed eventually
  output_index: _schemas.output_index,
  // defaults to "undefined" if not set during decode
  saved_id: _schemas.saved_id,
  // defaults to "undefined" if not set during decode
  timeline_id: _schemas.timeline_id,
  // defaults to "undefined" if not set during decode
  timeline_title: _schemas.timeline_title,
  // defaults to "undefined" if not set during decode
  meta: _schemas.meta,
  // defaults to "undefined" if not set during decode
  machine_learning_job_id: _securitysolutionIoTsAlertingTypes.machine_learning_job_id,
  // defaults to "undefined" if not set during decode
  max_signals: _securitysolutionIoTsAlertingTypes.DefaultMaxSignalsNumber,
  // defaults to DEFAULT_MAX_SIGNALS (100) if not set during decode
  risk_score_mapping: _securitysolutionIoTsAlertingTypes.DefaultRiskScoreMappingArray,
  // defaults to empty risk score mapping array if not set during decode
  rule_name_override: _schemas.rule_name_override,
  // defaults to "undefined" if not set during decode
  severity_mapping: _securitysolutionIoTsAlertingTypes.DefaultSeverityMappingArray,
  // defaults to empty actions array if not set during decode
  tags: _securitysolutionIoTsTypes.DefaultStringArray,
  // defaults to empty string array if not set during decode
  to: _securitysolutionIoTsAlertingTypes.DefaultToString,
  // defaults to "now" if not set during decode
  threat: _securitysolutionIoTsAlertingTypes.DefaultThreatArray,
  // defaults to empty array if not set during decode
  threshold: _schemas.threshold,
  // defaults to "undefined" if not set during decode
  throttle: _securitysolutionIoTsAlertingTypes.DefaultThrottleNull,
  // defaults to "null" if not set during decode
  timestamp_override: _schemas.timestamp_override,
  // defaults to "undefined" if not set during decode
  references: _securitysolutionIoTsTypes.DefaultStringArray,
  // defaults to empty array of strings if not set during decode
  note: _schemas.note,
  // defaults to "undefined" if not set during decode
  version: _securitysolutionIoTsTypes.DefaultVersionNumber,
  // defaults to 1 if not set during decode
  exceptions_list: _securitysolutionIoTsListTypes.DefaultListArray,
  // defaults to empty array if not set during decode
  created_at: _schemas.created_at,
  // defaults "undefined" if not set during decode
  updated_at: _schemas.updated_at,
  // defaults "undefined" if not set during decode
  created_by: _schemas.created_by,
  // defaults "undefined" if not set during decode
  updated_by: _schemas.updated_by,
  // defaults "undefined" if not set during decode
  threat_filters: _securitysolutionIoTsAlertingTypes.threat_filters,
  // defaults to "undefined" if not set during decode
  threat_mapping: _securitysolutionIoTsAlertingTypes.threat_mapping,
  // defaults to "undefined" if not set during decode
  threat_query: _securitysolutionIoTsAlertingTypes.threat_query,
  // defaults to "undefined" if not set during decode
  threat_index: _securitysolutionIoTsAlertingTypes.threat_index,
  // defaults to "undefined" if not set during decode
  threat_language: _securitysolutionIoTsAlertingTypes.threat_language,
  // defaults "undefined" if not set during decode
  threat_indicator_path: _securitysolutionIoTsAlertingTypes.threat_indicator_path,
  // defaults to "undefined" if not set during decode
  concurrent_searches: _securitysolutionIoTsAlertingTypes.concurrent_searches,
  // defaults to "undefined" if not set during decode
  items_per_search: _securitysolutionIoTsAlertingTypes.items_per_search // defaults to "undefined" if not set during decode

}))]);
exports.importRulesSchema = importRulesSchema;
const importRulesQuerySchema = t.exact(t.partial({
  overwrite: _securitysolutionIoTsTypes.DefaultStringBooleanFalse
}));
exports.importRulesQuerySchema = importRulesQuerySchema;
const importRulesPayloadSchema = t.exact(t.type({
  file: t.object
}));
exports.importRulesPayloadSchema = importRulesPayloadSchema;