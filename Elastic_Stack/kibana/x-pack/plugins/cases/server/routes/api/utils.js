"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeHatch = void 0;
exports.wrapError = wrapError;

var _boom = require("@hapi/boom");

var _configSchema = require("@kbn/config-schema");

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Transforms an error into the correct format for a kibana response.
 */


function wrapError(error) {
  let boom;

  if ((0, _common.isCaseError)(error)) {
    boom = error.boomify();
  } else {
    var _error$statusCode;

    const options = {
      statusCode: (_error$statusCode = error.statusCode) !== null && _error$statusCode !== void 0 ? _error$statusCode : 500
    };
    boom = (0, _boom.isBoom)(error) ? error : (0, _boom.boomify)(error, options);
  }

  return {
    body: boom,
    headers: boom.output.headers,
    statusCode: boom.output.statusCode
  };
}

const escapeHatch = _configSchema.schema.object({}, {
  unknowns: 'allow'
});

exports.escapeHatch = escapeHatch;