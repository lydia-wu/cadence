"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetRuntimeFieldRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _error = require("../../error");

var _handle_errors = require("../util/handle_errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerGetRuntimeFieldRoute = (router, getStartServices) => {
  router.get({
    path: '/api/index_patterns/index_pattern/{id}/runtime_field/{name}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        }),
        name: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
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
    const id = req.params.id;
    const name = req.params.name;
    const indexPattern = await indexPatternsService.get(id);
    const field = indexPattern.fields.getByName(name);

    if (!field) {
      throw new _error.ErrorIndexPatternFieldNotFound(id, name);
    }

    if (!field.runtimeField) {
      throw new Error('Only runtime fields can be retrieved.');
    }

    return res.ok({
      body: {
        field: field.toSpec(),
        runtimeField: indexPattern.getRuntimeField(name)
      }
    });
  }));
};

exports.registerGetRuntimeFieldRoute = registerGetRuntimeFieldRoute;