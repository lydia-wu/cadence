"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.thresholdOrUndefined = exports.thresholdNormalizedOrUndefined = exports.thresholdNormalized = exports.thresholdFieldNormalized = exports.thresholdField = exports.thresholdCardinalityField = exports.threshold = exports.tagsOrUndefined = exports.tags = exports.success_count = exports.success = exports.status_date = exports.status_code = exports.status = exports.sort_order = exports.sort_field = exports.sortOrderOrUndefined = exports.sortFieldOrUndefined = exports.signal_status_query = exports.signal_ids = exports.saved_id = exports.savedIdOrUndefined = exports.rules_updated = exports.rules_not_updated = exports.rules_not_installed = exports.rules_installed = exports.rules_custom_installed = exports.rule_name_override = exports.rule_id = exports.ruleNameOverrideOrUndefined = exports.ruleIdOrUndefined = exports.ruleExecutionStatus = exports.referencesOrUndefined = exports.references = exports.queryOrUndefined = exports.queryFilterOrUndefined = exports.queryFilter = exports.query = exports.privilege = exports.per_page = exports.perPageOrUndefined = exports.perPage = exports.pageOrUndefined = exports.page = exports.output_index = exports.outputIndexOrUndefined = exports.outcome = exports.objects = exports.noteOrUndefined = exports.note = exports.namespaceOrUndefined = exports.namespace = exports.nameOrUndefined = exports.name = exports.metaOrUndefined = exports.meta = exports.message = exports.licenseOrUndefined = exports.license = exports.last_success_message = exports.last_success_at = exports.last_failure_message = exports.last_failure_at = exports.intervalOrUndefined = exports.interval = exports.indexType = exports.indexRecord = exports.indexOrUndefined = exports.index = exports.immutable = exports.idOrUndefined = exports.id = exports.filtersOrUndefined = exports.filters = exports.file_name = exports.fieldsOrUndefined = exports.fields = exports.false_positives = exports.falsePositivesOrUndefined = exports.exclude_export_details = exports.event_category_override = exports.eventCategoryOverrideOrUndefined = exports.enabledOrUndefined = exports.enabled = exports.descriptionOrUndefined = exports.description = exports.created_by = exports.created_at = exports.createdByOrNull = exports.conflicts = exports.bulkAction = exports.building_block_type = exports.buildingBlockTypeOrUndefined = exports.authorOrUndefined = exports.author = exports.anomaly_threshold = exports.anomalyThresholdOrUndefined = exports.alias_target_id = exports.RuleExecutionStatus = exports.BulkAction = void 0;
exports.updated_by = exports.updated_at = exports.updatedByOrNull = exports.total = exports.toOrUndefined = exports.to = exports.timestamp_override = exports.timestampOverrideOrUndefined = exports.timelines_updated = exports.timelines_not_updated = exports.timelines_not_installed = exports.timelines_installed = exports.timeline_title = exports.timeline_id = exports.timelineTitleOrUndefined = exports.timelineIdOrUndefined = exports.thresholdOrUndefined = exports.thresholdNormalizedOrUndefined = exports.thresholdNormalized = exports.thresholdFieldNormalized = exports.thresholdField = exports.thresholdCardinalityField = exports.threshold = exports.tagsOrUndefined = exports.tags = exports.success_count = exports.success = exports.status_date = exports.status_code = exports.status = exports.sort_order = exports.sort_field = exports.sortOrderOrUndefined = exports.sortFieldOrUndefined = exports.signal_status_query = exports.signal_ids = exports.saved_id = exports.savedIdOrUndefined = exports.rules_updated = exports.rules_not_updated = exports.rules_not_installed = exports.rules_installed = exports.rules_custom_installed = exports.rule_name_override = exports.rule_id = exports.ruleNameOverrideOrUndefined = exports.ruleIdOrUndefined = exports.ruleExecutionStatus = exports.referencesOrUndefined = exports.references = exports.queryOrUndefined = exports.queryFilterOrUndefined = exports.queryFilter = exports.query = exports.privilege = exports.per_page = exports.perPageOrUndefined = exports.perPage = exports.pageOrUndefined = exports.page = exports.output_index = exports.outputIndexOrUndefined = exports.outcome = exports.objects = exports.noteOrUndefined = exports.note = exports.namespaceOrUndefined = exports.namespace = exports.nameOrUndefined = exports.name = exports.metaOrUndefined = exports.meta = exports.message = exports.licenseOrUndefined = exports.license = exports.last_success_message = exports.last_success_at = exports.last_failure_message = exports.last_failure_at = exports.intervalOrUndefined = exports.interval = exports.indexType = exports.indexRecord = exports.indexOrUndefined = exports.index = exports.immutable = exports.idOrUndefined = exports.id = exports.filtersOrUndefined = exports.filters = exports.file_name = exports.fieldsOrUndefined = exports.fields = exports.false_positives = exports.falsePositivesOrUndefined = exports.exclude_export_details = exports.event_category_override = exports.eventCategoryOverrideOrUndefined = exports.enabledOrUndefined = exports.enabled = exports.descriptionOrUndefined = exports.description = exports.created_by = exports.created_at = exports.createdByOrNull = exports.conflicts = exports.bulkAction = exports.building_block_type = exports.buildingBlockTypeOrUndefined = exports.authorOrUndefined = exports.author = exports.anomaly_threshold = exports.anomalyThresholdOrUndefined = exports.alias_target_id = exports.RuleExecutionStatus = exports.BulkAction = void 0;

