"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPatchSubCasesApi = initPatchSubCasesApi;

var _common = require("../../../../common");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initPatchSubCasesApi({
  router,
  logger
}) {
  router.patch({
    path: _common.SUB_CASES_PATCH_DEL_URL,
    validate: {
      body: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      const casesClient = await context.cases.getCasesClient();
      const subCases = request.body;
      return response.ok({
        body: await casesClient.subCases.update(subCases)
      });
    } catch (error) {
      logger.error(`Failed to patch sub cases in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}