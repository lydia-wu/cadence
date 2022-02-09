"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransformServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _routes = require("./routes");

var _services = require("./services");

var _alerting = require("./lib/alerting");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const basicLicense = 'basic';
const PLUGIN = {
  id: 'transform',
  minimumLicenseType: basicLicense,
  getI18nName: () => _i18n.i18n.translate('xpack.transform.appTitle', {
    defaultMessage: 'Transforms'
  })
};

class TransformServerPlugin {
  constructor(initContext) {
    (0, _defineProperty2.default)(this, "apiRoutes", void 0);
    (0, _defineProperty2.default)(this, "license", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = initContext.logger.get();
    this.apiRoutes = new _routes.ApiRoutes();
    this.license = new _services.License();
  }

  setup({
    http,
    getStartServices,
    elasticsearch
  }, {
    licensing,
    features,
    alerting
  }) {
    const router = http.createRouter();
    this.license.setup({
      pluginId: PLUGIN.id,
      minimumLicenseType: PLUGIN.minimumLicenseType,
      defaultErrorMessage: _i18n.i18n.translate('xpack.transform.licenseCheckErrorMessage', {
        defaultMessage: 'License check failed'
      })
    }, {
      licensing,
      logger: this.logger
    });
    features.registerElasticsearchFeature({
      id: PLUGIN.id,
      management: {
        data: [PLUGIN.id]
      },
      catalogue: [PLUGIN.id],
      privileges: [{
        requiredClusterPrivileges: ['monitor_transform'],
        ui: []
      }]
    });
    this.apiRoutes.setup({
      router,
      license: this.license
    });

    if (alerting) {
      (0, _alerting.registerTransformHealthRuleType)({
        alerting,
        logger: this.logger
      });
    }

    return {};
  }

  start() {}

  stop() {}

}

exports.TransformServerPlugin = TransformServerPlugin;