var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");

var t = _interopRequireWildcard(require("io-ts"));

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

/* eslint-disable @typescript-eslint/naming-convention */


const author = t.array(t.string);
exports.author = author;
const authorOrUndefined = t.union([author, t.undefined]);
exports.authorOrUndefined = authorOrUndefined;
const building_block_type = t.string;
exports.building_block_type = building_block_type;
const buildingBlockTypeOrUndefined = t.union([building_block_type, t.undefined]);
exports.buildingBlockTypeOrUndefined = buildingBlockTypeOrUndefined;
const description = _securitysolutionIoTsTypes.NonEmptyString;
exports.description = description;
const descriptionOrUndefined = t.union([description, t.undefined]);
exports.descriptionOrUndefined = descriptionOrUndefined; // outcome is a property of the saved object resolve api
// will tell us info about the rule after 8.0 migrations

const outcome = t.union([t.literal('exactMatch'), t.literal('aliasMatch'), t.literal('conflict')]);
exports.outcome = outcome;
const alias_target_id = t.string;
exports.alias_target_id = alias_target_id;
const enabled = t.boolean;
exports.enabled = enabled;
const enabledOrUndefined = t.union([enabled, t.undefined]);
exports.enabledOrUndefined = enabledOrUndefined;
const event_category_override = t.string;
exports.event_category_override = event_category_override;
const eventCategoryOverrideOrUndefined = t.union([event_category_override, t.undefined]);
exports.eventCategoryOverrideOrUndefined = eventCategoryOverrideOrUndefined;
const false_positives = t.array(t.string);
exports.false_positives = false_positives;
const falsePositivesOrUndefined = t.union([false_positives, t.undefined]);
exports.falsePositivesOrUndefined = falsePositivesOrUndefined;
const file_name = t.string;
exports.file_name = file_name;
const exclude_export_details = t.boolean;
exports.exclude_export_details = exclude_export_details;
const namespace = t.string;
exports.namespace = namespace;
/**
 * TODO: Right now the filters is an "unknown", when it could more than likely
 * become the actual ESFilter as a type.
 */

const filters = t.array(t.unknown); // Filters are not easily type-able yet

exports.filters = filters; // Filters are not easily type-able yet

const filtersOrUndefined = t.union([filters, t.undefined]);
exports.filtersOrUndefined = filtersOrUndefined;
const immutable = t.boolean;
exports.immutable = immutable; // Note: Never make this a strict uuid, we allow the rule_id to be any string at the moment
// in case we encounter 3rd party rule systems which might be using auto incrementing numbers
// or other different things.

