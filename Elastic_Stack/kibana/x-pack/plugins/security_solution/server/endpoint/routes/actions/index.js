"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  registerActionRoutes: true
};
exports.registerActionRoutes = registerActionRoutes;

var _isolation = require("./isolation");

Object.keys(_isolation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _isolation[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _isolation[key];
    }
  });
});

var _status = require("./status");

var _audit_log = require("./audit_log");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// wrap route registration


function registerActionRoutes(router, endpointContext) {
  (0, _isolation.registerHostIsolationRoutes)(router, endpointContext);
  (0, _status.registerActionStatusRoutes)(router, endpointContext);
  (0, _audit_log.registerActionAuditLogRoutes)(router, endpointContext);
}