"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataVisualizer = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _common = require("../../../common");

var _get_histogram_for_fields = require("./get_histogram_for_fields");

var _check_fields_exist = require("./check_fields_exist");

var _constants = require("./constants");

var _get_field_examples = require("./get_field_examples");

var _get_fields_stats = require("./get_fields_stats");

var _error_wrapper = require("../../utils/error_wrapper");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class DataVisualizer {
  constructor(client) {
    (0, _defineProperty2.default)(this, "_client", void 0);
    this._client = client;
  } // Obtains overall stats on the fields in the supplied index pattern, returning an object
  // containing the total document count, and four arrays showing which of the supplied
  // aggregatable and non-aggregatable fields do or do not exist in documents.
  // Sampling will be used if supplied samplerShardSize > 0.


  async getOverallStats(indexPatternTitle, query, aggregatableFields, nonAggregatableFields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings) {
    const stats = {
      totalCount: 0,
      aggregatableExistsFields: [],
      aggregatableNotExistsFields: [],
      nonAggregatableExistsFields: [],
      nonAggregatableNotExistsFields: [],
      errors: []
    }; // To avoid checking for the existence of too many aggregatable fields in one request,
    // split the check into multiple batches (max 200 fields per request).

    const batches = [[]];
    (0, _lodash.each)(aggregatableFields, field => {
      let lastArray = (0, _lodash.last)(batches);

      if (lastArray.length === _constants.AGGREGATABLE_EXISTS_REQUEST_BATCH_SIZE) {
        lastArray = [];
        batches.push(lastArray);
      }

      lastArray.push(field);
    });
    await Promise.all(batches.map(async fields => {
      try {
        const batchStats = await this.checkAggregatableFieldsExist(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, undefined, runtimeMappings); // Total count will be returned with each batch of fields. Just overwrite.

        stats.totalCount = batchStats.totalCount; // Add to the lists of fields which do and do not exist.

        stats.aggregatableExistsFields.push(...batchStats.aggregatableExistsFields);
        stats.aggregatableNotExistsFields.push(...batchStats.aggregatableNotExistsFields);
      } catch (e) {
        // If index not found, no need to proceed with other batches
        if (e.statusCode === 404) {
          throw e;
        }

        stats.errors.push((0, _error_wrapper.wrapError)(e));
      }
    }));
    await Promise.all(nonAggregatableFields.map(async field => {
      try {
        const existsInDocs = await this.checkNonAggregatableFieldExists(indexPatternTitle, query, field, timeFieldName, earliestMs, latestMs, runtimeMappings);
        const fieldData = {
          fieldName: field,
          existsInDocs,
          stats: {}
        };

        if (existsInDocs === true) {
          stats.nonAggregatableExistsFields.push(fieldData);
        } else {
          stats.nonAggregatableNotExistsFields.push(fieldData);
        }
      } catch (e) {
        stats.errors.push((0, _error_wrapper.wrapError)(e));
      }
    }));
    return stats;
  } // Obtains binned histograms for supplied list of fields. The statistics for each field in the
  // returned array depend on the type of the field (keyword, number, date etc).
  // Sampling will be used if supplied samplerShardSize > 0.


  async getHistogramsForFields(indexPatternTitle, query, fields, samplerShardSize, runtimeMappings) {
    return await (0, _get_histogram_for_fields.getHistogramsForFields)(this._client, indexPatternTitle, query, fields, samplerShardSize, runtimeMappings);
  } // Obtains statistics for supplied list of fields. The statistics for each field in the
  // returned array depend on the type of the field (keyword, number, date etc).
  // Sampling will be used if supplied samplerShardSize > 0.


  async getStatsForFields(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, intervalMs, maxExamples, runtimeMappings) {
    // Batch up fields by type, getting stats for multiple fields at a time.
    const batches = [];
    const batchedFields = {};
    (0, _lodash.each)(fields, field => {
      if (field.fieldName === undefined) {
        // undefined fieldName is used for a document count request.
        // getDocumentCountStats requires timeField - don't add to batched requests if not defined
        if (timeFieldName !== undefined) {
          batches.push([field]);
        }
      } else {
        const fieldType = field.type;

        if (batchedFields[fieldType] === undefined) {
          batchedFields[fieldType] = [[]];
        }

        let lastArray = (0, _lodash.last)(batchedFields[fieldType]);

        if (lastArray.length === _constants.FIELDS_REQUEST_BATCH_SIZE) {
          lastArray = [];
          batchedFields[fieldType].push(lastArray);
        }

        lastArray.push(field);
      }
    });
    (0, _lodash.each)(batchedFields, lists => {
      batches.push(...lists);
    });
    let results = [];
    await Promise.all(batches.map(async batch => {
      let batchStats = [];
      const first = batch[0];

      switch (first.type) {
        case _common.JOB_FIELD_TYPES.NUMBER:
          // undefined fieldName is used for a document count request.
          if (first.fieldName !== undefined) {
            batchStats = await this.getNumericFieldsStats(indexPatternTitle, query, batch, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings);
          } else {
            // Will only ever be one document count card,
            // so no value in batching up the single request.
            if (intervalMs !== undefined) {
              const stats = await this.getDocumentCountStats(indexPatternTitle, query, timeFieldName, earliestMs, latestMs, intervalMs, runtimeMappings);
              batchStats.push(stats);
            }
          }

          break;

        case _common.JOB_FIELD_TYPES.KEYWORD:
        case _common.JOB_FIELD_TYPES.IP:
          batchStats = await this.getStringFieldsStats(indexPatternTitle, query, batch, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings);
          break;

        case _common.JOB_FIELD_TYPES.DATE:
          batchStats = await this.getDateFieldsStats(indexPatternTitle, query, batch, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings);
          break;

        case _common.JOB_FIELD_TYPES.BOOLEAN:
          batchStats = await this.getBooleanFieldsStats(indexPatternTitle, query, batch, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings);
          break;

        case _common.JOB_FIELD_TYPES.TEXT:
        default:
          // Use an exists filter on the the field name to get
          // examples of the field, so cannot batch up.
          await Promise.all(batch.map(async field => {
            const stats = await this.getFieldExamples(indexPatternTitle, query, field.fieldName, timeFieldName, earliestMs, latestMs, maxExamples, runtimeMappings);
            batchStats.push(stats);
          }));
          break;
      }

      results = [...results, ...batchStats];
    }));
    return results;
  }

  async checkAggregatableFieldsExist(indexPatternTitle, query, aggregatableFields, samplerShardSize, timeFieldName, earliestMs, latestMs, datafeedConfig, runtimeMappings) {
    return await (0, _check_fields_exist.checkAggregatableFieldsExist)(this._client, indexPatternTitle, query, aggregatableFields, samplerShardSize, timeFieldName, earliestMs, latestMs, datafeedConfig, runtimeMappings);
  }

  async checkNonAggregatableFieldExists(indexPatternTitle, query, field, timeFieldName, earliestMs, latestMs, runtimeMappings) {
    return await (0, _check_fields_exist.checkNonAggregatableFieldExists)(this._client, indexPatternTitle, query, field, timeFieldName, earliestMs, latestMs, runtimeMappings);
  }

  async getDocumentCountStats(indexPatternTitle, query, timeFieldName, earliestMs, latestMs, intervalMs, runtimeMappings) {
    return await (0, _get_fields_stats.getDocumentCountStats)(this._client, indexPatternTitle, query, timeFieldName, earliestMs, latestMs, intervalMs, runtimeMappings);
  }

  async getNumericFieldsStats(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings) {
    return await (0, _get_fields_stats.getNumericFieldsStats)(this._client, indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings);
  }

  async getStringFieldsStats(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings) {
    return await (0, _get_fields_stats.getStringFieldsStats)(this._client, indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings);
  }

  async getDateFieldsStats(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings) {
    return await (0, _get_fields_stats.getDateFieldsStats)(this._client, indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings);
  }

  async getBooleanFieldsStats(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings) {
    return await (0, _get_fields_stats.getBooleanFieldsStats)(this._client, indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings);
  }

  async getFieldExamples(indexPatternTitle, query, field, timeFieldName, earliestMs, latestMs, maxExamples, runtimeMappings) {
    return await (0, _get_field_examples.getFieldExamples)(this._client, indexPatternTitle, query, field, timeFieldName, earliestMs, latestMs, maxExamples, runtimeMappings);
  }

}

exports.DataVisualizer = DataVisualizer;