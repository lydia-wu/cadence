"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterSource = void 0;

var _build_event_type_signal = require("../../../signals/build_event_type_signal");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const filterSource = doc => {
  var _doc$_source;

  const event = (0, _build_event_type_signal.buildEventTypeSignal)(doc);
  const docSource = (_doc$_source = doc._source) !== null && _doc$_source !== void 0 ? _doc$_source : {};
  const {
    threshold_result: thresholdResult,
    ...filteredSource
  } = docSource || {
    threshold_result: null
  };
  return { ...filteredSource,
    event
  };
};

exports.filterSource = filterSource;