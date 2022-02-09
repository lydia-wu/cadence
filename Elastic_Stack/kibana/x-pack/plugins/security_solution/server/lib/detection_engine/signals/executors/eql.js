"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eqlExecutor = void 0;

var _perf_hooks = require("perf_hooks");

var _get_query_filter = require("../../../../../common/detection_engine/get_query_filter");

var _utils = require("../../../../../common/detection_engine/utils");

var _helpers = require("../../migrations/helpers");

var _get_index_version = require("../../routes/index/get_index_version");

var _get_signals_template = require("../../routes/index/get_signals_template");

var _get_input_output_index = require("../get_input_output_index");

var _utils2 = require("../utils");

var _reason_formatters = require("../reason_formatters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const eqlExecutor = async ({
  rule,
  tuple,
  exceptionItems,
  experimentalFeatures,
  services,
  version,
  logger,
  searchAfterSize,
  bulkCreate,
  wrapHits,
  wrapSequences
}) => {
  var _newSignals;

  const result = (0, _utils2.createSearchAfterReturnType)();
  const ruleParams = rule.attributes.params;

  if ((0, _utils.hasLargeValueItem)(exceptionItems)) {
    result.warningMessages.push('Exceptions that use "is in list" or "is not in list" operators are not applied to EQL rules');
    result.warning = true;
  }

  try {
    const signalIndexVersion = await (0, _get_index_version.getIndexVersion)(services.scopedClusterClient.asCurrentUser, ruleParams.outputIndex);

    if (!experimentalFeatures.ruleRegistryEnabled && (0, _helpers.isOutdated)({
      current: signalIndexVersion,
      target: _get_signals_template.MIN_EQL_RULE_INDEX_VERSION
    })) {
      throw new Error(`EQL based rules require an update to version ${_get_signals_template.MIN_EQL_RULE_INDEX_VERSION} of the detection alerts index mapping`);
    }
  } catch (err) {
    if (err.statusCode === 403) {
      throw new Error(`EQL based rules require the user that created it to have the view_index_metadata, read, and write permissions for index: ${ruleParams.outputIndex}`);
    } else {
      throw err;
    }
  }

  const inputIndex = await (0, _get_input_output_index.getInputIndex)({
    experimentalFeatures,
    services,
    version,
    index: ruleParams.index
  });
  const request = (0, _get_query_filter.buildEqlSearchRequest)(ruleParams.query, inputIndex, tuple.from.toISOString(), tuple.to.toISOString(), searchAfterSize, ruleParams.timestampOverride, exceptionItems, ruleParams.eventCategoryOverride);

  const eqlSignalSearchStart = _perf_hooks.performance.now();

  logger.debug(`EQL query request path: ${request.path}, method: ${request.method}, body: ${JSON.stringify(request.body)}`); // TODO: fix this later

  const {
    body: response
  } = await services.scopedClusterClient.asCurrentUser.transport.request(request);

  const eqlSignalSearchEnd = _perf_hooks.performance.now();

  const eqlSearchDuration = (0, _utils2.makeFloatString)(eqlSignalSearchEnd - eqlSignalSearchStart);
  result.searchAfterTimes = [eqlSearchDuration];
  let newSignals;

  if (response.hits.sequences !== undefined) {
    newSignals = wrapSequences(response.hits.sequences, _reason_formatters.buildReasonMessageForEqlAlert);
  } else if (response.hits.events !== undefined) {
    newSignals = wrapHits(response.hits.events, _reason_formatters.buildReasonMessageForEqlAlert);
  } else {
    throw new Error('eql query response should have either `sequences` or `events` but had neither');
  }

  if ((_newSignals = newSignals) !== null && _newSignals !== void 0 && _newSignals.length) {
    const insertResult = await bulkCreate(newSignals);
    result.bulkCreateTimes.push(insertResult.bulkCreateDuration);
    result.createdSignalsCount += insertResult.createdItemsCount;
    result.createdSignals = insertResult.createdItems;
  }

  result.success = true;
  return result;
};

exports.eqlExecutor = eqlExecutor;