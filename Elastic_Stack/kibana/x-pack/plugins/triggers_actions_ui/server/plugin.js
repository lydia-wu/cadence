"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TriggersActionsPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _data = require("./data");

var _health = require("./routes/health");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const BASE_ROUTE = '/api/triggers_actions_ui';

class TriggersActionsPlugin {
  constructor(ctx) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "data", void 0);
    this.logger = ctx.logger.get();
    this.data = (0, _data.getService)();
  }

  setup(core, plugins) {
    const router = core.http.createRouter();
    (0, _data.register)({
      logger: this.logger,
      data: this.data,
      router,
      baseRoute: BASE_ROUTE
    });
    (0, _health.createHealthRoute)(this.logger, router, BASE_ROUTE, plugins.alerting !== undefined);
  }

  start() {
    return {
      data: this.data
    };
  }

  async stop() {}

}

exports.TriggersActionsPlugin = TriggersActionsPlugin;