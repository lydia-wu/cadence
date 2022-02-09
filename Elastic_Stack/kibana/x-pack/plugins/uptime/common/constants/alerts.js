"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TLS_LEGACY = exports.TLS = exports.MONITOR_STATUS = exports.DURATION_ANOMALY = exports.CLIENT_ALERT_TYPES = exports.ACTION_GROUP_DEFINITIONS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MONITOR_STATUS = {
  id: 'xpack.uptime.alerts.actionGroups.monitorStatus',
  name: 'Uptime Down Monitor'
};
exports.MONITOR_STATUS = MONITOR_STATUS;
const TLS_LEGACY = {
  id: 'xpack.uptime.alerts.actionGroups.tls',
  name: 'Uptime TLS Alert (Legacy)'
};
exports.TLS_LEGACY = TLS_LEGACY;
const TLS = {
  id: 'xpack.uptime.alerts.actionGroups.tlsCertificate',
  name: 'Uptime TLS Alert'
};
exports.TLS = TLS;
const DURATION_ANOMALY = {
  id: 'xpack.uptime.alerts.actionGroups.durationAnomaly',
  name: 'Uptime Duration Anomaly'
};
exports.DURATION_ANOMALY = DURATION_ANOMALY;
const ACTION_GROUP_DEFINITIONS = {
  MONITOR_STATUS,
  TLS_LEGACY,
  TLS,
  DURATION_ANOMALY
};
exports.ACTION_GROUP_DEFINITIONS = ACTION_GROUP_DEFINITIONS;
const CLIENT_ALERT_TYPES = {
  MONITOR_STATUS: 'xpack.uptime.alerts.monitorStatus',
  TLS_LEGACY: 'xpack.uptime.alerts.tls',
  TLS: 'xpack.uptime.alerts.tlsCertificate',
  DURATION_ANOMALY: 'xpack.uptime.alerts.durationAnomaly'
};
exports.CLIENT_ALERT_TYPES = CLIENT_ALERT_TYPES;