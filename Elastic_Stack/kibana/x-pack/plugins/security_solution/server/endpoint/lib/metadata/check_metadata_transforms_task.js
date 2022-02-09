"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VERSION = exports.TYPE = exports.CheckMetadataTransformsTask = exports.BASE_NEXT_ATTEMPT_DELAY = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _server = require("../../../../../task_manager/server");

var _constants = require("../../../../common/endpoint/constants");

var _constants2 = require("../../../../common/constants");

var _utils = require("../../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SCOPE = ['securitySolution'];
const INTERVAL = '2h';
const TIMEOUT = '4m';
const TYPE = 'endpoint:metadata-check-transforms-task';
exports.TYPE = TYPE;
const VERSION = '0.0.1';
exports.VERSION = VERSION;
const MAX_ATTEMPTS = 5;
const BASE_NEXT_ATTEMPT_DELAY = 5; // minutes

exports.BASE_NEXT_ATTEMPT_DELAY = BASE_NEXT_ATTEMPT_DELAY;

class CheckMetadataTransformsTask {
  constructor(setupContract) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "wasStarted", false);
    (0, _defineProperty2.default)(this, "start", async ({
      taskManager
    }) => {
      if (!taskManager) {
        this.logger.error('missing required service during start');
        return;
      }

      this.wasStarted = true;

      try {
        await taskManager.ensureScheduled({
          id: this.getTaskId(),
          taskType: TYPE,
          scope: SCOPE,
          schedule: {
            interval: INTERVAL
          },
          state: {
            attempts: {}
          },
          params: {
            version: VERSION
          }
        });
      } catch (e) {
        this.logger.debug(`Error scheduling task, received ${e.message}`);
      }
    });
    (0, _defineProperty2.default)(this, "runTask", async (taskInstance, core) => {
      // if task was not `.start()`'d yet, then exit
      if (!this.wasStarted) {
        this.logger.debug('[runTask()] Aborted. MetadataTask not started yet');
        return;
      } // Check that this task is current


      if (taskInstance.id !== this.getTaskId()) {
        // old task, die
        (0, _server.throwUnrecoverableError)(new Error('Outdated task version'));
      }

      const [{
        elasticsearch
      }] = await core.getStartServices();
      const esClient = elasticsearch.client.asInternalUser;
      let transformStatsResponse;

      try {
        transformStatsResponse = await (esClient === null || esClient === void 0 ? void 0 : esClient.transform.getTransformStats({
          transform_id: _constants.METADATA_TRANSFORMS_PATTERN
        }));
      } catch (e) {
        const err = (0, _utils.wrapErrorIfNeeded)(e);
        const errMessage = `failed to get transform stats with error: ${err}`;
        this.logger.error(errMessage);
        return;
      }

      const {
        transforms
      } = transformStatsResponse.body;

      if (!transforms.length) {
        this.logger.info('no endpoint metadata transforms found');
        return;
      }

      let didAttemptRestart = false;
      let highestAttempt = 0;
      const attempts = { ...taskInstance.state.attempts
      };

      for (const transform of transforms) {
        const restartedTransform = await this.restartTransform(esClient, transform, attempts[transform.id]);

        if (restartedTransform.didAttemptRestart) {
          didAttemptRestart = true;
        }

        attempts[transform.id] = restartedTransform.attempts;
        highestAttempt = Math.max(attempts[transform.id], highestAttempt);
      } // after a restart attempt run next check sooner with exponential backoff


      let runAt;

      if (didAttemptRestart) {
        const delay = BASE_NEXT_ATTEMPT_DELAY ** Math.max(highestAttempt, 1) * 60000;
        runAt = new Date(new Date().getTime() + delay);
      }

      const nextState = {
        attempts
      };
      const nextTask = runAt ? {
        state: nextState,
        runAt
      } : {
        state: nextState
      };
      return nextTask;
    });
    (0, _defineProperty2.default)(this, "restartTransform", async (esClient, transform, currentAttempts = 0) => {
      let attempts = currentAttempts;
      let didAttemptRestart = false;

      if (!_constants2.WARNING_TRANSFORM_STATES.has(transform.state)) {
        return {
          attempts,
          didAttemptRestart
        };
      }

      if (attempts > MAX_ATTEMPTS) {
        this.logger.warn(`transform ${transform.id} has failed to restart ${attempts} times. stopping auto restart attempts.`);
        return {
          attempts,
          didAttemptRestart
        };
      }

      try {
        this.logger.info(`failed transform detected with id: ${transform.id}. attempting restart.`);
        await esClient.transform.stopTransform({
          transform_id: transform.id,
          allow_no_match: true,
          wait_for_completion: true,
          force: true
        });
        await esClient.transform.startTransform({
          transform_id: transform.id
        }); // restart succeeded, reset attempt count

        attempts = 0;
      } catch (e) {
        const err = (0, _utils.wrapErrorIfNeeded)(e);
        const errMessage = `failed to restart transform ${transform.id} with error: ${err}`;
        this.logger.error(errMessage); // restart failed, increment attempt count

        attempts = attempts + 1;
      } finally {
        didAttemptRestart = true;
      }

      return {
        attempts,
        didAttemptRestart
      };
    });
    (0, _defineProperty2.default)(this, "getTaskId", () => {
      return `${TYPE}:${VERSION}`;
    });
    const {
      endpointAppContext,
      core: _core,
      taskManager: _taskManager
    } = setupContract;
    this.logger = endpointAppContext.logFactory.get(this.getTaskId());

    _taskManager.registerTaskDefinitions({
      [TYPE]: {
        title: 'Security Solution Endpoint Metadata Periodic Tasks',
        timeout: TIMEOUT,
        createTaskRunner: ({
          taskInstance
        }) => {
          return {
            run: async () => {
              return this.runTask(taskInstance, _core);
            },
            cancel: async () => {}
          };
        }
      }
    });
  }

}

exports.CheckMetadataTransformsTask = CheckMetadataTransformsTask;