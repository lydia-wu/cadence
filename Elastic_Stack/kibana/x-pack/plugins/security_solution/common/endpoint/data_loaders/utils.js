"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapErrorIfNeeded = exports.wrapErrorAndRejectPromise = exports.EndpointDataLoadingError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class EndpointDataLoadingError extends Error {
  constructor(message, meta) {
    super(message);
    this.meta = meta;
  }

}

exports.EndpointDataLoadingError = EndpointDataLoadingError;

const wrapErrorIfNeeded = error => error instanceof EndpointDataLoadingError ? error : new EndpointDataLoadingError(error.message, error); // Use it in Promise's `.catch()` as `.catch(wrapErrorAndRejectPromise)`


exports.wrapErrorIfNeeded = wrapErrorIfNeeded;

const wrapErrorAndRejectPromise = error => Promise.reject(wrapErrorIfNeeded(error));

exports.wrapErrorAndRejectPromise = wrapErrorAndRejectPromise;