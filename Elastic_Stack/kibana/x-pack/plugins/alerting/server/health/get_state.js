"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHealthStatusStream = exports.getHealthServiceStatusWithRetryAndErrorHandling = exports.MAX_RETRY_ATTEMPTS = void 0;

var _i18n = require("@kbn/i18n");

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _server = require("../../../../../src/core/server");

var _task = require("./task");

var _types = require("../types");

var _get_health = require("./get_health");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MAX_RETRY_ATTEMPTS = 3;
exports.MAX_RETRY_ATTEMPTS = MAX_RETRY_ATTEMPTS;
const HEALTH_STATUS_INTERVAL = 60000 * 5; // Five minutes

const RETRY_DELAY = 5000; // Wait 5 seconds before retrying on errors

async function getLatestTaskState(taskManager, logger, savedObjects, config) {
  try {
    return await taskManager.get(_task.HEALTH_TASK_ID);
  } catch (err) {
    var _err$output; // if task is not found


    if ((err === null || err === void 0 ? void 0 : (_err$output = err.output) === null || _err$output === void 0 ? void 0 : _err$output.statusCode) === 404) {
      await (0, _task.scheduleAlertingHealthCheck)(logger, config, taskManager);
      return await (0, _get_health.getAlertingHealthStatus)(savedObjects);
    }

    throw err;
  }
}

const LEVEL_SUMMARY = {
  [_server.ServiceStatusLevels.available.toString()]: _i18n.i18n.translate('xpack.alerting.server.healthStatus.available', {
    defaultMessage: 'Alerting framework is available'
  }),
  [_server.ServiceStatusLevels.degraded.toString()]: _i18n.i18n.translate('xpack.alerting.server.healthStatus.degraded', {
    defaultMessage: 'Alerting framework is degraded'
  }),
  [_server.ServiceStatusLevels.unavailable.toString()]: _i18n.i18n.translate('xpack.alerting.server.healthStatus.unavailable', {
    defaultMessage: 'Alerting framework is unavailable'
  })
};

const getHealthServiceStatus = async (taskManager, logger, savedObjects, config) => {
  var _doc$state;

  const doc = await getLatestTaskState(taskManager, logger, savedObjects, config);
  const level = ((_doc$state = doc.state) === null || _doc$state === void 0 ? void 0 : _doc$state.health_status) === _types.HealthStatus.OK ? _server.ServiceStatusLevels.available : _server.ServiceStatusLevels.degraded;
  return {
    level,
    summary: LEVEL_SUMMARY[level.toString()]
  };
};

const getHealthServiceStatusWithRetryAndErrorHandling = (taskManager, logger, savedObjects, config, retryDelay) => {
  return (0, _rxjs.defer)(() => getHealthServiceStatus(taskManager, logger, savedObjects, config)).pipe((0, _operators.retryWhen)(errors => {
    return errors.pipe((0, _operators.mergeMap)((error, i) => {
      const retryAttempt = i + 1;

      if (retryAttempt > MAX_RETRY_ATTEMPTS) {
        return (0, _rxjs.throwError)(error);
      }

      return (0, _rxjs.timer)(retryDelay !== null && retryDelay !== void 0 ? retryDelay : RETRY_DELAY);
    }));
  }), (0, _operators.catchError)(error => {
    logger.warn(`Alerting framework is degraded due to the error: ${error}`);
    return (0, _rxjs.of)({
      level: _server.ServiceStatusLevels.degraded,
      summary: LEVEL_SUMMARY[_server.ServiceStatusLevels.degraded.toString()],
      meta: {
        error
      }
    });
  }));
};

exports.getHealthServiceStatusWithRetryAndErrorHandling = getHealthServiceStatusWithRetryAndErrorHandling;

const getHealthStatusStream = (taskManager, logger, savedObjects, config, healthStatusInterval, retryDelay) => (0, _rxjs.interval)(healthStatusInterval !== null && healthStatusInterval !== void 0 ? healthStatusInterval : HEALTH_STATUS_INTERVAL).pipe( // Emit an initial check
(0, _operators.startWith)(getHealthServiceStatusWithRetryAndErrorHandling(taskManager, logger, savedObjects, config, retryDelay)), // On each interval do a new check
(0, _operators.switchMap)(() => getHealthServiceStatusWithRetryAndErrorHandling(taskManager, logger, savedObjects, config, retryDelay)));

exports.getHealthStatusStream = getHealthStatusStream;