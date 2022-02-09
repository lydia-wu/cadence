"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerManageDefaultIndexPatternRoutes = void 0;

var _configSchema = require("@kbn/config-schema");

var _handle_errors = require("./util/handle_errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerManageDefaultIndexPatternRoutes = (router, getStartServices) => {
  router.get({
    path: '/api/index_patterns/default',
    validate: {}
  }, (0, _handle_errors.handleErrors)(async (ctx, req, res) => {
    const savedObjectsClient = ctx.core.savedObjects.client;
    const elasticsearchClient = ctx.core.elasticsearch.client.asCurrentUser;
    const [,, {
      indexPatternsServiceFactory
    }] = await getStartServices();
    const indexPatternsService = await indexPatternsServiceFactory(savedObjectsClient, elasticsearchClient);
    const defaultIndexPatternId = await indexPatternsService.getDefaultId();
    return res.ok({
      body: {
        index_pattern_id: defaultIndexPatternId
      }
    });
  }));
  router.post({
    path: '/api/index_patterns/default',
    validate: {
      body: _configSchema.schema.object({
        index_pattern_id: _configSchema.schema.nullable(_configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        })),
        force: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    }
  }, (0, _handle_errors.handleErrors)(async (ctx, req, res) => {
    const savedObjectsClient = ctx.core.savedObjects.client;
    const elasticsearchClient = ctx.core.elasticsearch.client.asCurrentUser;
    const [,, {
      indexPatternsServiceFactory
    }] = await getStartServices();
    const indexPatternsService = await indexPatternsServiceFactory(savedObjectsClient, elasticsearchClient);
    const newDefaultId = req.body.index_pattern_id;
    const force = req.body.force;
    await indexPatternsService.setDefault(newDefaultId, force);
    return res.ok({
      body: {
        acknowledged: true
      }
    });
  }));
};

exports.registerManageDefaultIndexPatternRoutes = registerManageDefaultIndexPatternRoutes;