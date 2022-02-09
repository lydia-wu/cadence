"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "TaskStatus", {
  enumerable: true,
  get: function () {
    return _task.TaskStatus;
  }
});
Object.defineProperty(exports, "asInterval", {
  enumerable: true,
  get: function () {
    return _intervals.asInterval;
  }
});
exports.config = void 0;
Object.defineProperty(exports, "getOldestIdleActionTask", {
  enumerable: true,
  get: function () {
    return _oldest_idle_action_task.getOldestIdleActionTask;
  }
});
Object.defineProperty(exports, "isEphemeralTaskRejectedDueToCapacityError", {
  enumerable: true,
  get: function () {
    return _task_running.isEphemeralTaskRejectedDueToCapacityError;
  }
});
Object.defineProperty(exports, "isUnrecoverableError", {
  enumerable: true,
  get: function () {
    return _task_running.isUnrecoverableError;
  }
});
exports.plugin = void 0;
Object.defineProperty(exports, "throwUnrecoverableError", {
  enumerable: true,
  get: function () {
    return _task_running.throwUnrecoverableError;
  }
});

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _plugin = require("./plugin");

var _config = require("./config");

var _task = require("./task");

var _intervals = require("./lib/intervals");

var _task_running = require("./task_running");

var _oldest_idle_action_task = require("./queries/oldest_idle_action_task");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = initContext => new _plugin.TaskManagerPlugin(initContext);

exports.plugin = plugin;
const config = {
  schema: _config.configSchema,
  exposeToUsage: {
    max_workers: true
  },
  deprecations: () => [(settings, fromPath, addDeprecation) => {
    const taskManager = (0, _lodash.get)(settings, fromPath);

    if (taskManager !== null && taskManager !== void 0 && taskManager.index) {
      addDeprecation({
        level: 'critical',
        configPath: `${fromPath}.index`,
        documentationUrl: 'https://ela.st/kbn-remove-legacy-multitenancy',
        message: `"${fromPath}.index" is deprecated. Multitenancy by changing "kibana.index" will not be supported starting in 8.0. See https://ela.st/kbn-remove-legacy-multitenancy for more details`,
        correctiveActions: {
          manualSteps: [`If you rely on this setting to achieve multitenancy you should use Spaces, cross-cluster replication, or cross-cluster search instead.`, `To migrate to Spaces, we encourage using saved object management to export your saved objects from a tenant into the default tenant in a space.`]
        }
      });
    }

    if ((taskManager === null || taskManager === void 0 ? void 0 : taskManager.max_workers) > _config.MAX_WORKERS_LIMIT) {
      addDeprecation({
        level: 'critical',
        configPath: `${fromPath}.max_workers`,
        message: `setting "${fromPath}.max_workers" (${taskManager === null || taskManager === void 0 ? void 0 : taskManager.max_workers}) greater than ${_config.MAX_WORKERS_LIMIT} is deprecated.`,
        correctiveActions: {
          manualSteps: [`Maximum allowed value of "${fromPath}.max_workers" is ${_config.MAX_WORKERS_LIMIT}.` + `Replace "${fromPath}.max_workers: ${taskManager === null || taskManager === void 0 ? void 0 : taskManager.max_workers}" with (${_config.MAX_WORKERS_LIMIT}).`]
        }
      });
    }
  }, (settings, fromPath, addDeprecation) => {
    const taskManager = (0, _lodash.get)(settings, fromPath);

    if ((taskManager === null || taskManager === void 0 ? void 0 : taskManager.enabled) === false || (taskManager === null || taskManager === void 0 ? void 0 : taskManager.enabled) === true) {
      addDeprecation({
        configPath: 'xpack.task_manager.enabled',
        title: _i18n.i18n.translate('xpack.taskManager.deprecations.enabledTitle', {
          defaultMessage: 'Setting "xpack.task_manager.enabled" is deprecated'
        }),
        message: _i18n.i18n.translate('xpack.taskManager.deprecations.enabledMessage', {
          defaultMessage: 'This setting will be removed in 8.0 and the Task Manager plugin will always be enabled.'
        }),
        correctiveActions: {
          manualSteps: [_i18n.i18n.translate('xpack.taskManager.deprecations.enabled.manualStepOneMessage', {
            defaultMessage: 'Remove "xpack.task_manager.enabled" from kibana.yml.'
          })]
        }
      });
    }
  }]
};
exports.config = config;