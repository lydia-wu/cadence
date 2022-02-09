"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.thresholdExecutor = void 0;

var _utils = require("../../../../../common/detection_engine/utils");

var _get_filter = require("../get_filter");

var _get_input_output_index = require("../get_input_output_index");

var _threshold = require("../threshold");

var _utils2 = require("../utils");

var _build_signal_history = require("../threshold/build_signal_history");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const thresholdExecutor = async ({
  rule,
  tuple,
  exceptionItems,
  experimentalFeatures,
  services,
  version,
  logger,
  buildRuleMessage,
  startedAt,
  state,
  bulkCreate,
  wrapHits
}) => {
  let result = (0, _utils2.createSearchAfterReturnType)();
  const ruleParams = rule.attributes.params; // Get state or build initial state (on upgrade)

  const {
    signalHistory,
    searchErrors: previousSearchErrors
  } = state.initialized ? {
    signalHistory: state.signalHistory,
    searchErrors: []
  } : await (0, _threshold.getThresholdSignalHistory)({
    indexPattern: ['*'],
    // TODO: get outputIndex?
    from: tuple.from.toISOString(),
    to: tuple.to.toISOString(),
    services,
    logger,
    ruleId: ruleParams.ruleId,
    bucketByFields: ruleParams.threshold.field,
    timestampOverride: ruleParams.timestampOverride,
    buildRuleMessage
  });

  if (!state.initialized) {
    // Clean up any signal history that has fallen outside the window
    const toDelete = [];

    for (const [hash, entry] of Object.entries(signalHistory)) {
      if (entry.lastSignalTimestamp < tuple.from.valueOf()) {
        toDelete.push(hash);
      }
    }

    for (const hash of toDelete) {
      delete signalHistory[hash];
    }
  }

  if ((0, _utils.hasLargeValueItem)(exceptionItems)) {
    result.warningMessages.push('Exceptions that use "is in list" or "is not in list" operators are not applied to Threshold rules');
    result.warning = true;
  }

  const inputIndex = await (0, _get_input_output_index.getInputIndex)({
    experimentalFeatures,
    services,
    version,
    index: ruleParams.index
  });
  const bucketFilters = await (0, _threshold.getThresholdBucketFilters)({
    signalHistory,
    timestampOverride: ruleParams.timestampOverride
  });
  const esFilter = await (0, _get_filter.getFilter)({
    type: ruleParams.type,
    filters: ruleParams.filters ? ruleParams.filters.concat(bucketFilters) : bucketFilters,
    language: ruleParams.language,
    query: ruleParams.query,
    savedId: ruleParams.savedId,
    services,
    index: inputIndex,
    lists: exceptionItems
  });
  const {
    searchResult: thresholdResults,
    searchErrors,
    searchDuration: thresholdSearchDuration
  } = await (0, _threshold.findThresholdSignals)({
    inputIndexPattern: inputIndex,
    from: tuple.from.toISOString(),
    to: tuple.to.toISOString(),
    services,
    logger,
    filter: esFilter,
    threshold: ruleParams.threshold,
    timestampOverride: ruleParams.timestampOverride,
    buildRuleMessage
  });
  const {
    success,
    bulkCreateDuration,
    createdItemsCount,
    createdItems,
    errors
  } = await (0, _threshold.bulkCreateThresholdSignals)({
    someResult: thresholdResults,
    ruleSO: rule,
    filter: esFilter,
    services,
    logger,
    inputIndexPattern: inputIndex,
    signalsIndex: ruleParams.outputIndex,
    startedAt,
    from: tuple.from.toDate(),
    signalHistory,
    bulkCreate,
    wrapHits
  });
  result = (0, _utils2.mergeReturns)([result, (0, _utils2.createSearchAfterReturnTypeFromResponse)({
    searchResult: thresholdResults,
    timestampOverride: ruleParams.timestampOverride
  }), (0, _utils2.createSearchAfterReturnType)({
    success,
    errors: [...errors, ...previousSearchErrors, ...searchErrors],
    createdSignalsCount: createdItemsCount,
    createdSignals: createdItems,
    bulkCreateTimes: bulkCreateDuration ? [bulkCreateDuration] : [],
    searchAfterTimes: [thresholdSearchDuration]
  })]);
  const createdAlerts = createdItems.map(alert => {
    const {
      _id,
      _index,
      ...source
    } = alert;
    return {
      _id,
      _index,
      _source: { ...source
      }
    };
  });
  const newSignalHistory = (0, _build_signal_history.buildThresholdSignalHistory)({
    alerts: createdAlerts
  });
  return { ...result,
    state: { ...state,
      initialized: true,
      signalHistory: { ...signalHistory,
        ...newSignalHistory
      }
    }
  };
};

exports.thresholdExecutor = thresholdExecutor;