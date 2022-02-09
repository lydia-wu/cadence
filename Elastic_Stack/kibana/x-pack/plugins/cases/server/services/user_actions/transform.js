"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PushConnectorIdReferenceName = exports.ConnectorIdReferenceName = void 0;
exports.extractConnectorId = extractConnectorId;
exports.extractConnectorIdFromJson = extractConnectorIdFromJson;
exports.extractConnectorIdHelper = extractConnectorIdHelper;
exports.transformPushConnectorIdToReference = exports.transformConnectorIdToReference = void 0;

var _lodash = require("lodash");

var _common = require("../../../common");

var _common2 = require("../../common");

var _server = require("../../../../actions/server");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Extracts the connector id from a json encoded string and formats it as a saved object reference. This will remove
 * the field it extracted the connector id from.
 */


function extractConnectorIdFromJson({
  action,
  actionFields,
  actionDetails,
  fieldType
}) {
  if (!action || !actionFields || !actionDetails) {
    return {
      transformedActionDetails: actionDetails,
      references: []
    };
  }

  const decodedJson = JSON.parse(actionDetails);
  return extractConnectorIdHelper({
    action,
    actionFields,
    actionDetails: decodedJson,
    fieldType
  });
}
/**
 * Extracts the connector id from an unencoded object and formats it as a saved object reference.
 * This will remove the field it extracted the connector id from.
 */


function extractConnectorId({
  action,
  actionFields,
  actionDetails,
  fieldType
}) {
  if (!actionDetails || (0, _lodash.isString)(actionDetails)) {
    // the action was null, undefined, or a regular string so just return it unmodified and not encoded
    return {
      transformedActionDetails: actionDetails,
      references: []
    };
  }

  try {
    return extractConnectorIdHelper({
      action,
      actionFields,
      actionDetails,
      fieldType
    });
  } catch (error) {
    return {
      transformedActionDetails: encodeActionDetails(actionDetails),
      references: []
    };
  }
}

function encodeActionDetails(actionDetails) {
  try {
    return JSON.stringify(actionDetails);
  } catch (error) {
    return null;
  }
}
/**
 * Internal helper function for extracting the connector id. This is only exported for usage in unit tests.
 * This function handles encoding the transformed fields as a json string
 */


function extractConnectorIdHelper({
  action,
  actionFields,
  actionDetails,
  fieldType
}) {
  let transformedActionDetails = actionDetails;
  let referencesToReturn = [];

  try {
    if (isCreateCaseConnector(action, actionFields, actionDetails)) {
      const {
        transformedActionDetails: transformedConnectorPortion,
        references
      } = transformConnectorFromCreateAndUpdateAction(actionDetails.connector, fieldType); // the above call only transforms the connector portion of the action details so let's add back
      // the rest of the details and we'll overwrite the connector portion when the transformed one

      transformedActionDetails = { ...actionDetails,
        ...transformedConnectorPortion
      };
      referencesToReturn = references;
    } else if (isUpdateCaseConnector(action, actionFields, actionDetails)) {
      const {
        transformedActionDetails: {
          connector: transformedConnector
        },
        references
      } = transformConnectorFromCreateAndUpdateAction(actionDetails, fieldType);
      transformedActionDetails = transformedConnector;
      referencesToReturn = references;
    } else if (isPushConnector(action, actionFields, actionDetails)) {
      ({
        transformedActionDetails,
        references: referencesToReturn
      } = transformConnectorFromPushAction(actionDetails, fieldType));
    }
  } catch (error) {// ignore any errors, we'll just return whatever was passed in for action details in that case
  }

  return {
    transformedActionDetails: JSON.stringify(transformedActionDetails),
    references: referencesToReturn
  };
}

function isCreateCaseConnector(action, actionFields, actionDetails) {
  try {
    const unsafeCase = actionDetails;
    return (0, _common.isCreateConnector)(action, actionFields) && unsafeCase.connector !== undefined && _common.CaseConnectorRt.is(unsafeCase.connector);
  } catch {
    return false;
  }
}

const ConnectorIdReferenceName = {
  [_types.UserActionFieldType.New]: _common2.CONNECTOR_ID_REFERENCE_NAME,
  [_types.UserActionFieldType.Old]: _common2.USER_ACTION_OLD_ID_REF_NAME
};
exports.ConnectorIdReferenceName = ConnectorIdReferenceName;

function transformConnectorFromCreateAndUpdateAction(connector, fieldType) {
  const {
    transformedConnector,
    references
  } = transformConnectorIdToReference(ConnectorIdReferenceName[fieldType], connector);
  return {
    transformedActionDetails: transformedConnector,
    references
  };
}

const transformConnectorIdToReference = (referenceName, connector) => {
  const {
    id: connectorId,
    ...restConnector
  } = connector !== null && connector !== void 0 ? connector : {};
  const references = createConnectorReference(connectorId, _server.ACTION_SAVED_OBJECT_TYPE, referenceName);
  const {
    id: ignoreNoneId,
    ...restNoneConnector
  } = (0, _common2.getNoneCaseConnector)();
  const connectorFieldsToReturn = connector && isConnectorIdValid(connectorId) ? restConnector : restNoneConnector;
  return {
    transformedConnector: {
      connector: connectorFieldsToReturn
    },
    references
  };
};

exports.transformConnectorIdToReference = transformConnectorIdToReference;

const createConnectorReference = (id, type, name) => {
  return isConnectorIdValid(id) ? [{
    id,
    type,
    name
  }] : [];
};

const isConnectorIdValid = id => id != null && id !== _common.noneConnectorId;

function isUpdateCaseConnector(action, actionFields, actionDetails) {
  try {
    return (0, _common.isUpdateConnector)(action, actionFields) && _common.CaseConnectorRt.is(actionDetails);
  } catch {
    return false;
  }
}

function isPushConnector(action, actionFields, actionDetails) {
  try {
    return (0, _common.isPush)(action, actionFields) && _common.CaseExternalServiceBasicRt.is(actionDetails);
  } catch {
    return false;
  }
}

const PushConnectorIdReferenceName = {
  [_types.UserActionFieldType.New]: _common2.PUSH_CONNECTOR_ID_REFERENCE_NAME,
  [_types.UserActionFieldType.Old]: _common2.USER_ACTION_OLD_PUSH_ID_REF_NAME
};
exports.PushConnectorIdReferenceName = PushConnectorIdReferenceName;

function transformConnectorFromPushAction(externalService, fieldType) {
  const {
    transformedPushConnector,
    references
  } = transformPushConnectorIdToReference(PushConnectorIdReferenceName[fieldType], externalService);
  return {
    transformedActionDetails: transformedPushConnector.external_service,
    references
  };
}

const transformPushConnectorIdToReference = (referenceName, external_service) => {
  const {
    connector_id: pushConnectorId,
    ...restExternalService
  } = external_service !== null && external_service !== void 0 ? external_service : {};
  const references = createConnectorReference(pushConnectorId, _server.ACTION_SAVED_OBJECT_TYPE, referenceName);
  return {
    transformedPushConnector: {
      external_service: external_service ? restExternalService : null
    },
    references
  };
};

exports.transformPushConnectorIdToReference = transformPushConnectorIdToReference;