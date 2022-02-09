"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPutRuntimeFieldRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _handle_errors = require("../util/handle_errors");

var _schemas = require("../util/schemas");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerPutRuntimeFieldRoute = (router, getStartServices) => {
  router.put({
    path: '/api/index_patterns/index_pattern/{id}/runtime_field',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        })
      }),
      body: _configSchema.schema.object({
        name: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        }),
        runtimeField: _schemas.runtimeFieldSpecSchema
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
    const {
      name,
      runtimeField
    } = req.body;
    const indexPattern = await indexPatternsService.get(id);
    const oldFieldObject = indexPattern.fields.getByName(name);

    if (oldFieldObject && !oldFieldObject.runtimeField) {
      throw new Error('Only runtime fields can be updated');
    }

    if (oldFieldObject) {
      indexPattern.removeRuntimeField(name);
    }

    indexPattern.addRuntimeField(name, runtimeField);
    await indexPatternsService.updateSavedObject(indexPattern);
    const fieldObject = indexPattern.fields.getByName(name);
    if (!fieldObject) throw new Error(`Could not create a field [name = ${name}].`);
    return res.ok({
      body: {
        field: fieldObject.toSpec(),
        index_pattern: indexPattern.toSpec()
      }
    });
  }));
};

exports.registerPutRuntimeFieldRoute = registerPutRuntimeFieldRoute;