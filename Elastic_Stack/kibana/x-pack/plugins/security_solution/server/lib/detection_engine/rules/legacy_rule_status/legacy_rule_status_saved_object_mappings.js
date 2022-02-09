"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleStatusSavedObjectMappings = exports.legacyRuleStatusType = exports.legacyRuleStatusSavedObjectType = void 0;

var _legacy_migrations = require("./legacy_migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line no-restricted-imports

/**
 * This side-car rule status SO is deprecated and is to be replaced by the RuleExecutionLog on Event-Log and
 * additional fields on the Alerting Framework Rule SO.
 *
 * @deprecated Remove this once we've fully migrated to event-log and no longer require addition status SO (8.x)
 */


const legacyRuleStatusSavedObjectType = 'siem-detection-engine-rule-status';
/**
 * This side-car rule status SO is deprecated and is to be replaced by the RuleExecutionLog on Event-Log and
 * additional fields on the Alerting Framework Rule SO.
 *
 * @deprecated Remove this once we've fully migrated to event-log and no longer require addition status SO (8.x)
 */

exports.legacyRuleStatusSavedObjectType = legacyRuleStatusSavedObjectType;
const ruleStatusSavedObjectMappings = {
  properties: {
    status: {
      type: 'keyword'
    },
    statusDate: {
      type: 'date'
    },
    lastFailureAt: {
      type: 'date'
    },
    lastSuccessAt: {
      type: 'date'
    },
    lastFailureMessage: {
      type: 'text'
    },
    lastSuccessMessage: {
      type: 'text'
    },
    lastLookBackDate: {
      type: 'date'
    },
    gap: {
      type: 'text'
    },
    bulkCreateTimeDurations: {
      type: 'float'
    },
    searchAfterTimeDurations: {
      type: 'float'
    }
  }
};
/**
 * This side-car rule status SO is deprecated and is to be replaced by the RuleExecutionLog on Event-Log and
 * additional fields on the Alerting Framework Rule SO.
 *
 * @deprecated Remove this once we've fully migrated to event-log and no longer require addition status SO (8.x)
 */

exports.ruleStatusSavedObjectMappings = ruleStatusSavedObjectMappings;
const legacyRuleStatusType = {
  name: legacyRuleStatusSavedObjectType,
  hidden: false,
  namespaceType: 'single',
  mappings: ruleStatusSavedObjectMappings,
  migrations: _legacy_migrations.legacyRuleStatusSavedObjectMigration
};
exports.legacyRuleStatusType = legacyRuleStatusType;