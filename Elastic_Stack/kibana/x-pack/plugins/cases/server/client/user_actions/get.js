"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractAttributesWithoutSubCases = extractAttributesWithoutSubCases;
exports.get = void 0;

var _common = require("../../../common");

var _common2 = require("../../common");

var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const get = async ({
  caseId,
  subCaseId
}, clientArgs) => {
  const {
    unsecuredSavedObjectsClient,
    userActionService,
    logger,
    authorization
  } = clientArgs;

  try {
    (0, _common2.checkEnabledCaseConnectorOrThrow)(subCaseId);
    const userActions = await userActionService.getAll({
      unsecuredSavedObjectsClient,
      caseId,
      subCaseId
    });
    await authorization.ensureAuthorized({
      entities: userActions.saved_objects.map(userAction => ({
        owner: userAction.attributes.owner,
        id: userAction.id
      })),
      operation: _authorization.Operations.getUserActions
    });
    const resultsToEncode = subCaseId == null ? extractAttributesWithoutSubCases(userActions) : extractAttributes(userActions);
    return _common.CaseUserActionsResponseRt.encode(resultsToEncode);
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to retrieve user actions case id: ${caseId} sub case id: ${subCaseId}: ${error}`,
      error,
      logger
    });
  }
};

exports.get = get;

function extractAttributesWithoutSubCases(userActions) {
  // exclude user actions relating to sub cases from the results
  const hasSubCaseReference = references => references.find(ref => ref.type === _common.SUB_CASE_SAVED_OBJECT && ref.name === _common2.SUB_CASE_REF_NAME);

  return userActions.saved_objects.filter(so => !hasSubCaseReference(so.references)).map(so => so.attributes);
}

function extractAttributes(userActions) {
  return userActions.saved_objects.map(so => so.attributes);
}