"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FleetActionGenerator = void 0;

var _lodash = require("lodash");

var _base_data_generator = require("./base_data_generator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ISOLATION_COMMANDS = ['isolate', 'unisolate'];

class FleetActionGenerator extends _base_data_generator.BaseDataGenerator {
  /** Generate a random endpoint Action (isolate or unisolate) */
  generate(overrides = {}) {
    const timeStamp = new Date(this.randomPastDate());
    return (0, _lodash.merge)({
      action_id: this.randomUUID(),
      '@timestamp': timeStamp.toISOString(),
      expiration: this.randomFutureDate(timeStamp),
      type: 'INPUT_ACTION',
      input_type: 'endpoint',
      agents: [this.randomUUID()],
      user_id: 'elastic',
      data: {
        command: this.randomIsolateCommand(),
        comment: this.randomString(15)
      }
    }, overrides);
  }

  generateIsolateAction(overrides = {}) {
    return (0, _lodash.merge)(this.generate({
      data: {
        command: 'isolate'
      }
    }), overrides);
  }

  generateUnIsolateAction(overrides = {}) {
    return (0, _lodash.merge)(this.generate({
      data: {
        command: 'unisolate'
      }
    }), overrides);
  }
  /** Generates an endpoint action response */


  generateResponse(overrides = {}) {
    const timeStamp = new Date();
    return (0, _lodash.merge)({
      action_data: {
        command: this.randomIsolateCommand(),
        comment: ''
      },
      action_id: this.randomUUID(),
      agent_id: this.randomUUID(),
      started_at: this.randomPastDate(),
      completed_at: timeStamp.toISOString(),
      error: 'some error happen',
      '@timestamp': timeStamp.toISOString()
    }, overrides);
  }

  randomFloat() {
    return this.random();
  }

  randomN(max) {
    return super.randomN(max);
  }

  randomIsolateCommand() {
    return this.randomChoice(ISOLATION_COMMANDS);
  }

}

exports.FleetActionGenerator = FleetActionGenerator;