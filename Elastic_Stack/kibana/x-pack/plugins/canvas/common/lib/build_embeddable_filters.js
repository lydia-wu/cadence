"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildEmbeddableFilters = buildEmbeddableFilters;
exports.getQueryFilters = getQueryFilters;

var _esQuery = require("@kbn/es-query");

var _build_bool_array = require("./build_bool_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error untyped local


const TimeFilterType = 'time';

function getTimeRangeFromFilters(filters) {
  const timeFilter = filters.find(filter => filter.filterType !== undefined && filter.filterType === TimeFilterType);
  return timeFilter !== undefined && timeFilter.from !== undefined && timeFilter.to !== undefined ? {
    from: timeFilter.from,
    to: timeFilter.to
  } : undefined;
}

function getQueryFilters(filters) {
  const dataFilters = filters.map(filter => ({ ...filter,
    type: filter.filterType
  }));
  return (0, _build_bool_array.buildBoolArray)(dataFilters).map(_esQuery.buildQueryFilter);
}

function buildEmbeddableFilters(filters) {
  return {
    timeRange: getTimeRangeFromFilters(filters),
    filters: getQueryFilters(filters)
  };
}