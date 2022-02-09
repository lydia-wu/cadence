"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyGetBulkRuleActionsSavedObject = void 0;

var _legacy_saved_object_mappings = require("./legacy_saved_object_mappings");

var _legacy_utils = require("./legacy_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line no-restricted-imports
// eslint-disable-next-line no-restricted-imports

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */


const legacyGetBulkRuleActionsSavedObject = async ({
  alertIds,
  savedObjectsClient,
  logger
}) => {
  const references = alertIds.map(alertId => ({
    id: alertId,
    type: 'alert'
  }));
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    saved_objects
  } = await savedObjectsClient.find({
    type: _legacy_saved_object_mappings.legacyRuleActionsSavedObjectType,
    perPage: 10000,
    hasReference: references
  });
  return saved_objects.reduce((acc, savedObject) => {
    const ruleAlertId = savedObject.references.find(reference => {
      // Find the first rule alert and assume that is the one we want since we should only ever have 1.
      return reference.type === 'alert';
    }); // We check to ensure we have found a "ruleAlertId" and hopefully we have.

    const ruleAlertIdKey = ruleAlertId != null ? ruleAlertId.id : undefined;

    if (ruleAlertIdKey != null) {
      acc[ruleAlertIdKey] = (0, _legacy_utils.legacyGetRuleActionsFromSavedObject)(savedObject, logger);
    } else {
      logger.error(`Security Solution notification (Legacy) Was expecting to find a reference of type "alert" within ${savedObject.references} but did not. Skipping this notification.`);
    }

    return acc;
  }, {});
};

exports.legacyGetBulkRuleActionsSavedObject = legacyGetBulkRuleActionsSavedObject;