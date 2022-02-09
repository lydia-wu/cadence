"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShardAllocation = getShardAllocation;
exports.handleResponse = handleResponse;

var _error_missing_required = require("../../error_missing_required");

var _create_query = require("../../create_query");

var _metrics = require("../../metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore


function handleResponse(response) {
  var _response$hits;

  const hits = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits;

  if (!hits) {
    return [];
  } // deduplicate any shards from earlier days with the same cluster state state_uuid


  const uniqueShards = new Set(); // map into object with shard and source propertiesd

  return hits.reduce((shards, hit) => {
    const legacyShard = hit._source.shard;
    const mbShard = hit._source.elasticsearch;

    if (legacyShard || mbShard) {
      var _mbShard$index$name, _mbShard$index, _mbShard$shard$number, _mbShard$shard, _mbShard$shard$primar, _mbShard$shard2, _ref, _mbShard$shard$reloca, _mbShard$shard3, _mbShard$shard3$reloc, _mbShard$node$id, _mbShard$node;

      const index = (_mbShard$index$name = mbShard === null || mbShard === void 0 ? void 0 : (_mbShard$index = mbShard.index) === null || _mbShard$index === void 0 ? void 0 : _mbShard$index.name) !== null && _mbShard$index$name !== void 0 ? _mbShard$index$name : legacyShard === null || legacyShard === void 0 ? void 0 : legacyShard.index;
      const shardNumber = (_mbShard$shard$number = mbShard === null || mbShard === void 0 ? void 0 : (_mbShard$shard = mbShard.shard) === null || _mbShard$shard === void 0 ? void 0 : _mbShard$shard.number) !== null && _mbShard$shard$number !== void 0 ? _mbShard$shard$number : legacyShard === null || legacyShard === void 0 ? void 0 : legacyShard.shard;
      const primary = (_mbShard$shard$primar = mbShard === null || mbShard === void 0 ? void 0 : (_mbShard$shard2 = mbShard.shard) === null || _mbShard$shard2 === void 0 ? void 0 : _mbShard$shard2.primary) !== null && _mbShard$shard$primar !== void 0 ? _mbShard$shard$primar : legacyShard === null || legacyShard === void 0 ? void 0 : legacyShard.primary;
      const relocatingNode = (_ref = (_mbShard$shard$reloca = mbShard === null || mbShard === void 0 ? void 0 : (_mbShard$shard3 = mbShard.shard) === null || _mbShard$shard3 === void 0 ? void 0 : (_mbShard$shard3$reloc = _mbShard$shard3.relocating_node) === null || _mbShard$shard3$reloc === void 0 ? void 0 : _mbShard$shard3$reloc.id) !== null && _mbShard$shard$reloca !== void 0 ? _mbShard$shard$reloca : legacyShard === null || legacyShard === void 0 ? void 0 : legacyShard.relocating_node) !== null && _ref !== void 0 ? _ref : null;
      const node = (_mbShard$node$id = mbShard === null || mbShard === void 0 ? void 0 : (_mbShard$node = mbShard.node) === null || _mbShard$node === void 0 ? void 0 : _mbShard$node.id) !== null && _mbShard$node$id !== void 0 ? _mbShard$node$id : legacyShard === null || legacyShard === void 0 ? void 0 : legacyShard.node; // note: if the request is for a node, then it's enough to deduplicate without primary, but for indices it displays both

      const shardId = `${index}-${shardNumber}-${primary}-${relocatingNode}-${node}`;

      if (!uniqueShards.has(shardId)) {
        var _legacyShard$state, _mbShard$shard4; // @ts-ignore


        shards.push({
          index,
          node,
          primary,
          relocating_node: relocatingNode,
          shard: shardNumber,
          state: (_legacyShard$state = legacyShard === null || legacyShard === void 0 ? void 0 : legacyShard.state) !== null && _legacyShard$state !== void 0 ? _legacyShard$state : mbShard === null || mbShard === void 0 ? void 0 : (_mbShard$shard4 = mbShard.shard) === null || _mbShard$shard4 === void 0 ? void 0 : _mbShard$shard4.state
        });
        uniqueShards.add(shardId);
      }
    }

    return shards;
  }, []);
}

function getShardAllocation(req, esIndexPattern, {
  shardFilter,
  stateUuid,
  showSystemIndices = false
}) {
  (0, _error_missing_required.checkParam)(esIndexPattern, 'esIndexPattern in elasticsearch/getShardAllocation');
  const filters = [{
    bool: {
      should: [{
        term: {
          state_uuid: stateUuid
        }
      }, {
        term: {
          'elasticsearch.cluster.state.id': stateUuid
        }
      }]
    }
  }, shardFilter];

  if (!showSystemIndices) {
    filters.push({
      bool: {
        must_not: [{
          prefix: {
            'shard.index': '.'
          }
        }, {
          prefix: {
            'elasticsearch.index.name': '.'
          }
        }]
      }
    });
  }

  const config = req.server.config();
  const clusterUuid = req.params.clusterUuid;

  const metric = _metrics.ElasticsearchMetric.getMetricFields();

  const params = {
    index: esIndexPattern,
    size: config.get('monitoring.ui.max_bucket_size'),
    ignore_unavailable: true,
    body: {
      query: (0, _create_query.createQuery)({
        types: ['shard', 'shards'],
        clusterUuid,
        metric,
        filters
      })
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(handleResponse);
}