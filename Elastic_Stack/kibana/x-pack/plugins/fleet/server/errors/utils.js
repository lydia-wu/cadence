"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isESClientError = isESClientError;
exports.isElasticsearchVersionConflictError = isElasticsearchVersionConflictError;

var _errors = require("@elastic/elasticsearch/lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isESClientError(error) {
  return error instanceof _errors.ResponseError;
}

function isElasticsearchVersionConflictError(error) {
  return isESClientError(error) && error.meta.statusCode === 409;
}