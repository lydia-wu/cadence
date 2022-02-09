"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = defineRoutes;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defineRoutes(router) {
  router.get({
    path: '/api/timeline/example',
    validate: false
  }, async (context, request, response) => {
    return response.ok({
      body: {
        time: new Date().toISOString()
      }
    });
  });
}