"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AuditService", {
  enumerable: true,
  get: function () {
    return _audit_service.AuditService;
  }
});
Object.defineProperty(exports, "SavedObjectAction", {
  enumerable: true,
  get: function () {
    return _audit_events.SavedObjectAction;
  }
});
Object.defineProperty(exports, "SecurityAuditLogger", {
  enumerable: true,
  get: function () {
    return _security_audit_logger.SecurityAuditLogger;
  }
});
Object.defineProperty(exports, "SpaceAuditAction", {
  enumerable: true,
  get: function () {
    return _audit_events.SpaceAuditAction;
  }
});
Object.defineProperty(exports, "httpRequestEvent", {
  enumerable: true,
  get: function () {
    return _audit_events.httpRequestEvent;
  }
});
Object.defineProperty(exports, "savedObjectEvent", {
  enumerable: true,
  get: function () {
    return _audit_events.savedObjectEvent;
  }
});
Object.defineProperty(exports, "spaceAuditEvent", {
  enumerable: true,
  get: function () {
    return _audit_events.spaceAuditEvent;
  }
});
Object.defineProperty(exports, "userLoginEvent", {
  enumerable: true,
  get: function () {
    return _audit_events.userLoginEvent;
  }
});
Object.defineProperty(exports, "userLogoutEvent", {
  enumerable: true,
  get: function () {
    return _audit_events.userLogoutEvent;
  }
});

var _audit_service = require("./audit_service");

var _audit_events = require("./audit_events");

var _security_audit_logger = require("./security_audit_logger");