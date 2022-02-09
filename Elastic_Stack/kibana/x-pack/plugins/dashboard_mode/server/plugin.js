"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DashboardModeServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _server = require("../../../../src/core/server");

var _interceptors = require("./interceptors");

var _ui_settings = require("./ui_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class DashboardModeServerPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "initializerContext", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.initializerContext = initializerContext;
  }

  setup(core, {
    security
  }) {
    this.logger = this.initializerContext.logger.get();
    core.uiSettings.register((0, _ui_settings.getUiSettings)());

    const getUiSettingsClient = async () => {
      const [coreStart] = await core.getStartServices();
      const {
        savedObjects,
        uiSettings
      } = coreStart;
      const savedObjectsClient = new _server.SavedObjectsClient(savedObjects.createInternalRepository());
      return uiSettings.asScopedToClient(savedObjectsClient);
    };

    if (security) {
      const dashboardModeRequestInterceptor = (0, _interceptors.setupDashboardModeRequestInterceptor)({
        http: core.http,
        security,
        getUiSettingsClient
      });
      core.http.registerOnPostAuth(dashboardModeRequestInterceptor);
      this.logger.debug(`registered DashboardModeRequestInterceptor`);
    }
  }

  start(core) {}

  stop() {}

}

exports.DashboardModeServerPlugin = DashboardModeServerPlugin;