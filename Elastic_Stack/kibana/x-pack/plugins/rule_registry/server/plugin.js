"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleRegistryPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rule_data_plugin_service = require("./rule_data_plugin_service");

var _alerts_client_factory = require("./alert_data_client/alerts_client_factory");

var _routes = require("./routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class RuleRegistryPlugin {
  constructor(initContext) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "legacyConfig", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "alertsClientFactory", void 0);
    (0, _defineProperty2.default)(this, "ruleDataService", void 0);
    (0, _defineProperty2.default)(this, "security", void 0);
    (0, _defineProperty2.default)(this, "createRouteHandlerContext", () => {
      const {
        alertsClientFactory
      } = this;
      return function alertsRouteHandlerContext(context, request) {
        return {
          getAlertsClient: async () => {
            const createdClient = alertsClientFactory.create(request);
            return createdClient;
          }
        };
      };
    });
    this.config = initContext.config.get(); // TODO: Can be removed in 8.0.0. Exists to work around multi-tenancy users.

    this.legacyConfig = initContext.config.legacy.get();
    this.logger = initContext.logger.get();
    this.kibanaVersion = initContext.env.packageInfo.version;
    this.ruleDataService = null;
    this.alertsClientFactory = new _alerts_client_factory.AlertsClientFactory();
  }

  setup(core, plugins) {
    const {
      logger,
      kibanaVersion
    } = this;
    const startDependencies = core.getStartServices().then(([coreStart, pluginStart]) => {
      return {
        core: coreStart,
        ...pluginStart
      };
    });
    this.security = plugins.security;

    const isWriteEnabled = (config, legacyConfig) => {
      const hasEnabledWrite = config.write.enabled;
      const hasSetCustomKibanaIndex = legacyConfig.kibana.index !== '.kibana';
      const hasSetUnsafeAccess = config.unsafe.legacyMultiTenancy.enabled;
      if (!hasEnabledWrite) return false; // Not using legacy multi-tenancy

      if (!hasSetCustomKibanaIndex) {
        return hasEnabledWrite;
      } else {
        return hasSetUnsafeAccess;
      }
    };

    this.ruleDataService = new _rule_data_plugin_service.RuleDataService({
      logger,
      kibanaVersion,
      isWriteEnabled: isWriteEnabled(this.config, this.legacyConfig),
      getClusterClient: async () => {
        const deps = await startDependencies;
        return deps.core.elasticsearch.client.asInternalUser;
      }
    });
    this.ruleDataService.initializeService(); // ALERTS ROUTES

    const router = core.http.createRouter();
    core.http.registerRouteHandlerContext('rac', this.createRouteHandlerContext());
    (0, _routes.defineRoutes)(router);
    return {
      ruleDataService: this.ruleDataService
    };
  }

  start(core, plugins) {
    const {
      logger,
      alertsClientFactory,
      ruleDataService,
      security
    } = this;
    alertsClientFactory.initialize({
      logger,
      esClient: core.elasticsearch.client.asInternalUser,

      // NOTE: Alerts share the authorization client with the alerting plugin
      getAlertingAuthorization(request) {
        return plugins.alerting.getAlertingAuthorizationWithRequest(request);
      },

      securityPluginSetup: security,
      ruleDataService
    });

    const getRacClientWithRequest = request => {
      return alertsClientFactory.create(request);
    };

    return {
      getRacClientWithRequest,
      alerting: plugins.alerting
    };
  }

  stop() {}

}

exports.RuleRegistryPlugin = RuleRegistryPlugin;