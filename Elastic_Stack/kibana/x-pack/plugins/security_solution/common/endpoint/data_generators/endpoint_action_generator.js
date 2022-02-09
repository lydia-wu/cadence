"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndpointActionGenerator = void 0;

var _lodash = require("lodash");

var _base_data_generator = require("./base_data_generator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ISOLATION_COMMANDS = ['isolate', 'unisolate'];

class EndpointActionGenerator extends _base_data_generator.BaseDataGenerator {
  /** Generate a random endpoint Action request (isolate or unisolate) */
  generate(overrides = {}) {
    const timeStamp = new Date(this.randomPastDate());
    return (0, _lodash.merge)({
      '@timestamp': timeStamp.toISOString(),
      agent: {
        id: [this.randomUUID()]
      },
      EndpointActions: {
        action_id: this.randomUUID(),
        expiration: this.randomFutureDate(timeStamp),
        type: 'INPUT_ACTION',
        input_type: 'endpoint',
        data: {
          command: this.randomIsolateCommand(),
          comment: this.randomString(15)
        }
      },
      error: undefined,
      user: {
        id: this.randomUser()
      }
    }, overrides);
  }

  generateIsolateAction(overrides = {}) {
    return (0, _lodash.merge)(this.generate({
      EndpointActions: {
        data: {
          command: 'isolate'
        }
      }
    }), overrides);
  }

  generateUnIsolateAction(overrides = {}) {
    return (0, _lodash.merge)(this.generate({
      EndpointActions: {
        data: {
          command: 'unisolate'
        }
      }
    }), overrides);
  }
  /** Generates an endpoint action response */


  generateResponse(overrides = {}) {
    const timeStamp = new Date();
    return (0, _lodash.merge)({
      '@timestamp': timeStamp.toISOString(),
      agent: {
        id: this.randomUUID()
      },
      EndpointActions: {
        action_id: this.randomUUID(),
        completed_at: timeStamp.toISOString(),
        data: {
          command: this.randomIsolateCommand(),
          comment: ''
        },
        started_at: this.randomPastDate()
      },
      error: undefined
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

exports.EndpointActionGenerator = EndpointActionGenerator;