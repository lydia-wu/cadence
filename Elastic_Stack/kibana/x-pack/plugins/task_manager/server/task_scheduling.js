"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskScheduling = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _operators = require("rxjs/operators");

var _pipeable = require("fp-ts/lib/pipeable");

var _Option = require("fp-ts/lib/Option");

var _uuid = _interopRequireDefault(require("uuid"));

var _lodash = require("lodash");

var _rxjs = require("rxjs");

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _result_type = require("./lib/result_type");

var _task_events = require("./task_events");

var _task = require("./task");

var _correct_deprecated_fields = require("./lib/correct_deprecated_fields");

var _task_running = require("./task_running");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const VERSION_CONFLICT_STATUS = 409;

class TaskScheduling {
  /**
   * Initializes the task manager, preventing any further addition of middleware,
   * enabling the task manipulation methods, and beginning the background polling
   * mechanism.
   */
  constructor(opts) {
    (0, _defineProperty2.default)(this, "store", void 0);
    (0, _defineProperty2.default)(this, "taskPollingLifecycle", void 0);
    (0, _defineProperty2.default)(this, "ephemeralTaskLifecycle", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "middleware", void 0);
    (0, _defineProperty2.default)(this, "definitions", void 0);
    (0, _defineProperty2.default)(this, "taskManagerId", void 0);
    this.logger = opts.logger;
    this.middleware = opts.middleware;
    this.taskPollingLifecycle = opts.taskPollingLifecycle;
    this.ephemeralTaskLifecycle = opts.ephemeralTaskLifecycle;
    this.store = opts.taskStore;
    this.definitions = opts.definitions;
    this.taskManagerId = opts.taskManagerId;
  }
  /**
   * Schedules a task.
   *
   * @param task - The task being scheduled.
   * @returns {Promise<ConcreteTaskInstance>}
   */


  async schedule(taskInstance, options) {
    const {
      taskInstance: modifiedTask
    } = await this.middleware.beforeSave({ ...options,
      taskInstance: (0, _correct_deprecated_fields.ensureDeprecatedFieldsAreCorrected)(taskInstance, this.logger)
    });
    const traceparent = _elasticApmNode.default.currentTransaction && _elasticApmNode.default.currentTransaction.type !== 'request' ? _elasticApmNode.default.currentTraceparent : '';
    return await this.store.schedule({ ...modifiedTask,
      traceparent: traceparent || ''
    });
  }
  /**
   * Run  task.
   *
   * @param taskId - The task being scheduled.
   * @returns {Promise<ConcreteTaskInstance>}
   */


