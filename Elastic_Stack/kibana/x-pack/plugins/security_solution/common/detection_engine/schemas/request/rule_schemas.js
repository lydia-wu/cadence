"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRulesSchema = exports.thresholdCreateParams = exports.threatMatchCreateParams = exports.sharedUpdateSchema = exports.sharedCreateSchema = exports.savedQueryCreateParams = exports.queryCreateParams = exports.machineLearningCreateParams = exports.fullResponseSchema = exports.fullPatchSchema = exports.eqlCreateParams = exports.createSchema = exports.createRulesSchema = exports.buildAPISchemas = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _securitysolutionIoTsAlertingTypes = require("@kbn/securitysolution-io-ts-alerting-types");

var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");

var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");

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


const createSchema = (requiredFields, optionalFields, defaultableFields) => {
  return t.intersection([t.exact(t.type(requiredFields)), t.exact(t.partial(optionalFields)), t.exact(t.partial(defaultableFields))]);
};

exports.createSchema = createSchema;

const patchSchema = (requiredFields, optionalFields, defaultableFields) => {
  return t.intersection([t.exact(t.partial(requiredFields)), t.exact(t.partial(optionalFields)), t.exact(t.partial(defaultableFields))]);
};

const responseSchema = (requiredFields, optionalFields, defaultableFields) => {
  return t.intersection([t.exact(t.type(requiredFields)), t.exact(t.partial(optionalFields)), t.exact(t.type(defaultableFields))]);
};

const buildAPISchemas = params => {
  return {
    create: createSchema(params.required, params.optional, params.defaultable),
    patch: patchSchema(params.required, params.optional, params.defaultable),
    response: responseSchema(params.required, params.optional, params.defaultable)
  };
};

exports.buildAPISchemas = buildAPISchemas;
const baseParams = {
  required: {
    name: _schemas.name,
    description: _schemas.description,
    risk_score: _securitysolutionIoTsAlertingTypes.risk_score,
    severity: _securitysolutionIoTsAlertingTypes.severity
  },
  optional: {
    building_block_type: _schemas.building_block_type,
    note: _schemas.note,
    license: _schemas.license,
    outcome: _schemas.outcome,
    alias_target_id: _schemas.alias_target_id,
    output_index: _schemas.output_index,
    timeline_id: _schemas.timeline_id,
    timeline_title: _schemas.timeline_title,
    meta: _schemas.meta,
    rule_name_override: _schemas.rule_name_override,
    timestamp_override: _schemas.timestamp_override,
    namespace: _schemas.namespace
  },
  defaultable: {
    tags: _schemas.tags,
    interval: _schemas.interval,
    enabled: _schemas.enabled,
    throttle: _securitysolutionIoTsAlertingTypes.throttle,
    actions: _securitysolutionIoTsAlertingTypes.actions,
    author: _schemas.author,
    false_positives: _schemas.false_positives,
    from: _securitysolutionIoTsAlertingTypes.from,
    // maxSignals not used in ML rules but probably should be used
    max_signals: _securitysolutionIoTsAlertingTypes.max_signals,
    risk_score_mapping: _securitysolutionIoTsAlertingTypes.risk_score_mapping,
    severity_mapping: _securitysolutionIoTsAlertingTypes.severity_mapping,
    threat: _securitysolutionIoTsAlertingTypes.threats,
    to: _schemas.to,
    references: _schemas.references,
    version: _securitysolutionIoTsTypes.version,
    exceptions_list: _securitysolutionIoTsListTypes.listArray
  }
};
const {
  create: baseCreateParams,
  patch: basePatchParams,
  response: baseResponseParams
} = buildAPISchemas(baseParams); // "shared" types are the same across all rule types, and built from "baseParams" above
// with some variations for each route. These intersect with type specific schemas below
// to create the full schema for each route.

