"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isContinuousTransform = isContinuousTransform;
exports.isLatestTransform = isLatestTransform;
exports.isPivotTransform = isPivotTransform;

var _shared_imports = require("../shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isPivotTransform(transform) {
  return (0, _shared_imports.isPopulatedObject)(transform, ['pivot']);
}

function isLatestTransform(transform) {
  return (0, _shared_imports.isPopulatedObject)(transform, ['latest']);
}

function isContinuousTransform(transform) {
  return (0, _shared_imports.isPopulatedObject)(transform, ['sync']);
}