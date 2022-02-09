"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.threatMatchExecutor = void 0;

var _get_input_output_index = require("../get_input_output_index");

var _create_threat_signals = require("../threat_mapping/create_threat_signals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const threatMatchExecutor = async ({
  rule,
  tuple,
  listClient,
  exceptionItems,
  services,
  version,
  searchAfterSize,
  logger,
  eventsTelemetry,
  experimentalFeatures,
  buildRuleMessage,
  bulkCreate,
  wrapHits
}) => {
  var _ruleParams$filters, _ruleParams$threatFil, _ruleParams$concurren, _ruleParams$itemsPerS;

  const ruleParams = rule.attributes.params;
  const inputIndex = await (0, _get_input_output_index.getInputIndex)({
    experimentalFeatures,
    services,
    version,
    index: ruleParams.index
  });
  return (0, _create_threat_signals.createThreatSignals)({
    tuple,
    threatMapping: ruleParams.threatMapping,
    query: ruleParams.query,
    inputIndex,
    type: ruleParams.type,
    filters: (_ruleParams$filters = ruleParams.filters) !== null && _ruleParams$filters !== void 0 ? _ruleParams$filters : [],
    language: ruleParams.language,
    savedId: ruleParams.savedId,
    services,
    exceptionItems,
    listClient,
    logger,
    eventsTelemetry,
    alertId: rule.id,
    outputIndex: ruleParams.outputIndex,
    ruleSO: rule,
    searchAfterSize,
    threatFilters: (_ruleParams$threatFil = ruleParams.threatFilters) !== null && _ruleParams$threatFil !== void 0 ? _ruleParams$threatFil : [],
    threatQuery: ruleParams.threatQuery,
    threatLanguage: ruleParams.threatLanguage,
    buildRuleMessage,
    threatIndex: ruleParams.threatIndex,
    threatIndicatorPath: ruleParams.threatIndicatorPath,
    concurrentSearches: (_ruleParams$concurren = ruleParams.concurrentSearches) !== null && _ruleParams$concurren !== void 0 ? _ruleParams$concurren : 1,
    itemsPerSearch: (_ruleParams$itemsPerS = ruleParams.itemsPerSearch) !== null && _ruleParams$itemsPerS !== void 0 ? _ruleParams$itemsPerS : 9000,
    bulkCreate,
    wrapHits
  });
};

exports.threatMatchExecutor = threatMatchExecutor;