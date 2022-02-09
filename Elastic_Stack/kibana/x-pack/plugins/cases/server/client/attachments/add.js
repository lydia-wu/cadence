"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addComment = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _server = require("../../../../../../src/core/server");

var _common = require("../../../../../../src/plugins/data/common");

var _common2 = require("../../../common");

var _helpers = require("../../services/user_actions/helpers");

var _common3 = require("../../common");

var _utils = require("../utils");

var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getSubCase({
  caseService,
  unsecuredSavedObjectsClient,
  caseId,
  createdAt,
  userActionService,
  user
}) {
  const mostRecentSubCase = await caseService.getMostRecentSubCase(unsecuredSavedObjectsClient, caseId);

  if (mostRecentSubCase && mostRecentSubCase.attributes.status !== _common2.CaseStatuses.closed) {
    const subCaseAlertsAttachement = await caseService.getAllSubCaseComments({
      unsecuredSavedObjectsClient,
      id: mostRecentSubCase.id,
      options: {
        fields: [],
        filter: _common.nodeBuilder.is(`${_common2.CASE_COMMENT_SAVED_OBJECT}.attributes.type`, _common2.CommentType.generatedAlert),
        page: 1,
        perPage: 1
      }
    });

    if (subCaseAlertsAttachement.total <= _common2.MAX_GENERATED_ALERTS_PER_SUB_CASE) {
      return mostRecentSubCase;
    }
  }

  const newSubCase = await caseService.createSubCase({
    unsecuredSavedObjectsClient,
    createdAt,
    caseId,
    createdBy: user
  });
  await userActionService.bulkCreate({
    unsecuredSavedObjectsClient,
    actions: [(0, _helpers.buildCaseUserActionItem)({
      action: 'create',
      actionAt: createdAt,
      actionBy: user,
      caseId,
      subCaseId: newSubCase.id,
      fields: ['status', 'sub_case'],
      newValue: {
        status: newSubCase.attributes.status
      },
      owner: newSubCase.attributes.owner
    })]
  });
  return newSubCase;
}

const addGeneratedAlerts = async ({
  caseId,
  comment
}, clientArgs, casesClientInternal) => {
  const {
    unsecuredSavedObjectsClient,
    attachmentService,
    caseService,
    userActionService,
    logger,
    lensEmbeddableFactory,
    authorization
  } = clientArgs;
  const query = (0, _pipeable.pipe)(_common2.AlertCommentRequestRt.decode(comment), (0, _Either.fold)((0, _common2.throwErrors)(_boom.default.badRequest), _function.identity));
  (0, _utils.decodeCommentRequest)(comment); // This function only supports adding generated alerts

  if (comment.type !== _common2.CommentType.generatedAlert) {
    throw _boom.default.internal('Attempting to add a non generated alert in the wrong context');
  }

  try {
    var _caseInfo$attributes$, _caseInfo$attributes$2, _caseInfo$attributes$3;

    const createdDate = new Date().toISOString();

    const savedObjectID = _server.SavedObjectsUtils.generateId();

    await authorization.ensureAuthorized({
      entities: [{
        owner: comment.owner,
        id: savedObjectID
      }],
      operation: _authorization.Operations.createComment
    });
    const caseInfo = await caseService.getCase({
      unsecuredSavedObjectsClient,
      id: caseId
    });

    if (query.type === _common2.CommentType.generatedAlert && caseInfo.attributes.type !== _common2.CaseType.collection) {
      throw _boom.default.badRequest('Sub case style alert comment cannot be added to an individual case');
    }

    const userDetails = {
      username: (_caseInfo$attributes$ = caseInfo.attributes.created_by) === null || _caseInfo$attributes$ === void 0 ? void 0 : _caseInfo$attributes$.username,
      full_name: (_caseInfo$attributes$2 = caseInfo.attributes.created_by) === null || _caseInfo$attributes$2 === void 0 ? void 0 : _caseInfo$attributes$2.full_name,
      email: (_caseInfo$attributes$3 = caseInfo.attributes.created_by) === null || _caseInfo$attributes$3 === void 0 ? void 0 : _caseInfo$attributes$3.email
    };
    const subCase = await getSubCase({
      caseService,
      unsecuredSavedObjectsClient,
      caseId,
      createdAt: createdDate,
      userActionService,
      user: userDetails
    });
    const commentableCase = new _common3.CommentableCase({
      logger,
      collection: caseInfo,
      subCase,
      unsecuredSavedObjectsClient,
      caseService,
      attachmentService,
      lensEmbeddableFactory
    });
    const {
      comment: newComment,
      commentableCase: updatedCase
    } = await commentableCase.createComment({
      createdDate,
      user: userDetails,
      commentReq: query,
      id: savedObjectID
    });

    if ((newComment.attributes.type === _common2.CommentType.alert || newComment.attributes.type === _common2.CommentType.generatedAlert) && caseInfo.attributes.settings.syncAlerts) {
      const alertsToUpdate = (0, _common3.createAlertUpdateRequest)({
        comment: query,
        status: subCase.attributes.status
      });
      await casesClientInternal.alerts.updateStatus({
        alerts: alertsToUpdate
      });
    }

    await userActionService.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: [(0, _helpers.buildCommentUserActionItem)({
        action: 'create',
        actionAt: createdDate,
        actionBy: { ...userDetails
        },
        caseId: updatedCase.caseId,
        subCaseId: updatedCase.subCaseId,
        commentId: newComment.id,
        fields: ['comment'],
        newValue: query,
        owner: newComment.attributes.owner
      })]
    });
    return updatedCase.encode();
  } catch (error) {
    throw (0, _common3.createCaseError)({
      message: `Failed while adding a generated alert to case id: ${caseId} error: ${error}`,
      error,
      logger
    });
  }
};

