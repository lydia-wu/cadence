"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThresholdSignalHistory = void 0;

var _find_previous_threshold_signals = require("./find_previous_threshold_signals");

var _build_signal_history = require("./build_signal_history");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getThresholdSignalHistory = async ({
  from,
  to,
  indexPattern,
  services,
  logger,
  ruleId,
  bucketByFields,
  timestampOverride,
  buildRuleMessage
}) => {
  const {
    searchResult,
    searchErrors
  } = await (0, _find_previous_threshold_signals.findPreviousThresholdSignals)({
    indexPattern,
    from,
    to,
    services,
    logger,
    ruleId,
    bucketByFields,
    timestampOverride,
    buildRuleMessage
  });
  return {
    signalHistory: (0, _build_signal_history.buildThresholdSignalHistory)({
      alerts: searchResult.hits.hits
    }),
    searchErrors
  };
};

exports.getThresholdSignalHistory = getThresholdSignalHistory;