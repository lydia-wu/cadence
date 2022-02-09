"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isIndexPattern = isIndexPattern;

var _shared_imports = require("../shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Custom minimal type guard for IndexPattern to check against the attributes used in transforms code.


function isIndexPattern(arg) {
  return (0, _shared_imports.isPopulatedObject)(arg, ['title', 'fields']) && // `getComputedFields` is inherited, so it's not possible to
  // check with `hasOwnProperty` which is used by isPopulatedObject()
  'getComputedFields' in arg && typeof arg.getComputedFields === 'function' && typeof arg.title === 'string' && Array.isArray(arg.fields);
}