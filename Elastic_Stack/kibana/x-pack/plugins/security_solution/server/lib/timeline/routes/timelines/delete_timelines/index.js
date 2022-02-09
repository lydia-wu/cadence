"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteTimelinesRoute = void 0;

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _route_validation = require("../../../../../utils/build_validation/route_validation");

var _delete_timelines_schema = require("../../../schemas/timelines/delete_timelines_schema");

var _constants = require("../../../../../../common/constants");

var _utils = require("../../../../detection_engine/routes/utils");

var _common = require("../../../utils/common");

var _timelines = require("../../../saved_object/timelines");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteTimelinesRoute = (router, config, security) => {
  router.delete({
    path: _constants.TIMELINE_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidationWithExcess)(_delete_timelines_schema.deleteTimelinesSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const {
        savedObjectIds
      } = request.body;
      await (0, _timelines.deleteTimeline)(frameworkRequest, savedObjectIds);
      return response.ok({
        body: {
          data: {
            deleteTimeline: true
          }
        }
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.deleteTimelinesRoute = deleteTimelinesRoute;