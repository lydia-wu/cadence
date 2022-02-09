"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortNoteRt = exports.pageInfoNoteRt = exports.SortFieldNote = exports.SavedNoteRuntimeType = exports.NoteSavedObjectToReturnRuntimeType = exports.NoteSavedObjectRuntimeType = void 0;

var runtimeTypes = _interopRequireWildcard(require("io-ts"));

var _common = require("../../../search_strategy/common");

var _utility_types = require("../../../utility_types");

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

/* eslint-disable @typescript-eslint/no-empty-interface */

/*
 *  Note Types
 */


const SavedNoteRuntimeType = runtimeTypes.intersection([runtimeTypes.type({
  timelineId: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
}), runtimeTypes.partial({
  eventId: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  note: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  created: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  createdBy: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  updated: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  updatedBy: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
})]);
exports.SavedNoteRuntimeType = SavedNoteRuntimeType;
/**
 * Note Saved object type with metadata
 */

const NoteSavedObjectRuntimeType = runtimeTypes.intersection([runtimeTypes.type({
  id: runtimeTypes.string,
  attributes: SavedNoteRuntimeType,
  version: runtimeTypes.string
}), runtimeTypes.partial({
  noteId: runtimeTypes.string,
  timelineVersion: runtimeTypes.union([runtimeTypes.string, runtimeTypes.null, runtimeTypes.undefined])
})]);
exports.NoteSavedObjectRuntimeType = NoteSavedObjectRuntimeType;
const NoteSavedObjectToReturnRuntimeType = runtimeTypes.intersection([SavedNoteRuntimeType, runtimeTypes.type({
  noteId: runtimeTypes.string,
  version: runtimeTypes.string
}), runtimeTypes.partial({
  timelineVersion: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
})]);
exports.NoteSavedObjectToReturnRuntimeType = NoteSavedObjectToReturnRuntimeType;
let SortFieldNote;
exports.SortFieldNote = SortFieldNote;

(function (SortFieldNote) {
  SortFieldNote["updatedBy"] = "updatedBy";
  SortFieldNote["updated"] = "updated";
})(SortFieldNote || (exports.SortFieldNote = SortFieldNote = {}));

const pageInfoNoteRt = runtimeTypes.type({
  pageIndex: runtimeTypes.number,
  pageSize: runtimeTypes.number
});
exports.pageInfoNoteRt = pageInfoNoteRt;
const sortNoteRt = runtimeTypes.type({
  sortField: runtimeTypes.union([runtimeTypes.literal(SortFieldNote.updatedBy), runtimeTypes.literal(SortFieldNote.updated)]),
  sortOrder: runtimeTypes.union([runtimeTypes.literal(_common.Direction.asc), runtimeTypes.literal(_common.Direction.desc)])
});
exports.sortNoteRt = sortNoteRt;