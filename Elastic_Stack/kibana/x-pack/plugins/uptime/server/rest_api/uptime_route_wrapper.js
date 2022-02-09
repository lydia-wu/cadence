"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uptimeRouteWrapper = void 0;

var _lib = require("../lib/lib");

var _router = require("../../../../../src/core/server/http/router");

var _common = require("../../../observability/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


const uptimeRouteWrapper = uptimeRoute => ({ ...uptimeRoute,
  options: {
    tags: ['access:uptime-read', ...(uptimeRoute !== null && uptimeRoute !== void 0 && uptimeRoute.writeAccess ? ['access:uptime-write'] : [])]
  },
  handler: async (context, request, response) => {
    const {
      client: esClient
    } = context.core.elasticsearch;
    const {
      client: savedObjectsClient
    } = context.core.savedObjects;
    const isInspectorEnabled = await context.core.uiSettings.client.get(_common.enableInspectEsQueries);
    const uptimeEsClient = (0, _lib.createUptimeESClient)({
      request,
      savedObjectsClient,
      esClient: esClient.asCurrentUser
    });

    if (isInspectorEnabled) {
      _lib.inspectableEsQueriesMap.set(request, []);
    }

    const res = await uptimeRoute.handler({
      uptimeEsClient,
      savedObjectsClient,
      context,
      request,
      response
    });

    if (res instanceof _router.KibanaResponse) {
      return res;
    }

    return response.ok({
      body: { ...res,
        ...(isInspectorEnabled ? {
          _inspect: _lib.inspectableEsQueriesMap.get(request)
        } : {})
      }
    });
  }
});

exports.uptimeRouteWrapper = uptimeRouteWrapper;