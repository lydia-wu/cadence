"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmsForClusters = getApmsForClusters;
exports.handleResponse = handleResponse;

var _error_missing_required = require("../error_missing_required");

var _create_apm_query = require("./create_apm_query");

var _metrics = require("../metrics");

var _apm_stats = require("./_apm_stats");

var _get_time_of_last_event = require("./_get_time_of_last_event");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function handleResponse(clusterUuid, response) {
  const {
    apmTotal,
    totalEvents,
    memRss,
    versions
  } = (0, _apm_stats.apmAggResponseHandler)(response); // combine stats

  const stats = {
    totalEvents,
    memRss,
    apms: {
      total: apmTotal
    },
    versions
  };
  return {
    clusterUuid,
    stats
  };
}

function getApmsForClusters(req, apmIndexPattern, clusters) {
  (0, _error_missing_required.checkParam)(apmIndexPattern, 'apmIndexPattern in apms/getApmsForClusters');
  const start = req.payload.timeRange.min;
  const end = req.payload.timeRange.max;
  const config = req.server.config();
  const maxBucketSize = config.get('monitoring.ui.max_bucket_size');
  const cgroup = config.get('monitoring.ui.container.apm.enabled');
  return Promise.all(clusters.map(async cluster => {
    var _cluster$elasticsearc, _cluster$elasticsearc2, _cluster$elasticsearc3;

    const clusterUuid = (_cluster$elasticsearc = (_cluster$elasticsearc2 = cluster.elasticsearch) === null || _cluster$elasticsearc2 === void 0 ? void 0 : (_cluster$elasticsearc3 = _cluster$elasticsearc2.cluster) === null || _cluster$elasticsearc3 === void 0 ? void 0 : _cluster$elasticsearc3.id) !== null && _cluster$elasticsearc !== void 0 ? _cluster$elasticsearc : cluster.cluster_uuid;
    const params = {
      index: apmIndexPattern,
      size: 0,
      ignore_unavailable: true,
      filter_path: _apm_stats.apmAggFilterPath,
      body: {
        query: (0, _create_apm_query.createApmQuery)({
          start,
          end,
          clusterUuid,
          metric: _metrics.ApmMetric.getMetricFields() // override default of BeatMetric.getMetricFields

        }),
        aggs: (0, _apm_stats.apmUuidsAgg)(maxBucketSize, cgroup)
      }
    };
    const {
      callWithRequest
    } = req.server.plugins.elasticsearch.getCluster('monitoring');
    const [response, timeOfLastEvent] = await Promise.all([callWithRequest(req, 'search', params), (0, _get_time_of_last_event.getTimeOfLastEvent)({
      req,
      callWithRequest,
      apmIndexPattern,
      start,
      end,
      clusterUuid
    })]);
    const formattedResponse = handleResponse(clusterUuid, response);
    return { ...formattedResponse,
      config: {
        container: config.get('monitoring.ui.container.apm.enabled')
      },
      stats: { ...formattedResponse.stats,
        timeOfLastEvent
      }
    };
  }));
}