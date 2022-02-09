"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = void 0;
Object.defineProperty(exports, "registerTransformHealthRuleType", {
  enumerable: true,
  get: function () {
    return _alerting.registerTransformHealthRuleType;
  }
});

var _plugin = require("./plugin");

var _alerting = require("./lib/alerting");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = ctx => new _plugin.TransformServerPlugin(ctx);

exports.plugin = plugin;