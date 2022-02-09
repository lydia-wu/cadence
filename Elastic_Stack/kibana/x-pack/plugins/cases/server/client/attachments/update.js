"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = update;

var _fp = require("lodash/fp");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _common = require("../../common");

var _helpers = require("../../services/user_actions/helpers");

var _common2 = require("../../../common");

var _utils = require("../utils");

var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getCommentableCase({
  attachmentService,
  caseService,
  unsecuredSavedObjectsClient,
  caseID,
  subCaseId,
  logger,
  lensEmbeddableFactory
}) {
  if (subCaseId) {
    const [caseInfo, subCase] = await Promise.all([caseService.getCase({
      unsecuredSavedObjectsClient,
      id: caseID
    }), caseService.getSubCase({
      unsecuredSavedObjectsClient,
      id: subCaseId
    })]);
    return new _common.CommentableCase({
      attachmentService,
      caseService,
      collection: caseInfo,
      subCase,
      unsecuredSavedObjectsClient,
      logger,
      lensEmbeddableFactory
    });
  } else {
    const caseInfo = await caseService.getCase({
      unsecuredSavedObjectsClient,
      id: caseID
    });
    return new _common.CommentableCase({
      attachmentService,
      caseService,
      collection: caseInfo,
      unsecuredSavedObjectsClient,
      logger,
      lensEmbeddableFactory
    });
  }
}
/**
 * Update an attachment.
 *
 * @ignore
 */


async function update({
  caseID,
  subCaseID,
  updateRequest: queryParams
}, clientArgs) {
  const {
    attachmentService,
    caseService,
    unsecuredSavedObjectsClient,
    logger,
    lensEmbeddableFactory,
    user,
    userActionService,
    authorization
  } = clientArgs;

  try {
    (0, _common.checkEnabledCaseConnectorOrThrow)(subCaseID);
    const {
      id: queryCommentId,
      version: queryCommentVersion,
      ...queryRestAttributes
    } = queryParams;
    (0, _utils.decodeCommentRequest)(queryRestAttributes);
    const commentableCase = await getCommentableCase({
      attachmentService,
      caseService,
      unsecuredSavedObjectsClient,
      caseID,
      subCaseId: subCaseID,
      logger,
      lensEmbeddableFactory
    });
    const myComment = await attachmentService.get({
      unsecuredSavedObjectsClient,
      attachmentId: queryCommentId
    });

    if (myComment == null) {
      throw _boom.default.notFound(`This comment ${queryCommentId} does not exist anymore.`);
    }

    await authorization.ensureAuthorized({
      entities: [{
        owner: myComment.attributes.owner,
        id: myComment.id
      }],
      operation: _authorization.Operations.updateComment
    });

    if (myComment.attributes.type !== queryRestAttributes.type) {
      throw _boom.default.badRequest(`You cannot change the type of the comment.`);
    }

    if (myComment.attributes.owner !== queryRestAttributes.owner) {
      throw _boom.default.badRequest(`You cannot change the owner of the comment.`);
    }

    const saveObjType = subCaseID ? _common2.SUB_CASE_SAVED_OBJECT : _common2.CASE_SAVED_OBJECT;
    const caseRef = myComment.references.find(c => c.type === saveObjType);

    if (caseRef == null || caseRef != null && caseRef.id !== commentableCase.id) {
      throw _boom.default.notFound(`This comment ${queryCommentId} does not exist in ${commentableCase.id}).`);
    }

    if (queryCommentVersion !== myComment.version) {
      throw _boom.default.conflict('This case has been updated. Please refresh before saving additional updates.');
    }

    const updatedDate = new Date().toISOString();
    const {
      comment: updatedComment,
      commentableCase: updatedCase
    } = await commentableCase.updateComment({
      updateRequest: queryParams,
      updatedAt: updatedDate,
      user
    });
    await userActionService.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: [(0, _helpers.buildCommentUserActionItem)({
        action: 'update',
        actionAt: updatedDate,
        actionBy: user,
        caseId: caseID,
        subCaseId: subCaseID,
        commentId: updatedComment.id,
        fields: ['comment'],
        // casting because typescript is complaining that it's not a Record<string, unknown> even though it is
        newValue: queryRestAttributes,
        oldValue: // We are interested only in ContextBasicRt attributes
        // myComment.attribute contains also CommentAttributesBasicRt attributes
        (0, _fp.pick)(Object.keys(queryRestAttributes), myComment.attributes),
        owner: myComment.attributes.owner
      })]
    });
    return await updatedCase.encode();
  } catch (error) {
    throw (0, _common.createCaseError)({
      message: `Failed to patch comment case id: ${caseID} sub case id: ${subCaseID}: ${error}`,
      error,
      logger
    });
  }
}