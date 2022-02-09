"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanaInfo = getKibanaInfo;
exports.handleResponse = handleResponse;

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _calculate_availability = require("../calculate_availability");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore


function handleResponse(resp) {
  var _resp$hits, _resp$hits$hits$, _resp$hits2, _resp$hits2$hits$, _resp$hits2$hits$$_so, _resp$hits$hits$0$_so, _resp$hits3, _resp$hits3$hits$, _resp$hits3$hits$$_so, _resp$hits$hits$0$_so2, _resp$hits4, _resp$hits4$hits$, _mbSource$os$memory$f, _mbSource$os, _mbSource$os$memory, _legacySource$os, _legacySource$os$memo, _mbSource$process$upt, _mbSource$process, _mbSource$process$upt2, _legacySource$process;

  const legacySource = (_resp$hits = resp.hits) === null || _resp$hits === void 0 ? void 0 : (_resp$hits$hits$ = _resp$hits.hits[0]) === null || _resp$hits$hits$ === void 0 ? void 0 : _resp$hits$hits$._source.kibana_stats;
  const mbSource = (_resp$hits2 = resp.hits) === null || _resp$hits2 === void 0 ? void 0 : (_resp$hits2$hits$ = _resp$hits2.hits[0]) === null || _resp$hits2$hits$ === void 0 ? void 0 : (_resp$hits2$hits$$_so = _resp$hits2$hits$._source.kibana) === null || _resp$hits2$hits$$_so === void 0 ? void 0 : _resp$hits2$hits$$_so.stats;
  const kibana = (_resp$hits$hits$0$_so = (_resp$hits3 = resp.hits) === null || _resp$hits3 === void 0 ? void 0 : (_resp$hits3$hits$ = _resp$hits3.hits[0]) === null || _resp$hits3$hits$ === void 0 ? void 0 : (_resp$hits3$hits$$_so = _resp$hits3$hits$._source.kibana) === null || _resp$hits3$hits$$_so === void 0 ? void 0 : _resp$hits3$hits$$_so.kibana) !== null && _resp$hits$hits$0$_so !== void 0 ? _resp$hits$hits$0$_so : legacySource === null || legacySource === void 0 ? void 0 : legacySource.kibana;
  const availabilityTimestamp = (_resp$hits$hits$0$_so2 = (_resp$hits4 = resp.hits) === null || _resp$hits4 === void 0 ? void 0 : (_resp$hits4$hits$ = _resp$hits4.hits[0]) === null || _resp$hits4$hits$ === void 0 ? void 0 : _resp$hits4$hits$._source['@timestamp']) !== null && _resp$hits$hits$0$_so2 !== void 0 ? _resp$hits$hits$0$_so2 : legacySource === null || legacySource === void 0 ? void 0 : legacySource.timestamp;

  if (!availabilityTimestamp) {
    throw new _error_missing_required.MissingRequiredError('timestamp');
  }

  return (0, _lodash.merge)(kibana, {
    availability: (0, _calculate_availability.calculateAvailability)(availabilityTimestamp),
    os_memory_free: (_mbSource$os$memory$f = mbSource === null || mbSource === void 0 ? void 0 : (_mbSource$os = mbSource.os) === null || _mbSource$os === void 0 ? void 0 : (_mbSource$os$memory = _mbSource$os.memory) === null || _mbSource$os$memory === void 0 ? void 0 : _mbSource$os$memory.free_in_bytes) !== null && _mbSource$os$memory$f !== void 0 ? _mbSource$os$memory$f : legacySource === null || legacySource === void 0 ? void 0 : (_legacySource$os = legacySource.os) === null || _legacySource$os === void 0 ? void 0 : (_legacySource$os$memo = _legacySource$os.memory) === null || _legacySource$os$memo === void 0 ? void 0 : _legacySource$os$memo.free_in_bytes,
    uptime: (_mbSource$process$upt = mbSource === null || mbSource === void 0 ? void 0 : (_mbSource$process = mbSource.process) === null || _mbSource$process === void 0 ? void 0 : (_mbSource$process$upt2 = _mbSource$process.uptime) === null || _mbSource$process$upt2 === void 0 ? void 0 : _mbSource$process$upt2.ms) !== null && _mbSource$process$upt !== void 0 ? _mbSource$process$upt : legacySource === null || legacySource === void 0 ? void 0 : (_legacySource$process = legacySource.process) === null || _legacySource$process === void 0 ? void 0 : _legacySource$process.uptime_in_millis
  });
}

function getKibanaInfo(req, kbnIndexPattern, {
  clusterUuid,
  kibanaUuid
}) {
  (0, _error_missing_required.checkParam)(kbnIndexPattern, 'kbnIndexPattern in getKibanaInfo');
  const params = {
    index: kbnIndexPattern,
    size: 1,
    ignore_unavailable: true,
    filter_path: ['hits.hits._source.kibana_stats.kibana', 'hits.hits._source.kibana.kibana', 'hits.hits._source.kibana_stats.os.memory.free_in_bytes', 'hits.hits._source.kibana.stats.os.memory.free_in_bytes', 'hits.hits._source.kibana_stats.process.uptime_in_millis', 'hits.hits._source.kibana.stats.process.uptime.ms', 'hits.hits._source.kibana_stats.timestamp', 'hits.hits._source.@timestamp'],
    body: {
      query: {
        bool: {
          filter: [{
            term: {
              cluster_uuid: clusterUuid
            }
          }, {
            term: {
              'kibana_stats.kibana.uuid': kibanaUuid
            }
          }]
        }
      },
      collapse: {
        field: 'kibana_stats.kibana.uuid'
      },
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }]
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(handleResponse);
}