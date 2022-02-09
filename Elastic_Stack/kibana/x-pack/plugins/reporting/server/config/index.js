"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ConfigSchema", {
  enumerable: true,
  get: function () {
    return _schema.ConfigSchema;
  }
});
Object.defineProperty(exports, "buildConfig", {
  enumerable: true,
  get: function () {
    return _config.buildConfig;
  }
});
exports.config = void 0;
Object.defineProperty(exports, "registerUiSettings", {
  enumerable: true,
  get: function () {
    return _ui_settings.registerUiSettings;
  }
});

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _schema = require("./schema");

var _config = require("./config");

var _ui_settings = require("./ui_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  exposeToBrowser: {
    poll: true,
    roles: true
  },
  schema: _schema.ConfigSchema,
  deprecations: ({
    unused
  }) => [unused('capture.browser.chromium.maxScreenshotDimension', {
    level: 'warning'
  }), // unused since 7.8
  unused('poll.jobCompletionNotifier.intervalErrorMultiplier', {
    level: 'warning'
  }), // unused since 7.10
  unused('poll.jobsRefresh.intervalErrorMultiplier', {
    level: 'warning'
  }), // unused since 7.10
  unused('capture.viewport', {
    level: 'warning'
  }), // deprecated as unused since 7.16
  (settings, fromPath, addDeprecation) => {
    var _reporting$roles;

    const reporting = (0, _lodash.get)(settings, fromPath);

    if (reporting !== null && reporting !== void 0 && reporting.index) {
      addDeprecation({
        configPath: `${fromPath}.index`,
        title: _i18n.i18n.translate('xpack.reporting.deprecations.reportingIndex.title', {
          defaultMessage: 'Setting "{fromPath}.index" is deprecated',
          values: {
            fromPath
          }
        }),
        message: _i18n.i18n.translate('xpack.reporting.deprecations.reportingIndex.description', {
          defaultMessage: `Multitenancy by changing "xpack.reporting.index" will not be supported in 8.0.` + ` See https://ela.st/kbn-remove-legacy-multitenancy for more details`
        }),
        correctiveActions: {
          manualSteps: [_i18n.i18n.translate('xpack.reporting.deprecations.reportingIndex.manualStepOne', {
            defaultMessage: `Remove the "xpack.reporting.index" setting.`
          }), _i18n.i18n.translate('xpack.reporting.deprecations.reportingIndex.manualStepTwo', {
            defaultMessage: `Reindex reports stored in a custom reporting index into the default ".reporting-*"` + ` indices or regenerate the reports to be able to access them in 8.0.`
          })]
        }
      });
    }

    if ((reporting === null || reporting === void 0 ? void 0 : (_reporting$roles = reporting.roles) === null || _reporting$roles === void 0 ? void 0 : _reporting$roles.enabled) !== false) {
      addDeprecation({
        configPath: `${fromPath}.roles.enabled`,
        level: 'warning',
        title: _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoles.title', {
          defaultMessage: 'Setting "{fromPath}.roles" is deprecated',
          values: {
            fromPath
          }
        }),
        // TODO: once scheduled reports is released, restate this to say that we have no access to scheduled reporting.
        // https://github.com/elastic/kibana/issues/79905
        message: _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoles.description', {
          defaultMessage: `Use Kibana application privileges to grant reporting privileges.` + ` Using  "{fromPath}.roles.allow" to grant reporting privileges` + ` is deprecated.` + ` The "{fromPath}.roles.enabled" setting will default to false` + ` in a future release.`,
          values: {
            fromPath
          }
        }),
        correctiveActions: {
          manualSteps: [_i18n.i18n.translate('xpack.reporting.deprecations.reportingRoles.manualStepOne', {
            defaultMessage: `Set "xpack.reporting.roles.enabled" to "false" in kibana.yml.`
          }), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoles.manualStepOnePartOne', {
            defaultMessage: `Remove "xpack.reporting.roles.allow" to "false" in kibana.yml, if present.`
          }), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoles.manualStepTwo', {
            defaultMessage: `Create one or more roles that grant the Kibana application` + ` privilege for reporting from **Management > Security > Roles**.`
          }), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoles.manualStepThree', {
            defaultMessage: `Grant reporting privileges to users by assigning one of the new roles.` + ` Users assigned a reporting role specified in "xpack.reporting.roles.allow"` + ` will no longer have reporting privileges, they must be assigned an application privilege based role.`
          })]
        }
      });
    }
  }],
  exposeToUsage: {
    capture: {
      maxAttempts: true,
      timeouts: {
        openUrl: true,
        renderComplete: true,
        waitForElements: true
      },
      networkPolicy: false,
      // show as [redacted]
      zoom: true
    },
    csv: {
      maxSizeBytes: true,
      scroll: {
        size: true,
        duration: true
      }
    },
    kibanaServer: false,
    // show as [redacted]
    queue: {
      indexInterval: true,
      pollEnabled: true,
      timeout: true
    },
    roles: {
      enabled: true
    }
  }
};
exports.config = config;