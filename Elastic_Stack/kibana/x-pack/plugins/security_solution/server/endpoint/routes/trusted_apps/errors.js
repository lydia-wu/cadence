"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrustedAppVersionConflictError = exports.TrustedAppPolicyNotExistsError = exports.TrustedAppNotFoundError = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */


class TrustedAppNotFoundError extends _errors.NotFoundError {
  constructor(id) {
    super(`Trusted Application (${id}) not found`);
  }

}

exports.TrustedAppNotFoundError = TrustedAppNotFoundError;

class TrustedAppPolicyNotExistsError extends Error {
  constructor(name, policyIds) {
    super(`Trusted Application (${name}) is assigned with a policy that no longer exists: ${policyIds.join(', ')}`);
    (0, _defineProperty2.default)(this, "type", 'TrustedApps/PolicyNotFound');
  }

}

exports.TrustedAppPolicyNotExistsError = TrustedAppPolicyNotExistsError;

class TrustedAppVersionConflictError extends Error {
  constructor(id, sourceError) {
    super(`Trusted Application (${id}) has been updated since last retrieved`);
    this.sourceError = sourceError;
  }

}

exports.TrustedAppVersionConflictError = TrustedAppVersionConflictError;