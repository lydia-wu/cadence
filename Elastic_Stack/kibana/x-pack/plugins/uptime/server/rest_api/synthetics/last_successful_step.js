"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLastSuccessfulStepRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _synthetics = require("../../../common/runtime_types/ping/synthetics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createLastSuccessfulStepRoute = libs => ({
  method: 'GET',
  path: '/api/uptime/synthetics/step/success/',
  validate: {
    query: _configSchema.schema.object({
      monitorId: _configSchema.schema.string(),
      stepIndex: _configSchema.schema.number(),
      timestamp: _configSchema.schema.string(),
      location: _configSchema.schema.maybe(_configSchema.schema.string())
    })
  },
  handler: async ({
    uptimeEsClient,
    request,
    response
  }) => {
    var _step$synthetics, _step$synthetics$step;

    const {
      timestamp,
      monitorId,
      stepIndex,
      location
    } = request.query;
    const step = await libs.requests.getStepLastSuccessfulStep({
      uptimeEsClient,
      monitorId,
      stepIndex,
      timestamp,
      location
    });

    if (step === null) {
      return response.notFound();
    }

    if (!((_step$synthetics = step.synthetics) !== null && _step$synthetics !== void 0 && (_step$synthetics$step = _step$synthetics.step) !== null && _step$synthetics$step !== void 0 && _step$synthetics$step.index)) {
      return response.ok({
        body: step
      });
    }

    const screenshot = await libs.requests.getJourneyScreenshot({
      uptimeEsClient,
      checkGroup: step.monitor.check_group,
      stepIndex: step.synthetics.step.index
    });

    if (screenshot === null) {
      return response.ok({
        body: step
      });
    }

    step.synthetics.isScreenshotRef = (0, _synthetics.isRefResult)(screenshot);
    step.synthetics.isFullScreenshot = (0, _synthetics.isFullScreenshot)(screenshot);
    return response.ok({
      body: step
    });
  }
});

exports.createLastSuccessfulStepRoute = createLastSuccessfulStepRoute;