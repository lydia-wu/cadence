"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ACTION_SAVED_OBJECT_TYPE", {
  enumerable: true,
  get: function () {
    return _saved_objects.ACTION_SAVED_OBJECT_TYPE;
  }
});
Object.defineProperty(exports, "asHttpRequestExecutionSource", {
  enumerable: true,
  get: function () {
    return _lib.asHttpRequestExecutionSource;
  }
});
Object.defineProperty(exports, "asSavedObjectExecutionSource", {
  enumerable: true,
  get: function () {
    return _lib.asSavedObjectExecutionSource;
  }
});
exports.plugin = exports.config = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _plugin = require("./plugin");

var _config = require("./config");

var _lib = require("./lib");

var _saved_objects = require("./constants/saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = initContext => new _plugin.ActionsPlugin(initContext);

exports.plugin = plugin;
const config = {
  schema: _config.configSchema,
  deprecations: ({
    renameFromRoot,
    unused
  }) => [renameFromRoot('xpack.actions.whitelistedHosts', 'xpack.actions.allowedHosts', {
    level: 'warning'
  }), (settings, fromPath, addDeprecation) => {
    var _actions$customHostSe;

    const actions = (0, _lodash.get)(settings, fromPath);
    const customHostSettings = (_actions$customHostSe = actions === null || actions === void 0 ? void 0 : actions.customHostSettings) !== null && _actions$customHostSe !== void 0 ? _actions$customHostSe : [];

    if (customHostSettings.find(customHostSchema => {
      var _customHostSchema$ssl;

      return customHostSchema.hasOwnProperty('ssl') && ((_customHostSchema$ssl = customHostSchema.ssl) === null || _customHostSchema$ssl === void 0 ? void 0 : _customHostSchema$ssl.hasOwnProperty('rejectUnauthorized'));
    })) {
      addDeprecation({
        level: 'warning',
        configPath: 'xpack.actions.customHostSettings.ssl.rejectUnauthorized',
        message: `"xpack.actions.customHostSettings[<index>].ssl.rejectUnauthorized" is deprecated.` + `Use "xpack.actions.customHostSettings[<index>].ssl.verificationMode" instead, ` + `with the setting "verificationMode:full" eql to "rejectUnauthorized:true", ` + `and "verificationMode:none" eql to "rejectUnauthorized:false".`,
        correctiveActions: {
          manualSteps: [`Remove "xpack.actions.customHostSettings[<index>].ssl.rejectUnauthorized" from your kibana configs.`, `Use "xpack.actions.customHostSettings[<index>].ssl.verificationMode" ` + `with the setting "verificationMode:full" eql to "rejectUnauthorized:true", ` + `and "verificationMode:none" eql to "rejectUnauthorized:false".`]
        }
      });
      return {
        unset: [{
          path: `xpack.actions.customHostSettings.ssl.rejectUnauthorized`
        }]
      };
    }
  }, (settings, fromPath, addDeprecation) => {
    const actions = (0, _lodash.get)(settings, fromPath);

    if (actions !== null && actions !== void 0 && actions.hasOwnProperty('rejectUnauthorized')) {
      addDeprecation({
        level: 'warning',
        configPath: `${fromPath}.rejectUnauthorized`,
        message: `"xpack.actions.rejectUnauthorized" is deprecated. Use "xpack.actions.ssl.verificationMode" instead, ` + `with the setting "verificationMode:full" eql to "rejectUnauthorized:true", ` + `and "verificationMode:none" eql to "rejectUnauthorized:false".`,
        correctiveActions: {
          manualSteps: [`Remove "xpack.actions.rejectUnauthorized" from your kibana configs.`, `Use "xpack.actions.ssl.verificationMode" ` + `with the setting "verificationMode:full" eql to "rejectUnauthorized:true", ` + `and "verificationMode:none" eql to "rejectUnauthorized:false".`]
        }
      });
      return {
        unset: [{
          path: `xpack.actions.rejectUnauthorized`
        }]
      };
    }
  }, (settings, fromPath, addDeprecation) => {
    const actions = (0, _lodash.get)(settings, fromPath);

    if (actions !== null && actions !== void 0 && actions.hasOwnProperty('proxyRejectUnauthorizedCertificates')) {
      addDeprecation({
        level: 'warning',
        configPath: `${fromPath}.proxyRejectUnauthorizedCertificates`,
        message: `"xpack.actions.proxyRejectUnauthorizedCertificates" is deprecated. Use "xpack.actions.ssl.proxyVerificationMode" instead, ` + `with the setting "proxyVerificationMode:full" eql to "rejectUnauthorized:true",` + `and "proxyVerificationMode:none" eql to "rejectUnauthorized:false".`,
        correctiveActions: {
          manualSteps: [`Remove "xpack.actions.proxyRejectUnauthorizedCertificates" from your kibana configs.`, `Use "xpack.actions.ssl.proxyVerificationMode" ` + `with the setting "proxyVerificationMode:full" eql to "rejectUnauthorized:true",` + `and "proxyVerificationMode:none" eql to "rejectUnauthorized:false".`]
        }
      });
      return {
        unset: [{
          path: `xpack.actions.proxyRejectUnauthorizedCertificates`
        }]
      };
    }
  }, (settings, fromPath, addDeprecation) => {
    const actions = (0, _lodash.get)(settings, fromPath);

    if ((actions === null || actions === void 0 ? void 0 : actions.enabled) === false || (actions === null || actions === void 0 ? void 0 : actions.enabled) === true) {
      addDeprecation({
        configPath: 'xpack.actions.enabled',
        title: _i18n.i18n.translate('xpack.actions.deprecations.enabledTitle', {
          defaultMessage: 'Setting "xpack.actions.enabled" is deprecated'
        }),
        message: _i18n.i18n.translate('xpack.actions.deprecations.enabledMessage', {
          defaultMessage: 'This setting will be removed in 8.0 and the Actions plugin will always be enabled.'
        }),
        documentationUrl: `https://www.elastic.co/guide/en/kibana/current/alert-action-settings-kb.html#action-settings`,
        correctiveActions: {
          manualSteps: [_i18n.i18n.translate('xpack.actions.deprecations.enabled.manualStepOneMessage', {
            defaultMessage: 'Remove "xpack.actions.enabled" from kibana.yml.'
          }), _i18n.i18n.translate('xpack.actions.deprecations.enabled.manualStepTwoMessage', {
            defaultMessage: 'To disable actions and connectors, use the "xpack.actions.enabledActionTypes" setting.'
          })]
        }
      });
    }
  }]
};
exports.config = config;