"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseUserActionService = void 0;
exports.transformFindResponseToExternalModel = transformFindResponseToExternalModel;

var _common = require("../../../common");

var _types = require("./types");

var _common2 = require("../../common");

var _transform = require("./transform");

var _transform2 = require("../transform");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CaseUserActionService {
  constructor(log) {
    this.log = log;
  }

  async getAll({
    unsecuredSavedObjectsClient,
    caseId,
    subCaseId
  }) {
    try {
      const id = subCaseId !== null && subCaseId !== void 0 ? subCaseId : caseId;
      const type = subCaseId ? _common.SUB_CASE_SAVED_OBJECT : _common.CASE_SAVED_OBJECT;
      const userActions = await unsecuredSavedObjectsClient.find({
        type: _common.CASE_USER_ACTION_SAVED_OBJECT,
        hasReference: {
          type,
          id
        },
        page: 1,
        perPage: _common.MAX_DOCS_PER_PAGE,
        sortField: 'action_at',
        sortOrder: 'asc'
      });
      return transformFindResponseToExternalModel(userActions);
    } catch (error) {
      this.log.error(`Error on GET case user action case id: ${caseId}: ${error}`);
      throw error;
    }
  }

  async bulkCreate({
    unsecuredSavedObjectsClient,
    actions
  }) {
    try {
      this.log.debug(`Attempting to POST a new case user action`);
      await unsecuredSavedObjectsClient.bulkCreate(actions.map(action => ({
        type: _common.CASE_USER_ACTION_SAVED_OBJECT,
        ...action
      })));
    } catch (error) {
      this.log.error(`Error on POST a new case user action: ${error}`);
      throw error;
    }
  }

}

exports.CaseUserActionService = CaseUserActionService;

function transformFindResponseToExternalModel(userActions) {
  return { ...userActions,
    saved_objects: userActions.saved_objects.map(so => ({ ...so,
      ...transformToExternalModel(so)
    }))
  };
}

function transformToExternalModel(userAction) {
  var _findReferenceId, _findReferenceId2, _findReferenceId3;

  const {
    references
  } = userAction;
  const newValueConnectorId = getConnectorIdFromReferences(_types.UserActionFieldType.New, userAction);
  const oldValueConnectorId = getConnectorIdFromReferences(_types.UserActionFieldType.Old, userAction);
  const caseId = (_findReferenceId = findReferenceId(_common2.CASE_REF_NAME, _common.CASE_SAVED_OBJECT, references)) !== null && _findReferenceId !== void 0 ? _findReferenceId : '';
  const commentId = (_findReferenceId2 = findReferenceId(_common2.COMMENT_REF_NAME, _common.CASE_COMMENT_SAVED_OBJECT, references)) !== null && _findReferenceId2 !== void 0 ? _findReferenceId2 : null;
  const subCaseId = (_findReferenceId3 = findReferenceId(_common2.SUB_CASE_REF_NAME, _common.SUB_CASE_SAVED_OBJECT, references)) !== null && _findReferenceId3 !== void 0 ? _findReferenceId3 : '';
  return { ...userAction,
    attributes: { ...userAction.attributes,
      action_id: userAction.id,
      case_id: caseId,
      comment_id: commentId,
      sub_case_id: subCaseId,
      new_val_connector_id: newValueConnectorId,
      old_val_connector_id: oldValueConnectorId
    }
  };
}

function getConnectorIdFromReferences(fieldType, userAction) {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    attributes: {
      action,
      action_field
    },
    references
  } = userAction;

  if ((0, _common.isCreateConnector)(action, action_field) || (0, _common.isUpdateConnector)(action, action_field)) {
    var _findConnectorIdRefer, _findConnectorIdRefer2;

    return (_findConnectorIdRefer = (_findConnectorIdRefer2 = (0, _transform2.findConnectorIdReference)(_transform.ConnectorIdReferenceName[fieldType], references)) === null || _findConnectorIdRefer2 === void 0 ? void 0 : _findConnectorIdRefer2.id) !== null && _findConnectorIdRefer !== void 0 ? _findConnectorIdRefer : null;
  } else if ((0, _common.isPush)(action, action_field)) {
    var _findConnectorIdRefer3, _findConnectorIdRefer4;

    return (_findConnectorIdRefer3 = (_findConnectorIdRefer4 = (0, _transform2.findConnectorIdReference)(_transform.PushConnectorIdReferenceName[fieldType], references)) === null || _findConnectorIdRefer4 === void 0 ? void 0 : _findConnectorIdRefer4.id) !== null && _findConnectorIdRefer3 !== void 0 ? _findConnectorIdRefer3 : null;
  }

  return null;
}

function findReferenceId(name, type, references) {
  var _references$find;

  return (_references$find = references.find(ref => ref.name === name && ref.type === type)) === null || _references$find === void 0 ? void 0 : _references$find.id;
}