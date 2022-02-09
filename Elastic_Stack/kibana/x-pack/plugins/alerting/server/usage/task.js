"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TELEMETRY_TASK_TYPE = exports.TASK_ID = void 0;
exports.initializeAlertingTelemetry = initializeAlertingTelemetry;
exports.scheduleAlertingTelemetry = scheduleAlertingTelemetry;
exports.telemetryTaskRunner = telemetryTaskRunner;

var _moment = _interopRequireDefault(require("moment"));

var _alerts_telemetry = require("./alerts_telemetry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const TELEMETRY_TASK_TYPE = 'alerting_telemetry';
exports.TELEMETRY_TASK_TYPE = TELEMETRY_TASK_TYPE;
const TASK_ID = `Alerting-${TELEMETRY_TASK_TYPE}`;
exports.TASK_ID = TASK_ID;

function initializeAlertingTelemetry(logger, core, taskManager, kibanaIndex) {
  registerAlertingTelemetryTask(logger, core, taskManager, kibanaIndex);
}

function scheduleAlertingTelemetry(logger, taskManager) {
  if (taskManager) {
    scheduleTasks(logger, taskManager);
  }
}

function registerAlertingTelemetryTask(logger, core, taskManager, kibanaIndex) {
  taskManager.registerTaskDefinitions({
    [TELEMETRY_TASK_TYPE]: {
      title: 'Alerting usage fetch task',
      timeout: '5m',
      createTaskRunner: telemetryTaskRunner(logger, core, kibanaIndex)
    }
  });
}

async function scheduleTasks(logger, taskManager) {
  try {
    await taskManager.ensureScheduled({
      id: TASK_ID,
      taskType: TELEMETRY_TASK_TYPE,
      state: {},
      params: {}
    });
  } catch (e) {
    logger.debug(`Error scheduling task, received ${e.message}`);
  }
}

function telemetryTaskRunner(logger, core, kibanaIndex) {
  return ({
    taskInstance
  }) => {
    const {
      state
    } = taskInstance;

    const getEsClient = () => core.getStartServices().then(([{
      elasticsearch: {
        client
      }
    }]) => client.asInternalUser);

    return {
      async run() {
        const esClient = await getEsClient();
        return Promise.all([(0, _alerts_telemetry.getTotalCountAggregations)(esClient, kibanaIndex), (0, _alerts_telemetry.getTotalCountInUse)(esClient, kibanaIndex)]).then(([totalCountAggregations, totalInUse]) => {
          return {
            state: {
              runs: (state.runs || 0) + 1,
              ...totalCountAggregations,
              count_active_by_type: totalInUse.countByType,
              count_active_total: totalInUse.countTotal,
              count_disabled_total: totalCountAggregations.count_total - totalInUse.countTotal,
              count_rules_namespaces: totalInUse.countNamespaces
            },
            runAt: getNextMidnight()
          };
        }).catch(errMsg => {
          logger.warn(`Error executing alerting telemetry task: ${errMsg}`);
          return {
            state: {},
            runAt: getNextMidnight()
          };
        });
      }

    };
  };
}

function getNextMidnight() {
  return (0, _moment.default)().add(1, 'd').startOf('d').toDate();
}