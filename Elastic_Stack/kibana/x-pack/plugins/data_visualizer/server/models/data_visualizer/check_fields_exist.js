"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkNonAggregatableFieldExists = exports.checkAggregatableFieldsExist = void 0;

var _lodash = require("lodash");

var _query_utils = require("../../../common/utils/query_utils");

var _datafeed_utils = require("../../../common/utils/datafeed_utils");

var _object_utils = require("../../../common/utils/object_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const checkAggregatableFieldsExist = async (client, indexPatternTitle, query, aggregatableFields, samplerShardSize, timeFieldName, earliestMs, latestMs, datafeedConfig, runtimeMappings) => {
  const {
    asCurrentUser
  } = client;
  const index = indexPatternTitle;
  const size = 0;
  const filterCriteria = (0, _query_utils.buildBaseFilterCriteria)(timeFieldName, earliestMs, latestMs, query);
  const datafeedAggregations = (0, _datafeed_utils.getDatafeedAggregations)(datafeedConfig); // Value count aggregation faster way of checking if field exists than using
  // filter aggregation with exists query.

  const aggs = datafeedAggregations !== undefined ? { ...datafeedAggregations
  } : {}; // Combine runtime fields from the index pattern as well as the datafeed

  const combinedRuntimeMappings = { ...((0, _object_utils.isPopulatedObject)(runtimeMappings) ? runtimeMappings : {}),
    ...((0, _object_utils.isPopulatedObject)(datafeedConfig) && (0, _object_utils.isPopulatedObject)(datafeedConfig.runtime_mappings) ? datafeedConfig.runtime_mappings : {})
  };
  aggregatableFields.forEach((field, i) => {
    var _datafeedConfig$scrip;

    const safeFieldName = (0, _query_utils.getSafeAggregationName)(field, i);
    aggs[`${safeFieldName}_count`] = {
      filter: {
        exists: {
          field
        }
      }
    };
    let cardinalityField;

    if (datafeedConfig !== null && datafeedConfig !== void 0 && (_datafeedConfig$scrip = datafeedConfig.script_fields) !== null && _datafeedConfig$scrip !== void 0 && _datafeedConfig$scrip.hasOwnProperty(field)) {
      cardinalityField = aggs[`${safeFieldName}_cardinality`] = {
        cardinality: {
          script: datafeedConfig === null || datafeedConfig === void 0 ? void 0 : datafeedConfig.script_fields[field].script
        }
      };
    } else {
      cardinalityField = {
        cardinality: {
          field
        }
      };
    }

    aggs[`${safeFieldName}_cardinality`] = cardinalityField;
  });
  const searchBody = {
    query: {
      bool: {
        filter: filterCriteria
      }
    },
    ...((0, _object_utils.isPopulatedObject)(aggs) ? {
      aggs: (0, _query_utils.buildSamplerAggregation)(aggs, samplerShardSize)
    } : {}),
    ...((0, _object_utils.isPopulatedObject)(combinedRuntimeMappings) ? {
      runtime_mappings: combinedRuntimeMappings
    } : {})
  };
  const {
    body
  } = await asCurrentUser.search({
    index,
    track_total_hits: true,
    size,
    body: searchBody
  });
  const aggregations = body.aggregations; // @ts-expect-error incorrect search response type

  const totalCount = body.hits.total.value;
  const stats = {
    totalCount,
    aggregatableExistsFields: [],
    aggregatableNotExistsFields: []
  };
  const aggsPath = (0, _query_utils.getSamplerAggregationsResponsePath)(samplerShardSize);
  const sampleCount = samplerShardSize > 0 ? (0, _lodash.get)(aggregations, ['sample', 'doc_count'], 0) : totalCount;
  aggregatableFields.forEach((field, i) => {
    const safeFieldName = (0, _query_utils.getSafeAggregationName)(field, i);
    const count = (0, _lodash.get)(aggregations, [...aggsPath, `${safeFieldName}_count`, 'doc_count'], 0);

    if (count > 0) {
      const cardinality = (0, _lodash.get)(aggregations, [...aggsPath, `${safeFieldName}_cardinality`, 'value'], 0);
      stats.aggregatableExistsFields.push({
        fieldName: field,
        existsInDocs: true,
        stats: {
          sampleCount,
          count,
          cardinality
        }
      });
    } else {
      var _datafeedConfig$scrip2, _datafeedConfig$runti;

      if (datafeedConfig !== null && datafeedConfig !== void 0 && (_datafeedConfig$scrip2 = datafeedConfig.script_fields) !== null && _datafeedConfig$scrip2 !== void 0 && _datafeedConfig$scrip2.hasOwnProperty(field) || datafeedConfig !== null && datafeedConfig !== void 0 && (_datafeedConfig$runti = datafeedConfig.runtime_mappings) !== null && _datafeedConfig$runti !== void 0 && _datafeedConfig$runti.hasOwnProperty(field)) {
        const cardinality = (0, _lodash.get)(aggregations, [...aggsPath, `${safeFieldName}_cardinality`, 'value'], 0);
        stats.aggregatableExistsFields.push({
          fieldName: field,
          existsInDocs: true,
          stats: {
            sampleCount,
            count,
            cardinality
          }
        });
      } else {
        stats.aggregatableNotExistsFields.push({
          fieldName: field,
          existsInDocs: false
        });
      }
    }
  });
  return stats;
};

exports.checkAggregatableFieldsExist = checkAggregatableFieldsExist;

const checkNonAggregatableFieldExists = async (client, indexPatternTitle, query, field, timeFieldName, earliestMs, latestMs, runtimeMappings) => {
  const {
    asCurrentUser
  } = client;
  const index = indexPatternTitle;
  const size = 0;
  const filterCriteria = (0, _query_utils.buildBaseFilterCriteria)(timeFieldName, earliestMs, latestMs, query);
  const searchBody = {
    query: {
      bool: {
        filter: filterCriteria
      }
    },
    ...((0, _object_utils.isPopulatedObject)(runtimeMappings) ? {
      runtime_mappings: runtimeMappings
    } : {})
  };
  filterCriteria.push({
    exists: {
      field
    }
  });
  const {
    body
  } = await asCurrentUser.search({
    index,
    size,
    body: searchBody
  }); // @ts-expect-error incorrect search response type

  return body.hits.total.value > 0;
};

exports.checkNonAggregatableFieldExists = checkNonAggregatableFieldExists;