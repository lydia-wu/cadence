"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildBulkBody = void 0;

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _build_rule = require("../../../signals/build_rule");

var _strategies = require("../../../signals/source_fields_merging/strategies");

var _build_alert = require("./build_alert");

var _filter_source = require("./filter_source");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isSourceDoc = hit => {
  return hit._source != null;
};
/**
 * Formats the search_after result for insertion into the signals index. We first create a
 * "best effort" merged "fields" with the "_source" object, then build the signal object,
 * then the event object, and finally we strip away any additional temporary data that was added
 * such as the "threshold_result".
 * @param ruleSO The rule saved object to build overrides
 * @param doc The SignalSourceHit with "_source", "fields", and additional data such as "threshold_result"
 * @returns The body that can be added to a bulk call for inserting the signal.
 */


const buildBulkBody = (spaceId, ruleSO, doc, mergeStrategy, ignoreFields, applyOverrides, buildReasonMessage) => {
  var _mergedDoc$_source;

  const mergedDoc = (0, _strategies.getMergeStrategy)(mergeStrategy)({
    doc,
    ignoreFields
  });
  const rule = applyOverrides ? (0, _build_rule.buildRuleWithOverrides)(ruleSO, (_mergedDoc$_source = mergedDoc._source) !== null && _mergedDoc$_source !== void 0 ? _mergedDoc$_source : {}) : (0, _build_rule.buildRuleWithoutOverrides)(ruleSO);
  const filteredSource = (0, _filter_source.filterSource)(mergedDoc);
  const timestamp = new Date().toISOString();
  const reason = buildReasonMessage({
    mergedDoc,
    rule
  });

  if (isSourceDoc(mergedDoc)) {
    return { ...filteredSource,
      ...(0, _build_alert.buildAlert)([mergedDoc], rule, spaceId, reason),
      ...(0, _build_alert.additionalAlertFields)(mergedDoc),
      [_ruleDataUtils.TIMESTAMP]: timestamp
    };
  }

  throw Error('Error building alert from source document.');
};

exports.buildBulkBody = buildBulkBody;