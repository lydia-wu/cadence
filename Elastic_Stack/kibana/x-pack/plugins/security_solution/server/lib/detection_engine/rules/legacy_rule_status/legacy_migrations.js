"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncateMessageFields = exports.legacyRuleStatusSavedObjectMigration = exports.legacyMigrateRuleAlertIdSOReferences = exports.legacyMigrateAlertId = void 0;

var _fp = require("lodash/fp");

var _rule_execution_log = require("../../rule_execution_log");

var _legacy_utils = require("./legacy_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line no-restricted-imports


const truncateMessageFields = doc => {
  var _doc$references;

  const {
    lastFailureMessage,
    lastSuccessMessage,
    ...otherAttributes
  } = doc.attributes;
  return { ...doc,
    attributes: { ...otherAttributes,
      lastFailureMessage: (0, _rule_execution_log.truncateMessage)(lastFailureMessage),
      lastSuccessMessage: (0, _rule_execution_log.truncateMessage)(lastSuccessMessage)
    },
    references: (_doc$references = doc.references) !== null && _doc$references !== void 0 ? _doc$references : []
  };
};
/**
 * This migrates alertId within legacy `siem-detection-engine-rule-status` to saved object references on an upgrade.
 * We only migrate alertId if we find these conditions:
 *   - alertId is a string and not null, undefined, or malformed data.
 *   - The existing references do not already have a alertId found within it.
 *
 * Some of these issues could crop up during either user manual errors of modifying things, earlier migration
 * issues, etc... so we are safer to check them as possibilities
 *
 * @deprecated Remove this once we've fully migrated to event-log and no longer require addition status SO (8.x)
 * @param doc The document having an alertId to migrate into references
 * @returns The document migrated with saved object references
 */


exports.truncateMessageFields = truncateMessageFields;

const legacyMigrateRuleAlertIdSOReferences = doc => {
  var _doc$references2;

  const {
    alertId,
    ...otherAttributes
  } = doc.attributes;
  const existingReferences = (_doc$references2 = doc.references) !== null && _doc$references2 !== void 0 ? _doc$references2 : []; // early return if alertId is not a string as expected, still removing alertId as the mapping no longer exists

  if (!(0, _fp.isString)(alertId)) {
    return { ...doc,
      attributes: otherAttributes,
      references: existingReferences
    };
  }

  const alertReferences = legacyMigrateAlertId({
    alertId,
    existingReferences
  });
  return { ...doc,
    attributes: otherAttributes,
    references: [...existingReferences, ...alertReferences]
  };
};
/**
 * This is a helper to migrate "alertId"
 *
 * @deprecated Remove this once we've fully migrated to event-log and no longer require addition status SO (8.x)
 *
 * @param existingReferences The existing saved object references
 * @param alertId The alertId to migrate
 *
 * @returns The savedObjectReferences migrated
 */


exports.legacyMigrateRuleAlertIdSOReferences = legacyMigrateRuleAlertIdSOReferences;

const legacyMigrateAlertId = ({
  existingReferences,
  alertId
}) => {
  const existingReferenceFound = existingReferences.find(reference => {
    return reference.id === alertId && reference.type === 'alert';
  });

  if (existingReferenceFound) {
    return [];
  } else {
    return [(0, _legacy_utils.legacyGetRuleReference)(alertId)];
  }
};
/**
 * This side-car rule status SO is deprecated and is to be replaced by the RuleExecutionLog on Event-Log and
 * additional fields on the Alerting Framework Rule SO.
 *
 * @deprecated Remove this once we've fully migrated to event-log and no longer require addition status SO (8.x)
 */


exports.legacyMigrateAlertId = legacyMigrateAlertId;
const legacyRuleStatusSavedObjectMigration = {
  '7.15.2': truncateMessageFields,
  '7.16.0': legacyMigrateRuleAlertIdSOReferences
};
exports.legacyRuleStatusSavedObjectMigration = legacyRuleStatusSavedObjectMigration;