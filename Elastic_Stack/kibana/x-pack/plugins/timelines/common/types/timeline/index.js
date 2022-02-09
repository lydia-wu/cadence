"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  DataProviderType: true,
  DataProviderTypeLiteralRt: true,
  TimelineStatus: true,
  TimelineStatusLiteralRt: true,
  RowRendererId: true,
  RowRendererIdRuntimeType: true,
  TemplateTimelineType: true,
  TemplateTimelineTypeLiteralRt: true,
  TemplateTimelineTypeLiteralWithNullRt: true,
  TimelineType: true,
  TimelineTypeLiteralRt: true,
  TimelineTypeLiteralWithNullRt: true,
  SavedTimelineRuntimeType: true,
  TimelineId: true,
  TimelineIdLiteralRt: true,
  TimelineSavedObjectRuntimeType: true,
  TimelineSavedToReturnObjectRuntimeType: true,
  SingleTimelineResponseType: true,
  TimelineResponseType: true,
  TimelineErrorResponseType: true,
  AllTimelineSavedObjectRuntimeType: true,
  importTimelineResultSchema: true,
  TimelineTabs: true,
  pageInfoTimeline: true,
  SortFieldTimeline: true,
  sortFieldTimeline: true,
  direction: true,
  sortTimeline: true,
  responseFavoriteTimeline: true,
  getTimelinesArgs: true,
  allTimelinesResponse: true
};
exports.sortTimeline = exports.sortFieldTimeline = exports.responseFavoriteTimeline = exports.pageInfoTimeline = exports.importTimelineResultSchema = exports.getTimelinesArgs = exports.direction = exports.allTimelinesResponse = exports.TimelineTypeLiteralWithNullRt = exports.TimelineTypeLiteralRt = exports.TimelineType = exports.TimelineTabs = exports.TimelineStatusLiteralRt = exports.TimelineStatus = exports.TimelineSavedToReturnObjectRuntimeType = exports.TimelineSavedObjectRuntimeType = exports.TimelineResponseType = exports.TimelineIdLiteralRt = exports.TimelineId = exports.TimelineErrorResponseType = exports.TemplateTimelineTypeLiteralWithNullRt = exports.TemplateTimelineTypeLiteralRt = exports.TemplateTimelineType = exports.SortFieldTimeline = exports.SingleTimelineResponseType = exports.SavedTimelineRuntimeType = exports.RowRendererIdRuntimeType = exports.RowRendererId = exports.DataProviderTypeLiteralRt = exports.DataProviderType = exports.AllTimelineSavedObjectRuntimeType = void 0;

var runtimeTypes = _interopRequireWildcard(require("io-ts"));

var _utility_types = require("../../utility_types");

var _note = require("./note");

var _pinned_event = require("./pinned_event");

var _search_strategy = require("../../search_strategy");

var _actions = require("./actions");

Object.keys(_actions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _actions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _actions[key];
    }
  });
});

var _cells = require("./cells");

Object.keys(_cells).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _cells[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cells[key];
    }
  });
});

var _columns = require("./columns");

Object.keys(_columns).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _columns[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _columns[key];
    }
  });
});

var _data_provider = require("./data_provider");

Object.keys(_data_provider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _data_provider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _data_provider[key];
    }
  });
});

var _rows = require("./rows");

Object.keys(_rows).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _rows[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rows[key];
    }
  });
});

var _store = require("./store");

Object.keys(_store).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _store[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _store[key];
    }
  });
});

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


const errorSchema = runtimeTypes.exact(runtimeTypes.type({
  error: runtimeTypes.type({
    status_code: runtimeTypes.number,
    message: runtimeTypes.string
  })
}));
/*
 *  ColumnHeader Types
 */

