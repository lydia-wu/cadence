"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleAssetType = exports.ruleAssetSavedObjectType = exports.ruleAssetSavedObjectMappings = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ruleAssetSavedObjectType = 'security-rule';
exports.ruleAssetSavedObjectType = ruleAssetSavedObjectType;
const ruleAssetSavedObjectMappings = {
  dynamic: false,
  properties: {
    name: {
      type: 'keyword'
    },
    rule_id: {
      type: 'keyword'
    },
    version: {
      type: 'long'
    }
  }
};
exports.ruleAssetSavedObjectMappings = ruleAssetSavedObjectMappings;
const ruleAssetType = {
  name: ruleAssetSavedObjectType,
  hidden: false,
  namespaceType: 'agnostic',
  mappings: ruleAssetSavedObjectMappings
};
exports.ruleAssetType = ruleAssetType;