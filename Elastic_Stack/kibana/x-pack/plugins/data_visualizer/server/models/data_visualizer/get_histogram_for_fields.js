"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHistogramsForFields = exports.getAggIntervals = void 0;

var _lodash = require("lodash");

var _common = require("../../../../../../src/plugins/data/common");

var _string_utils = require("../../../common/utils/string_utils");

var _query_utils = require("../../../common/utils/query_utils");

var _object_utils = require("../../../common/utils/object_utils");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getAggIntervals = async ({
  asCurrentUser
}, indexPatternTitle, query, fields, samplerShardSize, runtimeMappings) => {
  const numericColumns = fields.filter(field => {
    return field.type === _common.KBN_FIELD_TYPES.NUMBER || field.type === _common.KBN_FIELD_TYPES.DATE;
  });

  if (numericColumns.length === 0) {
    return {};
  }

  const minMaxAggs = numericColumns.reduce((aggs, c) => {
    const id = (0, _string_utils.stringHash)(c.fieldName);
    aggs[id] = {
      stats: {
        field: c.fieldName
      }
    };
    return aggs;
  }, {});
  const {
    body
  } = await asCurrentUser.search({
    index: indexPatternTitle,
    size: 0,
    body: {
      query,
      aggs: (0, _query_utils.buildSamplerAggregation)(minMaxAggs, samplerShardSize),
      size: 0,
      ...((0, _object_utils.isPopulatedObject)(runtimeMappings) ? {
        runtime_mappings: runtimeMappings
      } : {})
    }
  });
  const aggsPath = (0, _query_utils.getSamplerAggregationsResponsePath)(samplerShardSize);
  const aggregations = aggsPath.length > 0 ? (0, _lodash.get)(body.aggregations, aggsPath) : body.aggregations;
  return Object.keys(aggregations).reduce((p, aggName) => {
    const stats = [aggregations[aggName].min, aggregations[aggName].max];

    if (!stats.includes(null)) {
      const delta = aggregations[aggName].max - aggregations[aggName].min;
      let aggInterval = 1;

      if (delta > _constants.MAX_CHART_COLUMNS || delta <= 1) {
        aggInterval = delta / (_constants.MAX_CHART_COLUMNS - 1);
      }

      p[aggName] = {
        interval: aggInterval,
        min: stats[0],
        max: stats[1]
      };
    }

    return p;
  }, {});
};

exports.getAggIntervals = getAggIntervals;

const getHistogramsForFields = async (client, indexPatternTitle, query, fields, samplerShardSize, runtimeMappings) => {
  const {
    asCurrentUser
  } = client;
  const aggIntervals = await getAggIntervals(client, indexPatternTitle, query, fields, samplerShardSize, runtimeMappings);
  const chartDataAggs = fields.reduce((aggs, field) => {
    const fieldName = field.fieldName;
    const fieldType = field.type;
    const id = (0, _string_utils.stringHash)(fieldName);

    if (fieldType === _common.KBN_FIELD_TYPES.NUMBER || fieldType === _common.KBN_FIELD_TYPES.DATE) {
      if (aggIntervals[id] !== undefined) {
        aggs[`${id}_histogram`] = {
          histogram: {
            field: fieldName,
            interval: aggIntervals[id].interval !== 0 ? aggIntervals[id].interval : 1
          }
        };
      }
    } else if (fieldType === _common.KBN_FIELD_TYPES.STRING || fieldType === _common.KBN_FIELD_TYPES.BOOLEAN) {
      if (fieldType === _common.KBN_FIELD_TYPES.STRING) {
        aggs[`${id}_cardinality`] = {
          cardinality: {
            field: fieldName
          }
        };
      }

      aggs[`${id}_terms`] = {
        terms: {
          field: fieldName,
          size: _constants.MAX_CHART_COLUMNS
        }
      };
    }

    return aggs;
  }, {});

  if (Object.keys(chartDataAggs).length === 0) {
    return [];
  }

  const {
    body
  } = await asCurrentUser.search({
    index: indexPatternTitle,
    size: 0,
    body: {
      query,
      aggs: (0, _query_utils.buildSamplerAggregation)(chartDataAggs, samplerShardSize),
      size: 0,
      ...((0, _object_utils.isPopulatedObject)(runtimeMappings) ? {
        runtime_mappings: runtimeMappings
      } : {})
    }
  });
  const aggsPath = (0, _query_utils.getSamplerAggregationsResponsePath)(samplerShardSize);
  const aggregations = aggsPath.length > 0 ? (0, _lodash.get)(body.aggregations, aggsPath) : body.aggregations;
  const chartsData = fields.map(field => {
    const fieldName = field.fieldName;
    const fieldType = field.type;
    const id = (0, _string_utils.stringHash)(field.fieldName);

    if (fieldType === _common.KBN_FIELD_TYPES.NUMBER || fieldType === _common.KBN_FIELD_TYPES.DATE) {
      if (aggIntervals[id] === undefined) {
        return {
          type: 'numeric',
          data: [],
          interval: 0,
          stats: [0, 0],
          id: fieldName
        };
      }

      return {
        data: aggregations[`${id}_histogram`].buckets,
        interval: aggIntervals[id].interval,
        stats: [aggIntervals[id].min, aggIntervals[id].max],
        type: 'numeric',
        id: fieldName
      };
    } else if (fieldType === _common.KBN_FIELD_TYPES.STRING || fieldType === _common.KBN_FIELD_TYPES.BOOLEAN) {
      return {
        type: fieldType === _common.KBN_FIELD_TYPES.STRING ? 'ordinal' : 'boolean',
        cardinality: fieldType === _common.KBN_FIELD_TYPES.STRING ? aggregations[`${id}_cardinality`].value : 2,
        data: aggregations[`${id}_terms`].buckets,
        id: fieldName
      };
    }

    return {
      type: 'unsupported',
      id: fieldName
    };
  });
  return chartsData;
};

exports.getHistogramsForFields = getHistogramsForFields;