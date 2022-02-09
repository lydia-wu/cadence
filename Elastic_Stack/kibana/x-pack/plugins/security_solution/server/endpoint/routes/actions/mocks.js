"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockSearchResult = exports.mockAuditLogSearchResult = exports.aMockResponse = exports.aMockEndpointResponse = exports.aMockAction = exports.MockResponse = exports.MockEndpointResponse = exports.MockAction = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _moment = _interopRequireDefault(require("moment"));

var _uuid = _interopRequireDefault(require("uuid"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable max-classes-per-file */

/* eslint-disable @typescript-eslint/no-useless-constructor */


const mockAuditLogSearchResult = results => {
  var _results$length, _results$map;

  const response = {
    body: {
      hits: {
        total: {
          value: (_results$length = results === null || results === void 0 ? void 0 : results.length) !== null && _results$length !== void 0 ? _results$length : 0,
          relation: 'eq'
        },
        hits: (_results$map = results === null || results === void 0 ? void 0 : results.map(a => ({
          _index: a._index,
          _id: Math.random().toString(36).split('.')[1],
          _score: 0.0,
          _source: a._source
        }))) !== null && _results$map !== void 0 ? _results$map : []
      }
    },
    statusCode: 200,
    headers: {},
    warnings: [],
    meta: {}
  };
  return response;
};

exports.mockAuditLogSearchResult = mockAuditLogSearchResult;

const mockSearchResult = (results = []) => {
  return {
    body: {
      hits: {
        hits: results.map(a => ({
          _source: a
        }))
      }
    },
    statusCode: 200,
    headers: {},
    warnings: [],
    meta: {}
  };
};

exports.mockSearchResult = mockSearchResult;

class MockAction {
  constructor() {
    (0, _defineProperty2.default)(this, "actionID", _uuid.default.v4());
    (0, _defineProperty2.default)(this, "ts", (0, _moment.default)());
    (0, _defineProperty2.default)(this, "user", '');
    (0, _defineProperty2.default)(this, "agents", []);
    (0, _defineProperty2.default)(this, "command", 'isolate');
    (0, _defineProperty2.default)(this, "comment", void 0);
  }

  build() {
    return {
      action_id: this.actionID,
      '@timestamp': this.ts.toISOString(),
      expiration: this.ts.add(2, 'weeks').toISOString(),
      type: 'INPUT_ACTION',
      input_type: 'endpoint',
      agents: this.agents,
      user_id: this.user,
      data: {
        command: this.command,
        comment: this.comment
      }
    };
  }

  fromUser(u) {
    this.user = u;
    return this;
  }

  withAgents(a) {
    this.agents = a;
    return this;
  }

  withAgent(a) {
    this.agents = [a];
    return this;
  }

  withComment(c) {
    this.comment = c;
    return this;
  }

  withAction(a) {
    this.command = a;
    return this;
  }

  atTime(m) {
    if (m instanceof Date) {
      this.ts = (0, _moment.default)(m);
    } else {
      this.ts = m;
    }

    return this;
  }

  withID(id) {
    this.actionID = id;
    return this;
  }

}

exports.MockAction = MockAction;

const aMockAction = () => {
  return new MockAction();
};

exports.aMockAction = aMockAction;

class MockResponse {
  constructor() {
    (0, _defineProperty2.default)(this, "actionID", _uuid.default.v4());
    (0, _defineProperty2.default)(this, "ts", (0, _moment.default)());
    (0, _defineProperty2.default)(this, "started", (0, _moment.default)());
    (0, _defineProperty2.default)(this, "completed", (0, _moment.default)());
    (0, _defineProperty2.default)(this, "agent", '');
    (0, _defineProperty2.default)(this, "command", 'isolate');
    (0, _defineProperty2.default)(this, "comment", void 0);
    (0, _defineProperty2.default)(this, "error", void 0);
    (0, _defineProperty2.default)(this, "ack", void 0);
  }

  build() {
    return {
      '@timestamp': this.ts.toISOString(),
      action_id: this.actionID,
      agent_id: this.agent,
      started_at: this.started.toISOString(),
      completed_at: this.completed.toISOString(),
      error: this.error,
      action_data: {
        command: this.command,
        comment: this.comment
      },
      action_response: {
        endpoint: {
          ack: this.ack
        }
      }
    };
  }

  withAck(ack) {
    this.ack = ack;
    return this;
  }

  forAction(id) {
    this.actionID = id;
    return this;
  }

  forAgent(id) {
    this.agent = id;
    return this;
  }

}

exports.MockResponse = MockResponse;

const aMockResponse = (actionID, agentID, ack) => {
  return new MockResponse().forAction(actionID).forAgent(agentID).withAck(ack);
};

exports.aMockResponse = aMockResponse;

class MockEndpointResponse {
  constructor() {
    (0, _defineProperty2.default)(this, "actionID", _uuid.default.v4());
    (0, _defineProperty2.default)(this, "ts", (0, _moment.default)());
    (0, _defineProperty2.default)(this, "started", (0, _moment.default)());
    (0, _defineProperty2.default)(this, "completed", (0, _moment.default)());
    (0, _defineProperty2.default)(this, "agent", '');
    (0, _defineProperty2.default)(this, "command", 'isolate');
    (0, _defineProperty2.default)(this, "comment", void 0);
    (0, _defineProperty2.default)(this, "error", void 0);
  }

  build() {
    var _this$error;

    return {
      '@timestamp': this.ts.toISOString(),
      EndpointActions: {
        action_id: this.actionID,
        completed_at: this.completed.toISOString(),
        data: {
          command: this.command,
          comment: this.comment
        },
        started_at: this.started.toISOString()
      },
      agent: {
        id: this.agent
      },
      error: {
        message: (_this$error = this.error) !== null && _this$error !== void 0 ? _this$error : ''
      }
    };
  }

  forAction(id) {
    this.actionID = id;
    return this;
  }

  forAgent(id) {
    this.agent = id;
    return this;
  }

}

exports.MockEndpointResponse = MockEndpointResponse;

const aMockEndpointResponse = (actionID, agentID) => {
  return new MockEndpointResponse().forAction(actionID).forAgent(agentID);
};

exports.aMockEndpointResponse = aMockEndpointResponse;