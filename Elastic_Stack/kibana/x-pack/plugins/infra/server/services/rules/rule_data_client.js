"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleDataClient = void 0;

var _server = require("../../../../rule_registry/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createRuleDataClient = ({
  ownerFeatureId,
  registrationContext,
  getStartServices,
  logger,
  ruleDataService
}) => {
  return ruleDataService.initializeIndex({
    feature: ownerFeatureId,
    registrationContext,
    dataset: _server.Dataset.alerts,
    componentTemplateRefs: [],
    componentTemplates: [{
      name: 'mappings',
      mappings: {}
    }]
  });
};

exports.createRuleDataClient = createRuleDataClient;