"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCases = deleteCases;

var _pMap = _interopRequireDefault(require("p-map"));

var _boom = require("@hapi/boom");

var _common = require("../../../common");

var _common2 = require("../../common");

var _helpers = require("../../services/user_actions/helpers");

var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function deleteSubCases({
  attachmentService,
  caseService,
  unsecuredSavedObjectsClient,
  caseIds
}) {
  const subCasesForCaseIds = await caseService.findSubCasesByCaseId({
    unsecuredSavedObjectsClient,
    ids: caseIds
  });
  const subCaseIDs = subCasesForCaseIds.saved_objects.map(subCase => subCase.id);
  const commentsForSubCases = await caseService.getAllSubCaseComments({
    unsecuredSavedObjectsClient,
    id: subCaseIDs
  });

  const commentMapper = commentSO => attachmentService.delete({
    unsecuredSavedObjectsClient,
    attachmentId: commentSO.id
  });

  const subCasesMapper = subCaseSO => caseService.deleteSubCase(unsecuredSavedObjectsClient, subCaseSO.id);
  /**
   * This shouldn't actually delete anything because
   * all the comments should be deleted when comments are deleted
   * per case ID. We also ensure that we don't too many concurrent deletions running.
   */


  await (0, _pMap.default)(commentsForSubCases.saved_objects, commentMapper, {
    concurrency: _common.MAX_CONCURRENT_SEARCHES
  });
  await (0, _pMap.default)(subCasesForCaseIds.saved_objects, subCasesMapper, {
    concurrency: _common.MAX_CONCURRENT_SEARCHES
  });
}
/**
 * Deletes the specified cases and their attachments.
 *
 * @ignore
 */


async function deleteCases(ids, clientArgs) {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    attachmentService,
    user,
    userActionService,
    logger,
    authorization
  } = clientArgs;

  try {
    const cases = await caseService.getCases({
      unsecuredSavedObjectsClient,
      caseIds: ids
    });
    const entities = new Map();

    for (const theCase of cases.saved_objects) {
      // bulkGet can return an error.
      if (theCase.error != null) {
        throw (0, _common2.createCaseError)({
          message: `Failed to delete cases ids: ${JSON.stringify(ids)}: ${theCase.error.error}`,
          error: new _boom.Boom(theCase.error.message, {
            statusCode: theCase.error.statusCode
          }),
          logger
        });
      }

      entities.set(theCase.id, {
        id: theCase.id,
        owner: theCase.attributes.owner
      });
    }

    await authorization.ensureAuthorized({
      operation: _authorization.Operations.deleteCase,
      entities: Array.from(entities.values())
    });

    const deleteCasesMapper = async id => caseService.deleteCase({
      unsecuredSavedObjectsClient,
      id
    }); // Ensuring we don't too many concurrent deletions running.


    await (0, _pMap.default)(ids, deleteCasesMapper, {
      concurrency: _common.MAX_CONCURRENT_SEARCHES
    });

    const getCommentsMapper = async id => caseService.getAllCaseComments({
      unsecuredSavedObjectsClient,
      id
    }); // Ensuring we don't too many concurrent get running.


    const comments = await (0, _pMap.default)(ids, getCommentsMapper, {
      concurrency: _common.MAX_CONCURRENT_SEARCHES
    });
    /**
     * This is a nested pMap.Mapper.
     * Each element of the comments array contains all comments of a particular case.
     * For that reason we need first to create a map that iterate over all cases
     * and return a pMap that deletes the comments for that case
     */

    const deleteCommentsMapper = async commentRes => (0, _pMap.default)(commentRes.saved_objects, comment => attachmentService.delete({
      unsecuredSavedObjectsClient,
      attachmentId: comment.id
    })); // Ensuring we don't too many concurrent deletions running.


    await (0, _pMap.default)(comments, deleteCommentsMapper, {
      concurrency: _common.MAX_CONCURRENT_SEARCHES
    });

    if (_common.ENABLE_CASE_CONNECTOR) {
      await deleteSubCases({
        attachmentService,
        caseService,
        unsecuredSavedObjectsClient,
        caseIds: ids
      });
    }

    const deleteDate = new Date().toISOString();
    await userActionService.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: cases.saved_objects.map(caseInfo => (0, _helpers.buildCaseUserActionItem)({
        action: 'delete',
        actionAt: deleteDate,
        actionBy: user,
        caseId: caseInfo.id,
        fields: ['description', 'status', 'tags', 'title', 'connector', 'settings', _common.OWNER_FIELD, 'comment', ...(_common.ENABLE_CASE_CONNECTOR ? ['sub_case'] : [])],
        owner: caseInfo.attributes.owner
      }))
    });
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to delete cases ids: ${JSON.stringify(ids)}: ${error}`,
      error,
      logger
    });
  }
}