"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchRulesSchema = void 0;

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
 * All of the patch elements should default to undefined if not set
 */


const patchRulesSchema = t.exact(t.partial({
  author: _schemas.author,
  building_block_type: _schemas.building_block_type,
  description: _schemas.description,
  risk_score: _securitysolutionIoTsAlertingTypes.risk_score,
  name: _schemas.name,
  severity: _securitysolutionIoTsAlertingTypes.severity,
  type: _securitysolutionIoTsAlertingTypes.type,
  id: _schemas.id,
  actions: _securitysolutionIoTsAlertingTypes.actions,
  anomaly_threshold: _schemas.anomaly_threshold,
  enabled: _schemas.enabled,
  event_category_override: _schemas.event_category_override,
  false_positives: _schemas.false_positives,
  filters: _schemas.filters,
  from: _securitysolutionIoTsAlertingTypes.from,
  rule_id: _schemas.rule_id,
  index: _schemas.index,
  interval: _schemas.interval,
  query: _schemas.query,
  language: _securitysolutionIoTsAlertingTypes.language,
  license: _schemas.license,
  // TODO: output_index: This should be removed eventually
  output_index: _schemas.output_index,
  saved_id: _schemas.saved_id,
  timeline_id: _schemas.timeline_id,
  timeline_title: _schemas.timeline_title,
  meta: _schemas.meta,
  machine_learning_job_id: _securitysolutionIoTsAlertingTypes.machine_learning_job_id,
  max_signals: _securitysolutionIoTsAlertingTypes.max_signals,
  risk_score_mapping: _securitysolutionIoTsAlertingTypes.risk_score_mapping,
  rule_name_override: _schemas.rule_name_override,
  severity_mapping: _securitysolutionIoTsAlertingTypes.severity_mapping,
  tags: _schemas.tags,
  to: _schemas.to,
  threat: _securitysolutionIoTsAlertingTypes.threats,
  threshold: _schemas.threshold,
  throttle: _securitysolutionIoTsAlertingTypes.throttle,
  timestamp_override: _schemas.timestamp_override,
  references: _schemas.references,
  note: _schemas.note,
  version: _securitysolutionIoTsTypes.version,
  exceptions_list: _securitysolutionIoTsListTypes.listArrayOrUndefined,
  threat_index: _securitysolutionIoTsAlertingTypes.threat_index,
  threat_query: _securitysolutionIoTsAlertingTypes.threat_query,
  threat_filters: _securitysolutionIoTsAlertingTypes.threat_filters,
  threat_mapping: _securitysolutionIoTsAlertingTypes.threat_mapping,
  threat_language: _securitysolutionIoTsAlertingTypes.threat_language,
  threat_indicator_path: _securitysolutionIoTsAlertingTypes.threat_indicator_path,
  concurrent_searches: _securitysolutionIoTsAlertingTypes.concurrent_searches,
  items_per_search: _securitysolutionIoTsAlertingTypes.items_per_search
}));
exports.patchRulesSchema = patchRulesSchema;