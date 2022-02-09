"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runtimeMappingsSchema = exports.indexPatternTitleSchema = exports.dataVisualizerOverallStatsSchema = exports.dataVisualizerFieldStatsSchema = exports.dataVisualizerFieldHistogramsSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _runtime_field_utils = require("../../../common/utils/runtime_field_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const runtimeMappingsSchema = _configSchema.schema.object({}, {
  unknowns: 'allow',
  validate: v => {
    if (Object.values(v).some(o => !(0, _runtime_field_utils.isRuntimeField)(o))) {
      return 'Invalid runtime field';
    }
  }
});

exports.runtimeMappingsSchema = runtimeMappingsSchema;

const indexPatternTitleSchema = _configSchema.schema.object({
  /** Title of the index pattern for which to return stats. */
  indexPatternTitle: _configSchema.schema.string()
});

exports.indexPatternTitleSchema = indexPatternTitleSchema;

const dataVisualizerFieldHistogramsSchema = _configSchema.schema.object({
  /** Query to match documents in the index. */
  query: _configSchema.schema.any(),

  /** The fields to return histogram data. */
  fields: _configSchema.schema.arrayOf(_configSchema.schema.any()),

  /** Number of documents to be collected in the sample processed on each shard, or -1 for no sampling. */
  samplerShardSize: _configSchema.schema.number(),

  /** Optional search time runtime fields */
  runtimeMappings: runtimeMappingsSchema
});

exports.dataVisualizerFieldHistogramsSchema = dataVisualizerFieldHistogramsSchema;

const dataVisualizerFieldStatsSchema = _configSchema.schema.object({
  /** Query to match documents in the index. */
  query: _configSchema.schema.any(),
  fields: _configSchema.schema.arrayOf(_configSchema.schema.any()),

  /** Number of documents to be collected in the sample processed on each shard, or -1 for no sampling. */
  samplerShardSize: _configSchema.schema.number(),

  /** Name of the time field in the index (optional). */
  timeFieldName: _configSchema.schema.maybe(_configSchema.schema.string()),

  /** Earliest timestamp for search, as epoch ms (optional). */
  earliest: _configSchema.schema.maybe(_configSchema.schema.number()),

  /** Latest timestamp for search, as epoch ms (optional). */
  latest: _configSchema.schema.maybe(_configSchema.schema.number()),

  /** Aggregation interval, in milliseconds, to use for obtaining document counts over time (optional). */
  interval: _configSchema.schema.maybe(_configSchema.schema.number()),

  /** Maximum number of examples to return for text type fields.  */
  maxExamples: _configSchema.schema.number(),

  /** Optional search time runtime fields */
  runtimeMappings: runtimeMappingsSchema
});

exports.dataVisualizerFieldStatsSchema = dataVisualizerFieldStatsSchema;

const dataVisualizerOverallStatsSchema = _configSchema.schema.object({
  /** Query to match documents in the index. */
  query: _configSchema.schema.any(),

  /** Names of aggregatable fields for which to return stats. */
  aggregatableFields: _configSchema.schema.arrayOf(_configSchema.schema.string()),

  /** Names of non-aggregatable fields for which to return stats. */
  nonAggregatableFields: _configSchema.schema.arrayOf(_configSchema.schema.string()),

  /** Number of documents to be collected in the sample processed on each shard, or -1 for no sampling. */
  samplerShardSize: _configSchema.schema.number(),

  /** Name of the time field in the index (optional). */
  timeFieldName: _configSchema.schema.maybe(_configSchema.schema.string()),

  /** Earliest timestamp for search, as epoch ms (optional). */
  earliest: _configSchema.schema.maybe(_configSchema.schema.number()),

  /** Latest timestamp for search, as epoch ms (optional). */
  latest: _configSchema.schema.maybe(_configSchema.schema.number()),

  /** Optional search time runtime fields */
  runtimeMappings: runtimeMappingsSchema
});

exports.dataVisualizerOverallStatsSchema = dataVisualizerOverallStatsSchema;