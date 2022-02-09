"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertingSecurity = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class AlertingSecurity {}

exports.AlertingSecurity = AlertingSecurity;
(0, _defineProperty2.default)(AlertingSecurity, "getSecurityHealth", async (context, encryptedSavedObjects) => {
  const {
    security: {
      enabled: isSecurityEnabled = false,
      ssl: {
        http: {
          enabled: isTLSEnabled = false
        } = {}
      } = {}
    } = {}
  } = (await context.core.elasticsearch.client.asInternalUser.transport.request({
    method: 'GET',
    path: '/_xpack/usage'
  })).body;
  return {
    isSufficientlySecure: !isSecurityEnabled || isSecurityEnabled && isTLSEnabled,
    hasPermanentEncryptionKey: (encryptedSavedObjects === null || encryptedSavedObjects === void 0 ? void 0 : encryptedSavedObjects.canEncrypt) === true
  };
});