"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScopeType = exports.AuthorizationResult = exports.AlertingAuthorizationAuditLogger = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let ScopeType;
exports.ScopeType = ScopeType;

(function (ScopeType) {
  ScopeType[ScopeType["Consumer"] = 0] = "Consumer";
  ScopeType[ScopeType["Producer"] = 1] = "Producer";
})(ScopeType || (exports.ScopeType = ScopeType = {}));

let AuthorizationResult;
exports.AuthorizationResult = AuthorizationResult;

(function (AuthorizationResult) {
  AuthorizationResult["Unauthorized"] = "Unauthorized";
  AuthorizationResult["Authorized"] = "Authorized";
})(AuthorizationResult || (exports.AuthorizationResult = AuthorizationResult = {}));

class AlertingAuthorizationAuditLogger {
  constructor(auditLogger = {
    log() {}

  }) {
    (0, _defineProperty2.default)(this, "auditLogger", void 0);
    this.auditLogger = auditLogger;
  }

  getAuthorizationMessage(authorizationResult, alertTypeId, scopeType, scope, operation, entity) {
    return `${authorizationResult} to ${operation} a "${alertTypeId}" ${entity} ${scopeType === ScopeType.Consumer ? `for "${scope}"` : `by "${scope}"`}`;
  }

  logAuthorizationFailure(username, alertTypeId, scopeType, scope, operation, entity) {
    const message = this.getAuthorizationMessage(AuthorizationResult.Unauthorized, alertTypeId, scopeType, scope, operation, entity);
    this.auditLogger.log('alerting_authorization_failure', `${username} ${message}`, {
      username,
      alertTypeId,
      scopeType,
      scope,
      operation,
      entity
    });
    return message;
  }

  logUnscopedAuthorizationFailure(username, operation, entity) {
    const message = `Unauthorized to ${operation} ${entity}s for any rule types`;
    this.auditLogger.log('alerting_unscoped_authorization_failure', `${username} ${message}`, {
      username,
      operation
    });
    return message;
  }

  logAuthorizationSuccess(username, alertTypeId, scopeType, scope, operation, entity) {
    const message = this.getAuthorizationMessage(AuthorizationResult.Authorized, alertTypeId, scopeType, scope, operation, entity);
    this.auditLogger.log('alerting_authorization_success', `${username} ${message}`, {
      username,
      alertTypeId,
      scopeType,
      scope,
      operation,
      entity
    });
    return message;
  }

  logBulkAuthorizationSuccess(username, authorizedEntries, scopeType, operation, entity) {
    const message = `${AuthorizationResult.Authorized} to ${operation}: ${authorizedEntries.map(([alertTypeId, scope]) => `"${alertTypeId}" ${entity}s ${scopeType === ScopeType.Consumer ? `for "${scope}"` : `by "${scope}"`}`).join(', ')}`;
    this.auditLogger.log('alerting_authorization_success', `${username} ${message}`, {
      username,
      scopeType,
      authorizedEntries,
      operation,
      entity
    });
    return message;
  }

}

exports.AlertingAuthorizationAuditLogger = AlertingAuthorizationAuditLogger;