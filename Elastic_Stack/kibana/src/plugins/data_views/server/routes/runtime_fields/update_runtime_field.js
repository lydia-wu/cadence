"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateRuntimeFieldRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _error = require("../../error");

var _handle_errors = require("../util/handle_errors");

var _schemas = require("../util/schemas");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerUpdateRuntimeFieldRoute = (router, getStartServices) => {
  router.post({
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
      }),
      body: _configSchema.schema.object({
        name: _configSchema.schema.never(),
        runtimeField: _configSchema.schema.object({ ..._schemas.runtimeFieldSpec,
          // We need to overwrite the below fields on top of `runtimeFieldSpec`,
          // because some fields would be optional
          type: _configSchema.schema.maybe(_schemas.runtimeFieldSpecTypeSchema)
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
    const runtimeField = req.body.runtimeField;
    const indexPattern = await indexPatternsService.get(id);
    const existingRuntimeField = indexPattern.getRuntimeField(name);

    if (!existingRuntimeField) {
      throw new _error.ErrorIndexPatternFieldNotFound(id, name);
    }

    indexPattern.removeRuntimeField(name);
    indexPattern.addRuntimeField(name, { ...existingRuntimeField,
      ...runtimeField
    });
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

exports.registerUpdateRuntimeFieldRoute = registerUpdateRuntimeFieldRoute;