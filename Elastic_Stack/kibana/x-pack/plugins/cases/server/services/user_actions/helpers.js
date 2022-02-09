"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSubCaseUserActions = exports.buildCommentUserActionItem = exports.buildCaseUserActions = exports.buildCaseUserActionItem = void 0;

var _lodash = require("lodash");

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

var _common = require("../../../common");

var _utils = require("../../client/utils");

var _transform = require("./transform");

var _types = require("./types");

var _common2 = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildCaseUserActionItem = ({
  action,
  actionAt,
  actionBy,
  caseId,
  fields,
  newValue,
  oldValue,
  subCaseId,
  owner
}) => {
  const {
    transformedActionDetails: transformedNewValue,
    references: newValueReferences
  } = (0, _transform.extractConnectorId)({
    action,
    actionFields: fields,
    actionDetails: newValue,
    fieldType: _types.UserActionFieldType.New
  });
  const {
    transformedActionDetails: transformedOldValue,
    references: oldValueReferences
  } = (0, _transform.extractConnectorId)({
    action,
    actionFields: fields,
    actionDetails: oldValue,
    fieldType: _types.UserActionFieldType.Old
  });
  return {
    attributes: transformNewUserAction({
      actionField: fields,
      action,
      actionAt,
      owner,
      ...actionBy,
      newValue: transformedNewValue,
      oldValue: transformedOldValue
    }),
    references: [...createCaseReferences(caseId, subCaseId), ...newValueReferences, ...oldValueReferences]
  };
};

exports.buildCaseUserActionItem = buildCaseUserActionItem;

const transformNewUserAction = ({
  actionField,
  action,
  actionAt,
  email,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  full_name,
  owner,
  newValue = null,
  oldValue = null,
  username
}) => ({
  action_field: actionField,
  action,
  action_at: actionAt,
  action_by: {
    email,
    full_name,
    username
  },
  new_value: newValue,
  old_value: oldValue,
  owner
});

const createCaseReferences = (caseId, subCaseId) => [{
  type: _common.CASE_SAVED_OBJECT,
  name: _common2.CASE_REF_NAME,
  id: caseId
}, ...(subCaseId ? [{
  type: _common.SUB_CASE_SAVED_OBJECT,
  name: _common2.SUB_CASE_REF_NAME,
  id: subCaseId
}] : [])];

const buildCommentUserActionItem = params => {
  const {
    commentId
  } = params;
  const {
    attributes,
    references
  } = buildCaseUserActionItem(params);
  return {
    attributes,
    references: [...references, {
      type: _common.CASE_COMMENT_SAVED_OBJECT,
      name: _common2.COMMENT_REF_NAME,
      id: commentId
    }]
  };
};

exports.buildCommentUserActionItem = buildCommentUserActionItem;
const userActionFieldsAllowed = ['comment', 'connector', 'description', 'tags', 'title', 'status', 'settings', 'sub_case', _common.OWNER_FIELD];
/**
 * The entity associated with the user action must contain an owner field
 */

const buildGenericCaseUserActions = ({
  actionDate,
  actionBy,
  originalCases,
  updatedCases,
  allowedFields,
  getters
}) => {
  const {
    getCaseAndSubID
  } = getters;
  return updatedCases.reduce((acc, updatedItem) => {
    const {
      caseId,
      subCaseId
    } = getCaseAndSubID(updatedItem); // regardless of whether we're looking at a sub case or case, the id field will always be used to match between
    // the original and the updated saved object

    const originalItem = originalCases.find(oItem => oItem.id === updatedItem.id);

    if (originalItem != null) {
      let userActions = [];
      const updatedFields = Object.keys(updatedItem.attributes);
      updatedFields.forEach(field => {
        if (allowedFields.includes(field)) {
          const origValue = (0, _lodash.get)(originalItem, ['attributes', field]);
          const updatedValue = (0, _lodash.get)(updatedItem, ['attributes', field]);

          if ((0, _lodash.isString)(origValue) && (0, _lodash.isString)(updatedValue) && origValue !== updatedValue) {
            userActions = [...userActions, buildCaseUserActionItem({
              action: 'update',
              actionAt: actionDate,
              actionBy,
              caseId,
              subCaseId,
              fields: [field],
              newValue: updatedValue,
              oldValue: origValue,
              owner: originalItem.attributes.owner
            })];
          } else if (Array.isArray(origValue) && Array.isArray(updatedValue)) {
            const compareValues = (0, _utils.isTwoArraysDifference)(origValue, updatedValue);

            if (compareValues && compareValues.addedItems.length > 0) {
              userActions = [...userActions, buildCaseUserActionItem({
                action: 'add',
                actionAt: actionDate,
                actionBy,
                caseId,
                subCaseId,
                fields: [field],
                newValue: compareValues.addedItems.join(', '),
                owner: originalItem.attributes.owner
              })];
            }

            if (compareValues && compareValues.deletedItems.length > 0) {
              userActions = [...userActions, buildCaseUserActionItem({
                action: 'delete',
                actionAt: actionDate,
                actionBy,
                caseId,
                subCaseId,
                fields: [field],
                newValue: compareValues.deletedItems.join(', '),
                owner: originalItem.attributes.owner
              })];
            }
          } else if ((0, _lodash.isPlainObject)(origValue) && (0, _lodash.isPlainObject)(updatedValue) && !(0, _fastDeepEqual.default)(origValue, updatedValue)) {
            userActions = [...userActions, buildCaseUserActionItem({
              action: 'update',
              actionAt: actionDate,
              actionBy,
              caseId,
              subCaseId,
              fields: [field],
              newValue: updatedValue,
              oldValue: origValue,
              owner: originalItem.attributes.owner
            })];
          }
        }
      });
      return [...acc, ...userActions];
    }

    return acc;
  }, []);
};
/**
 * Create a user action for an updated sub case.
 */


const buildSubCaseUserActions = args => {
  const getCaseAndSubID = so => {
    var _so$references$find$i, _so$references, _so$references$find;

    const caseId = (_so$references$find$i = (_so$references = so.references) === null || _so$references === void 0 ? void 0 : (_so$references$find = _so$references.find(ref => ref.type === _common.CASE_SAVED_OBJECT)) === null || _so$references$find === void 0 ? void 0 : _so$references$find.id) !== null && _so$references$find$i !== void 0 ? _so$references$find$i : '';
    return {
      caseId,
      subCaseId: so.id
    };
  };

  const getters = {
    getCaseAndSubID
  };
  return buildGenericCaseUserActions({
    actionDate: args.actionDate,
    actionBy: args.actionBy,
    originalCases: args.originalSubCases,
    updatedCases: args.updatedSubCases,
    allowedFields: ['status'],
    getters
  });
};
/**
 * Create a user action for an updated case.
 */


exports.buildSubCaseUserActions = buildSubCaseUserActions;

const buildCaseUserActions = args => {
  const caseGetIds = so => {
    return {
      caseId: so.id
    };
  };

  const getters = {
    getCaseAndSubID: caseGetIds
  };
  return buildGenericCaseUserActions({ ...args,
    allowedFields: userActionFieldsAllowed,
    getters
  });
};

exports.buildCaseUserActions = buildCaseUserActions;