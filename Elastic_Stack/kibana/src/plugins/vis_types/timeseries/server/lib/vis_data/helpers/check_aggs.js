"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAggSupported = isAggSupported;

var _errors = require("../../../../common/errors");

var _agg_utils = require("../../../../common/agg_utils");

var _enums = require("../../../../common/enums");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isAggSupported(metrics) {
  const parentPipelineAggs = (0, _agg_utils.getAggsByType)(agg => agg.id)[_agg_utils.AGG_TYPE.PARENT_PIPELINE];

  const metricTypes = metrics.filter(metric => parentPipelineAggs.includes(metric.type) || metric.type === _enums.TSVB_METRIC_TYPES.SERIES_AGG);

  if (metricTypes.length) {
    throw new _errors.AggNotSupportedInMode(metricTypes.map(metric => metric.type).join(', '), _enums.TIME_RANGE_DATA_MODES.ENTIRE_TIME_RANGE);
  }
}