"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineCreateApiKeyRoutes = defineCreateApiKeyRoutes;

var _configSchema = require("@kbn/config-schema");

var _errors = require("../../errors");

var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineCreateApiKeyRoutes({
  router,
  getAuthenticationService
}) {
  router.post({
    path: '/internal/security/api_key',
    validate: {
      body: _configSchema.schema.object({
        name: _configSchema.schema.string(),
        expiration: _configSchema.schema.maybe(_configSchema.schema.string()),
        role_descriptors: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({}, {
          unknowns: 'allow'
        }), {
          defaultValue: {}
        }),
        metadata: _configSchema.schema.maybe(_configSchema.schema.object({}, {
          unknowns: 'allow'
        }))
      })
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    try {
      const apiKey = await getAuthenticationService().apiKeys.create(request, request.body);

      if (!apiKey) {
        return response.badRequest({
          body: {
            message: `API Keys are not available`
          }
        });
      }

      return response.ok({
        body: apiKey
      });
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }));
}