async function getCombinedCase({
  caseService,
  attachmentService,
  unsecuredSavedObjectsClient,
  id,
  logger,
  lensEmbeddableFactory
}) {
  const [casePromise, subCasePromise] = await Promise.allSettled([caseService.getCase({
    unsecuredSavedObjectsClient,
    id
  }), ...(_common2.ENABLE_CASE_CONNECTOR ? [caseService.getSubCase({
    unsecuredSavedObjectsClient,
    id
  })] : [Promise.reject('case connector feature is disabled')])]);

  if (subCasePromise.status === 'fulfilled') {
    if (subCasePromise.value.references.length > 0) {
      const caseValue = await caseService.getCase({
        unsecuredSavedObjectsClient,
        id: subCasePromise.value.references[0].id
      });
      return new _common3.CommentableCase({
        logger,
        collection: caseValue,
        subCase: subCasePromise.value,
        caseService,
        attachmentService,
        unsecuredSavedObjectsClient,
        lensEmbeddableFactory
      });
    } else {
      throw _boom.default.badRequest('Sub case found without reference to collection');
    }
  }

  if (casePromise.status === 'rejected') {
    throw casePromise.reason;
  } else {
    return new _common3.CommentableCase({
      logger,
      collection: casePromise.value,
      caseService,
      attachmentService,
      unsecuredSavedObjectsClient,
      lensEmbeddableFactory
    });
  }
}
/**
 * The arguments needed for creating a new attachment to a case.
 */

/**
 * Create an attachment to a case.
 *
 * @ignore
 */


const addComment = async (addArgs, clientArgs, casesClientInternal) => {
  const {
    comment,
    caseId
  } = addArgs;
  const query = (0, _pipeable.pipe)(_common2.CommentRequestRt.decode(comment), (0, _Either.fold)((0, _common2.throwErrors)(_boom.default.badRequest), _function.identity));
  const {
    unsecuredSavedObjectsClient,
    caseService,
    userActionService,
    attachmentService,
    user,
    logger,
    lensEmbeddableFactory,
    authorization
  } = clientArgs;

  if ((0, _common3.isCommentRequestTypeGenAlert)(comment)) {
    if (!_common2.ENABLE_CASE_CONNECTOR) {
      throw _boom.default.badRequest('Attempting to add a generated alert when case connector feature is disabled');
    }

    return addGeneratedAlerts(addArgs, clientArgs, casesClientInternal);
  }

  (0, _utils.decodeCommentRequest)(comment);

  try {
    const savedObjectID = _server.SavedObjectsUtils.generateId();

    await authorization.ensureAuthorized({
      operation: _authorization.Operations.createComment,
      entities: [{
        owner: comment.owner,
        id: savedObjectID
      }]
    });
    const createdDate = new Date().toISOString();
    const combinedCase = await getCombinedCase({
      caseService,
      attachmentService,
      unsecuredSavedObjectsClient,
      id: caseId,
      logger,
      lensEmbeddableFactory
    }); // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      username,
      full_name,
      email
    } = user;
    const userInfo = {
      username,
      full_name,
      email
    };
    const {
      comment: newComment,
      commentableCase: updatedCase
    } = await combinedCase.createComment({
      createdDate,
      user: userInfo,
      commentReq: query,
      id: savedObjectID
    });

    if (newComment.attributes.type === _common2.CommentType.alert && updatedCase.settings.syncAlerts) {
      const alertsToUpdate = (0, _common3.createAlertUpdateRequest)({
        comment: query,
        status: updatedCase.status
      });
      await casesClientInternal.alerts.updateStatus({
        alerts: alertsToUpdate
      });
    }

    await userActionService.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: [(0, _helpers.buildCommentUserActionItem)({
        action: 'create',
        actionAt: createdDate,
        actionBy: {
          username,
          full_name,
          email
        },
        caseId: updatedCase.caseId,
        subCaseId: updatedCase.subCaseId,
        commentId: newComment.id,
        fields: ['comment'],
        newValue: query,
        owner: newComment.attributes.owner
      })]
    });
    return updatedCase.encode();
  } catch (error) {
    throw (0, _common3.createCaseError)({
      message: `Failed while adding a comment to case id: ${caseId} error: ${error}`,
      error,
      logger
    });
  }
};

exports.addComment = addComment;