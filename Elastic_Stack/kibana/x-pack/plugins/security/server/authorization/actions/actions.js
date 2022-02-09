"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Actions = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _alerting = require("./alerting");

var _api = require("./api");

var _app = require("./app");

var _cases = require("./cases");

var _saved_object = require("./saved_object");

var _space = require("./space");

var _ui = require("./ui");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/** Actions are used to create the "actions" that are associated with Elasticsearch's
 * application privileges, and are used to perform the authorization checks implemented
 * by the various `checkPrivilegesWithRequest` derivatives.
 */


class Actions {
  constructor(versionNumber) {
    (0, _defineProperty2.default)(this, "api", void 0);
    (0, _defineProperty2.default)(this, "app", void 0);
    (0, _defineProperty2.default)(this, "cases", void 0);
    (0, _defineProperty2.default)(this, "login", void 0);
    (0, _defineProperty2.default)(this, "savedObject", void 0);
    (0, _defineProperty2.default)(this, "alerting", void 0);
    (0, _defineProperty2.default)(this, "space", void 0);
    (0, _defineProperty2.default)(this, "ui", void 0);
    (0, _defineProperty2.default)(this, "version", void 0);
    this.versionNumber = versionNumber;

    if (versionNumber === '') {
      throw new Error(`version can't be an empty string`);
    }

    this.api = new _api.ApiActions(this.versionNumber);
    this.app = new _app.AppActions(this.versionNumber);
    this.cases = new _cases.CasesActions(this.versionNumber);
    this.login = 'login:';
    this.savedObject = new _saved_object.SavedObjectActions(this.versionNumber);
    this.alerting = new _alerting.AlertingActions(this.versionNumber);
    this.space = new _space.SpaceActions(this.versionNumber);
    this.ui = new _ui.UIActions(this.versionNumber);
    this.version = `version:${this.versionNumber}`;
  }

}

exports.Actions = Actions;