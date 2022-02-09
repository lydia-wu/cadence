"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidateIntervalError = exports.UIError = exports.FieldNotFoundError = exports.AggNotSupportedInMode = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable max-classes-per-file */
class UIError extends Error {
  constructor(message) {
    super(message);
  }

  get name() {
    return this.constructor.name;
  }

  get errBody() {
    return this.message;
  }

}

exports.UIError = UIError;

class FieldNotFoundError extends UIError {
  constructor(name) {
    super(_i18n.i18n.translate('visTypeTimeseries.errors.fieldNotFound', {
      defaultMessage: `Field "{field}" not found`,
      values: {
        field: name
      }
    }));
  }

}

exports.FieldNotFoundError = FieldNotFoundError;

class ValidateIntervalError extends UIError {
  constructor() {
    super(_i18n.i18n.translate('visTypeTimeseries.errors.maxBucketsExceededErrorMessage', {
      defaultMessage: 'Your query attempted to fetch too much data. Reducing the time range or changing the interval used usually fixes the issue.'
    }));
  }

}

exports.ValidateIntervalError = ValidateIntervalError;

class AggNotSupportedInMode extends UIError {
  constructor(metricType, timeRangeMode) {
    super(_i18n.i18n.translate('visTypeTimeseries.wrongAggregationErrorMessage', {
      defaultMessage: 'The aggregation {metricType} is not supported in {timeRangeMode} mode',
      values: {
        metricType,
        timeRangeMode
      }
    }));
  }

}

exports.AggNotSupportedInMode = AggNotSupportedInMode;