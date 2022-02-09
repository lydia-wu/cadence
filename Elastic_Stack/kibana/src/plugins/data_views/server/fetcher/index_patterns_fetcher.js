"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPatternsFetcher = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _lib = require("./lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class IndexPatternsFetcher {
  constructor(elasticsearchClient, allowNoIndices = false) {
    (0, _defineProperty2.default)(this, "elasticsearchClient", void 0);
    (0, _defineProperty2.default)(this, "allowNoIndices", void 0);
    this.elasticsearchClient = elasticsearchClient;
    this.allowNoIndices = allowNoIndices;
  }
  /**
   *  Get a list of field objects for an index pattern that may contain wildcards
   *
   *  @param {Object} [options]
   *  @property {String} options.pattern The index pattern
   *  @property {Number} options.metaFields The list of underscore prefixed fields that should
   *                                        be left in the field list (all others are removed).
   *  @return {Promise<Array<Fields>>}
   */


  async getFieldsForWildcard(options) {
    const {
      pattern,
      metaFields,
      fieldCapsOptions,
      type,
      rollupIndex
    } = options;
    const patternList = Array.isArray(pattern) ? pattern : pattern.split(',');
    let patternListActive = patternList; // if only one pattern, don't bother with validation. We let getFieldCapabilities fail if the single pattern is bad regardless

    if (patternList.length > 1) {
      patternListActive = await this.validatePatternListActive(patternList);
    }

    const fieldCapsResponse = await (0, _lib.getFieldCapabilities)(this.elasticsearchClient, // if none of the patterns are active, pass the original list to get an error
    patternListActive.length > 0 ? patternListActive : patternList, metaFields, {
      allow_no_indices: fieldCapsOptions ? fieldCapsOptions.allow_no_indices : this.allowNoIndices
    });

    if (type === 'rollup' && rollupIndex) {
      const rollupFields = [];
      const rollupIndexCapabilities = (0, _lib.getCapabilitiesForRollupIndices)((await this.elasticsearchClient.rollup.getRollupIndexCaps({
        index: rollupIndex
      })).body)[rollupIndex].aggs;
      const fieldCapsResponseObj = (0, _lodash.keyBy)(fieldCapsResponse, 'name'); // Keep meta fields

      metaFields.forEach(field => fieldCapsResponseObj[field] && rollupFields.push(fieldCapsResponseObj[field]));
      return (0, _lib.mergeCapabilitiesWithFields)(rollupIndexCapabilities, fieldCapsResponseObj, rollupFields);
    }

    return fieldCapsResponse;
  }
  /**
   *  Get a list of field objects for a time pattern
   *
   *  @param {Object} [options={}]
   *  @property {String} options.pattern The moment compatible time pattern
   *  @property {Number} options.lookBack The number of indices we will pull mappings for
   *  @property {Number} options.metaFields The list of underscore prefixed fields that should
   *                                        be left in the field list (all others are removed).
   *  @return {Promise<Array<Fields>>}
   */


  async getFieldsForTimePattern(options) {
    const {
      pattern,
      lookBack,
      metaFields
    } = options;
    const {
      matches
    } = await (0, _lib.resolveTimePattern)(this.elasticsearchClient, pattern);
    const indices = matches.slice(0, lookBack);

    if (indices.length === 0) {
      throw (0, _lib.createNoMatchingIndicesError)(pattern);
    }

    return await (0, _lib.getFieldCapabilities)(this.elasticsearchClient, indices, metaFields);
  }
  /**
   *  Returns an index pattern list of only those index pattern strings in the given list that return indices
   *
   *  @param patternList string[]
   *  @return {Promise<string[]>}
   */


  async validatePatternListActive(patternList) {
    const result = await Promise.all(patternList.map(pattern => {
      if (pattern.startsWith('-')) {
        return Promise.resolve({
          body: {
            count: 1
          }
        });
      }

      return this.elasticsearchClient.count({
        index: pattern
      });
    }).map(p => p.catch(e => {
      if (e.body.error.type === 'index_not_found_exception') {
        return {
          body: {
            count: 0
          }
        };
      }

      throw e;
    })));
    return result.reduce((acc, {
      body: {
        count
      }
    }, patternListIndex) => count > 0 ? [...acc, patternList[patternListIndex]] : acc, []);
  }

}

exports.IndexPatternsFetcher = IndexPatternsFetcher;