"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAll = deleteAll;
exports.deleteComment = deleteComment;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pMap = _interopRequireDefault(require("p-map"));

var _common = require("../../../common");

var _helpers = require("../../services/user_actions/helpers");

var _common2 = require("../../common");

var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Delete all comments for a case or sub case.
 *
 * @ignore
 */


async function deleteAll({
  caseID,
  subCaseID
}, clientArgs) {
  const {
    user,
    unsecuredSavedObjectsClient,
    caseService,
    attachmentService,
    userActionService,
    logger,
    authorization
  } = clientArgs;

  try {
    (0, _common2.checkEnabledCaseConnectorOrThrow)(subCaseID);
    const id = subCaseID !== null && subCaseID !== void 0 ? subCaseID : caseID;
    const comments = await caseService.getCommentsByAssociation({
      unsecuredSavedObjectsClient,
      id,
      associationType: subCaseID ? _common.AssociationType.subCase : _common.AssociationType.case
    });

    if (comments.total <= 0) {
      throw _boom.default.notFound(`No comments found for ${id}.`);
    }

    await authorization.ensureAuthorized({
      operation: _authorization.Operations.deleteAllComments,
      entities: comments.saved_objects.map(comment => ({
        owner: comment.attributes.owner,
        id: comment.id
      }))
    });

    const mapper = async comment => attachmentService.delete({
      unsecuredSavedObjectsClient,
      attachmentId: comment.id
    }); // Ensuring we don't too many concurrent deletions running.


    await (0, _pMap.default)(comments.saved_objects, mapper, {
      concurrency: _common.MAX_CONCURRENT_SEARCHES
    });
    const deleteDate = new Date().toISOString();
    await userActionService.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: comments.saved_objects.map(comment => (0, _helpers.buildCommentUserActionItem)({
        action: 'delete',
        actionAt: deleteDate,
        actionBy: user,
        caseId: caseID,
        subCaseId: subCaseID,
        commentId: comment.id,
        fields: ['comment'],
        owner: comment.attributes.owner
      }))
    });
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to delete all comments case id: ${caseID} sub case id: ${subCaseID}: ${error}`,
      error,
      logger
    });
  }
}
/**
 * Deletes an attachment
 *
 * @ignore
 */


async function deleteComment({
  caseID,
  attachmentID,
  subCaseID
}, clientArgs) {
  const {
    user,
    unsecuredSavedObjectsClient,
    attachmentService,
    userActionService,
    logger,
    authorization
  } = clientArgs;

  try {
    (0, _common2.checkEnabledCaseConnectorOrThrow)(subCaseID);
    const deleteDate = new Date().toISOString();
    const myComment = await attachmentService.get({
      unsecuredSavedObjectsClient,
      attachmentId: attachmentID
    });

    if (myComment == null) {
      throw _boom.default.notFound(`This comment ${attachmentID} does not exist anymore.`);
    }

    await authorization.ensureAuthorized({
      entities: [{
        owner: myComment.attributes.owner,
        id: myComment.id
      }],
      operation: _authorization.Operations.deleteComment
    });
    const type = subCaseID ? _common.SUB_CASE_SAVED_OBJECT : _common.CASE_SAVED_OBJECT;
    const id = subCaseID !== null && subCaseID !== void 0 ? subCaseID : caseID;
    const caseRef = myComment.references.find(c => c.type === type);

    if (caseRef == null || caseRef != null && caseRef.id !== id) {
      throw _boom.default.notFound(`This comment ${attachmentID} does not exist in ${id}.`);
    }

    await attachmentService.delete({
      unsecuredSavedObjectsClient,
      attachmentId: attachmentID
    });
    await userActionService.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: [(0, _helpers.buildCommentUserActionItem)({
        action: 'delete',
        actionAt: deleteDate,
        actionBy: user,
        caseId: id,
        subCaseId: subCaseID,
        commentId: attachmentID,
        fields: ['comment'],
        owner: myComment.attributes.owner
      })]
    });
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to delete comment: ${caseID} comment id: ${attachmentID} sub case id: ${subCaseID}: ${error}`,
      error,
      logger
    });
  }
}