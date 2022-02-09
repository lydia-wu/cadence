"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPipelineStatsAggregation = getPipelineStatsAggregation;

var _create_query = require("../create_query");

var _metrics = require("../metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function scalarCounterAggregation(field, fieldPath, ephemeralIdField, maxBucketSize) {
  const fullPath = `${fieldPath}.${field}`;
  const byEphemeralIdName = `${field}_temp_by_ephemeral_id`;
  const sumName = `${field}_total`;
  const aggs = {};
  aggs[byEphemeralIdName] = {
    terms: {
      field: ephemeralIdField,
      size: maxBucketSize
    },
    aggs: {
      stats: {
        stats: {
          field: fullPath
        }
      },
      difference: {
        bucket_script: {
          script: 'params.max - params.min',
          buckets_path: {
            min: 'stats.min',
            max: 'stats.max'
          }
        }
      }
    }
  };
  aggs[sumName] = {
    sum_bucket: {
      buckets_path: `${byEphemeralIdName}>difference`
    }
  };
  return aggs;
}

function nestedVertices(maxBucketSize) {
  const fieldPath = 'logstash_stats.pipelines.vertices';
  const ephemeralIdField = 'logstash_stats.pipelines.vertices.pipeline_ephemeral_id';
  return {
    nested: {
      path: 'logstash_stats.pipelines.vertices'
    },
    aggs: {
      vertex_id: {
        terms: {
          field: 'logstash_stats.pipelines.vertices.id',
          size: maxBucketSize
        },
        aggs: { ...scalarCounterAggregation('events_in', fieldPath, ephemeralIdField, maxBucketSize),
          ...scalarCounterAggregation('events_out', fieldPath, ephemeralIdField, maxBucketSize),
          ...scalarCounterAggregation('duration_in_millis', fieldPath, ephemeralIdField, maxBucketSize)
        }
      }
    }
  };
}

function createScopedAgg(pipelineId, pipelineHash, agg) {
  return {
    pipelines: {
      nested: {
        path: 'logstash_stats.pipelines'
      },
      aggs: {
        scoped: {
          filter: {
            bool: {
              filter: [{
                term: {
                  'logstash_stats.pipelines.id': pipelineId
                }
              }, {
                term: {
                  'logstash_stats.pipelines.hash': pipelineHash
                }
              }]
            }
          },
          aggs: agg
        }
      }
    }
  };
}

function fetchPipelineLatestStats(query, logstashIndexPattern, pipelineId, version, maxBucketSize, callWithRequest, req) {
  const params = {
    index: logstashIndexPattern,
    size: 0,
    ignore_unavailable: true,
    filter_path: ['aggregations.pipelines.scoped.vertices.vertex_id.buckets.key', 'aggregations.pipelines.scoped.vertices.vertex_id.buckets.events_in_total', 'aggregations.pipelines.scoped.vertices.vertex_id.buckets.events_out_total', 'aggregations.pipelines.scoped.vertices.vertex_id.buckets.duration_in_millis_total', 'aggregations.pipelines.scoped.total_processor_duration_stats'],
    body: {
      query,
      aggs: createScopedAgg(pipelineId, version.hash, {
        vertices: nestedVertices(maxBucketSize),
        total_processor_duration_stats: {
          stats: {
            field: 'logstash_stats.pipelines.events.duration_in_millis'
          }
        }
      })
    }
  };
  return callWithRequest(req, 'search', params);
}

function getPipelineStatsAggregation({
  req,
  logstashIndexPattern,
  timeseriesInterval,
  clusterUuid,
  pipelineId,
  version
}) {
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const filters = [{
    nested: {
      path: 'logstash_stats.pipelines',
      query: {
        bool: {
          must: [{
            term: {
              'logstash_stats.pipelines.hash': version.hash
            }
          }, {
            term: {
              'logstash_stats.pipelines.id': pipelineId
            }
          }]
        }
      }
    }
  }];
  const start = version.lastSeen - timeseriesInterval * 1000;
  const end = version.lastSeen;
  const query = (0, _create_query.createQuery)({
    types: ['stats', 'logstash_stats'],
    start,
    end,
    metric: _metrics.LogstashMetric.getMetricFields(),
    clusterUuid,
    filters
  });
  const config = req.server.config();
  return fetchPipelineLatestStats(query, logstashIndexPattern, pipelineId, version, // @ts-ignore not undefined, need to get correct config
  // https://github.com/elastic/kibana/issues/112146
  config.get('monitoring.ui.max_bucket_size'), callWithRequest, req);
}