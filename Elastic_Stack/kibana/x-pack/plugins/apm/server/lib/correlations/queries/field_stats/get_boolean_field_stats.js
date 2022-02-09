"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBooleanFieldStatsRequest = exports.fetchBooleanFieldStats = void 0;

var _field_stats_utils = require("../../utils/field_stats_utils");

var _get_query_with_params = require("../get_query_with_params");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getBooleanFieldStatsRequest = (params, fieldName, termFilters) => {
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
    sampled_value_count: {
      filter: {
        exists: {
          field: fieldName
        }
      }
    },
    sampled_values: {
      terms: {
        field: fieldName,
        size: 2
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

exports.getBooleanFieldStatsRequest = getBooleanFieldStatsRequest;

const fetchBooleanFieldStats = async (esClient, params, field, termFilters) => {
  var _aggregations$sample$, _aggregations$sample$2, _aggregations$sample$3;

  const request = getBooleanFieldStatsRequest(params, field.fieldName, termFilters);
  const {
    body
  } = await esClient.search(request);
  const aggregations = body.aggregations;
  const stats = {
    fieldName: field.fieldName,
    count: (_aggregations$sample$ = aggregations === null || aggregations === void 0 ? void 0 : aggregations.sample.sampled_value_count.doc_count) !== null && _aggregations$sample$ !== void 0 ? _aggregations$sample$ : 0
  };
  const valueBuckets = (_aggregations$sample$2 = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sample$3 = aggregations.sample.sampled_values) === null || _aggregations$sample$3 === void 0 ? void 0 : _aggregations$sample$3.buckets) !== null && _aggregations$sample$2 !== void 0 ? _aggregations$sample$2 : [];
  valueBuckets.forEach(bucket => {
    stats[`${bucket.key.toString()}Count`] = bucket.doc_count;
  });
  return stats;
};

exports.fetchBooleanFieldStats = fetchBooleanFieldStats;