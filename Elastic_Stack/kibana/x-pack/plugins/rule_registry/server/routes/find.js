"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAlertsByQueryRoute = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");

var _constants = require("../../common/constants");

var _route_validation = require("./utils/route_validation");

var _types = require("../../common/types");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const findAlertsByQueryRoute = router => {
  router.post({
    path: `${_constants.BASE_RAC_ALERTS_API_PATH}/find`,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(t.exact(t.partial({
        index: t.string,
        query: t.object,
        aggs: t.union([t.record(t.string, _types.BucketAggsSchemas), t.undefined]),
        size: t.union([_securitysolutionIoTsTypes.PositiveInteger, t.undefined]),
        track_total_hits: t.union([t.boolean, t.undefined]),
        _source: t.union([t.array(t.string), t.undefined])
      })))
    },
    options: {
      tags: ['access:rac']
    }
  }, async (context, request, response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const {
        query,
        aggs,
        _source,
        track_total_hits,
        size,
        index
      } = request.body;
      const alertsClient = await context.rac.getAlertsClient();
      const alerts = await alertsClient.find({
        query,
        aggs,
        _source,
        track_total_hits,
        size,
        index
      });

      if (alerts == null) {
        return response.notFound({
          body: {
            message: `alerts with query and index ${index} not found`
          }
        });
      }

      return response.ok({
        body: alerts
      });
    } catch (exc) {
      const err = (0, _securitysolutionEsUtils.transformError)(exc);
      const contentType = {
        'content-type': 'application/json'
      };
      const defaultedHeaders = { ...contentType
      };
      return response.customError({
        headers: defaultedHeaders,
        statusCode: err.statusCode,
        body: {
          message: err.message,
          attributes: {
            success: false
          }
        }
      });
    }
  });
};

exports.findAlertsByQueryRoute = findAlertsByQueryRoute;