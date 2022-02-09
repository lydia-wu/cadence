"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _common = require("../../../common");

var _common2 = require("../../common");

var _utils = require("../utils");

var _utils2 = require("../../authorization/utils");

var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Retrieves a case and optionally its comments and sub case comments.
 *
 * @ignore
 */


const find = async (params, clientArgs) => {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    authorization,
    logger
  } = clientArgs;

  try {
    const queryParams = (0, _pipeable.pipe)((0, _common.excess)(_common.CasesFindRequestRt).decode(params), (0, _Either.fold)((0, _common.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      filter: authorizationFilter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.findCases);
    const queryArgs = {
      tags: queryParams.tags,
      reporters: queryParams.reporters,
      sortByField: queryParams.sortField,
      status: queryParams.status,
      caseType: queryParams.type,
      owner: queryParams.owner
    };
    const caseQueries = (0, _utils.constructQueryOptions)({ ...queryArgs,
      authorizationFilter
    });
    const cases = await caseService.findCasesGroupedByID({
      unsecuredSavedObjectsClient,
      caseOptions: { ...queryParams,
        ...caseQueries.case,
        searchFields: queryParams.searchFields != null ? Array.isArray(queryParams.searchFields) ? queryParams.searchFields : [queryParams.searchFields] : queryParams.searchFields,
        fields: (0, _utils2.includeFieldsRequiredForAuthentication)(queryParams.fields)
      },
      subCaseOptions: caseQueries.subCase
    });
    ensureSavedObjectsAreAuthorized([...cases.casesMap.values()]); // casesStatuses are bounded by us. No need to limit concurrent calls.

    const [openCases, inProgressCases, closedCases] = await Promise.all([..._common.caseStatuses.map(status => {
      const statusQuery = (0, _utils.constructQueryOptions)({ ...queryArgs,
        status,
        authorizationFilter
      });
      return caseService.findCaseStatusStats({
        unsecuredSavedObjectsClient,
        caseOptions: statusQuery.case,
        subCaseOptions: statusQuery.subCase,
        ensureSavedObjectsAreAuthorized
      });
    })]);
    return _common.CasesFindResponseRt.encode((0, _common2.transformCases)({
      casesMap: cases.casesMap,
      page: cases.page,
      perPage: cases.perPage,
      total: cases.total,
      countOpenCases: openCases,
      countInProgressCases: inProgressCases,
      countClosedCases: closedCases
    }));
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to find cases: ${JSON.stringify(params)}: ${error}`,
      error,
      logger
    });
  }
};

exports.find = find;