const rule_id = t.string;
exports.rule_id = rule_id;
const ruleIdOrUndefined = t.union([rule_id, t.undefined]);
exports.ruleIdOrUndefined = ruleIdOrUndefined;
const id = _securitysolutionIoTsTypes.UUID;
exports.id = id;
const idOrUndefined = t.union([id, t.undefined]);
exports.idOrUndefined = idOrUndefined;
const index = t.array(t.string);
exports.index = index;
const indexOrUndefined = t.union([index, t.undefined]);
exports.indexOrUndefined = indexOrUndefined;
const interval = t.string;
exports.interval = interval;
const intervalOrUndefined = t.union([interval, t.undefined]);
exports.intervalOrUndefined = intervalOrUndefined;
const query = t.string;
exports.query = query;
const queryOrUndefined = t.union([query, t.undefined]);
exports.queryOrUndefined = queryOrUndefined;
const license = t.string;
exports.license = license;
const licenseOrUndefined = t.union([license, t.undefined]);
exports.licenseOrUndefined = licenseOrUndefined;
const objects = t.array(t.type({
  rule_id
}));
exports.objects = objects;
const output_index = t.string;
exports.output_index = output_index;
const outputIndexOrUndefined = t.union([output_index, t.undefined]);
exports.outputIndexOrUndefined = outputIndexOrUndefined;
const saved_id = t.string;
exports.saved_id = saved_id;
const savedIdOrUndefined = t.union([saved_id, t.undefined]);
exports.savedIdOrUndefined = savedIdOrUndefined;
const timeline_id = t.string;
exports.timeline_id = timeline_id;
const timelineIdOrUndefined = t.union([timeline_id, t.undefined]);
exports.timelineIdOrUndefined = timelineIdOrUndefined;
const timeline_title = t.string;
exports.timeline_title = timeline_title;
const timelineTitleOrUndefined = t.union([timeline_title, t.undefined]);
exports.timelineTitleOrUndefined = timelineTitleOrUndefined;
const timestamp_override = t.string;
exports.timestamp_override = timestamp_override;
const timestampOverrideOrUndefined = t.union([timestamp_override, t.undefined]);
exports.timestampOverrideOrUndefined = timestampOverrideOrUndefined;
const anomaly_threshold = _securitysolutionIoTsTypes.PositiveInteger;
exports.anomaly_threshold = anomaly_threshold;
const anomalyThresholdOrUndefined = t.union([anomaly_threshold, t.undefined]);
exports.anomalyThresholdOrUndefined = anomalyThresholdOrUndefined;
/**
 * Note that this is a non-exact io-ts type as we allow extra meta information
 * to be added to the meta object
 */

const meta = t.object;
exports.meta = meta;
const metaOrUndefined = t.union([meta, t.undefined]);
exports.metaOrUndefined = metaOrUndefined;
const name = _securitysolutionIoTsTypes.NonEmptyString;
exports.name = name;
const nameOrUndefined = t.union([name, t.undefined]);
exports.nameOrUndefined = nameOrUndefined;
const rule_name_override = t.string;
exports.rule_name_override = rule_name_override;
const ruleNameOverrideOrUndefined = t.union([rule_name_override, t.undefined]);
exports.ruleNameOverrideOrUndefined = ruleNameOverrideOrUndefined;
const status = t.keyof({
  open: null,
  closed: null,
  acknowledged: null,
  'in-progress': null // TODO: Remove after `acknowledged` migrations

});
exports.status = status;
let RuleExecutionStatus;
exports.RuleExecutionStatus = RuleExecutionStatus;

(function (RuleExecutionStatus) {
  RuleExecutionStatus["succeeded"] = "succeeded";
  RuleExecutionStatus["failed"] = "failed";
  RuleExecutionStatus["going to run"] = "going to run";
  RuleExecutionStatus["partial failure"] = "partial failure";
  RuleExecutionStatus["warning"] = "warning";
})(RuleExecutionStatus || (exports.RuleExecutionStatus = RuleExecutionStatus = {}));

const ruleExecutionStatus = (0, _securitysolutionIoTsTypes.enumeration)('RuleExecutionStatus', RuleExecutionStatus);
exports.ruleExecutionStatus = ruleExecutionStatus;
const conflicts = t.keyof({
  abort: null,
  proceed: null
});
exports.conflicts = conflicts; // TODO: Create a regular expression type or custom date math part type here