const SavedColumnHeaderRuntimeType = runtimeTypes.partial({
  aggregatable: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  category: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  columnHeaderType: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  description: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  example: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  indexes: (0, _utility_types.unionWithNullType)(runtimeTypes.array(runtimeTypes.string)),
  id: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  name: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  placeholder: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  searchable: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  type: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
/*
 *  DataProvider Types
 */

const SavedDataProviderQueryMatchBasicRuntimeType = runtimeTypes.partial({
  field: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  displayField: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  value: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  displayValue: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  operator: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
const SavedDataProviderQueryMatchRuntimeType = runtimeTypes.partial({
  id: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  name: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  enabled: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  excluded: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  kqlQuery: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  queryMatch: (0, _utility_types.unionWithNullType)(SavedDataProviderQueryMatchBasicRuntimeType)
});
let DataProviderType;
exports.DataProviderType = DataProviderType;

(function (DataProviderType) {
  DataProviderType["default"] = "default";
  DataProviderType["template"] = "template";
})(DataProviderType || (exports.DataProviderType = DataProviderType = {}));

const DataProviderTypeLiteralRt = runtimeTypes.union([runtimeTypes.literal(DataProviderType.default), runtimeTypes.literal(DataProviderType.template)]);
exports.DataProviderTypeLiteralRt = DataProviderTypeLiteralRt;
const SavedDataProviderRuntimeType = runtimeTypes.partial({
  id: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  name: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  enabled: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  excluded: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  kqlQuery: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  queryMatch: (0, _utility_types.unionWithNullType)(SavedDataProviderQueryMatchBasicRuntimeType),
  and: (0, _utility_types.unionWithNullType)(runtimeTypes.array(SavedDataProviderQueryMatchRuntimeType)),
  type: (0, _utility_types.unionWithNullType)(DataProviderTypeLiteralRt)
});
/*
 *  Filters Types
 */

const SavedFilterMetaRuntimeType = runtimeTypes.partial({
  alias: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  controlledBy: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  disabled: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  field: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  formattedValue: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  index: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  key: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  negate: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  params: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  type: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  value: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
const SavedFilterRuntimeType = runtimeTypes.partial({
  exists: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  meta: (0, _utility_types.unionWithNullType)(SavedFilterMetaRuntimeType),
  match_all: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  missing: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  query: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  range: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  script: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
/*
 *  eqlOptionsQuery -> filterQuery Types
 */

const EqlOptionsRuntimeType = runtimeTypes.partial({
  eventCategoryField: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  query: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  tiebreakerField: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  timestampField: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  size: (0, _utility_types.unionWithNullType)(runtimeTypes.union([runtimeTypes.string, runtimeTypes.number]))
});
/*
 *  kqlQuery -> filterQuery Types
 */

const SavedKueryFilterQueryRuntimeType = runtimeTypes.partial({
  kind: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  expression: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
const SavedSerializedFilterQueryQueryRuntimeType = runtimeTypes.partial({
  kuery: (0, _utility_types.unionWithNullType)(SavedKueryFilterQueryRuntimeType),
  serializedQuery: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
const SavedFilterQueryQueryRuntimeType = runtimeTypes.partial({
  filterQuery: (0, _utility_types.unionWithNullType)(SavedSerializedFilterQueryQueryRuntimeType)
});
/*
 *  DatePicker Range Types
 */

const SavedDateRangePickerRuntimeType = runtimeTypes.partial({
  /* Before the change of all timestamp to ISO string the values of start and from
   * attributes where a number. Specifically UNIX timestamps.
   * To support old timeline's saved object we need to add the number io-ts type
   */
  start: (0, _utility_types.unionWithNullType)(runtimeTypes.union([runtimeTypes.string, runtimeTypes.number])),
  end: (0, _utility_types.unionWithNullType)(runtimeTypes.union([runtimeTypes.string, runtimeTypes.number]))
});
/*
 *  Favorite Types
 */

const SavedFavoriteRuntimeType = runtimeTypes.partial({
  keySearch: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  favoriteDate: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  fullName: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  userName: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
/*
 *  Sort Types
 */

const SavedSortObject = runtimeTypes.partial({
  columnId: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  columnType: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  sortDirection: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
const SavedSortRuntimeType = runtimeTypes.union([runtimeTypes.array(SavedSortObject), SavedSortObject]);
/*
 *  Timeline Statuses
 */

let TimelineStatus;
exports.TimelineStatus = TimelineStatus;

(function (TimelineStatus) {
  TimelineStatus["active"] = "active";
  TimelineStatus["draft"] = "draft";
  TimelineStatus["immutable"] = "immutable";
})(TimelineStatus || (exports.TimelineStatus = TimelineStatus = {}));

const TimelineStatusLiteralRt = runtimeTypes.union([runtimeTypes.literal(TimelineStatus.active), runtimeTypes.literal(TimelineStatus.draft), runtimeTypes.literal(TimelineStatus.immutable)]);
exports.TimelineStatusLiteralRt = TimelineStatusLiteralRt;
const TimelineStatusLiteralWithNullRt = (0, _utility_types.unionWithNullType)(TimelineStatusLiteralRt);
let RowRendererId;
exports.RowRendererId = RowRendererId;

(function (RowRendererId) {
  RowRendererId["alerts"] = "alerts";
  RowRendererId["auditd"] = "auditd";
  RowRendererId["auditd_file"] = "auditd_file";
  RowRendererId["library"] = "library";
  RowRendererId["netflow"] = "netflow";
  RowRendererId["plain"] = "plain";
  RowRendererId["registry"] = "registry";
  RowRendererId["suricata"] = "suricata";
  RowRendererId["system"] = "system";
  RowRendererId["system_dns"] = "system_dns";
  RowRendererId["system_endgame_process"] = "system_endgame_process";
  RowRendererId["system_file"] = "system_file";
  RowRendererId["system_fim"] = "system_fim";
  RowRendererId["system_security_event"] = "system_security_event";
  RowRendererId["system_socket"] = "system_socket";
  RowRendererId["threat_match"] = "threat_match";
  RowRendererId["zeek"] = "zeek";
})(RowRendererId || (exports.RowRendererId = RowRendererId = {}));

const RowRendererIdRuntimeType = (0, _utility_types.stringEnum)(RowRendererId, 'RowRendererId');
/**
 * Timeline template type
 */

exports.RowRendererIdRuntimeType = RowRendererIdRuntimeType;
let TemplateTimelineType;
exports.TemplateTimelineType = TemplateTimelineType;

(function (TemplateTimelineType) {
  TemplateTimelineType["elastic"] = "elastic";
  TemplateTimelineType["custom"] = "custom";
})(TemplateTimelineType || (exports.TemplateTimelineType = TemplateTimelineType = {}));

const TemplateTimelineTypeLiteralRt = runtimeTypes.union([runtimeTypes.literal(TemplateTimelineType.elastic), runtimeTypes.literal(TemplateTimelineType.custom)]);
exports.TemplateTimelineTypeLiteralRt = TemplateTimelineTypeLiteralRt;
const TemplateTimelineTypeLiteralWithNullRt = (0, _utility_types.unionWithNullType)(TemplateTimelineTypeLiteralRt);
exports.TemplateTimelineTypeLiteralWithNullRt = TemplateTimelineTypeLiteralWithNullRt;
/*
 *  Timeline Types
 */

let TimelineType;
exports.TimelineType = TimelineType;

(function (TimelineType) {
  TimelineType["default"] = "default";
  TimelineType["template"] = "template";
  TimelineType["test"] = "test";
})(TimelineType || (exports.TimelineType = TimelineType = {}));

const TimelineTypeLiteralRt = runtimeTypes.union([runtimeTypes.literal(TimelineType.template), runtimeTypes.literal(TimelineType.default), runtimeTypes.literal(TimelineType.test)]);
exports.TimelineTypeLiteralRt = TimelineTypeLiteralRt;
const TimelineTypeLiteralWithNullRt = (0, _utility_types.unionWithNullType)(TimelineTypeLiteralRt);
exports.TimelineTypeLiteralWithNullRt = TimelineTypeLiteralWithNullRt;
const SavedTimelineRuntimeType = runtimeTypes.partial({
  columns: (0, _utility_types.unionWithNullType)(runtimeTypes.array(SavedColumnHeaderRuntimeType)),
  dataProviders: (0, _utility_types.unionWithNullType)(runtimeTypes.array(SavedDataProviderRuntimeType)),
  description: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  eqlOptions: (0, _utility_types.unionWithNullType)(EqlOptionsRuntimeType),
  eventType: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  excludedRowRendererIds: (0, _utility_types.unionWithNullType)(runtimeTypes.array(RowRendererIdRuntimeType)),
  favorite: (0, _utility_types.unionWithNullType)(runtimeTypes.array(SavedFavoriteRuntimeType)),
  filters: (0, _utility_types.unionWithNullType)(runtimeTypes.array(SavedFilterRuntimeType)),
  indexNames: (0, _utility_types.unionWithNullType)(runtimeTypes.array(runtimeTypes.string)),
  kqlMode: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  kqlQuery: (0, _utility_types.unionWithNullType)(SavedFilterQueryQueryRuntimeType),
  title: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  templateTimelineId: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  templateTimelineVersion: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  timelineType: (0, _utility_types.unionWithNullType)(TimelineTypeLiteralRt),
  dateRange: (0, _utility_types.unionWithNullType)(SavedDateRangePickerRuntimeType),
  savedQueryId: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  sort: (0, _utility_types.unionWithNullType)(SavedSortRuntimeType),
  status: (0, _utility_types.unionWithNullType)(TimelineStatusLiteralRt),
  created: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  createdBy: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  updated: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  updatedBy: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
exports.SavedTimelineRuntimeType = SavedTimelineRuntimeType;
/*
 *  Timeline IDs
 */

let TimelineId;
exports.TimelineId = TimelineId;

(function (TimelineId) {
  TimelineId["hostsPageEvents"] = "hosts-page-events";
  TimelineId["hostsPageExternalAlerts"] = "hosts-page-external-alerts";
  TimelineId["detectionsRulesDetailsPage"] = "detections-rules-details-page";
  TimelineId["detectionsPage"] = "detections-page";
  TimelineId["networkPageExternalAlerts"] = "network-page-external-alerts";
  TimelineId["uebaPageExternalAlerts"] = "ueba-page-external-alerts";
  TimelineId["active"] = "timeline-1";
  TimelineId["casePage"] = "timeline-case";
  TimelineId["test"] = "test";
  TimelineId["alternateTest"] = "alternateTest";
})(TimelineId || (exports.TimelineId = TimelineId = {}));

const TimelineIdLiteralRt = runtimeTypes.union([runtimeTypes.literal(TimelineId.hostsPageEvents), runtimeTypes.literal(TimelineId.hostsPageExternalAlerts), runtimeTypes.literal(TimelineId.detectionsRulesDetailsPage), runtimeTypes.literal(TimelineId.detectionsPage), runtimeTypes.literal(TimelineId.networkPageExternalAlerts), runtimeTypes.literal(TimelineId.uebaPageExternalAlerts), runtimeTypes.literal(TimelineId.active), runtimeTypes.literal(TimelineId.test)]);
exports.TimelineIdLiteralRt = TimelineIdLiteralRt;
/**
 * Timeline Saved object type with metadata
 */

const TimelineSavedObjectRuntimeType = runtimeTypes.intersection([runtimeTypes.type({
  id: runtimeTypes.string,
  attributes: SavedTimelineRuntimeType,
  version: runtimeTypes.string
}), runtimeTypes.partial({
  savedObjectId: runtimeTypes.string
})]);
exports.TimelineSavedObjectRuntimeType = TimelineSavedObjectRuntimeType;
const TimelineSavedToReturnObjectRuntimeType = runtimeTypes.intersection([SavedTimelineRuntimeType, runtimeTypes.type({
  savedObjectId: runtimeTypes.string,
  version: runtimeTypes.string
}), runtimeTypes.partial({
  eventIdToNoteIds: runtimeTypes.array(_note.NoteSavedObjectToReturnRuntimeType),
  noteIds: runtimeTypes.array(runtimeTypes.string),
  notes: runtimeTypes.array(_note.NoteSavedObjectToReturnRuntimeType),
  pinnedEventIds: runtimeTypes.array(runtimeTypes.string),
  pinnedEventsSaveObject: runtimeTypes.array(_pinned_event.PinnedEventToReturnSavedObjectRuntimeType)
})]);
exports.TimelineSavedToReturnObjectRuntimeType = TimelineSavedToReturnObjectRuntimeType;
const SingleTimelineResponseType = runtimeTypes.type({
  data: runtimeTypes.type({
    getOneTimeline: TimelineSavedToReturnObjectRuntimeType
  })
});
exports.SingleTimelineResponseType = SingleTimelineResponseType;
/**
 * All Timeline Saved object type with metadata
 */

const TimelineResponseType = runtimeTypes.type({
  data: runtimeTypes.type({
    persistTimeline: runtimeTypes.intersection([runtimeTypes.partial({
      code: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
      message: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
    }), runtimeTypes.type({
      timeline: TimelineSavedToReturnObjectRuntimeType
    })])
  })
});
exports.TimelineResponseType = TimelineResponseType;
const TimelineErrorResponseType = runtimeTypes.type({
  status_code: runtimeTypes.number,
  message: runtimeTypes.string
});
exports.TimelineErrorResponseType = TimelineErrorResponseType;
/**
 * All Timeline Saved object type with metadata
 */

const AllTimelineSavedObjectRuntimeType = runtimeTypes.type({
  total: runtimeTypes.number,
  data: TimelineSavedToReturnObjectRuntimeType
});
exports.AllTimelineSavedObjectRuntimeType = AllTimelineSavedObjectRuntimeType;
const importTimelineResultSchema = runtimeTypes.exact(runtimeTypes.type({
  success: runtimeTypes.boolean,
  success_count: runtimeTypes.number,
  timelines_installed: runtimeTypes.number,
  timelines_updated: runtimeTypes.number,
  errors: runtimeTypes.array(errorSchema)
}));
exports.importTimelineResultSchema = importTimelineResultSchema;
let TimelineTabs; // eslint-disable-next-line @typescript-eslint/no-explicit-any

exports.TimelineTabs = TimelineTabs;

(function (TimelineTabs) {
  TimelineTabs["query"] = "query";
  TimelineTabs["graph"] = "graph";
  TimelineTabs["notes"] = "notes";
  TimelineTabs["pinned"] = "pinned";
  TimelineTabs["eql"] = "eql";
})(TimelineTabs || (exports.TimelineTabs = TimelineTabs = {}));

var FlowTarget;

(function (FlowTarget) {
  FlowTarget["client"] = "client";
  FlowTarget["destination"] = "destination";
  FlowTarget["server"] = "server";
  FlowTarget["source"] = "source";
})(FlowTarget || (FlowTarget = {}));

const pageInfoTimeline = runtimeTypes.type({
  pageIndex: runtimeTypes.number,
  pageSize: runtimeTypes.number
});
exports.pageInfoTimeline = pageInfoTimeline;
let SortFieldTimeline;
exports.SortFieldTimeline = SortFieldTimeline;

(function (SortFieldTimeline) {
  SortFieldTimeline["title"] = "title";
  SortFieldTimeline["description"] = "description";
  SortFieldTimeline["updated"] = "updated";
  SortFieldTimeline["created"] = "created";
})(SortFieldTimeline || (exports.SortFieldTimeline = SortFieldTimeline = {}));

const sortFieldTimeline = runtimeTypes.union([runtimeTypes.literal(SortFieldTimeline.title), runtimeTypes.literal(SortFieldTimeline.description), runtimeTypes.literal(SortFieldTimeline.updated), runtimeTypes.literal(SortFieldTimeline.created)]);
exports.sortFieldTimeline = sortFieldTimeline;
const direction = runtimeTypes.union([runtimeTypes.literal(_search_strategy.Direction.asc), runtimeTypes.literal(_search_strategy.Direction.desc)]);
exports.direction = direction;
const sortTimeline = runtimeTypes.type({
  sortField: sortFieldTimeline,
  sortOrder: direction
});
exports.sortTimeline = sortTimeline;
const favoriteTimelineResult = runtimeTypes.partial({
  fullName: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  userName: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  favoriteDate: (0, _utility_types.unionWithNullType)(runtimeTypes.number)
});
const responseFavoriteTimeline = runtimeTypes.partial({
  savedObjectId: runtimeTypes.string,
  version: runtimeTypes.string,
  code: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  message: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  templateTimelineId: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  templateTimelineVersion: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  timelineType: (0, _utility_types.unionWithNullType)(TimelineTypeLiteralRt),
  favorite: (0, _utility_types.unionWithNullType)(runtimeTypes.array(favoriteTimelineResult))
});
exports.responseFavoriteTimeline = responseFavoriteTimeline;
const getTimelinesArgs = runtimeTypes.partial({
  onlyUserFavorite: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  pageInfo: (0, _utility_types.unionWithNullType)(pageInfoTimeline),
  search: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  sort: (0, _utility_types.unionWithNullType)(sortTimeline),
  status: (0, _utility_types.unionWithNullType)(TimelineStatusLiteralRt),
  timelineType: (0, _utility_types.unionWithNullType)(TimelineTypeLiteralRt)
});
exports.getTimelinesArgs = getTimelinesArgs;
const responseTimelines = runtimeTypes.type({
  timeline: runtimeTypes.array(TimelineSavedToReturnObjectRuntimeType),
  totalCount: runtimeTypes.number
});
const allTimelinesResponse = runtimeTypes.intersection([responseTimelines, runtimeTypes.type({
  defaultTimelineCount: runtimeTypes.number,
  templateTimelineCount: runtimeTypes.number,
  elasticTemplateTimelineCount: runtimeTypes.number,
  customTemplateTimelineCount: runtimeTypes.number,
  favoriteCount: runtimeTypes.number
})]);
exports.allTimelinesResponse = allTimelinesResponse;