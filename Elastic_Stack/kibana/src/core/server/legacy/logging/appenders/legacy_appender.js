"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LegacyAppender = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

var _legacyLogging = require("@kbn/legacy-logging");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Simple appender that just forwards `LogRecord` to the legacy KbnServer log.
 * @internal
 */
class LegacyAppender {
  /**
   * Sets {@link Appender.receiveAllLevels} because legacy does its own filtering based on the legacy logging
   * configuration.
   */
  constructor(legacyLoggingConfig) {
    (0, _defineProperty2.default)(this, "receiveAllLevels", true);
    (0, _defineProperty2.default)(this, "loggingServer", void 0);
    this.loggingServer = new _legacyLogging.LegacyLoggingServer(legacyLoggingConfig);
  }
  /**
   * Forwards `LogRecord` to the legacy platform that will layout and
   * write record to the configured destination.
   * @param record `LogRecord` instance to forward to.
   */


  append(record) {
    this.loggingServer.log(record);
  }

  dispose() {
    this.loggingServer.stop();
  }

}

exports.LegacyAppender = LegacyAppender;
(0, _defineProperty2.default)(LegacyAppender, "configSchema", _configSchema.schema.object({
  type: _configSchema.schema.literal('legacy-appender'),
  legacyLoggingConfig: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())
}));