"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BufferedTaskStore = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _bulk_operation_buffer = require("./lib/bulk_operation_buffer");

var _result_type = require("./lib/result_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// by default allow updates to be buffered for up to 50ms


const DEFAULT_BUFFER_MAX_DURATION = 50;

class BufferedTaskStore {
  constructor(taskStore, options) {
    (0, _defineProperty2.default)(this, "bufferedUpdate", void 0);
    this.taskStore = taskStore;
    this.bufferedUpdate = (0, _bulk_operation_buffer.createBuffer)(docs => taskStore.bulkUpdate(docs), {
      bufferMaxDuration: DEFAULT_BUFFER_MAX_DURATION,
      ...options
    });
  }

  async update(doc) {
    return (0, _result_type.unwrapPromise)(this.bufferedUpdate(doc));
  }

  async remove(id) {
    return this.taskStore.remove(id);
  }

}

exports.BufferedTaskStore = BufferedTaskStore;