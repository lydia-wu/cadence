"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKeywordFieldStatsRequest = exports.fetchKeywordFieldStats = void 0;

var _field_stats_utils = require("../../utils/field_stats_utils");

var _get_query_with_params = require("../get_query_with_params");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getKeywordFieldStatsRequest = (params, fieldName, termFilters) => {
  const query = (0, _get_query_with_params.getQueryWithParams)({
    params,
    termFilters
  });
  const {
    index,
    samplerShardSize
  } = params;
  const size = 0;
  const aggs = {
    sampled_top: {
      terms: {
        field: fieldName,
        size: 10,
        order: {
          _count: 'desc'
        }
      }
    }
  };
  const searchBody = {
    query,
    aggs: {
      sample: (0, _field_stats_utils.buildSamplerAggregation)(aggs, samplerShardSize)
    }
  };
  return {
    index,
    size,
    body: searchBody
  };
};

exports.getKeywordFieldStatsRequest = getKeywordFieldStatsRequest;

const fetchKeywordFieldStats = async (esClient, params, field, termFilters) => {
  var _aggregations$sample$, _aggregations$sample$2, _aggregations$sample$3, _aggregations$sample$4;

  const request = getKeywordFieldStatsRequest(params, field.fieldName, termFilters);
  const {
    body
  } = await esClient.search(request);
  const aggregations = body.aggregations;
  const topValues = (_aggregations$sample$ = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sample$2 = aggregations.sample.sampled_top) === null || _aggregations$sample$2 === void 0 ? void 0 : _aggregations$sample$2.buckets) !== null && _aggregations$sample$ !== void 0 ? _aggregations$sample$ : [];
  const stats = {
    fieldName: field.fieldName,
    topValues,
    topValuesSampleSize: topValues.reduce((acc, curr) => acc + curr.doc_count, (_aggregations$sample$3 = (_aggregations$sample$4 = aggregations.sample.sampled_top) === null || _aggregations$sample$4 === void 0 ? void 0 : _aggregations$sample$4.sum_other_doc_count) !== null && _aggregations$sample$3 !== void 0 ? _aggregations$sample$3 : 0)
  };
  return stats;
};

exports.fetchKeywordFieldStats = fetchKeywordFieldStats;