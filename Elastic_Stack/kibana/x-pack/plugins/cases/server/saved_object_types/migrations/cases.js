"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.caseMigrations = exports.caseConnectorIdMigration = void 0;

var _ = require(".");

var _common = require("../../../common");

var _transform = require("../../services/user_actions/transform");

var _common2 = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */


const caseConnectorIdMigration = doc => {
  // removing the id field since it will be stored in the references instead
  const {
    connector,
    external_service,
    ...restAttributes
  } = doc.attributes;
  const {
    transformedConnector,
    references: connectorReferences
  } = (0, _transform.transformConnectorIdToReference)(_common2.CONNECTOR_ID_REFERENCE_NAME, connector);
  const {
    transformedPushConnector,
    references: pushConnectorReferences
  } = (0, _transform.transformPushConnectorIdToReference)(_common2.PUSH_CONNECTOR_ID_REFERENCE_NAME, external_service);
  const {
    references = []
  } = doc;
  return { ...doc,
    attributes: { ...restAttributes,
      ...transformedConnector,
      ...transformedPushConnector
    },
    references: [...references, ...connectorReferences, ...pushConnectorReferences]
  };
};

exports.caseConnectorIdMigration = caseConnectorIdMigration;
const caseMigrations = {
  '7.10.0': doc => {
    const {
      connector_id,
      ...attributesWithoutConnectorId
    } = doc.attributes;
    return { ...doc,
      attributes: { ...attributesWithoutConnectorId,
        connector: {
          id: connector_id !== null && connector_id !== void 0 ? connector_id : 'none',
          name: 'none',
          type: _common.ConnectorTypes.none,
          fields: null
        }
      },
      references: doc.references || []
    };
  },
  '7.11.0': doc => {
    return { ...doc,
      attributes: { ...doc.attributes,
        settings: {
          syncAlerts: true
        }
      },
      references: doc.references || []
    };
  },
  '7.12.0': doc => {
    const {
      fields,
      type
    } = doc.attributes.connector;
    return { ...doc,
      attributes: { ...doc.attributes,
        type: _common.CaseType.individual,
        connector: { ...doc.attributes.connector,
          fields: Array.isArray(fields) && fields.length > 0 && type === _common.ConnectorTypes.serviceNowITSM ? [...fields, {
            key: 'category',
            value: null
          }, {
            key: 'subcategory',
            value: null
          }] : fields
        }
      },
      references: doc.references || []
    };
  },
  '7.14.0': doc => {
    return (0, _.addOwnerToSO)(doc);
  },
  '7.15.0': caseConnectorIdMigration
};
exports.caseMigrations = caseMigrations;