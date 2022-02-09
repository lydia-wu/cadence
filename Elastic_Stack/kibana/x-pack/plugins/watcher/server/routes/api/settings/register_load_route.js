"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLoadRoute = registerLoadRoute;

var _index = require("../../../models/settings/index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


function fetchClusterSettings(client) {
  return client.asCurrentUser.cluster.getSettings({
    include_defaults: true,
    filter_path: '**.xpack.notification'
  }).then(({
    body
  }) => body);
}

function registerLoadRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: '/api/watcher/settings',
    validate: false
  }, license.guardApiRoute(async (ctx, request, response) => {
    try {
      const settings = await fetchClusterSettings(ctx.core.elasticsearch.client);
      return response.ok({
        body: _index.Settings.fromUpstreamJson(settings).downstreamJson
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response
      });
    }
  }));
}