"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEventLogProvider = void 0;

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerEventLogProvider = eventLogService => {
  eventLogService.registerProviderActions(_constants.RULE_EXECUTION_LOG_PROVIDER, Object.keys(_constants.RuleExecutionLogAction));
};

exports.registerEventLogProvider = registerEventLogProvider;