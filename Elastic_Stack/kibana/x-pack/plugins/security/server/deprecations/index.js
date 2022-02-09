"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "KIBANA_ADMIN_ROLE_NAME", {
  enumerable: true,
  get: function () {
    return _kibana_user_role.KIBANA_ADMIN_ROLE_NAME;
  }
});
Object.defineProperty(exports, "KIBANA_DASHBOARD_ONLY_USER_ROLE_NAME", {
  enumerable: true,
  get: function () {
    return _kibana_dashboard_only_role.KIBANA_DASHBOARD_ONLY_USER_ROLE_NAME;
  }
});
Object.defineProperty(exports, "KIBANA_USER_ROLE_NAME", {
  enumerable: true,
  get: function () {
    return _kibana_user_role.KIBANA_USER_ROLE_NAME;
  }
});
Object.defineProperty(exports, "getPrivilegeDeprecationsService", {
  enumerable: true,
  get: function () {
    return _privilege_deprecations.getPrivilegeDeprecationsService;
  }
});
Object.defineProperty(exports, "registerKibanaDashboardOnlyRoleDeprecation", {
  enumerable: true,
  get: function () {
    return _kibana_dashboard_only_role.registerKibanaDashboardOnlyRoleDeprecation;
  }
});
Object.defineProperty(exports, "registerKibanaUserRoleDeprecation", {
  enumerable: true,
  get: function () {
    return _kibana_user_role.registerKibanaUserRoleDeprecation;
  }
});
Object.defineProperty(exports, "registerMLPrivilegesDeprecation", {
  enumerable: true,
  get: function () {
    return _ml_privileges.registerMLPrivilegesDeprecation;
  }
});

var _privilege_deprecations = require("./privilege_deprecations");

var _kibana_dashboard_only_role = require("./kibana_dashboard_only_role");

var _kibana_user_role = require("./kibana_user_role");

var _ml_privileges = require("./ml_privileges");