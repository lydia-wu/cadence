"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsAdapter = exports.MAX_RULE_STATUSES = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _schemas = require("../../../../../common/detection_engine/schemas/common/schemas");

var _legacy_utils = require("../../rules/legacy_rule_status/legacy_utils");

var _rule_status_saved_objects_client = require("./rule_status_saved_objects_client");

var _common = require("../../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line no-restricted-imports
// 1st is mutable status, followed by 5 most recent failures


const MAX_RULE_STATUSES = 6;
exports.MAX_RULE_STATUSES = MAX_RULE_STATUSES;

const convertMetricFields = metrics => {
  var _metrics$executionGap;

  return {
    gap: (_metrics$executionGap = metrics.executionGap) === null || _metrics$executionGap === void 0 ? void 0 : _metrics$executionGap.humanize(),
    searchAfterTimeDurations: metrics.searchDurations,
    bulkCreateTimeDurations: metrics.indexingDurations
  };
};

class SavedObjectsAdapter {
  constructor(savedObjectsClient) {
    (0, _defineProperty2.default)(this, "ruleStatusClient", void 0);
    (0, _defineProperty2.default)(this, "createNewRuleStatus", async ruleId => {
      const references = [(0, _legacy_utils.legacyGetRuleReference)(ruleId)];
      const now = new Date().toISOString();
      return this.ruleStatusClient.create({
        statusDate: now,
        status: _schemas.RuleExecutionStatus['going to run'],
        lastFailureAt: null,
        lastSuccessAt: null,
        lastFailureMessage: null,
        lastSuccessMessage: null,
        gap: null,
        bulkCreateTimeDurations: [],
        searchAfterTimeDurations: [],
        lastLookBackDate: null
      }, {
        references
      });
    });
    (0, _defineProperty2.default)(this, "getOrCreateRuleStatuses", async ruleId => {
      const ruleStatuses = await this.find({
        spaceId: '',
        // spaceId is a required argument but it's not used by savedObjectsClient, any string would work here
        ruleId,
        logsCount: MAX_RULE_STATUSES
      });

      if (ruleStatuses.length > 0) {
        return ruleStatuses;
      }

      const newStatus = await this.createNewRuleStatus(ruleId);
      return [newStatus];
    });
    this.ruleStatusClient = (0, _rule_status_saved_objects_client.ruleStatusSavedObjectsClientFactory)(savedObjectsClient);
  }

  find({
    ruleId,
    logsCount = 1
  }) {
    return this.ruleStatusClient.find({
      perPage: logsCount,
      sortField: 'statusDate',
      sortOrder: 'desc',
      ruleId
    });
  }

  findBulk({
    ruleIds,
    logsCount = 1
  }) {
    return this.ruleStatusClient.findBulk(ruleIds, logsCount);
  }

  async update({
    id,
    attributes,
    ruleId
  }) {
    const references = [(0, _legacy_utils.legacyGetRuleReference)(ruleId)];
    await this.ruleStatusClient.update(id, attributes, {
      references
    });
  }

  async delete(id) {
    await this.ruleStatusClient.delete(id);
  }

  async logExecutionMetrics({
    ruleId,
    metrics
  }) {
    const references = [(0, _legacy_utils.legacyGetRuleReference)(ruleId)];
    const [currentStatus] = await this.getOrCreateRuleStatuses(ruleId);
    await this.ruleStatusClient.update(currentStatus.id, { ...currentStatus.attributes,
      ...convertMetricFields(metrics)
    }, {
      references
    });
  }

  async logStatusChange({
    newStatus,
    ruleId,
    message,
    metrics
  }) {
    const references = [(0, _legacy_utils.legacyGetRuleReference)(ruleId)];

    switch (newStatus) {
      case _schemas.RuleExecutionStatus['going to run']:
      case _schemas.RuleExecutionStatus.succeeded:
      case _schemas.RuleExecutionStatus.warning:
      case _schemas.RuleExecutionStatus['partial failure']:
        {
          const [currentStatus] = await this.getOrCreateRuleStatuses(ruleId);
          await this.ruleStatusClient.update(currentStatus.id, { ...currentStatus.attributes,
            ...buildRuleStatusAttributes(newStatus, message, metrics)
          }, {
            references
          });
          return;
        }

      case _schemas.RuleExecutionStatus.failed:
        {
          const ruleStatuses = await this.getOrCreateRuleStatuses(ruleId);
          const [currentStatus] = ruleStatuses;
          const failureAttributes = { ...currentStatus.attributes,
            ...buildRuleStatusAttributes(_schemas.RuleExecutionStatus.failed, message, metrics)
          }; // We always update the newest status, so to 'persist' a failure we push a copy to the head of the list

          await this.ruleStatusClient.update(currentStatus.id, failureAttributes, {
            references
          });
          const lastStatus = await this.ruleStatusClient.create(failureAttributes, {
            references
          }); // drop oldest failures

          const oldStatuses = [lastStatus, ...ruleStatuses].slice(MAX_RULE_STATUSES);
          await Promise.all(oldStatuses.map(status => this.delete(status.id)));
          return;
        }

      default:
        (0, _common.assertUnreachable)(newStatus, 'Unknown rule execution status supplied to logStatusChange');
    }
  }

}

exports.SavedObjectsAdapter = SavedObjectsAdapter;

const buildRuleStatusAttributes = (status, message, metrics = {}) => {
  const now = new Date().toISOString();
  const baseAttributes = { ...convertMetricFields(metrics),
    status: status === _schemas.RuleExecutionStatus.warning ? _schemas.RuleExecutionStatus['partial failure'] : status,
    statusDate: now
  };

  switch (status) {
    case _schemas.RuleExecutionStatus.succeeded:
    case _schemas.RuleExecutionStatus.warning:
    case _schemas.RuleExecutionStatus['partial failure']:
      {
        return { ...baseAttributes,
          lastSuccessAt: now,
          lastSuccessMessage: message
        };
      }

    case _schemas.RuleExecutionStatus.failed:
      {
        return { ...baseAttributes,
          lastFailureAt: now,
          lastFailureMessage: message
        };
      }

    case _schemas.RuleExecutionStatus['going to run']:
      {
        return baseAttributes;
      }
  }
};