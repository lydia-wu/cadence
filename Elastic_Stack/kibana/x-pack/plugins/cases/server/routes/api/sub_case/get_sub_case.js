"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetSubCaseApi = initGetSubCaseApi;

var _configSchema = require("@kbn/config-schema");

var _utils = require("../utils");

var _common = require("../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetSubCaseApi({
  router,
  logger
}) {
  router.get({
    path: _common.SUB_CASE_DETAILS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string(),
        sub_case_id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        includeComments: _configSchema.schema.boolean({
          defaultValue: true
        })
      })
    }
  }, async (context, request, response) => {
    try {
      const client = await context.cases.getCasesClient();
      return response.ok({
        body: await client.subCases.get({
          id: request.params.sub_case_id,
          includeComments: request.query.includeComments
        })
      });
    } catch (error) {
      var _request$query;

      logger.error(`Failed to get sub case in route case id: ${request.params.case_id} sub case id: ${request.params.sub_case_id} include comments: ${(_request$query = request.query) === null || _request$query === void 0 ? void 0 : _request$query.includeComments}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}