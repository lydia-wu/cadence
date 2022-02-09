"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.config = exports.MapsEmsPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _config = require("../config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  exposeToBrowser: {
    regionmap: true,
    tilemap: true,
    includeElasticMapsService: true,
    proxyElasticMapsServiceInMaps: true,
    manifestServiceUrl: true,
    emsUrl: true,
    emsFileApiUrl: true,
    emsTileApiUrl: true,
    emsLandingPageUrl: true,
    emsFontLibraryUrl: true,
    emsTileLayerId: true
  },
  schema: _config.emsConfigSchema
};
exports.config = config;

class MapsEmsPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "_initializerContext", void 0);
    this._initializerContext = initializerContext;
  }

  setup(core) {
    const emsPluginConfig = this._initializerContext.config.get();

    return {
      config: emsPluginConfig
    };
  }

  start() {}

}

exports.MapsEmsPlugin = MapsEmsPlugin;

const plugin = initializerContext => new MapsEmsPlugin(initializerContext);

exports.plugin = plugin;