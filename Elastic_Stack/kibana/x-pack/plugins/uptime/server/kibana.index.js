"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initServerWithKibana = void 0;

var _server = require("../../../../src/core/server");

var _plugin = require("../common/constants/plugin");

var _kibana = require("./lib/compose/kibana");

var _uptime_server = require("./uptime_server");

var _saved_objects = require("./lib/saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initServerWithKibana = (server, plugins, ruleRegistry, logger) => {
  const {
    features
  } = plugins;
  const libs = (0, _kibana.compose)(server);
  features.registerKibanaFeature({
    id: _plugin.PLUGIN.ID,
    name: _plugin.PLUGIN.NAME,
    order: 1000,
    category: _server.DEFAULT_APP_CATEGORIES.observability,
    app: ['uptime', 'kibana'],
    catalogue: ['uptime'],
    management: {
      insightsAndAlerting: ['triggersActions']
    },
    alerting: ['xpack.uptime.alerts.tls', 'xpack.uptime.alerts.tlsCertificate', 'xpack.uptime.alerts.monitorStatus', 'xpack.uptime.alerts.durationAnomaly'],
    privileges: {
      all: {
        app: ['uptime', 'kibana'],
        catalogue: ['uptime'],
        api: ['uptime-read', 'uptime-write', 'lists-all'],
        savedObject: {
          all: [_saved_objects.umDynamicSettings.name, 'alert'],
          read: []
        },
        alerting: {
          rule: {
            all: ['xpack.uptime.alerts.tls', 'xpack.uptime.alerts.tlsCertificate', 'xpack.uptime.alerts.monitorStatus', 'xpack.uptime.alerts.durationAnomaly']
          },
          alert: {
            all: ['xpack.uptime.alerts.tls', 'xpack.uptime.alerts.tlsCertificate', 'xpack.uptime.alerts.monitorStatus', 'xpack.uptime.alerts.durationAnomaly']
          }
        },
        management: {
          insightsAndAlerting: ['triggersActions']
        },
        ui: ['save', 'configureSettings', 'show', 'alerting:save']
      },
      read: {
        app: ['uptime', 'kibana'],
        catalogue: ['uptime'],
        api: ['uptime-read', 'lists-read'],
        savedObject: {
          all: ['alert'],
          read: [_saved_objects.umDynamicSettings.name]
        },
        alerting: {
          rule: {
            read: ['xpack.uptime.alerts.tls', 'xpack.uptime.alerts.tlsCertificate', 'xpack.uptime.alerts.monitorStatus', 'xpack.uptime.alerts.durationAnomaly']
          },
          alert: {
            read: ['xpack.uptime.alerts.tls', 'xpack.uptime.alerts.tlsCertificate', 'xpack.uptime.alerts.monitorStatus', 'xpack.uptime.alerts.durationAnomaly']
          }
        },
        management: {
          insightsAndAlerting: ['triggersActions']
        },
        ui: ['show', 'alerting:save']
      }
    }
  });
  (0, _uptime_server.initUptimeServer)(server, libs, plugins, ruleRegistry, logger);
};

exports.initServerWithKibana = initServerWithKibana;