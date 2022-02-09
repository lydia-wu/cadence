"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "INSTRUCTION_VARIANT", {
  enumerable: true,
  get: function () {
    return _instruction_variant.INSTRUCTION_VARIANT;
  }
});
Object.defineProperty(exports, "TutorialsCategory", {
  enumerable: true,
  get: function () {
    return _tutorials.TutorialsCategory;
  }
});
exports.plugin = exports.config = void 0;

var _plugin = require("./plugin");

var _config = require("../config");

var _instruction_variant = require("../common/instruction_variant");

var _tutorials = require("./services/tutorials");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  exposeToBrowser: {
    disableWelcomeScreen: true
  },
  schema: _config.configSchema,
  deprecations: ({
    renameFromRoot
  }) => [renameFromRoot('kibana.disableWelcomeScreen', 'home.disableWelcomeScreen', {
    level: 'critical'
  })]
};
exports.config = config;

const plugin = initContext => new _plugin.HomeServerPlugin(initContext);

exports.plugin = plugin;