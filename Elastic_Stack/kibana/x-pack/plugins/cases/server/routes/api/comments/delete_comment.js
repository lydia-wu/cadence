"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDeleteCommentApi = initDeleteCommentApi;

var _configSchema = require("@kbn/config-schema");

var _utils = require("../utils");

var _common = require("../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initDeleteCommentApi({
  router,
  logger
}) {
  router.delete({
    path: _common.CASE_COMMENT_DETAILS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string(),
        comment_id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.maybe(_configSchema.schema.object({
        subCaseId: _configSchema.schema.maybe(_configSchema.schema.string())
      }))
    }
  }, async (context, request, response) => {
    try {
      var _request$query;

      const client = await context.cases.getCasesClient();
      await client.attachments.delete({
        attachmentID: request.params.comment_id,
        subCaseID: (_request$query = request.query) === null || _request$query === void 0 ? void 0 : _request$query.subCaseId,
        caseID: request.params.case_id
      });
      return response.noContent();
    } catch (error) {
      var _request$query2;

      logger.error(`Failed to delete comment in route case id: ${request.params.case_id} comment id: ${request.params.comment_id} sub case id: ${(_request$query2 = request.query) === null || _request$query2 === void 0 ? void 0 : _request$query2.subCaseId}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}