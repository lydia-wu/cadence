"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initUptimeServer = void 0;

var _server = require("../../rule_registry/server");

var _rest_api = require("./rest_api");

var _status_check = require("./lib/alerts/status_check");

var _tls = require("./lib/alerts/tls");

var _tls_legacy = require("./lib/alerts/tls_legacy");

var _duration_anomaly = require("./lib/alerts/duration_anomaly");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initUptimeServer = (server, libs, plugins, ruleDataClient, logger) => {
  _rest_api.restApiRoutes.forEach(route => libs.framework.registerRoute((0, _rest_api.uptimeRouteWrapper)((0, _rest_api.createRouteWithAuth)(libs, route))));

  const {
    alerting: {
      registerType
    }
  } = plugins;
  const statusAlert = (0, _status_check.statusCheckAlertFactory)(server, libs, plugins);
  const tlsLegacyAlert = (0, _tls_legacy.tlsLegacyAlertFactory)(server, libs, plugins);
  const tlsAlert = (0, _tls.tlsAlertFactory)(server, libs, plugins);
  const durationAlert = (0, _duration_anomaly.durationAnomalyAlertFactory)(server, libs, plugins);
  const createLifecycleRuleType = (0, _server.createLifecycleRuleTypeFactory)({
    ruleDataClient,
    logger
  });
  registerType(createLifecycleRuleType(statusAlert));
  registerType(createLifecycleRuleType(tlsAlert));
  registerType(createLifecycleRuleType(durationAlert));
  /* TLS Legacy rule supported at least through 8.0.
   * Not registered with RAC */

  registerType(tlsLegacyAlert);
};

exports.initUptimeServer = initUptimeServer;