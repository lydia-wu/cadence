"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventLogClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _server = require("../../../../../../../../src/core/server");

var _server2 = require("../../../../../../event_log/server");

var _schemas = require("../../../../../common/detection_engine/schemas/common/schemas");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const spaceIdToNamespace = _server.SavedObjectsUtils.namespaceStringToId;
const statusSeverityDict = {
  [_schemas.RuleExecutionStatus.succeeded]: 0,
  [_schemas.RuleExecutionStatus['going to run']]: 10,
  [_schemas.RuleExecutionStatus.warning]: 20,
  [_schemas.RuleExecutionStatus['partial failure']]: 20,
  [_schemas.RuleExecutionStatus.failed]: 30
};

class EventLogClient {
  constructor(eventLogService) {
    (0, _defineProperty2.default)(this, "sequence", 0);
    (0, _defineProperty2.default)(this, "eventLogger", void 0);
    this.eventLogger = eventLogService.getLogger({
      event: {
        provider: _constants.RULE_EXECUTION_LOG_PROVIDER
      }
    });
  }

  async find({
    ruleIds,
    spaceId,
    statuses,
    logsCount = 1
  }) {
    return {}; // TODO implement
  }

  logExecutionMetrics({
    ruleId,
    ruleName,
    ruleType,
    metrics,
    spaceId
  }) {
    this.eventLogger.logEvent({
      rule: {
        id: ruleId,
        name: ruleName,
        category: ruleType
      },
      event: {
        kind: 'metric',
        action: _constants.RuleExecutionLogAction['execution-metrics'],
        sequence: this.sequence++
      },
      kibana: {
        alert: {
          rule: {
            execution: {
              metrics: {
                execution_gap_duration_s: metrics.executionGapDuration,
                total_search_duration_ms: metrics.totalSearchDuration,
                total_indexing_duration_ms: metrics.totalIndexingDuration
              }
            }
          }
        },
        space_ids: [spaceId],
        saved_objects: [{
          rel: _server2.SAVED_OBJECT_REL_PRIMARY,
          type: _constants.ALERT_SAVED_OBJECT_TYPE,
          id: ruleId,
          namespace: spaceIdToNamespace(spaceId)
        }]
      }
    });
  }

  logStatusChange({
    ruleId,
    ruleName,
    ruleType,
    newStatus,
    message,
    spaceId
  }) {
    this.eventLogger.logEvent({
      rule: {
        id: ruleId,
        name: ruleName,
        category: ruleType
      },
      event: {
        kind: 'event',
        action: _constants.RuleExecutionLogAction['status-change'],
        sequence: this.sequence++
      },
      message,
      kibana: {
        alert: {
          rule: {
            execution: {
              status: newStatus,
              status_order: statusSeverityDict[newStatus]
            }
          }
        },
        space_ids: [spaceId],
        saved_objects: [{
          rel: _server2.SAVED_OBJECT_REL_PRIMARY,
          type: _constants.ALERT_SAVED_OBJECT_TYPE,
          id: ruleId,
          namespace: spaceIdToNamespace(spaceId)
        }]
      }
    });
  }

}

exports.EventLogClient = EventLogClient;