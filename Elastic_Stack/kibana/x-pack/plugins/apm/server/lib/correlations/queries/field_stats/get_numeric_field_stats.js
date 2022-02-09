"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNumericFieldStatsRequest = exports.fetchNumericFieldStats = void 0;

var _lodash = require("lodash");

var _get_query_with_params = require("../get_query_with_params");

var _field_stats_utils = require("../../utils/field_stats_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Only need 50th percentile for the median


const PERCENTILES = [50];

const getNumericFieldStatsRequest = (params, fieldName, termFilters) => {
  const query = (0, _get_query_with_params.getQueryWithParams)({
    params,
    termFilters
  });
  const size = 0;
  const {
    index,
    samplerShardSize
  } = params;
  const percents = PERCENTILES;
  const aggs = {
    sampled_field_stats: {
      filter: {
        exists: {
          field: fieldName
        }
      },
      aggs: {
        actual_stats: {
          stats: {
            field: fieldName
          }
        }
      }
    },
    sampled_percentiles: {
      percentiles: {
        field: fieldName,
        percents,
        keyed: false
      }
    },
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

exports.getNumericFieldStatsRequest = getNumericFieldStatsRequest;

const fetchNumericFieldStats = async (esClient, params, field, termFilters) => {
  var _aggregations$sample$, _aggregations$sample$2, _aggregations$sample$3, _aggregations$sample$4, _aggregations$sample$5, _aggregations$sample$6, _aggregations$sample$7, _aggregations$sample$8;

  const request = getNumericFieldStatsRequest(params, field.fieldName, termFilters);
  const {
    body
  } = await esClient.search(request);
  const aggregations = body.aggregations;
  const docCount = (_aggregations$sample$ = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sample$2 = aggregations.sample.sampled_field_stats) === null || _aggregations$sample$2 === void 0 ? void 0 : _aggregations$sample$2.doc_count) !== null && _aggregations$sample$ !== void 0 ? _aggregations$sample$ : 0;
  const fieldStatsResp = (_aggregations$sample$3 = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sample$4 = aggregations.sample.sampled_field_stats) === null || _aggregations$sample$4 === void 0 ? void 0 : _aggregations$sample$4.actual_stats) !== null && _aggregations$sample$3 !== void 0 ? _aggregations$sample$3 : {};
  const topValues = (_aggregations$sample$5 = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sample$6 = aggregations.sample.sampled_top) === null || _aggregations$sample$6 === void 0 ? void 0 : _aggregations$sample$6.buckets) !== null && _aggregations$sample$5 !== void 0 ? _aggregations$sample$5 : [];
  const stats = {
    fieldName: field.fieldName,
    count: docCount,
    min: (0, _lodash.get)(fieldStatsResp, 'min', 0),
    max: (0, _lodash.get)(fieldStatsResp, 'max', 0),
    avg: (0, _lodash.get)(fieldStatsResp, 'avg', 0),
    topValues,
    topValuesSampleSize: topValues.reduce((acc, curr) => acc + curr.doc_count, (_aggregations$sample$7 = (_aggregations$sample$8 = aggregations.sample.sampled_top) === null || _aggregations$sample$8 === void 0 ? void 0 : _aggregations$sample$8.sum_other_doc_count) !== null && _aggregations$sample$7 !== void 0 ? _aggregations$sample$7 : 0)
  };

  if (stats.count !== undefined && stats.count > 0) {
    var _aggregations$sample$9;

    const percentiles = (_aggregations$sample$9 = aggregations === null || aggregations === void 0 ? void 0 : aggregations.sample.sampled_percentiles.values) !== null && _aggregations$sample$9 !== void 0 ? _aggregations$sample$9 : [];
    const medianPercentile = (0, _lodash.find)(percentiles, {
      key: 50
    });
    stats.median = medianPercentile !== undefined ? medianPercentile.value : 0;
  }

  return stats;
};

exports.fetchNumericFieldStats = fetchNumericFieldStats;