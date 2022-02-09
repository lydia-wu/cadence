"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElasticsearchDeprecationsProvider = void 0;

var _scripting_disabled_deprecation = require("./scripting_disabled_deprecation");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getElasticsearchDeprecationsProvider = () => {
  return {
    getDeprecations: async context => {
      return [...(await (0, _scripting_disabled_deprecation.getScriptingDisabledDeprecations)({
        esClient: context.esClient
      }))];
    }
  };
};

exports.getElasticsearchDeprecationsProvider = getElasticsearchDeprecationsProvider;