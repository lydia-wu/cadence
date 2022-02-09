"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRuntimeFieldRoute = void 0;

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
const registerCreateRuntimeFieldRoute = (router, getStartServices) => {
  router.post({
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

    if (indexPattern.fields.getByName(name)) {
      throw new Error(`Field [name = ${name}] already exists.`);
    }

    indexPattern.addRuntimeField(name, runtimeField);
    const addedField = indexPattern.fields.getByName(name);
    if (!addedField) throw new Error(`Could not create a field [name = ${name}].`);
    await indexPatternsService.updateSavedObject(indexPattern);
    const savedField = indexPattern.fields.getByName(name);
    if (!savedField) throw new Error(`Could not create a field [name = ${name}].`);
    return res.ok({
      body: {
        field: savedField.toSpec(),
        index_pattern: indexPattern.toSpec()
      }
    });
  }));
};

exports.registerCreateRuntimeFieldRoute = registerCreateRuntimeFieldRoute;