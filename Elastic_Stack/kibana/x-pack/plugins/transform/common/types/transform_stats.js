"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTransformStats = isTransformStats;

var _constants = require("../constants");

var _shared_imports = require("../shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isTransformState(arg) {
  return typeof arg === 'string' && Object.values(_constants.TRANSFORM_STATE).includes(arg);
}

function isTransformStats(arg) {
  return (0, _shared_imports.isPopulatedObject)(arg, ['state']) && isTransformState(arg.state);
}