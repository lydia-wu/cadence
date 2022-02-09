"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsonLayout = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _std = require("@kbn/std");

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const {
  literal,
  object
} = _configSchema.schema;
const jsonLayoutSchema = object({
  type: literal('json')
});
/** @internal */

/**
 * Layout that just converts `LogRecord` into JSON string.
 * @internal
 */
class JsonLayout {
  static errorToSerializableObject(error) {
    if (error === undefined) {
      return error;
    }

    return {
      message: error.message,
      type: error.name,
      stack_trace: error.stack
    };
  }

  format(record) {
    const log = {
      ecs: {
        version: '1.12.0'
      },
      '@timestamp': (0, _momentTimezone.default)(record.timestamp).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      message: record.message,
      error: JsonLayout.errorToSerializableObject(record.error),
      log: {
        level: record.level.id.toUpperCase(),
        logger: record.context
      },
      process: {
        pid: record.pid
      }
    };
    const output = record.meta ? (0, _std.merge)({ ...record.meta
    }, log) : log;
    return JSON.stringify(output);
  }

}

exports.JsonLayout = JsonLayout;
(0, _defineProperty2.default)(JsonLayout, "configSchema", jsonLayoutSchema);