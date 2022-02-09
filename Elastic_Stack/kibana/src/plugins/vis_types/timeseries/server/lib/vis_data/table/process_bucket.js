"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processBucket = processBucket;

var _lodash = require("lodash");

var _last_value_utils = require("../../../../common/last_value_utils");

var _helpers = require("../helpers");

var _build_response_body = require("./build_response_body");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function trendSinceLastBucket(data) {
  if (data.length < 2) {
    return 0;
  }

  const currentBucket = data[data.length - 1];
  const prevBucket = data[data.length - 2];
  const trend = (Number(currentBucket[1]) - Number(prevBucket[1])) / Number(currentBucket[1]);
  return Number.isNaN(trend) ? 0 : trend;
}

function processBucket({
  panel,
  extractFields
}) {
  return async bucket => {
    const resultSeries = await Promise.all((0, _helpers.getActiveSeries)(panel).map(async series => {
      var _result$data;

      const timeseries = (0, _lodash.get)(bucket, `${series.id}.timeseries`);
      const buckets = (0, _lodash.get)(bucket, `${series.id}.buckets`);
      let meta = {};

      if (!timeseries && buckets) {
        meta = (0, _lodash.get)(bucket, `${series.id}.meta`);
        (0, _helpers.overwrite)(bucket, series.id, {
          meta,
          timeseries: {
            buckets: (0, _lodash.get)(bucket, `${series.id}.buckets`)
          }
        });
      }

      const [result] = await (0, _build_response_body.buildTableResponse)({
        bucket,
        panel,
        series,
        meta,
        extractFields
      });
      if (!result) return null;
      const data = (_result$data = result === null || result === void 0 ? void 0 : result.data) !== null && _result$data !== void 0 ? _result$data : [];
      result.slope = trendSinceLastBucket(data);
      result.last = (0, _last_value_utils.getLastValue)(data);
      return result;
    }));
    return {
      key: bucket.key,
      series: resultSeries
    };
  };
}