  async runNow(taskId) {
    return new Promise(async (resolve, reject) => {
      try {
        this.awaitTaskRunResult(taskId) // don't expose state on runNow
        .then(({
          id
        }) => resolve({
          id
        })).catch(reject);
        this.taskPollingLifecycle.attemptToRun(taskId);
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * Run an ad-hoc task in memory without persisting it into ES or distributing the load across the cluster.
   *
   * @param task - The ephemeral task being queued.
   * @returns {Promise<ConcreteTaskInstance>}
   */


  async ephemeralRunNow(task, options) {
    const id = _uuid.default.v4();

    const {
      taskInstance: modifiedTask
    } = await this.middleware.beforeSave({ ...options,
      taskInstance: task
    });
    return new Promise(async (resolve, reject) => {
      try {
        // The actual promise returned from this function is resolved after the awaitTaskRunResult promise resolves.
        // However, we do not wait to await this promise, as we want later execution to happen in parallel.
        // The awaitTaskRunResult promise is resolved once the ephemeral task is successfully executed (technically, when a TaskEventType.TASK_RUN is emitted with the same id).
        // However, the ephemeral task won't even get into the queue until the subsequent this.ephemeralTaskLifecycle.attemptToRun is called (which puts it in the queue).
        // The reason for all this confusion? Timing.
        // In the this.ephemeralTaskLifecycle.attemptToRun, it's possible that the ephemeral task is put into the queue and processed before this function call returns anything.
        // If that happens, putting the awaitTaskRunResult after would just hang because the task already completed. We need to listen for the completion before we add it to the queue to avoid this possibility.
        const {
          cancel,
          resolveOnCancel
        } = cancellablePromise();
        this.awaitTaskRunResult(id, resolveOnCancel).then(arg => {
          resolve(arg);
        }).catch(err => {
          reject(err);
        });
        const attemptToRunResult = this.ephemeralTaskLifecycle.attemptToRun({
          id,
          scheduledAt: new Date(),
          runAt: new Date(),
          status: _task.TaskStatus.Idle,
          ownerId: this.taskManagerId,
          ...modifiedTask
        });

        if ((0, _result_type.isErr)(attemptToRunResult)) {
          cancel();
          reject(new _task_running.EphemeralTaskRejectedDueToCapacityError(`Ephemeral Task of type ${task.taskType} was rejected`, task));
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * Schedules a task with an Id
   *
   * @param task - The task being scheduled.
   * @returns {Promise<TaskInstanceWithId>}
   */


  async ensureScheduled(taskInstance, options) {
    try {
      return await this.schedule(taskInstance, options);
    } catch (err) {
      if (err.statusCode === VERSION_CONFLICT_STATUS) {
        return taskInstance;
      }

      throw err;
    }
  }

  awaitTaskRunResult(taskId, cancel) {
    return new Promise((resolve, reject) => {
      // listen for all events related to the current task
      const subscription = (0, _rxjs.merge)(this.taskPollingLifecycle.events, this.ephemeralTaskLifecycle.events).pipe((0, _operators.filter)(({
        id
      }) => id === taskId)).subscribe(taskEvent => {
        if ((0, _task_events.isTaskClaimEvent)(taskEvent)) {
          (0, _result_type.mapErr)(async error => {
            // reject if any error event takes place for the requested task
            subscription.unsubscribe();

            if ((0, _Option.isSome)(error.task) && error.errorType === _task_events.TaskClaimErrorType.CLAIMED_BY_ID_OUT_OF_CAPACITY) {
              var _definition$title;

              const task = error.task.value;
              const definition = this.definitions.get(task.taskType);
              return reject(new Error(`Failed to run task "${taskId}" as we would exceed the max concurrency of "${(_definition$title = definition === null || definition === void 0 ? void 0 : definition.title) !== null && _definition$title !== void 0 ? _definition$title : task.taskType}" which is ${definition === null || definition === void 0 ? void 0 : definition.maxConcurrency}. Rescheduled the task to ensure it is picked up as soon as possible.`));
            } else {
              return reject(await this.identifyTaskFailureReason(taskId, error.task));
            }
          }, taskEvent.event);
        } else {
          (0, _result_type.either)(taskEvent.event, taskInstance => {
            // resolve if the task has run sucessfully
            if ((0, _task_events.isTaskRunEvent)(taskEvent)) {
              subscription.unsubscribe();
              resolve((0, _lodash.pick)(taskInstance.task, ['id', 'state']));
            }
          }, async errorResult => {
            // reject if any error event takes place for the requested task
            subscription.unsubscribe();
            return reject(new Error(`Failed to run task "${taskId}": ${(0, _task_events.isTaskRunRequestEvent)(taskEvent) ? `Task Manager is at capacity, please try again later` : (0, _task_events.isTaskRunEvent)(taskEvent) ? `${errorResult.error}` : `${errorResult}`}`));
          });
        }
      });

      if (cancel) {
        cancel.then(() => {
          subscription.unsubscribe();
        });
      }
    });
  }

  async identifyTaskFailureReason(taskId, error) {
    return (0, _result_type.map)(await (0, _pipeable.pipe)(error, (0, _Option.map)(async taskReturnedBySweep => (0, _result_type.asOk)(taskReturnedBySweep.status)), (0, _Option.getOrElse)(() => // if the error happened in the Claim phase - we try to provide better insight
    // into why we failed to claim by getting the task's current lifecycle status
    (0, _result_type.promiseResult)(this.store.getLifecycle(taskId)))), taskLifecycleStatus => {
      if (taskLifecycleStatus === _task.TaskLifecycleResult.NotFound) {
        return new Error(`Failed to run task "${taskId}" as it does not exist`);
      } else if (taskLifecycleStatus === _task.TaskStatus.Running || taskLifecycleStatus === _task.TaskStatus.Claiming) {
        return new Error(`Failed to run task "${taskId}" as it is currently running`);
      }

      return new Error(`Failed to run task "${taskId}" for unknown reason (Current Task Lifecycle is "${taskLifecycleStatus}")`);
    }, getLifecycleError => new Error(`Failed to run task "${taskId}" and failed to get current Status:${getLifecycleError}`));
  }

}

exports.TaskScheduling = TaskScheduling;

const cancellablePromise = () => {
  const boolStream = new _rxjs.Subject();
  return {
    cancel: () => boolStream.next(true),
    resolveOnCancel: boolStream.pipe((0, _operators.take)(1)).toPromise().then(() => {})
  };
};