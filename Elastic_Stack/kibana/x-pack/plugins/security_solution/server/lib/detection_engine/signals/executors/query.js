"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryExecutor = void 0;

var _get_filter = require("../get_filter");

var _get_input_output_index = require("../get_input_output_index");

var _search_after_bulk_create = require("../search_after_bulk_create");

var _reason_formatters = require("../reason_formatters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const queryExecutor = async ({
  rule,
  tuple,
  listClient,
  exceptionItems,
  experimentalFeatures,
  services,
  version,
  searchAfterSize,
  logger,
  eventsTelemetry,
  buildRuleMessage,
  bulkCreate,
  wrapHits
}) => {
  const ruleParams = rule.attributes.params;
  const inputIndex = await (0, _get_input_output_index.getInputIndex)({
    experimentalFeatures,
    services,
    version,
    index: ruleParams.index
  });
  const esFilter = await (0, _get_filter.getFilter)({
    type: ruleParams.type,
    filters: ruleParams.filters,
    language: ruleParams.language,
    query: ruleParams.query,
    savedId: ruleParams.savedId,
    services,
    index: inputIndex,
    lists: exceptionItems
  });
  return (0, _search_after_bulk_create.searchAfterAndBulkCreate)({
    tuple,
    listClient,
    exceptionsList: exceptionItems,
    ruleSO: rule,
    services,
    logger,
    eventsTelemetry,
    id: rule.id,
    inputIndexPattern: inputIndex,
    signalsIndex: ruleParams.outputIndex,
    filter: esFilter,
    pageSize: searchAfterSize,
    buildReasonMessage: _reason_formatters.buildReasonMessageForQueryAlert,
    buildRuleMessage,
    bulkCreate,
    wrapHits
  });
};

exports.queryExecutor = queryExecutor;