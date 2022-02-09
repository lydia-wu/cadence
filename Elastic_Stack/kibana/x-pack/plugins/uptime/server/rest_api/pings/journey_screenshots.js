"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJourneyScreenshotRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _synthetics = require("../../../common/runtime_types/ping/synthetics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getSharedHeaders(stepName, totalSteps) {
  return {
    'cache-control': 'max-age=600',
    'caption-name': stepName,
    'max-steps': String(totalSteps)
  };
}

const createJourneyScreenshotRoute = libs => ({
  method: 'GET',
  path: '/api/uptime/journey/screenshot/{checkGroup}/{stepIndex}',
  validate: {
    params: _configSchema.schema.object({
      checkGroup: _configSchema.schema.string(),
      stepIndex: _configSchema.schema.number()
    })
  },
  handler: async ({
    uptimeEsClient,
    request,
    response
  }) => {
    var _result$synthetics;

    const {
      checkGroup,
      stepIndex
    } = request.params;
    const result = await libs.requests.getJourneyScreenshot({
      uptimeEsClient,
      checkGroup,
      stepIndex
    });

    if ((0, _synthetics.isFullScreenshot)(result) && typeof ((_result$synthetics = result.synthetics) === null || _result$synthetics === void 0 ? void 0 : _result$synthetics.blob) !== 'undefined') {
      return response.ok({
        body: Buffer.from(result.synthetics.blob, 'base64'),
        headers: {
          'content-type': result.synthetics.blob_mime || 'image/png',
          // falls back to 'image/png' for earlier versions of synthetics
          ...getSharedHeaders(result.synthetics.step.name, result.totalSteps)
        }
      });
    } else if ((0, _synthetics.isRefResult)(result)) {
      return response.ok({
        body: {
          screenshotRef: result
        },
        headers: getSharedHeaders(result.synthetics.step.name, result.totalSteps)
      });
    }

    return response.notFound();
  }
});

exports.createJourneyScreenshotRoute = createJourneyScreenshotRoute;