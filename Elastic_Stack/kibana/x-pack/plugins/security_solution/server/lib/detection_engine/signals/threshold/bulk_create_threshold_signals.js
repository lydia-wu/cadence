"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformThresholdResultsToEcs = exports.bulkCreateThresholdSignals = void 0;

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _fp = require("lodash/fp");

var _setValue = _interopRequireDefault(require("set-value"));

var _utils = require("../utils");

var _reason_formatters = require("../reason_formatters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTransformedHits = (results, inputIndex, startedAt, from, logger, threshold, ruleId, filter, timestampOverride, signalHistory) => {
  if (results.aggregations == null) {
    return [];
  }

  const aggParts = threshold.field.length ? (0, _utils.getThresholdAggregationParts)(results.aggregations) : {
    field: null,
    index: 0,
    name: 'threshold_0'
  };

  if (!aggParts) {
    return [];
  }

  const getCombinations = (buckets, i, field) => {
    return buckets.reduce((acc, bucket) => {
      if (i < threshold.field.length - 1) {
        const nextLevelIdx = i + 1;
        const nextLevelAggParts = (0, _utils.getThresholdAggregationParts)(bucket, nextLevelIdx);

        if (nextLevelAggParts == null) {
          throw new Error('Unable to parse aggregation.');
        }

        const nextLevelPath = `['${nextLevelAggParts.name}']['buckets']`;
        const nextBuckets = (0, _fp.get)(nextLevelPath, bucket);
        const combinations = getCombinations(nextBuckets, nextLevelIdx, nextLevelAggParts.field);
        combinations.forEach(val => {
          const el = {
            terms: [{
              field,
              value: bucket.key
            }, ...val.terms].filter(term => term.field != null),
            cardinality: val.cardinality,
            maxTimestamp: val.maxTimestamp,
            docCount: val.docCount
          };
          acc.push(el);
        });
      } else {
        var _threshold$cardinalit;

        const el = {
          terms: [{
            field,
            value: bucket.key
          }].filter(term => term.field != null),
          cardinality: (_threshold$cardinalit = threshold.cardinality) !== null && _threshold$cardinalit !== void 0 && _threshold$cardinalit.length ? [{
            field: threshold.cardinality[0].field,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            value: bucket.cardinality_count.value
          }] : undefined,
          maxTimestamp: bucket.max_timestamp.value_as_string,
          docCount: bucket.doc_count
        };
        acc.push(el);
      }

      return acc;
    }, []);
  };

  return getCombinations(results.aggregations[aggParts.name].buckets, 0, aggParts.field).reduce((acc, bucket) => {
    const termsHash = (0, _utils.getThresholdTermsHash)(bucket.terms);
    const signalHit = signalHistory[termsHash];
    const source = {
      [_ruleDataUtils.TIMESTAMP]: bucket.maxTimestamp,
      ...bucket.terms.reduce((termAcc, term) => {
        if (!term.field.startsWith('signal.')) {
          // We don't want to overwrite `signal.*` fields.
          // See: https://github.com/elastic/kibana/issues/83218
          return { ...termAcc,
            [term.field]: term.value
          };
        }

        return termAcc;
      }, {}),
      threshold_result: {
        terms: bucket.terms,
        cardinality: bucket.cardinality,
        count: bucket.docCount,
        // Store `from` in the signal so that we know the lower bound for the
        // threshold set in the timeline search. The upper bound will always be
        // the `original_time` of the signal (the timestamp of the latest event
        // in the set).
        from: (signalHit === null || signalHit === void 0 ? void 0 : signalHit.lastSignalTimestamp) != null ? new Date(signalHit.lastSignalTimestamp) : from
      }
    };
    acc.push({
      _index: inputIndex,
      _id: (0, _utils.calculateThresholdSignalUuid)(ruleId, startedAt, threshold.field, bucket.terms.map(term => term.value).sort().join(',')),
      _source: source
    });
    return acc;
  }, []);
};

const transformThresholdResultsToEcs = (results, inputIndex, startedAt, from, filter, logger, threshold, ruleId, timestampOverride, signalHistory) => {
  const transformedHits = getTransformedHits(results, inputIndex, startedAt, from, logger, threshold, ruleId, filter, timestampOverride, signalHistory);
  const thresholdResults = { ...results,
    hits: { ...results.hits,
      hits: transformedHits
    }
  };
  delete thresholdResults.aggregations; // delete because no longer needed

  (0, _setValue.default)(thresholdResults, 'results.hits.total', transformedHits.length);
  return thresholdResults;
};

exports.transformThresholdResultsToEcs = transformThresholdResultsToEcs;

const bulkCreateThresholdSignals = async params => {
  const ruleParams = params.ruleSO.attributes.params;
  const thresholdResults = params.someResult;
  const ecsResults = transformThresholdResultsToEcs(thresholdResults, params.inputIndexPattern.join(','), params.startedAt, params.from, params.filter, params.logger, ruleParams.threshold, ruleParams.ruleId, ruleParams.timestampOverride, params.signalHistory);
  return params.bulkCreate(params.wrapHits(ecsResults.hits.hits, _reason_formatters.buildReasonMessageForThresholdAlert));
};

exports.bulkCreateThresholdSignals = bulkCreateThresholdSignals;