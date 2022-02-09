"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNumericFieldForDatatable = isNumericFieldForDatatable;

var _transpose_helpers = require("./transpose_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isValidNumber(value) {
  return typeof value === 'number' || value == null;
}

function isNumericFieldForDatatable(currentData, accessor) {
  var _currentData$columns$;

  const isNumeric = (currentData === null || currentData === void 0 ? void 0 : (_currentData$columns$ = currentData.columns.find(col => col.id === accessor || (0, _transpose_helpers.getOriginalId)(col.id) === accessor)) === null || _currentData$columns$ === void 0 ? void 0 : _currentData$columns$.meta.type) === 'number';
  return isNumeric && (currentData === null || currentData === void 0 ? void 0 : currentData.rows.every(row => {
    const val = row[accessor];
    return isValidNumber(val) || Array.isArray(val) && val.every(isValidNumber);
  }));
}