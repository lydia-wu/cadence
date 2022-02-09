"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.config = exports.MapsLegacyPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _config = require("../config");

var _ui_settings = require("./ui_settings");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  exposeToBrowser: {},
  schema: _config.configSchema
};
exports.config = config;

class MapsLegacyPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "_initializerContext", void 0);
    this._initializerContext = initializerContext;
  }

  setup(core) {
    core.uiSettings.register((0, _ui_settings.getUiSettings)());

    const pluginConfig = this._initializerContext.config.get();

    return {
      config: pluginConfig
    };
  }

  start() {}

}

exports.MapsLegacyPlugin = MapsLegacyPlugin;

const plugin = initializerContext => new MapsLegacyPlugin(initializerContext);

exports.plugin = plugin;