const to = t.string;
exports.to = to;
const toOrUndefined = t.union([to, t.undefined]);
exports.toOrUndefined = toOrUndefined;
const queryFilter = t.string;
exports.queryFilter = queryFilter;
const queryFilterOrUndefined = t.union([queryFilter, t.undefined]);
exports.queryFilterOrUndefined = queryFilterOrUndefined;
const references = t.array(t.string);
exports.references = references;
const referencesOrUndefined = t.union([references, t.undefined]);
exports.referencesOrUndefined = referencesOrUndefined;
const per_page = _securitysolutionIoTsTypes.PositiveInteger;
exports.per_page = per_page;
const perPageOrUndefined = t.union([per_page, t.undefined]);
exports.perPageOrUndefined = perPageOrUndefined;
const page = _securitysolutionIoTsTypes.PositiveIntegerGreaterThanZero;
exports.page = page;
const pageOrUndefined = t.union([page, t.undefined]);
exports.pageOrUndefined = pageOrUndefined;
const signal_ids = t.array(t.string);
exports.signal_ids = signal_ids; // TODO: Can this be more strict or is this is the set of all Elastic Queries?

const signal_status_query = t.object;
exports.signal_status_query = signal_status_query;
const sort_field = t.string;
exports.sort_field = sort_field;
const sortFieldOrUndefined = t.union([sort_field, t.undefined]);
exports.sortFieldOrUndefined = sortFieldOrUndefined;
const sort_order = t.keyof({
  asc: null,
  desc: null
});
exports.sort_order = sort_order;
const sortOrderOrUndefined = t.union([sort_order, t.undefined]);
exports.sortOrderOrUndefined = sortOrderOrUndefined;
const tags = t.array(t.string);
exports.tags = tags;
const tagsOrUndefined = t.union([tags, t.undefined]);
exports.tagsOrUndefined = tagsOrUndefined;
const fields = t.array(t.string);
exports.fields = fields;
const fieldsOrUndefined = t.union([fields, t.undefined]);
exports.fieldsOrUndefined = fieldsOrUndefined;
const thresholdField = t.exact(t.type({
  field: t.union([t.string, t.array(t.string)]),
  // Covers pre- and post-7.12
  value: _securitysolutionIoTsTypes.PositiveIntegerGreaterThanZero
}));
exports.thresholdField = thresholdField;
const thresholdFieldNormalized = t.exact(t.type({
  field: t.array(t.string),
  value: _securitysolutionIoTsTypes.PositiveIntegerGreaterThanZero
}));
exports.thresholdFieldNormalized = thresholdFieldNormalized;
const thresholdCardinalityField = t.exact(t.type({
  field: t.string,
  value: _securitysolutionIoTsTypes.PositiveInteger
}));
exports.thresholdCardinalityField = thresholdCardinalityField;
const threshold = t.intersection([thresholdField, t.exact(t.partial({
  cardinality: t.array(thresholdCardinalityField)
}))]);
exports.threshold = threshold;
const thresholdOrUndefined = t.union([threshold, t.undefined]);
exports.thresholdOrUndefined = thresholdOrUndefined;
const thresholdNormalized = t.intersection([thresholdFieldNormalized, t.exact(t.partial({
  cardinality: t.array(thresholdCardinalityField)
}))]);
exports.thresholdNormalized = thresholdNormalized;
const thresholdNormalizedOrUndefined = t.union([thresholdNormalized, t.undefined]);
exports.thresholdNormalizedOrUndefined = thresholdNormalizedOrUndefined;
const created_at = _securitysolutionIoTsTypes.IsoDateString;
exports.created_at = created_at;
const updated_at = _securitysolutionIoTsTypes.IsoDateString;
exports.updated_at = updated_at;
const updated_by = t.string;
exports.updated_by = updated_by;
const created_by = t.string;
exports.created_by = created_by;
const updatedByOrNull = t.union([updated_by, t.null]);
exports.updatedByOrNull = updatedByOrNull;
const createdByOrNull = t.union([created_by, t.null]);
exports.createdByOrNull = createdByOrNull;
const last_success_at = _securitysolutionIoTsTypes.IsoDateString;
exports.last_success_at = last_success_at;
const last_success_message = t.string;
exports.last_success_message = last_success_message;
const last_failure_at = _securitysolutionIoTsTypes.IsoDateString;
exports.last_failure_at = last_failure_at;
const last_failure_message = t.string;
exports.last_failure_message = last_failure_message;
const status_date = _securitysolutionIoTsTypes.IsoDateString;
exports.status_date = status_date;
const rules_installed = _securitysolutionIoTsTypes.PositiveInteger;
exports.rules_installed = rules_installed;
const rules_updated = _securitysolutionIoTsTypes.PositiveInteger;
exports.rules_updated = rules_updated;
const status_code = _securitysolutionIoTsTypes.PositiveInteger;
exports.status_code = status_code;
const message = t.string;
exports.message = message;
const perPage = _securitysolutionIoTsTypes.PositiveInteger;
exports.perPage = perPage;
const total = _securitysolutionIoTsTypes.PositiveInteger;
exports.total = total;
const success = t.boolean;
exports.success = success;
const success_count = _securitysolutionIoTsTypes.PositiveInteger;
exports.success_count = success_count;
const rules_custom_installed = _securitysolutionIoTsTypes.PositiveInteger;
exports.rules_custom_installed = rules_custom_installed;
const rules_not_installed = _securitysolutionIoTsTypes.PositiveInteger;
exports.rules_not_installed = rules_not_installed;
const rules_not_updated = _securitysolutionIoTsTypes.PositiveInteger;
exports.rules_not_updated = rules_not_updated;
const timelines_installed = _securitysolutionIoTsTypes.PositiveInteger;
exports.timelines_installed = timelines_installed;
const timelines_updated = _securitysolutionIoTsTypes.PositiveInteger;
exports.timelines_updated = timelines_updated;
const timelines_not_installed = _securitysolutionIoTsTypes.PositiveInteger;
exports.timelines_not_installed = timelines_not_installed;
const timelines_not_updated = _securitysolutionIoTsTypes.PositiveInteger;
exports.timelines_not_updated = timelines_not_updated;
const note = t.string;
exports.note = note;
const namespaceOrUndefined = t.union([namespace, t.undefined]);
exports.namespaceOrUndefined = namespaceOrUndefined;
const noteOrUndefined = t.union([note, t.undefined]);
exports.noteOrUndefined = noteOrUndefined;
const indexRecord = t.record(t.string, t.type({
  all: t.boolean,
  maintenance: t.boolean,
  manage_ilm: t.boolean,
  read: t.boolean,
  create_index: t.boolean,
  read_cross_cluster: t.boolean,
  index: t.boolean,
  monitor: t.boolean,
  delete: t.boolean,
  manage: t.boolean,
  delete_index: t.boolean,
  create_doc: t.boolean,
  view_index_metadata: t.boolean,
  create: t.boolean,
  manage_follow_index: t.boolean,
  manage_leader_index: t.boolean,
  write: t.boolean
}));
exports.indexRecord = indexRecord;
const indexType = t.type({
  index: indexRecord
});
exports.indexType = indexType;
const privilege = t.type({
  username: t.string,
  has_all_requested: t.boolean,
  cluster: t.type({
    monitor_ml: t.boolean,
    manage_ccr: t.boolean,
    manage_index_templates: t.boolean,
    monitor_watcher: t.boolean,
    monitor_transform: t.boolean,
    read_ilm: t.boolean,
    manage_security: t.boolean,
    manage_own_api_key: t.boolean,
    manage_saml: t.boolean,
    all: t.boolean,
    manage_ilm: t.boolean,
    manage_ingest_pipelines: t.boolean,
    read_ccr: t.boolean,
    manage_rollup: t.boolean,
    monitor: t.boolean,
    manage_watcher: t.boolean,
    manage: t.boolean,
    manage_transform: t.boolean,
    manage_token: t.boolean,
    manage_ml: t.boolean,
    manage_pipeline: t.boolean,
    monitor_rollup: t.boolean,
    transport_client: t.boolean,
    create_snapshot: t.boolean
  }),
  index: indexRecord,
  is_authenticated: t.boolean,
  has_encryption_key: t.boolean
});
exports.privilege = privilege;
let BulkAction;
exports.BulkAction = BulkAction;

(function (BulkAction) {
  BulkAction["enable"] = "enable";
  BulkAction["disable"] = "disable";
  BulkAction["export"] = "export";
  BulkAction["delete"] = "delete";
  BulkAction["duplicate"] = "duplicate";
})(BulkAction || (exports.BulkAction = BulkAction = {}));

const bulkAction = (0, _securitysolutionIoTsTypes.enumeration)('BulkAction', BulkAction);
exports.bulkAction = bulkAction;