"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapHitsFactory = void 0;

var _filter_duplicate_signals = require("../../signals/filter_duplicate_signals");

var _utils = require("../../signals/utils");

var _build_bulk_body = require("./utils/build_bulk_body");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const wrapHitsFactory = ({
  logger,
  ignoreFields,
  mergeStrategy,
  ruleSO,
  spaceId
}) => (events, buildReasonMessage) => {
  try {
    const wrappedDocs = events.map(event => {
      var _ruleSO$attributes$pa;

      return {
        _index: '',
        _id: (0, _utils.generateId)(event._index, event._id, String(event._version), (_ruleSO$attributes$pa = ruleSO.attributes.params.ruleId) !== null && _ruleSO$attributes$pa !== void 0 ? _ruleSO$attributes$pa : ''),
        _source: (0, _build_bulk_body.buildBulkBody)(spaceId, ruleSO, event, mergeStrategy, ignoreFields, true, buildReasonMessage)
      };
    });
    return (0, _filter_duplicate_signals.filterDuplicateSignals)(ruleSO.id, wrappedDocs, true);
  } catch (error) {
    logger.error(error);
    return [];
  }
};

exports.wrapHitsFactory = wrapHitsFactory;