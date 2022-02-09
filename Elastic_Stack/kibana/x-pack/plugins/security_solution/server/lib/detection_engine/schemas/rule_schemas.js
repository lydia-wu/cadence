"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeSpecificRuleParams = exports.thresholdRuleParams = exports.threatRuleParams = exports.savedQueryRuleParams = exports.ruleParams = exports.queryRuleParams = exports.notifyWhen = exports.machineLearningRuleParams = exports.internalRuleUpdate = exports.internalRuleResponse = exports.internalRuleCreate = exports.eqlRuleParams = exports.baseRuleParams = exports.allRuleTypes = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _securitysolutionIoTsAlertingTypes = require("@kbn/securitysolution-io-ts-alerting-types");

var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");

var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");

var _schemas = require("../../../../common/detection_engine/schemas/common/schemas");

var _constants = require("../../../../common/constants");

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


const nonEqlLanguages = t.keyof({
  kuery: null,
  lucene: null
});
const baseRuleParams = t.exact(t.type({
  author: _schemas.author,
  buildingBlockType: _schemas.buildingBlockTypeOrUndefined,
  description: _schemas.description,
  namespace: _schemas.namespaceOrUndefined,
  note: _schemas.noteOrUndefined,
  falsePositives: _schemas.false_positives,
  from: _securitysolutionIoTsAlertingTypes.from,
  ruleId: _schemas.rule_id,
  immutable: _schemas.immutable,
  license: _schemas.licenseOrUndefined,
  outputIndex: _schemas.output_index,
  timelineId: _schemas.timelineIdOrUndefined,
  timelineTitle: _schemas.timelineTitleOrUndefined,
  meta: _schemas.metaOrUndefined,
  // maxSignals not used in ML rules but probably should be used
  maxSignals: _securitysolutionIoTsAlertingTypes.max_signals,
  riskScore: _securitysolutionIoTsAlertingTypes.risk_score,
  riskScoreMapping: _securitysolutionIoTsAlertingTypes.risk_score_mapping,
  ruleNameOverride: _schemas.ruleNameOverrideOrUndefined,
  severity: _securitysolutionIoTsAlertingTypes.severity,
  severityMapping: _securitysolutionIoTsAlertingTypes.severity_mapping,
  timestampOverride: _schemas.timestampOverrideOrUndefined,
  threat: _securitysolutionIoTsAlertingTypes.threats,
  to: _schemas.to,
  references: _schemas.references,
  version: _securitysolutionIoTsTypes.version,
  exceptionsList: _securitysolutionIoTsListTypes.listArray
}));
exports.baseRuleParams = baseRuleParams;
const eqlSpecificRuleParams = t.type({
  type: t.literal('eql'),
  language: t.literal('eql'),
  index: _schemas.indexOrUndefined,
  query: _schemas.query,
  filters: _schemas.filtersOrUndefined,
  eventCategoryOverride: _schemas.eventCategoryOverrideOrUndefined
});
const eqlRuleParams = t.intersection([baseRuleParams, eqlSpecificRuleParams]);
exports.eqlRuleParams = eqlRuleParams;
const threatSpecificRuleParams = t.type({
  type: t.literal('threat_match'),
  language: nonEqlLanguages,
  index: _schemas.indexOrUndefined,
  query: _schemas.query,
  filters: _schemas.filtersOrUndefined,
  savedId: _schemas.savedIdOrUndefined,
  threatFilters: _schemas.filtersOrUndefined,
  threatQuery: _securitysolutionIoTsAlertingTypes.threat_query,
  threatMapping: _securitysolutionIoTsAlertingTypes.threat_mapping,
  threatLanguage: t.union([nonEqlLanguages, t.undefined]),
  threatIndex: _securitysolutionIoTsAlertingTypes.threat_index,
  threatIndicatorPath: _securitysolutionIoTsAlertingTypes.threatIndicatorPathOrUndefined,
  concurrentSearches: _securitysolutionIoTsAlertingTypes.concurrentSearchesOrUndefined,
  itemsPerSearch: _securitysolutionIoTsAlertingTypes.itemsPerSearchOrUndefined
});
const threatRuleParams = t.intersection([baseRuleParams, threatSpecificRuleParams]);
exports.threatRuleParams = threatRuleParams;
const querySpecificRuleParams = t.exact(t.type({
  type: t.literal('query'),
  language: nonEqlLanguages,
  index: _schemas.indexOrUndefined,
  query: _schemas.query,
  filters: _schemas.filtersOrUndefined,
  savedId: _schemas.savedIdOrUndefined
}));
const queryRuleParams = t.intersection([baseRuleParams, querySpecificRuleParams]);
exports.queryRuleParams = queryRuleParams;
const savedQuerySpecificRuleParams = t.type({
  type: t.literal('saved_query'),
  // Having language, query, and filters possibly defined adds more code confusion and probably user confusion
  // if the saved object gets deleted for some reason
  language: nonEqlLanguages,
  index: _schemas.indexOrUndefined,
  query: _schemas.queryOrUndefined,
  filters: _schemas.filtersOrUndefined,
  savedId: _schemas.saved_id
});
const savedQueryRuleParams = t.intersection([baseRuleParams, savedQuerySpecificRuleParams]);
exports.savedQueryRuleParams = savedQueryRuleParams;
const thresholdSpecificRuleParams = t.type({
  type: t.literal('threshold'),
  language: nonEqlLanguages,
  index: _schemas.indexOrUndefined,
  query: _schemas.query,
  filters: _schemas.filtersOrUndefined,
  savedId: _schemas.savedIdOrUndefined,
  threshold: _schemas.thresholdNormalized
});
const thresholdRuleParams = t.intersection([baseRuleParams, thresholdSpecificRuleParams]);
exports.thresholdRuleParams = thresholdRuleParams;
const machineLearningSpecificRuleParams = t.type({
  type: t.literal('machine_learning'),
  anomalyThreshold: _schemas.anomaly_threshold,
  machineLearningJobId: _securitysolutionIoTsAlertingTypes.machine_learning_job_id_normalized
});
const machineLearningRuleParams = t.intersection([baseRuleParams, machineLearningSpecificRuleParams]);
exports.machineLearningRuleParams = machineLearningRuleParams;
const typeSpecificRuleParams = t.union([eqlSpecificRuleParams, threatSpecificRuleParams, querySpecificRuleParams, savedQuerySpecificRuleParams, thresholdSpecificRuleParams, machineLearningSpecificRuleParams]);
exports.typeSpecificRuleParams = typeSpecificRuleParams;
const ruleParams = t.intersection([baseRuleParams, typeSpecificRuleParams]);
exports.ruleParams = ruleParams;
const notifyWhen = t.union([t.literal('onActionGroupChange'), t.literal('onActiveAlert'), t.literal('onThrottleInterval'), t.null]);
exports.notifyWhen = notifyWhen;
const allRuleTypes = t.union([t.literal(_constants.SIGNALS_ID), t.literal(_constants.EQL_RULE_TYPE_ID), t.literal(_constants.ML_RULE_TYPE_ID), t.literal(_constants.QUERY_RULE_TYPE_ID), t.literal(_constants.INDICATOR_RULE_TYPE_ID), t.literal(_constants.THRESHOLD_RULE_TYPE_ID)]);
exports.allRuleTypes = allRuleTypes;
const internalRuleCreate = t.type({
  name: _schemas.name,
  tags: _schemas.tags,
  alertTypeId: allRuleTypes,
  consumer: t.literal(_constants.SERVER_APP_ID),
  schedule: t.type({
    interval: t.string
  }),
  enabled: _schemas.enabled,
  actions: _securitysolutionIoTsAlertingTypes.actionsCamel,
  params: ruleParams,
  throttle: _securitysolutionIoTsAlertingTypes.throttleOrNull,
  notifyWhen
});
exports.internalRuleCreate = internalRuleCreate;
const internalRuleUpdate = t.type({
  name: _schemas.name,
  tags: _schemas.tags,
  schedule: t.type({
    interval: t.string
  }),
  actions: _securitysolutionIoTsAlertingTypes.actionsCamel,
  params: ruleParams,
  throttle: _securitysolutionIoTsAlertingTypes.throttleOrNull,
  notifyWhen
});
exports.internalRuleUpdate = internalRuleUpdate;
const internalRuleResponse = t.intersection([internalRuleCreate, t.type({
  id: t.string,
  createdBy: _schemas.createdByOrNull,
  updatedBy: _schemas.updatedByOrNull,
  createdAt: _schemas.created_at,
  updatedAt: _schemas.updated_at
})]);
exports.internalRuleResponse = internalRuleResponse;