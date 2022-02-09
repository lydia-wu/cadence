"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPostCommentApi = initPostCommentApi;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _configSchema = require("@kbn/config-schema");

var _utils = require("../utils");

var _common = require("../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initPostCommentApi({
  router,
  logger
}) {
  router.post({
    path: _common.CASE_COMMENTS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.maybe(_configSchema.schema.object({
        subCaseId: _configSchema.schema.maybe(_configSchema.schema.string())
      })),
      body: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      var _request$query, _request$query$subCas, _request$query2;

      if (!_common.ENABLE_CASE_CONNECTOR && ((_request$query = request.query) === null || _request$query === void 0 ? void 0 : _request$query.subCaseId) !== undefined) {
        throw _boom.default.badRequest('The `subCaseId` is not supported when the case connector feature is disabled');
      }

      if (!context.cases) {
        return response.badRequest({
          body: 'RouteHandlerContext is not registered for cases'
        });
      }

      const casesClient = await context.cases.getCasesClient();
      const caseId = (_request$query$subCas = (_request$query2 = request.query) === null || _request$query2 === void 0 ? void 0 : _request$query2.subCaseId) !== null && _request$query$subCas !== void 0 ? _request$query$subCas : request.params.case_id;
      const comment = request.body;
      return response.ok({
        body: await casesClient.attachments.add({
          caseId,
          comment
        })
      });
    } catch (error) {
      var _request$query3;

      logger.error(`Failed to post comment in route case id: ${request.params.case_id} sub case id: ${(_request$query3 = request.query) === null || _request$query3 === void 0 ? void 0 : _request$query3.subCaseId}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}