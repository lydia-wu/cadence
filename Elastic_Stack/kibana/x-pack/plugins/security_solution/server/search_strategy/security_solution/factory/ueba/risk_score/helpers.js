"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatRiskScoreData = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const formatRiskScoreData = buckets => buckets.map(bucket => ({
  node: {
    _id: bucket.key,
    host_name: bucket.key,
    risk_score: (0, _fp.getOr)(0, 'risk_score.value', bucket),
    risk_keyword: (0, _fp.getOr)(0, 'risk_keyword.buckets[0].key', bucket)
  },
  cursor: {
    value: bucket.key,
    tiebreaker: null
  }
}));

exports.formatRiskScoreData = formatRiskScoreData;