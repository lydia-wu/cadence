"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEscapeValue = createEscapeValue;

var _constants = require("./constants");

var _formula_checks = require("./formula_checks");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function createEscapeValue(quoteValues, escapeFormulas) {
  return function escapeValue(val) {
    if (val && typeof val === 'string') {
      const formulasEscaped = escapeFormulas && (0, _formula_checks.cellHasFormulas)(val) ? "'" + val : val;

      if (quoteValues && _constants.nonAlphaNumRE.test(formulasEscaped)) {
        return `"${formulasEscaped.replace(_constants.allDoubleQuoteRE, '""')}"`;
      }
    }

    return val == null ? '' : val.toString();
  };
}