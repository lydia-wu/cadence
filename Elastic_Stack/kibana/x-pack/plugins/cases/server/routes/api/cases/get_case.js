"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetCaseApi = initGetCaseApi;

var _configSchema = require("@kbn/config-schema");

var _utils = require("../utils");

var _common = require("../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetCaseApi({
  router,
  logger
}) {
  router.get({
    path: _common.CASE_DETAILS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        includeComments: _configSchema.schema.boolean({
          defaultValue: true
        }),
        includeSubCaseComments: _configSchema.schema.maybe(_configSchema.schema.boolean({
          defaultValue: false
        }))
      })
    }
  }, async (context, request, response) => {
    try {
      const casesClient = await context.cases.getCasesClient();
      const id = request.params.case_id;
      return response.ok({
        body: await casesClient.cases.get({
          id,
          includeComments: request.query.includeComments,
          includeSubCaseComments: request.query.includeSubCaseComments
        })
      });
    } catch (error) {
      logger.error(`Failed to retrieve case in route case id: ${request.params.case_id} \ninclude comments: ${request.query.includeComments} \ninclude sub comments: ${request.query.includeSubCaseComments}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
  router.get({
    path: `${_common.CASE_DETAILS_URL}/resolve`,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        includeComments: _configSchema.schema.boolean({
          defaultValue: true
        }),
        includeSubCaseComments: _configSchema.schema.maybe(_configSchema.schema.boolean({
          defaultValue: false
        }))
      })
    }
  }, async (context, request, response) => {
    try {
      const casesClient = await context.cases.getCasesClient();
      const id = request.params.case_id;
      return response.ok({
        body: await casesClient.cases.resolve({
          id,
          includeComments: request.query.includeComments,
          includeSubCaseComments: request.query.includeSubCaseComments
        })
      });
    } catch (error) {
      logger.error(`Failed to retrieve case in resolve route case id: ${request.params.case_id} \ninclude comments: ${request.query.includeComments} \ninclude sub comments: ${request.query.includeSubCaseComments}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}