"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapHitsFactory = void 0;

var _utils = require("./utils");

var _build_bulk_body = require("./build_bulk_body");

var _filter_duplicate_signals = require("./filter_duplicate_signals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const wrapHitsFactory = ({
  ruleSO,
  signalsIndex,
  mergeStrategy,
  ignoreFields
}) => (events, buildReasonMessage) => {
  const wrappedDocs = events.flatMap(doc => {
    var _ruleSO$attributes$pa;

    return [{
      _index: signalsIndex,
      _id: (0, _utils.generateId)(doc._index, doc._id, String(doc._version), (_ruleSO$attributes$pa = ruleSO.attributes.params.ruleId) !== null && _ruleSO$attributes$pa !== void 0 ? _ruleSO$attributes$pa : ''),
      _source: (0, _build_bulk_body.buildBulkBody)(ruleSO, doc, mergeStrategy, ignoreFields, buildReasonMessage)
    }];
  });
  return (0, _filter_duplicate_signals.filterDuplicateSignals)(ruleSO.id, wrappedDocs, false);
};

exports.wrapHitsFactory = wrapHitsFactory;