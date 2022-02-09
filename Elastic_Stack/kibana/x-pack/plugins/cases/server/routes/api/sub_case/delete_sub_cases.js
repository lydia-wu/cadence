"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDeleteSubCasesApi = initDeleteSubCasesApi;

var _configSchema = require("@kbn/config-schema");

var _utils = require("../utils");

var _common = require("../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initDeleteSubCasesApi({
  router,
  logger
}) {
  router.delete({
    path: _common.SUB_CASES_PATCH_DEL_URL,
    validate: {
      query: _configSchema.schema.object({
        ids: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    try {
      const client = await context.cases.getCasesClient();
      await client.subCases.delete(request.query.ids);
      return response.noContent();
    } catch (error) {
      logger.error(`Failed to delete sub cases in route ids: ${JSON.stringify(request.query.ids)}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}