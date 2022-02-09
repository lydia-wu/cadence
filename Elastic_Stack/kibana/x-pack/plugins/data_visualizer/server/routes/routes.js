"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataVisualizerRoutes = dataVisualizerRoutes;

var _schemas = require("./schemas");

var _data_visualizer = require("../models/data_visualizer");

var _error_wrapper = require("../utils/error_wrapper");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getOverallStats(client, indexPatternTitle, query, aggregatableFields, nonAggregatableFields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings) {
  const dv = new _data_visualizer.DataVisualizer(client);
  return dv.getOverallStats(indexPatternTitle, query, aggregatableFields, nonAggregatableFields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings);
}

function getStatsForFields(client, indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, interval, maxExamples, runtimeMappings) {
  const dv = new _data_visualizer.DataVisualizer(client);
  return dv.getStatsForFields(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, interval, maxExamples, runtimeMappings);
}

function getHistogramsForFields(client, indexPatternTitle, query, fields, samplerShardSize, runtimeMappings) {
  const dv = new _data_visualizer.DataVisualizer(client);
  return dv.getHistogramsForFields(indexPatternTitle, query, fields, samplerShardSize, runtimeMappings);
}
/**
 * Routes for the index data visualizer.
 */


function dataVisualizerRoutes(coreSetup) {
  const router = coreSetup.http.createRouter();
  /**
   * @apiGroup DataVisualizer
   *
   * @api {post} /internal/data_visualizer/get_field_histograms/:indexPatternTitle Get histograms for fields
   * @apiName GetHistogramsForFields
   * @apiDescription Returns the histograms on a list fields in the specified index pattern.
   *
   * @apiSchema (params) indexPatternTitleSchema
   * @apiSchema (body) dataVisualizerFieldHistogramsSchema
   *
   * @apiSuccess {Object} fieldName histograms by field, keyed on the name of the field.
   */

  router.post({
    path: '/internal/data_visualizer/get_field_histograms/{indexPatternTitle}',
    validate: {
      params: _schemas.indexPatternTitleSchema,
      body: _schemas.dataVisualizerFieldHistogramsSchema
    }
  }, async (context, request, response) => {
    try {
      const {
        params: {
          indexPatternTitle
        },
        body: {
          query,
          fields,
          samplerShardSize,
          runtimeMappings
        }
      } = request;
      const results = await getHistogramsForFields(context.core.elasticsearch.client, indexPatternTitle, query, fields, samplerShardSize, runtimeMappings);
      return response.ok({
        body: results
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  });
  /**
   * @apiGroup DataVisualizer
   *
   * @api {post} /internal/data_visualizer/get_field_stats/:indexPatternTitle Get stats for fields
   * @apiName GetStatsForFields
   * @apiDescription Returns the stats on individual fields in the specified index pattern.
   *
   * @apiSchema (params) indexPatternTitleSchema
   * @apiSchema (body) dataVisualizerFieldStatsSchema
   *
   * @apiSuccess {Object} fieldName stats by field, keyed on the name of the field.
   */

  router.post({
    path: '/internal/data_visualizer/get_field_stats/{indexPatternTitle}',
    validate: {
      params: _schemas.indexPatternTitleSchema,
      body: _schemas.dataVisualizerFieldStatsSchema
    }
  }, async (context, request, response) => {
    try {
      const {
        params: {
          indexPatternTitle
        },
        body: {
          query,
          fields,
          samplerShardSize,
          timeFieldName,
          earliest,
          latest,
          interval,
          maxExamples,
          runtimeMappings
        }
      } = request;
      const results = await getStatsForFields(context.core.elasticsearch.client, indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliest, latest, interval, maxExamples, runtimeMappings);
      return response.ok({
        body: results
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  });
  /**
   * @apiGroup DataVisualizer
   *
   * @api {post} /internal/data_visualizer/get_overall_stats/:indexPatternTitle Get overall stats
   * @apiName GetOverallStats
   * @apiDescription Returns the top level overall stats for the specified index pattern.
   *
   * @apiSchema (params) indexPatternTitleSchema
   * @apiSchema (body) dataVisualizerOverallStatsSchema
   *
   * @apiSuccess {number} totalCount total count of documents.
   * @apiSuccess {Object} aggregatableExistsFields stats on aggregatable fields that exist in documents.
   * @apiSuccess {Object} aggregatableNotExistsFields stats on aggregatable fields that do not exist in documents.
   * @apiSuccess {Object} nonAggregatableExistsFields stats on non-aggregatable fields that exist in documents.
   * @apiSuccess {Object} nonAggregatableNotExistsFields stats on non-aggregatable fields that do not exist in documents.
   */

  router.post({
    path: '/internal/data_visualizer/get_overall_stats/{indexPatternTitle}',
    validate: {
      params: _schemas.indexPatternTitleSchema,
      body: _schemas.dataVisualizerOverallStatsSchema
    }
  }, async (context, request, response) => {
    try {
      const {
        params: {
          indexPatternTitle
        },
        body: {
          query,
          aggregatableFields,
          nonAggregatableFields,
          samplerShardSize,
          timeFieldName,
          earliest,
          latest,
          runtimeMappings
        }
      } = request;
      const results = await getOverallStats(context.core.elasticsearch.client, indexPatternTitle, query, aggregatableFields, nonAggregatableFields, samplerShardSize, timeFieldName, earliest, latest, runtimeMappings);
      return response.ok({
        body: results
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  });
}