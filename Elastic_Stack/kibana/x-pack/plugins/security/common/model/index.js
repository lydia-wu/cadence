"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "canUserChangePassword", {
  enumerable: true,
  get: function () {
    return _authenticated_user.canUserChangePassword;
  }
});
Object.defineProperty(exports, "copyRole", {
  enumerable: true,
  get: function () {
    return _role.copyRole;
  }
});
Object.defineProperty(exports, "getExtendedRoleDeprecationNotice", {
  enumerable: true,
  get: function () {
    return _role.getExtendedRoleDeprecationNotice;
  }
});
Object.defineProperty(exports, "getUserDisplayName", {
  enumerable: true,
  get: function () {
    return _user.getUserDisplayName;
  }
});
Object.defineProperty(exports, "isRoleAdmin", {
  enumerable: true,
  get: function () {
    return _role.isRoleAdmin;
  }
});
Object.defineProperty(exports, "isRoleDeprecated", {
  enumerable: true,
  get: function () {
    return _role.isRoleDeprecated;
  }
});
Object.defineProperty(exports, "isRoleEnabled", {
  enumerable: true,
  get: function () {
    return _role.isRoleEnabled;
  }
});
Object.defineProperty(exports, "isRoleReadOnly", {
  enumerable: true,
  get: function () {
    return _role.isRoleReadOnly;
  }
});
Object.defineProperty(exports, "isRoleReserved", {
  enumerable: true,
  get: function () {
    return _role.isRoleReserved;
  }
});
Object.defineProperty(exports, "isRoleSystem", {
  enumerable: true,
  get: function () {
    return _role.isRoleSystem;
  }
});
Object.defineProperty(exports, "prepareRoleClone", {
  enumerable: true,
  get: function () {
    return _role.prepareRoleClone;
  }
});
Object.defineProperty(exports, "shouldProviderUseLoginForm", {
  enumerable: true,
  get: function () {
    return _authentication_provider.shouldProviderUseLoginForm;
  }
});

var _user = require("./user");

var _authenticated_user = require("./authenticated_user");

var _authentication_provider = require("./authentication_provider");

var _role = require("./role");