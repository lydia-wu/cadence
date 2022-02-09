"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatHostTacticsData = void 0;

var _fp = require("lodash/fp");

var _common = require("../../../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const formatHostTacticsData = buckets => buckets.reduce((acc, bucket) => {
  return [...acc, ...(0, _fp.getOr)([], 'technique.buckets', bucket).map(t => ({
    node: {
      _id: bucket.key + t.key,
      [_common.HostTacticsFields.hits]: t.doc_count,
      [_common.HostTacticsFields.riskScore]: (0, _fp.getOr)(0, 'risk_score.value', t),
      [_common.HostTacticsFields.tactic]: bucket.key,
      [_common.HostTacticsFields.technique]: t.key
    },
    cursor: {
      value: bucket.key + t.key,
      tiebreaker: null
    }
  }))];
}, []); // buckets.map((bucket) => ({
//   node: {
//     _id: bucket.key,
//     [HostTacticsFields.hits]: bucket.doc_count,
//     [HostTacticsFields.riskScore]: getOr(0, 'risk_score.value', bucket),
//     [HostTacticsFields.tactic]: bucket.key,
//     [HostTacticsFields.technique]: getOr(0, 'technique.buckets[0].key', bucket),
//   },
//   cursor: {
//     value: bucket.key,
//     tiebreaker: null,
//   },
// }));


exports.formatHostTacticsData = formatHostTacticsData;