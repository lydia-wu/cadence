"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchElasticsearchVersions = fetchElasticsearchVersions;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function fetchElasticsearchVersions(esClient, clusters, index, size, filterQuery) {
  var _response$hits$hits, _response$hits;

  const params = {
    index,
    filter_path: ['hits.hits._source.cluster_stats.nodes.versions', 'hits.hits._index', 'hits.hits._source.cluster_uuid'],
    body: {
      size: clusters.length,
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      query: {
        bool: {
          filter: [{
            terms: {
              cluster_uuid: clusters.map(cluster => cluster.clusterUuid)
            }
          }, {
            term: {
              type: 'cluster_stats'
            }
          }, {
            range: {
              timestamp: {
                gte: 'now-2m'
              }
            }
          }]
        }
      },
      collapse: {
        field: 'cluster_uuid'
      }
    }
  };

  try {
    if (filterQuery) {
      const filterQueryObject = JSON.parse(filterQuery);
      params.body.query.bool.filter.push(filterQueryObject);
    }
  } catch (e) {// meh
  }

  const result = await esClient.search(params);
  const response = result.body;
  return ((_response$hits$hits = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits) !== null && _response$hits$hits !== void 0 ? _response$hits$hits : []).map(hit => {
    var _cluster_stats$nodes$, _cluster_stats, _cluster_stats$nodes;

    const versions = (_cluster_stats$nodes$ = (_cluster_stats = hit._source.cluster_stats) === null || _cluster_stats === void 0 ? void 0 : (_cluster_stats$nodes = _cluster_stats.nodes) === null || _cluster_stats$nodes === void 0 ? void 0 : _cluster_stats$nodes.versions) !== null && _cluster_stats$nodes$ !== void 0 ? _cluster_stats$nodes$ : [];
    return {
      versions,
      clusterUuid: hit._source.cluster_uuid,
      ccs: hit._index.includes(':') ? hit._index.split(':')[0] : undefined
    };
  });
}