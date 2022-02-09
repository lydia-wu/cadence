"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ClusterClientAdapter", {
  enumerable: true,
  get: function () {
    return _cluster_client_adapter.ClusterClientAdapter;
  }
});
Object.defineProperty(exports, "SAVED_OBJECT_REL_PRIMARY", {
  enumerable: true,
  get: function () {
    return _types.SAVED_OBJECT_REL_PRIMARY;
  }
});
exports.config = void 0;
Object.defineProperty(exports, "createReadySignal", {
  enumerable: true,
  get: function () {
    return _ready_signal.createReadySignal;
  }
});
exports.plugin = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("./types");

var _plugin = require("./plugin");

var _cluster_client_adapter = require("./es/cluster_client_adapter");

var _ready_signal = require("./lib/ready_signal");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _types.ConfigSchema,
  deprecations: () => [(settings, fromPath, addDeprecation) => {
    var _settings$xpack, _settings$xpack$event, _settings$xpack2, _settings$xpack2$even;

    if ((settings === null || settings === void 0 ? void 0 : (_settings$xpack = settings.xpack) === null || _settings$xpack === void 0 ? void 0 : (_settings$xpack$event = _settings$xpack.eventLog) === null || _settings$xpack$event === void 0 ? void 0 : _settings$xpack$event.enabled) === false || (settings === null || settings === void 0 ? void 0 : (_settings$xpack2 = settings.xpack) === null || _settings$xpack2 === void 0 ? void 0 : (_settings$xpack2$even = _settings$xpack2.eventLog) === null || _settings$xpack2$even === void 0 ? void 0 : _settings$xpack2$even.enabled) === true) {
      addDeprecation({
        configPath: 'xpack.eventLog.enabled',
        title: _i18n.i18n.translate('xpack.eventLog.deprecations.enabledTitle', {
          defaultMessage: 'Setting "xpack.eventLog.enabled" is deprecated'
        }),
        message: _i18n.i18n.translate('xpack.eventLog.deprecations.enabledMessage', {
          defaultMessage: 'This setting will be removed in 8.0 and the Event Log plugin will always be enabled.'
        }),
        correctiveActions: {
          manualSteps: [_i18n.i18n.translate('xpack.eventLog.deprecations.enabled.manualStepOneMessage', {
            defaultMessage: 'Remove "xpack.eventLog.enabled" from kibana.yml.'
          })]
        }
      });
    }
  }]
};
exports.config = config;

const plugin = context => new _plugin.Plugin(context);

exports.plugin = plugin;