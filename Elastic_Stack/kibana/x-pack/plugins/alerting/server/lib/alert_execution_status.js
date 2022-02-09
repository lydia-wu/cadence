"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertExecutionStatusFromRaw = alertExecutionStatusFromRaw;
exports.alertExecutionStatusToRaw = alertExecutionStatusToRaw;
exports.executionStatusFromError = executionStatusFromError;
exports.executionStatusFromState = executionStatusFromState;
exports.getAlertExecutionStatusPending = void 0;

var _error_with_reason = require("./error_with_reason");

var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function executionStatusFromState(state) {
  var _state$alertInstances;

  const instanceIds = Object.keys((_state$alertInstances = state.alertInstances) !== null && _state$alertInstances !== void 0 ? _state$alertInstances : {});
  return {
    lastExecutionDate: new Date(),
    status: instanceIds.length === 0 ? 'ok' : 'active'
  };
}

function executionStatusFromError(error) {
  return {
    lastExecutionDate: new Date(),
    status: 'error',
    error: {
      reason: (0, _error_with_reason.getReasonFromError)(error),
      message: (0, _errors.getEsErrorMessage)(error)
    }
  };
}

function alertExecutionStatusToRaw({
  lastExecutionDate,
  lastDuration,
  status,
  error
}) {
  return {
    lastExecutionDate: lastExecutionDate.toISOString(),
    lastDuration: lastDuration !== null && lastDuration !== void 0 ? lastDuration : 0,
    status,
    // explicitly setting to null (in case undefined) due to partial update concerns
    error: error !== null && error !== void 0 ? error : null
  };
}

function alertExecutionStatusFromRaw(logger, alertId, rawAlertExecutionStatus) {
  if (!rawAlertExecutionStatus) return undefined;
  const {
    lastExecutionDate,
    lastDuration,
    status = 'unknown',
    error
  } = rawAlertExecutionStatus;
  let parsedDateMillis = lastExecutionDate ? Date.parse(lastExecutionDate) : Date.now();

  if (isNaN(parsedDateMillis)) {
    logger.debug(`invalid alertExecutionStatus lastExecutionDate "${lastExecutionDate}" in raw alert ${alertId}`);
    parsedDateMillis = Date.now();
  }

  const executionStatus = {
    status,
    lastExecutionDate: new Date(parsedDateMillis)
  };

  if (null != lastDuration) {
    executionStatus.lastDuration = lastDuration;
  }

  if (error) {
    executionStatus.error = error;
  }

  return executionStatus;
}

const getAlertExecutionStatusPending = lastExecutionDate => ({
  status: 'pending',
  lastExecutionDate,
  error: null
});

exports.getAlertExecutionStatusPending = getAlertExecutionStatusPending;