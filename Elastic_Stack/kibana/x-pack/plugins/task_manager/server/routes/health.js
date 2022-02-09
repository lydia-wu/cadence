"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.healthRoute = healthRoute;
exports.withServiceStatus = withServiceStatus;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _server = require("../../../../../src/core/server");

var _monitoring = require("../monitoring");

var _log_health_metrics = require("../lib/log_health_metrics");

var _calculate_health_status = require("../lib/calculate_health_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const LEVEL_SUMMARY = {
  [_server.ServiceStatusLevels.available.toString()]: 'Task Manager is healthy',
  [_server.ServiceStatusLevels.degraded.toString()]: 'Task Manager is unhealthy',
  [_server.ServiceStatusLevels.unavailable.toString()]: 'Task Manager is unavailable'
};
/**
 * We enforce a `meta` of `never` because this meta gets duplicated into *every dependant plugin*, and
 * this will then get logged out when logging is set to Verbose.
 * We used to pass in the the entire MonitoredHealth into this `meta` field, but this means that the
 * whole MonitoredHealth JSON (which can be quite big) was duplicated dozens of times and when we
 * try to view logs in Discover, it fails to render as this JSON was often dozens of levels deep.
 */

function healthRoute(router, monitoringStats$, logger, taskManagerId, config) {
  // if "hot" health stats are any more stale than monitored_stats_required_freshness (pollInterval +1s buffer by default)
  // consider the system unhealthy
  const requiredHotStatsFreshness = config.monitored_stats_required_freshness;

  function getHealthStatus(monitoredStats) {
    const summarizedStats = (0, _monitoring.summarizeMonitoringStats)(logger, monitoredStats, config);
    const status = (0, _calculate_health_status.calculateHealthStatus)(summarizedStats, config, logger);
    const now = Date.now();
    const timestamp = new Date(now).toISOString();
    return {
      id: taskManagerId,
      timestamp,
      status,
      ...summarizedStats
    };
  }

  const serviceStatus$ = new _rxjs.Subject();
  const monitoredHealth$ = new _rxjs.Subject();
  /* keep track of last health summary, as we'll return that to the next call to _health */

  let lastMonitoredStats = null;
  /* Log Task Manager stats as a Debug log line at a fixed interval */

  monitoringStats$.pipe((0, _operators.throttleTime)(requiredHotStatsFreshness), (0, _operators.tap)(stats => {
    lastMonitoredStats = stats;
  }), // Only calculate the summerized stats (calculates all runnign averages and evaluates state)
  // when needed by throttling down to the requiredHotStatsFreshness
  (0, _operators.map)(stats => withServiceStatus(getHealthStatus(stats)))).subscribe(([monitoredHealth, serviceStatus]) => {
    serviceStatus$.next(serviceStatus);
    monitoredHealth$.next(monitoredHealth);
    (0, _log_health_metrics.logHealthMetrics)(monitoredHealth, logger, config);
  });
  router.get({
    path: '/api/task_manager/_health',
    validate: false
  }, async function (context, req, res) {
    return res.ok({
      body: lastMonitoredStats ? getHealthStatus(lastMonitoredStats) : {
        id: taskManagerId,
        timestamp: new Date().toISOString(),
        status: _monitoring.HealthStatus.Error
      }
    });
  });
  return {
    serviceStatus$,
    monitoredHealth$
  };
}

function withServiceStatus(monitoredHealth) {
  const level = monitoredHealth.status === _monitoring.HealthStatus.OK ? _server.ServiceStatusLevels.available : _server.ServiceStatusLevels.degraded;
  return [monitoredHealth, {
    level,
    summary: LEVEL_SUMMARY[level.toString()]
  }];
}