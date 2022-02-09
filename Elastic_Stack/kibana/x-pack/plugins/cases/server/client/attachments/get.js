"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;
exports.get = get;
exports.getAll = getAll;
exports.getAllAlertsAttachToCase = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _common = require("../../../common");

var _common2 = require("../../common");

var _api = require("../../routes/api");

var _utils = require("../utils");

var _authorization = require("../../authorization");

var _utils2 = require("../../authorization/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const normalizeAlertResponse = alerts => alerts.reduce((acc, alert) => {
  const {
    ids,
    indices
  } = (0, _common2.getIDsAndIndicesAsArrays)(alert.attributes);

  if (ids.length !== indices.length) {
    return acc;
  }

  return [...acc, ...ids.map((id, index) => ({
    id,
    index: indices[index],
    attached_at: alert.attributes.created_at
  }))];
}, []);
/**
 * Retrieves all alerts attached to a specific case.
 *
 * @ignore
 */


const getAllAlertsAttachToCase = async ({
  caseId
}, clientArgs, casesClient) => {
  const {
    unsecuredSavedObjectsClient,
    authorization,
    attachmentService
  } = clientArgs; // This will perform an authorization check to ensure the user has access to the parent case

  const theCase = await casesClient.cases.get({
    id: caseId,
    includeComments: false,
    includeSubCaseComments: false
  });
  const {
    filter: authorizationFilter,
    ensureSavedObjectsAreAuthorized
  } = await authorization.getAuthorizationFilter(_authorization.Operations.getAlertsAttachedToCase);
  const alerts = await attachmentService.getAllAlertsAttachToCase({
    unsecuredSavedObjectsClient,
    caseId: theCase.id,
    filter: authorizationFilter
  });
  ensureSavedObjectsAreAuthorized(alerts.map(alert => ({
    owner: alert.attributes.owner,
    id: alert.id
  })));
  return normalizeAlertResponse(alerts);
};
/**
 * Retrieves the attachments for a case entity. This support pagination.
 *
 * @ignore
 */


exports.getAllAlertsAttachToCase = getAllAlertsAttachToCase;

async function find({
  caseID,
  queryParams
}, clientArgs) {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    logger,
    authorization
  } = clientArgs;

  try {
    var _queryParams$subCaseI;

    (0, _common2.checkEnabledCaseConnectorOrThrow)(queryParams === null || queryParams === void 0 ? void 0 : queryParams.subCaseId);
    const {
      filter: authorizationFilter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.findComments);
    const id = (_queryParams$subCaseI = queryParams === null || queryParams === void 0 ? void 0 : queryParams.subCaseId) !== null && _queryParams$subCaseI !== void 0 ? _queryParams$subCaseI : caseID;
    const associationType = queryParams !== null && queryParams !== void 0 && queryParams.subCaseId ? _common.AssociationType.subCase : _common.AssociationType.case;
    const {
      filter,
      ...queryWithoutFilter
    } = queryParams !== null && queryParams !== void 0 ? queryParams : {}; // if the fields property was defined, make sure we include the 'owner' field in the response

    const fields = (0, _utils2.includeFieldsRequiredForAuthentication)(queryWithoutFilter.fields); // combine any passed in filter property and the filter for the appropriate owner

    const combinedFilter = (0, _utils.combineFilters)([(0, _utils.stringToKueryNode)(filter), authorizationFilter]);
    const args = queryParams ? {
      caseService,
      unsecuredSavedObjectsClient,
      id,
      options: {
        // We need this because the default behavior of getAllCaseComments is to return all the comments
        // unless the page and/or perPage is specified. Since we're spreading the query after the request can
        // still override this behavior.
        page: _api.defaultPage,
        perPage: _api.defaultPerPage,
        sortField: 'created_at',
        filter: combinedFilter,
        ...queryWithoutFilter,
        fields
      },
      associationType
    } : {
      caseService,
      unsecuredSavedObjectsClient,
      id,
      options: {
        page: _api.defaultPage,
        perPage: _api.defaultPerPage,
        sortField: 'created_at',
        filter: combinedFilter
      },
      associationType
    };
    const theComments = await caseService.getCommentsByAssociation(args);
    ensureSavedObjectsAreAuthorized(theComments.saved_objects.map(comment => ({
      owner: comment.attributes.owner,
      id: comment.id
    })));
    return _common.CommentsResponseRt.encode((0, _common2.transformComments)(theComments));
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to find comments case id: ${caseID}: ${error}`,
      error,
      logger
    });
  }
}
/**
 * Retrieves a single attachment by its ID.
 *
 * @ignore
 */


async function get({
  attachmentID,
  caseID
}, clientArgs) {
  const {
    attachmentService,
    unsecuredSavedObjectsClient,
    logger,
    authorization
  } = clientArgs;

  try {
    const comment = await attachmentService.get({
      unsecuredSavedObjectsClient,
      attachmentId: attachmentID
    });
    await authorization.ensureAuthorized({
      entities: [{
        owner: comment.attributes.owner,
        id: comment.id
      }],
      operation: _authorization.Operations.getComment
    });
    return _common.CommentResponseRt.encode((0, _common2.flattenCommentSavedObject)(comment));
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to get comment case id: ${caseID} attachment id: ${attachmentID}: ${error}`,
      error,
      logger
    });
  }
}
/**
 * Retrieves all the attachments for a case. The `includeSubCaseComments` can be used to include the sub case comments for
 * collections. If the entity is a sub case, pass in the subCaseID.
 *
 * @ignore
 */


async function getAll({
  caseID,
  includeSubCaseComments,
  subCaseID
}, clientArgs) {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    logger,
    authorization
  } = clientArgs;

  try {
    let comments;

    if (!_common.ENABLE_CASE_CONNECTOR && (subCaseID !== undefined || includeSubCaseComments !== undefined)) {
      throw _boom.default.badRequest('The sub case id and include sub case comments fields are not supported when the case connector feature is disabled');
    }

    const {
      filter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.getAllComments);

    if (subCaseID) {
      comments = await caseService.getAllSubCaseComments({
        unsecuredSavedObjectsClient,
        id: subCaseID,
        options: {
          filter,
          sortField: _common2.defaultSortField
        }
      });
    } else {
      comments = await caseService.getAllCaseComments({
        unsecuredSavedObjectsClient,
        id: caseID,
        includeSubCaseComments,
        options: {
          filter,
          sortField: _common2.defaultSortField
        }
      });
    }

    ensureSavedObjectsAreAuthorized(comments.saved_objects.map(comment => ({
      id: comment.id,
      owner: comment.attributes.owner
    })));
    return _common.AllCommentsResponseRt.encode((0, _common2.flattenCommentSavedObjects)(comments.saved_objects));
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to get all comments case id: ${caseID} include sub case comments: ${includeSubCaseComments} sub case id: ${subCaseID}: ${error}`,
      error,
      logger
    });
  }
}