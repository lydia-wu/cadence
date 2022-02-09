"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanDraftTimelinesRoute = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _utils = require("../../../../detection_engine/routes/utils");

var _constants = require("../../../../../../common/constants");

var _common = require("../../../utils/common");

var _route_validation = require("../../../../../utils/build_validation/route_validation");

var _timelines = require("../../../saved_object/timelines");

var _default_timeline = require("../../../utils/default_timeline");

var _draft_timelines = require("../../../schemas/draft_timelines");

var _timeline = require("../../../../../../common/types/timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const cleanDraftTimelinesRoute = (router, config, security) => {
  router.post({
    path: _constants.TIMELINE_DRAFT_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidationWithExcess)(_draft_timelines.cleanDraftTimelineSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      const {
        timeline: [draftTimeline]
      } = await (0, _timelines.getDraftTimeline)(frameworkRequest, request.body.timelineType);

      if (draftTimeline !== null && draftTimeline !== void 0 && draftTimeline.savedObjectId) {
        await (0, _timelines.resetTimeline)(frameworkRequest, [draftTimeline.savedObjectId], request.body.timelineType);
        const cleanedDraftTimeline = await (0, _timelines.getTimeline)(frameworkRequest, draftTimeline.savedObjectId);
        return response.ok({
          body: {
            data: {
              persistTimeline: {
                timeline: cleanedDraftTimeline
              }
            }
          }
        });
      }

      const templateTimelineData = request.body.timelineType === _timeline.TimelineType.template ? {
        timelineType: request.body.timelineType,
        templateTimelineId: _uuid.default.v4(),
        templateTimelineVersion: 1
      } : {};
      const newTimelineResponse = await (0, _timelines.persistTimeline)(frameworkRequest, null, null, { ..._default_timeline.draftTimelineDefaults,
        ...templateTimelineData
      });

      if (newTimelineResponse.code === 200) {
        return response.ok({
          body: {
            data: {
              persistTimeline: {
                timeline: newTimelineResponse.timeline
              }
            }
          }
        });
      }

      return response.ok({});
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.cleanDraftTimelinesRoute = cleanDraftTimelinesRoute;