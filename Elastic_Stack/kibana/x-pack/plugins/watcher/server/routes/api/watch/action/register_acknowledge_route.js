"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAcknowledgeRoute = registerAcknowledgeRoute;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _index = require("../../../../models/watch_status/index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


const paramsSchema = _configSchema.schema.object({
  watchId: _configSchema.schema.string(),
  actionId: _configSchema.schema.string()
});

function acknowledgeAction(dataClient, watchId, actionId) {
  return dataClient.asCurrentUser.watcher.ackWatch({
    watch_id: watchId,
    action_id: actionId
  }).then(({
    body
  }) => body);
}

function registerAcknowledgeRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.put({
    path: '/api/watcher/watch/{watchId}/action/{actionId}/acknowledge',
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, request, response) => {
    const {
      watchId,
      actionId
    } = request.params;

    try {
      const hit = await acknowledgeAction(ctx.core.elasticsearch.client, watchId, actionId);
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