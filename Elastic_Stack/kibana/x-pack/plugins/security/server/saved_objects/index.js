"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ensureAuthorized", {
  enumerable: true,
  get: function () {
    return _ensure_authorized.ensureAuthorized;
  }
});
Object.defineProperty(exports, "getEnsureAuthorizedActionResult", {
  enumerable: true,
  get: function () {
    return _ensure_authorized.getEnsureAuthorizedActionResult;
  }
});
Object.defineProperty(exports, "isAuthorizedForObjectInAllSpaces", {
  enumerable: true,
  get: function () {
    return _ensure_authorized.isAuthorizedForObjectInAllSpaces;
  }
});
exports.setupSavedObjects = setupSavedObjects;

var _server = require("../../../../../src/core/server");

var _secure_saved_objects_client_wrapper = require("./secure_saved_objects_client_wrapper");

var _ensure_authorized = require("./ensure_authorized");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function setupSavedObjects({
  legacyAuditLogger,
  audit,
  authz,
  savedObjects,
  getSpacesService
}) {
  savedObjects.setClientFactoryProvider(repositoryFactory => ({
    request,
    includedHiddenTypes
  }) => {
    return new _server.SavedObjectsClient(authz.mode.useRbacForRequest(request) ? repositoryFactory.createInternalRepository(includedHiddenTypes) : repositoryFactory.createScopedRepository(request, includedHiddenTypes));
  });
  savedObjects.addClientWrapper(Number.MAX_SAFE_INTEGER - 1, 'security', ({
    client,
    request
  }) => {
    return authz.mode.useRbacForRequest(request) ? new _secure_saved_objects_client_wrapper.SecureSavedObjectsClientWrapper({
      actions: authz.actions,
      legacyAuditLogger,
      auditLogger: audit.asScoped(request),
      baseClient: client,
      checkSavedObjectsPrivilegesAsCurrentUser: authz.checkSavedObjectsPrivilegesWithRequest(request),
      errors: _server.SavedObjectsClient.errors,
      getSpacesService
    }) : client;
  });
}