"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userActionsConnectorIdMigration = userActionsConnectorIdMigration;
exports.userActionsMigrations = void 0;

var _ = require(".");

var _common = require("../../../common");

var _transform = require("../../services/user_actions/transform");

var _types = require("../../services/user_actions/types");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */


function userActionsConnectorIdMigration(doc, context) {
  var _doc$references;

  const originalDocWithReferences = { ...doc,
    references: (_doc$references = doc.references) !== null && _doc$references !== void 0 ? _doc$references : []
  };

  if (!isConnectorUserAction(doc.attributes.action, doc.attributes.action_field)) {
    return originalDocWithReferences;
  }

  try {
    return formatDocumentWithConnectorReferences(doc);
  } catch (error) {
    (0, _utils.logError)({
      id: doc.id,
      context,
      error,
      docType: 'user action connector',
      docKey: 'userAction'
    });
    return originalDocWithReferences;
  }
}

function isConnectorUserAction(action, actionFields) {
  return (0, _common.isCreateConnector)(action, actionFields) || (0, _common.isUpdateConnector)(action, actionFields) || (0, _common.isPush)(action, actionFields);
}

function formatDocumentWithConnectorReferences(doc) {
  const {
    new_value,
    old_value,
    action,
    action_field,
    ...restAttributes
  } = doc.attributes;
  const {
    references = []
  } = doc;
  const {
    transformedActionDetails: transformedNewValue,
    references: newValueConnectorRefs
  } = (0, _transform.extractConnectorIdFromJson)({
    action,
    actionFields: action_field,
    actionDetails: new_value,
    fieldType: _types.UserActionFieldType.New
  });
  const {
    transformedActionDetails: transformedOldValue,
    references: oldValueConnectorRefs
  } = (0, _transform.extractConnectorIdFromJson)({
    action,
    actionFields: action_field,
    actionDetails: old_value,
    fieldType: _types.UserActionFieldType.Old
  });
  return { ...doc,
    attributes: { ...restAttributes,
      action,
      action_field,
      new_value: transformedNewValue,
      old_value: transformedOldValue
    },
    references: [...references, ...newValueConnectorRefs, ...oldValueConnectorRefs]
  };
}

const userActionsMigrations = {
  '7.10.0': doc => {
    const {
      action_field,
      new_value,
      old_value,
      ...restAttributes
    } = doc.attributes;

    if (action_field == null || !Array.isArray(action_field) || action_field[0] !== 'connector_id') {
      return { ...doc,
        references: doc.references || []
      };
    }

    return { ...doc,
      attributes: { ...restAttributes,
        action_field: ['connector'],
        new_value: new_value != null ? JSON.stringify({
          id: new_value,
          name: 'none',
          type: _common.ConnectorTypes.none,
          fields: null
        }) : new_value,
        old_value: old_value != null ? JSON.stringify({
          id: old_value,
          name: 'none',
          type: _common.ConnectorTypes.none,
          fields: null
        }) : old_value
      },
      references: doc.references || []
    };
  },
  '7.14.0': doc => {
    return (0, _.addOwnerToSO)(doc);
  },
  '7.16.0': userActionsConnectorIdMigration
};
exports.userActionsMigrations = userActionsMigrations;