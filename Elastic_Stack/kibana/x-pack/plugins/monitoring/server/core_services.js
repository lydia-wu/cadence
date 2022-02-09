"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoreServices = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _server = require("../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CoreServices {
  static init(core) {
    this._coreSetup = core;
  }

  static get coreSetup() {
    this.checkError();
    return this._coreSetup;
  }

  static async getCoreStart() {
    if (this._coreStart) {
      return this._coreStart;
    }

    const [coreStart] = await this.coreSetup.getStartServices();
    this._coreStart = coreStart;
    return coreStart;
  }

  static async getUISetting(key) {
    const coreStart = await this.getCoreStart();
    const {
      savedObjects,
      uiSettings
    } = coreStart;
    const savedObjectsClient = new _server.SavedObjectsClient(savedObjects.createInternalRepository());
    const theSettings = uiSettings.asScopedToClient(savedObjectsClient);
    return await theSettings.get(key);
  }

  static checkError() {
    if (!this._coreSetup) {
      throw new Error('CoreServices has not been initialized. Please run CoreServices.init(...) before use');
    }
  }

}

exports.CoreServices = CoreServices;
(0, _defineProperty2.default)(CoreServices, "_coreSetup", void 0);
(0, _defineProperty2.default)(CoreServices, "_coreStart", void 0);