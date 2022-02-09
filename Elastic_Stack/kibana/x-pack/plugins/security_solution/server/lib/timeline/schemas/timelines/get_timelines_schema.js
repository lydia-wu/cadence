"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimelinesQuerySchema = exports.getTimelinesArgsSchema = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _timeline = require("../../../../../common/types/timeline");

var _utility_types = require("../../../../../common/utility_types");

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


const BoolFromString = rt.union([rt.literal('true'), rt.literal('false')]);
const getTimelinesQuerySchema = rt.partial({
  only_user_favorite: (0, _utility_types.unionWithNullType)(BoolFromString),
  page_index: (0, _utility_types.unionWithNullType)(rt.string),
  page_size: (0, _utility_types.unionWithNullType)(rt.string),
  search: (0, _utility_types.unionWithNullType)(rt.string),
  sort_field: _timeline.sortFieldTimeline,
  sort_order: _timeline.direction,
  status: (0, _utility_types.unionWithNullType)(_timeline.TimelineStatusLiteralRt),
  timeline_type: (0, _utility_types.unionWithNullType)(_timeline.TimelineTypeLiteralRt)
});
exports.getTimelinesQuerySchema = getTimelinesQuerySchema;
const getTimelinesArgsSchema = rt.partial({
  onlyUserFavorite: (0, _utility_types.unionWithNullType)(BoolFromString),
  pageIndex: (0, _utility_types.unionWithNullType)(rt.string),
  pageSize: (0, _utility_types.unionWithNullType)(rt.string),
  search: (0, _utility_types.unionWithNullType)(rt.string),
  sortField: _timeline.sortFieldTimeline,
  sortOrder: _timeline.direction,
  status: (0, _utility_types.unionWithNullType)(_timeline.TimelineStatusLiteralRt),
  timelineType: (0, _utility_types.unionWithNullType)(_timeline.TimelineTypeLiteralRt)
});
exports.getTimelinesArgsSchema = getTimelinesArgsSchema;