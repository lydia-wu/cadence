"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleAssetSavedObjectsClientFactory = void 0;

var _rule_asset_saved_object_mappings = require("./rule_asset_saved_object_mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_PAGE_SIZE = 100;

const ruleAssetSavedObjectsClientFactory = savedObjectsClient => {
  return {
    find: options => savedObjectsClient.find({ ...options,
      type: _rule_asset_saved_object_mappings.ruleAssetSavedObjectType
    }),
    all: async () => {
      const finder = savedObjectsClient.createPointInTimeFinder({
        perPage: DEFAULT_PAGE_SIZE,
        type: _rule_asset_saved_object_mappings.ruleAssetSavedObjectType
      });
      const responses = [];

      for await (const response of finder.find()) {
        responses.push(...response.saved_objects.map(so => so));
      }

      await finder.close();
      return responses;
    }
  };
};

exports.ruleAssetSavedObjectsClientFactory = ruleAssetSavedObjectsClientFactory;