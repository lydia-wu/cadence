"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetAllCommentsApi = initGetAllCommentsApi;

var _configSchema = require("@kbn/config-schema");

var _utils = require("../utils");

var _common = require("../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetAllCommentsApi({
  router,
  logger
}) {
  router.get({
    path: _common.CASE_COMMENTS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.maybe(_configSchema.schema.object({
        includeSubCaseComments: _configSchema.schema.maybe(_configSchema.schema.boolean()),
        subCaseId: _configSchema.schema.maybe(_configSchema.schema.string())
      }))
    }
  }, async (context, request, response) => {
    try {
      var _request$query, _request$query2;

      const client = await context.cases.getCasesClient();
      return response.ok({
        body: await client.attachments.getAll({
          caseID: request.params.case_id,
          includeSubCaseComments: (_request$query = request.query) === null || _request$query === void 0 ? void 0 : _request$query.includeSubCaseComments,
          subCaseID: (_request$query2 = request.query) === null || _request$query2 === void 0 ? void 0 : _request$query2.subCaseId
        })
      });
    } catch (error) {
      var _request$query3, _request$query4;

      logger.error(`Failed to get all comments in route case id: ${request.params.case_id} include sub case comments: ${(_request$query3 = request.query) === null || _request$query3 === void 0 ? void 0 : _request$query3.includeSubCaseComments} sub case id: ${(_request$query4 = request.query) === null || _request$query4 === void 0 ? void 0 : _request$query4.subCaseId}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}