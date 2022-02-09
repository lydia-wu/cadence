"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClusterDataCheck = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createClusterDataCheck = () => {
  let clusterHasUserData = false;
  return async function doesClusterHaveUserData(esClient, log) {
    if (!clusterHasUserData) {
      try {
        const indices = await esClient.cat.indices({
          format: 'json',
          h: ['index', 'docs.count']
        });
        clusterHasUserData = indices.body.some(indexCount => {
          var _indexCount$index, _indexCount$index2;

          const isInternalIndex = ((_indexCount$index = indexCount.index) === null || _indexCount$index === void 0 ? void 0 : _indexCount$index.startsWith('.')) || ((_indexCount$index2 = indexCount.index) === null || _indexCount$index2 === void 0 ? void 0 : _indexCount$index2.startsWith('kibana_sample_'));
          return !isInternalIndex && parseInt(indexCount['docs.count'], 10) > 0;
        });
      } catch (e) {
        log.warn(`Error encountered while checking cluster for user data: ${e}`);
        clusterHasUserData = false;
      }
    }

    return clusterHasUserData;
  };
};

exports.createClusterDataCheck = createClusterDataCheck;