const sharedCreateSchema = t.intersection([baseCreateParams, t.exact(t.partial({
  rule_id: _schemas.rule_id
}))]);
exports.sharedCreateSchema = sharedCreateSchema;
const sharedUpdateSchema = t.intersection([baseCreateParams, t.exact(t.partial({
  rule_id: _schemas.rule_id
})), t.exact(t.partial({
  id: _schemas.id
}))]);
exports.sharedUpdateSchema = sharedUpdateSchema;
const eqlRuleParams = {
  required: {
    type: t.literal('eql'),
    language: t.literal('eql'),
    query: _schemas.query
  },
  optional: {
    index: _schemas.index,
    filters: _schemas.filters,
    event_category_override: _schemas.event_category_override
  },
  defaultable: {}
};
const {
  create: eqlCreateParams,
  patch: eqlPatchParams,
  response: eqlResponseParams
} = buildAPISchemas(eqlRuleParams);
exports.eqlCreateParams = eqlCreateParams;
const threatMatchRuleParams = {
  required: {
    type: t.literal('threat_match'),
    query: _schemas.query,
    threat_query: _securitysolutionIoTsAlertingTypes.threat_query,
    threat_mapping: _securitysolutionIoTsAlertingTypes.threat_mapping,
    threat_index: _securitysolutionIoTsAlertingTypes.threat_index
  },
  optional: {
    index: _schemas.index,
    filters: _schemas.filters,
    saved_id: _schemas.saved_id,
    threat_filters: _securitysolutionIoTsAlertingTypes.threat_filters,
    threat_indicator_path: _securitysolutionIoTsAlertingTypes.threat_indicator_path,
    threat_language: t.keyof({
      kuery: null,
      lucene: null
    }),
    concurrent_searches: _securitysolutionIoTsAlertingTypes.concurrent_searches,
    items_per_search: _securitysolutionIoTsAlertingTypes.items_per_search
  },
  defaultable: {
    language: t.keyof({
      kuery: null,
      lucene: null
    })
  }
};
const {
  create: threatMatchCreateParams,
  patch: threatMatchPatchParams,
  response: threatMatchResponseParams
} = buildAPISchemas(threatMatchRuleParams);
exports.threatMatchCreateParams = threatMatchCreateParams;
const queryRuleParams = {
  required: {
    type: t.literal('query')
  },
  optional: {
    index: _schemas.index,
    filters: _schemas.filters,
    saved_id: _schemas.saved_id
  },
  defaultable: {
    query: _schemas.query,
    language: t.keyof({
      kuery: null,
      lucene: null
    })
  }
};
const {
  create: queryCreateParams,
  patch: queryPatchParams,
  response: queryResponseParams
} = buildAPISchemas(queryRuleParams);
exports.queryCreateParams = queryCreateParams;
const savedQueryRuleParams = {
  required: {
    type: t.literal('saved_query'),
    saved_id: _schemas.saved_id
  },
  optional: {
    // Having language, query, and filters possibly defined adds more code confusion and probably user confusion
    // if the saved object gets deleted for some reason
    index: _schemas.index,
    query: _schemas.query,
    filters: _schemas.filters
  },
  defaultable: {
    language: t.keyof({
      kuery: null,
      lucene: null
    })
  }
};
const {
  create: savedQueryCreateParams,
  patch: savedQueryPatchParams,
  response: savedQueryResponseParams
} = buildAPISchemas(savedQueryRuleParams);
exports.savedQueryCreateParams = savedQueryCreateParams;
const thresholdRuleParams = {
  required: {
    type: t.literal('threshold'),
    query: _schemas.query,
    threshold: _schemas.threshold
  },
  optional: {
    index: _schemas.index,
    filters: _schemas.filters,
    saved_id: _schemas.saved_id
  },
  defaultable: {
    language: t.keyof({
      kuery: null,
      lucene: null
    })
  }
};
const {
  create: thresholdCreateParams,
  patch: thresholdPatchParams,
  response: thresholdResponseParams
} = buildAPISchemas(thresholdRuleParams);
exports.thresholdCreateParams = thresholdCreateParams;
const machineLearningRuleParams = {
  required: {
    type: t.literal('machine_learning'),
    anomaly_threshold: _schemas.anomaly_threshold,
    machine_learning_job_id: _securitysolutionIoTsAlertingTypes.machine_learning_job_id
  },
  optional: {},
  defaultable: {}
};
const {
  create: machineLearningCreateParams,
  patch: machineLearningPatchParams,
  response: machineLearningResponseParams
} = buildAPISchemas(machineLearningRuleParams);
exports.machineLearningCreateParams = machineLearningCreateParams;
const createTypeSpecific = t.union([eqlCreateParams, threatMatchCreateParams, queryCreateParams, savedQueryCreateParams, thresholdCreateParams, machineLearningCreateParams]);
const createRulesSchema = t.intersection([sharedCreateSchema, createTypeSpecific]);
exports.createRulesSchema = createRulesSchema;
const patchTypeSpecific = t.union([eqlPatchParams, threatMatchPatchParams, queryPatchParams, savedQueryPatchParams, thresholdPatchParams, machineLearningPatchParams]);
const responseTypeSpecific = t.union([eqlResponseParams, threatMatchResponseParams, queryResponseParams, savedQueryResponseParams, thresholdResponseParams, machineLearningResponseParams]);
const updateRulesSchema = t.intersection([createTypeSpecific, sharedUpdateSchema]);
exports.updateRulesSchema = updateRulesSchema;
const fullPatchSchema = t.intersection([basePatchParams, patchTypeSpecific, t.exact(t.partial({
  id: _schemas.id
}))]);
exports.fullPatchSchema = fullPatchSchema;
const responseRequiredFields = {
  id: _schemas.id,
  rule_id: _schemas.rule_id,
  immutable: _schemas.immutable,
  updated_at: _schemas.updated_at,
  updated_by: _schemas.updated_by,
  created_at: _schemas.created_at,
  created_by: _schemas.created_by
};
const responseOptionalFields = {
  status: _schemas.ruleExecutionStatus,
  status_date: _schemas.status_date,
  last_success_at: _schemas.last_success_at,
  last_success_message: _schemas.last_success_message,
  last_failure_at: _schemas.last_failure_at,
  last_failure_message: _schemas.last_failure_message
};
const fullResponseSchema = t.intersection([baseResponseParams, responseTypeSpecific, t.exact(t.type(responseRequiredFields)), t.exact(t.partial(responseOptionalFields))]);
exports.fullResponseSchema = fullResponseSchema;