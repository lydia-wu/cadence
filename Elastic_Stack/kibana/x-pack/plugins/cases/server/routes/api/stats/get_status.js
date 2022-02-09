"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetCasesStatusApi = initGetCasesStatusApi;

var _utils = require("../utils");

var _common = require("../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetCasesStatusApi({
  router,
  logger
}) {
  router.get({
    path: _common.CASE_STATUS_URL,
    validate: {
      query: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      const client = await context.cases.getCasesClient();
      return response.ok({
        body: await client.stats.getStatusTotalsByType(request.query)
      });
    } catch (error) {
      logger.error(`Failed to get status stats in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}