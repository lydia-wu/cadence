"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppClientFactory = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _client = require("./client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class AppClientFactory {
  constructor() {
    (0, _defineProperty2.default)(this, "getSpaceId", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
  }

  setup({
    getSpaceId,
    config
  }) {
    this.getSpaceId = getSpaceId;
    this.config = config;
  }

  create(request) {
    var _this$getSpaceId, _this$getSpaceId2;

    if (this.config == null) {
      throw new Error('Cannot create AppClient as config is not present. Did you forget to call setup()?');
    }

    const spaceId = (_this$getSpaceId = (_this$getSpaceId2 = this.getSpaceId) === null || _this$getSpaceId2 === void 0 ? void 0 : _this$getSpaceId2.call(this, request)) !== null && _this$getSpaceId !== void 0 ? _this$getSpaceId : 'default';
    return new _client.AppClient(spaceId, this.config);
  }

}

exports.AppClientFactory = AppClientFactory;