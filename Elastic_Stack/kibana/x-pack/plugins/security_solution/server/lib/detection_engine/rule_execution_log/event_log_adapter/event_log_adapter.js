"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventLogAdapter = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _saved_objects_adapter = require("../saved_objects_adapter/saved_objects_adapter");

var _event_log_client = require("./event_log_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class EventLogAdapter {
  /**
   * @deprecated Saved objects adapter is used during the transition period while the event log doesn't support all features needed to implement the execution log.
   * We use savedObjectsAdapter to write/read the latest rule execution status and eventLogClient to read/write historical execution data.
   * We can remove savedObjectsAdapter as soon as the event log supports all methods that we need (find, findBulk).
   */
  constructor(eventLogService, savedObjectsClient) {
    (0, _defineProperty2.default)(this, "eventLogClient", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsAdapter", void 0);
    this.eventLogClient = new _event_log_client.EventLogClient(eventLogService);
    this.savedObjectsAdapter = new _saved_objects_adapter.SavedObjectsAdapter(savedObjectsClient);
  }

  async find(args) {
    return this.savedObjectsAdapter.find(args);
  }

  async findBulk(args) {
    return this.savedObjectsAdapter.findBulk(args);
  }

  async update(args) {
    const {
      attributes,
      spaceId,
      ruleId,
      ruleName,
      ruleType
    } = args;
    await this.savedObjectsAdapter.update(args); // EventLog execution events are immutable, so we just log a status change istead of updating previous

    if (attributes.status) {
      this.eventLogClient.logStatusChange({
        ruleName,
        ruleType,
        ruleId,
        newStatus: attributes.status,
        spaceId
      });
    }
  }

  async delete(id) {
    await this.savedObjectsAdapter.delete(id); // EventLog execution events are immutable, nothing to do here
  }

  async logExecutionMetrics(args) {
    var _metrics$executionGap;

    const {
      ruleId,
      spaceId,
      ruleType,
      ruleName,
      metrics
    } = args;
    await this.savedObjectsAdapter.logExecutionMetrics(args);
    this.eventLogClient.logExecutionMetrics({
      ruleId,
      ruleName,
      ruleType,
      spaceId,
      metrics: {
        executionGapDuration: (_metrics$executionGap = metrics.executionGap) === null || _metrics$executionGap === void 0 ? void 0 : _metrics$executionGap.asSeconds(),
        totalIndexingDuration: metrics.indexingDurations ? (0, _lodash.sum)(metrics.indexingDurations.map(Number)) : undefined,
        totalSearchDuration: metrics.searchDurations ? (0, _lodash.sum)(metrics.searchDurations.map(Number)) : undefined
      }
    });
  }

  async logStatusChange(args) {
    await this.savedObjectsAdapter.logStatusChange(args);

    if (args.metrics) {
      await this.logExecutionMetrics({
        ruleId: args.ruleId,
        ruleName: args.ruleName,
        ruleType: args.ruleType,
        spaceId: args.spaceId,
        metrics: args.metrics
      });
    }

    this.eventLogClient.logStatusChange(args);
  }

}

exports.EventLogAdapter = EventLogAdapter;