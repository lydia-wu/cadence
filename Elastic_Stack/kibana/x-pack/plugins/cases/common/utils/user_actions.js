"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCreateConnector = isCreateConnector;
exports.isPush = isPush;
exports.isUpdateConnector = isUpdateConnector;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isCreateConnector(action, actionFields) {
  return action === 'create' && actionFields != null && actionFields.includes('connector');
}

function isUpdateConnector(action, actionFields) {
  return action === 'update' && actionFields != null && actionFields.includes('connector');
}

function isPush(action, actionFields) {
  return action === 'push-to-service' && actionFields != null && actionFields.includes('pushed');
}