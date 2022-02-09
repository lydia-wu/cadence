"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createResultObject = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createResultObject = state => {
  const result = {
    bulkCreateTimes: [],
    createdSignalsCount: 0,
    createdSignals: [],
    errors: [],
    lastLookbackDate: undefined,
    searchAfterTimes: [],
    state,
    success: true,
    warning: false,
    warningMessages: []
  };
  return result;
};

exports.createResultObject = createResultObject;