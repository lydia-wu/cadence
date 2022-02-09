"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImportTimelinesSchemaRt = exports.ImportTimelinesPayloadSchemaRt = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _timeline = require("../../../../../common/types/timeline");

var _utility_types = require("../../../../../common/utility_types");

var _notes = require("../notes");

var _pinned_events = require("../pinned_events");

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


const ImportTimelinesSchemaRt = rt.intersection([_timeline.SavedTimelineRuntimeType, rt.type({
  savedObjectId: (0, _utility_types.unionWithNullType)(rt.string),
  version: (0, _utility_types.unionWithNullType)(rt.string)
}), rt.type({
  globalNotes: _notes.globalNotes,
  eventNotes: _notes.eventNotes,
  pinnedEventIds: _pinned_events.pinnedEventIds
})]);
exports.ImportTimelinesSchemaRt = ImportTimelinesSchemaRt;
const ReadableRt = rt.partial({
  _maxListeners: rt.unknown,
  _readableState: rt.unknown,
  _read: rt.unknown,
  readable: rt.boolean,
  _events: rt.unknown,
  _eventsCount: rt.number,
  _data: rt.unknown,
  _position: rt.number,
  _encoding: rt.string
});
const booleanInString = rt.union([rt.literal('true'), rt.literal('false')]);
const ImportTimelinesPayloadSchemaRt = rt.intersection([rt.type({
  file: rt.intersection([ReadableRt, rt.type({
    hapi: rt.type({
      filename: rt.string,
      headers: rt.unknown
    })
  })])
}), rt.partial({
  isImmutable: booleanInString
})]);
exports.ImportTimelinesPayloadSchemaRt = ImportTimelinesPayloadSchemaRt;