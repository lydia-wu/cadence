"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterDuplicateSignals = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const filterDuplicateSignals = (ruleId, signals, isRuleRegistryEnabled) => {
  if (!isRuleRegistryEnabled) {
    return signals.filter(doc => {
      var _doc$_source$signal;

      return !((_doc$_source$signal = doc._source.signal) !== null && _doc$_source$signal !== void 0 && _doc$_source$signal.ancestors.some(ancestor => ancestor.rule === ruleId));
    });
  } else {
    return signals.filter(doc => !doc._source['kibana.alert.ancestors'].some(ancestor => ancestor.rule === ruleId));
  }
};

exports.filterDuplicateSignals = filterDuplicateSignals;