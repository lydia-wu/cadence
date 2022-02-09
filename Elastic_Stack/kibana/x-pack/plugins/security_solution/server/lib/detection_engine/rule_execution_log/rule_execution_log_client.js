"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleExecutionLogClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _event_log_adapter = require("./event_log_adapter/event_log_adapter");

var _saved_objects_adapter = require("./saved_objects_adapter/saved_objects_adapter");

var _types = require("./types");

var _normalization = require("./utils/normalization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class RuleExecutionLogClient {
  constructor({
    savedObjectsClient,
    eventLogService,
    underlyingClient
  }) {
    (0, _defineProperty2.default)(this, "client", void 0);

    switch (underlyingClient) {
      case _types.UnderlyingLogClient.savedObjects:
        this.client = new _saved_objects_adapter.SavedObjectsAdapter(savedObjectsClient);
        break;

      case _types.UnderlyingLogClient.eventLog:
        this.client = new _event_log_adapter.EventLogAdapter(eventLogService, savedObjectsClient);
        break;
    }
  }

  find(args) {
    return this.client.find(args);
  }

  findBulk(args) {
    return this.client.findBulk(args);
  }

  async update(args) {
    const {
      lastFailureMessage,
      lastSuccessMessage,
      ...restAttributes
    } = args.attributes;
    return this.client.update({ ...args,
      attributes: {
        lastFailureMessage: (0, _normalization.truncateMessage)(lastFailureMessage),
        lastSuccessMessage: (0, _normalization.truncateMessage)(lastSuccessMessage),
        ...restAttributes
      }
    });
  }

  async delete(id) {
    return this.client.delete(id);
  }

  async logExecutionMetrics(args) {
    return this.client.logExecutionMetrics(args);
  }

  async logStatusChange(args) {
    const message = args.message ? (0, _normalization.truncateMessage)(args.message) : args.message;
    return this.client.logStatusChange({ ...args,
      message
    });
  }

}

exports.RuleExecutionLogClient = RuleExecutionLogClient;