"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerHasUserIndexPatternRoute = void 0;

var _handle_errors = require("./util/handle_errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerHasUserIndexPatternRoute = (router, getStartServices) => {
  router.get({
    path: '/api/index_patterns/has_user_index_pattern',
    validate: {}
  }, router.handleLegacyErrors((0, _handle_errors.handleErrors)(async (ctx, req, res) => {
    const savedObjectsClient = ctx.core.savedObjects.client;
    const elasticsearchClient = ctx.core.elasticsearch.client.asCurrentUser;
    const [,, {
      indexPatternsServiceFactory
    }] = await getStartServices();
    const indexPatternsService = await indexPatternsServiceFactory(savedObjectsClient, elasticsearchClient);
    return res.ok({
      body: {
        result: await indexPatternsService.hasUserDataView()
      }
    });
  })));
};

exports.registerHasUserIndexPatternRoute = registerHasUserIndexPatternRoute;