"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSubCasesClient = createSubCasesClient;

var _pMap = _interopRequireDefault(require("p-map"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _common = require("../../../common");

var _common2 = require("../../common");

var _helpers = require("../../services/user_actions/helpers");

var _utils = require("../utils");

var _api = require("../../routes/api");

var _update = require("./update");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates a client for handling the different exposed API routes for interacting with sub cases.
 *
 * @ignore
 */


function createSubCasesClient(clientArgs, casesClientInternal) {
  return Object.freeze({
    delete: ids => deleteSubCase(ids, clientArgs),
    find: findArgs => find(findArgs, clientArgs),
    get: getArgs => get(getArgs, clientArgs),
    update: subCases => (0, _update.update)({
      subCases,
      clientArgs,
      casesClientInternal
    })
  });
}

async function deleteSubCase(ids, clientArgs) {
  try {
    const {
      unsecuredSavedObjectsClient,
      user,
      userActionService,
      caseService,
      attachmentService
    } = clientArgs;
    const [comments, subCases] = await Promise.all([caseService.getAllSubCaseComments({
      unsecuredSavedObjectsClient,
      id: ids
    }), caseService.getSubCases({
      unsecuredSavedObjectsClient,
      ids
    })]);
    const subCaseErrors = subCases.saved_objects.filter(subCase => subCase.error !== undefined);

    if (subCaseErrors.length > 0) {
      throw _boom.default.notFound(`These sub cases ${subCaseErrors.map(c => c.id).join(', ')} do not exist. Please check you have the correct ids.`);
    }

    const subCaseIDToParentID = subCases.saved_objects.reduce((acc, subCase) => {
      const parentID = subCase.references.find(ref => ref.type === _common.CASE_SAVED_OBJECT);
      acc.set(subCase.id, parentID === null || parentID === void 0 ? void 0 : parentID.id);
      return acc;
    }, new Map());

    const deleteCommentMapper = async comment => attachmentService.delete({
      unsecuredSavedObjectsClient,
      attachmentId: comment.id
    });

    const deleteSubCasesMapper = async id => caseService.deleteSubCase(unsecuredSavedObjectsClient, id); // Ensuring we don't too many concurrent deletions running.


    await (0, _pMap.default)(comments.saved_objects, deleteCommentMapper, {
      concurrency: _common.MAX_CONCURRENT_SEARCHES
    });
    await (0, _pMap.default)(ids, deleteSubCasesMapper, {
      concurrency: _common.MAX_CONCURRENT_SEARCHES
    });
    const deleteDate = new Date().toISOString();
    await userActionService.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: subCases.saved_objects.map(subCase => {
        var _subCaseIDToParentID$;

        return (0, _helpers.buildCaseUserActionItem)({
          action: 'delete',
          actionAt: deleteDate,
          actionBy: user,
          // if for some reason the sub case didn't have a reference to its parent, we'll still log a user action
          // but we won't have the case ID
          caseId: (_subCaseIDToParentID$ = subCaseIDToParentID.get(subCase.id)) !== null && _subCaseIDToParentID$ !== void 0 ? _subCaseIDToParentID$ : '',
          subCaseId: subCase.id,
          fields: ['sub_case', 'comment', 'status'],
          owner: subCase.attributes.owner
        });
      })
    });
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to delete sub cases ids: ${JSON.stringify(ids)}: ${error}`,
      error,
      logger: clientArgs.logger
    });
  }
}

async function find({
  caseID,
  queryParams
}, clientArgs) {
  try {
    const {
      unsecuredSavedObjectsClient,
      caseService
    } = clientArgs;
    const ids = [caseID];
    const {
      subCase: subCaseQueryOptions
    } = (0, _utils.constructQueryOptions)({
      status: queryParams.status,
      sortByField: queryParams.sortField
    });
    const subCases = await caseService.findSubCasesGroupByCase({
      unsecuredSavedObjectsClient,
      ids,
      options: {
        sortField: 'created_at',
        page: _api.defaultPage,
        perPage: _api.defaultPerPage,
        ...queryParams,
        ...subCaseQueryOptions
      }
    }); // casesStatuses are bounded by us. No need to limit concurrent calls.

    const [open, inProgress, closed] = await Promise.all([..._common.caseStatuses.map(status => {
      const {
        subCase: statusQueryOptions
      } = (0, _utils.constructQueryOptions)({
        status,
        sortByField: queryParams.sortField
      });
      return caseService.findSubCaseStatusStats({
        unsecuredSavedObjectsClient,
        options: statusQueryOptions !== null && statusQueryOptions !== void 0 ? statusQueryOptions : {},
        ids
      });
    })]);
    return _common.SubCasesFindResponseRt.encode((0, _common2.transformSubCases)({
      page: subCases.page,
      perPage: subCases.perPage,
      total: subCases.total,
      subCasesMap: subCases.subCasesMap,
      open,
      inProgress,
      closed
    }));
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to find sub cases for case id: ${caseID}: ${error}`,
      error,
      logger: clientArgs.logger
    });
  }
}

async function get({
  includeComments,
  id
}, clientArgs) {
  try {
    const {
      unsecuredSavedObjectsClient,
      caseService
    } = clientArgs;
    const subCase = await caseService.getSubCase({
      unsecuredSavedObjectsClient,
      id
    });

    if (!includeComments) {
      return _common.SubCaseResponseRt.encode((0, _common2.flattenSubCaseSavedObject)({
        savedObject: subCase
      }));
    }

    const theComments = await caseService.getAllSubCaseComments({
      unsecuredSavedObjectsClient,
      id,
      options: {
        sortField: 'created_at',
        sortOrder: 'asc'
      }
    });
    return _common.SubCaseResponseRt.encode((0, _common2.flattenSubCaseSavedObject)({
      savedObject: subCase,
      comments: theComments.saved_objects,
      totalComment: theComments.total,
      totalAlerts: (0, _common2.countAlertsForID)({
        comments: theComments,
        id
      })
    }));
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to get sub case id: ${id}: ${error}`,
      error,
      logger: clientArgs.logger
    });
  }
}