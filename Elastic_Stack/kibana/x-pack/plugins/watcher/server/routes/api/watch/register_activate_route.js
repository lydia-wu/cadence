"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerActivateRoute = registerActivateRoute;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _index = require("../../../models/watch_status/index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


function activateWatch(dataClient, watchId) {
  return dataClient.asCurrentUser.watcher.activateWatch({
    watch_id: watchId
  }).then(({
    body
  }) => body);
}

const paramsSchema = _configSchema.schema.object({
  watchId: _configSchema.schema.string()
});

function registerActivateRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.put({
    path: '/api/watcher/watch/{watchId}/activate',
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, request, response) => {
    const {
      watchId
    } = request.params;

    try {
      const hit = await activateWatch(ctx.core.elasticsearch.client, watchId);
      const watchStatusJson = (0, _lodash.get)(hit, 'status');
      const json = {
        id: watchId,
        watchStatusJson
      };

      const watchStatus = _index.WatchStatus.fromUpstreamJson(json);

      return response.ok({
        body: {
          watchStatus: watchStatus.downstreamJson
        }
      });
    } catch (e) {
      var _e$meta, _e$meta$body;

      if ((e === null || e === void 0 ? void 0 : e.statusCode) === 404 && (_e$meta = e.meta) !== null && _e$meta !== void 0 && (_e$meta$body = _e$meta.body) !== null && _e$meta$body !== void 0 && _e$meta$body.error) {
        e.meta.body.error.reason = `Watch with id = ${watchId} not found`;
      }

      return handleEsError({
        error: e,
        response
      });
    }
  }));
}