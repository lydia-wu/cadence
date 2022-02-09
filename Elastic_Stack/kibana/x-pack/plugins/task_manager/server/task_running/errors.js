"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EphemeralTaskRejectedDueToCapacityError = void 0;
exports.isEphemeralTaskRejectedDueToCapacityError = isEphemeralTaskRejectedDueToCapacityError;
exports.isUnrecoverableError = isUnrecoverableError;
exports.throwUnrecoverableError = throwUnrecoverableError;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Unrecoverable


const CODE_UNRECOVERABLE = 'TaskManager/unrecoverable';
const code = Symbol('TaskManagerErrorCode');

class EphemeralTaskRejectedDueToCapacityError extends Error {
  constructor(message, task) {
    super(message);
    (0, _defineProperty2.default)(this, "_task", void 0);
    this._task = task;
  }

  get task() {
    return this._task;
  }

}

exports.EphemeralTaskRejectedDueToCapacityError = EphemeralTaskRejectedDueToCapacityError;

function isTaskManagerError(error) {
  return Boolean(error && error[code]);
}

function isUnrecoverableError(error) {
  return isTaskManagerError(error) && error[code] === CODE_UNRECOVERABLE;
}

function throwUnrecoverableError(error) {
  error[code] = CODE_UNRECOVERABLE;
  throw error;
}

function isEphemeralTaskRejectedDueToCapacityError(error) {
  return Boolean(error && error instanceof EphemeralTaskRejectedDueToCapacityError);
}