"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSignalsStatusRoute = void 0;

var _lodash = require("lodash");

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _set_signal_status_type_dependents = require("../../../../../common/detection_engine/schemas/request/set_signal_status_type_dependents");

var _set_signal_status_schema = require("../../../../../common/detection_engine/schemas/request/set_signal_status_schema");

var _constants = require("../../../../../common/constants");

var _utils = require("../utils");

var _constants2 = require("../../../telemetry/constants");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _insights = require("../../../telemetry/insights");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const setSignalsStatusRoute = (router, logger, security, sender) => {
  router.post({
    path: _constants.DETECTION_ENGINE_SIGNALS_STATUS_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_set_signal_status_schema.setSignalsStatusSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _context$securitySolu, _security$authc$getCu;

    const {
      conflicts,
      signal_ids: signalIds,
      query,
      status
    } = request.body;
    const esClient = context.core.elasticsearch.client.asCurrentUser;
    const siemClient = (_context$securitySolu = context.securitySolution) === null || _context$securitySolu === void 0 ? void 0 : _context$securitySolu.getAppClient();
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const validationErrors = (0, _set_signal_status_type_dependents.setSignalStatusValidateTypeDependents)(request.body);

    if (validationErrors.length) {
      return siemResponse.error({
        statusCode: 400,
        body: validationErrors
      });
    }

    if (!siemClient) {
      return siemResponse.error({
        statusCode: 404
      });
    }

    const clusterId = sender.getClusterID();
    const [isTelemetryOptedIn, username] = await Promise.all([sender.isTelemetryOptedIn(), security === null || security === void 0 ? void 0 : (_security$authc$getCu = security.authc.getCurrentUser(request)) === null || _security$authc$getCu === void 0 ? void 0 : _security$authc$getCu.username]);

    if (isTelemetryOptedIn && clusterId) {
      // Sometimes the ids are in the query not passed in the request?
      const toSendAlertIds = (0, _lodash.get)(query, 'bool.filter.terms._id') || signalIds; // Get Context for Insights Payloads

      const sessionId = (0, _insights.getSessionIDfromKibanaRequest)(clusterId, request);

      if (username && toSendAlertIds && sessionId && status) {
        const insightsPayloads = (0, _insights.createAlertStatusPayloads)(clusterId, toSendAlertIds, sessionId, username, _constants.DETECTION_ENGINE_SIGNALS_STATUS_URL, status);
        logger.debug(`Sending Insights Payloads ${JSON.stringify(insightsPayloads)}`);
        await sender.sendOnDemand(_constants2.INSIGHTS_CHANNEL, insightsPayloads);
      }
    }

    let queryObject;

    if (signalIds) {
      queryObject = {
        ids: {
          values: signalIds
        }
      };
    }

    if (query) {
      queryObject = {
        bool: {
          filter: query
        }
      };
    }

    try {
      const {
        body
      } = await esClient.updateByQuery({
        index: siemClient.getSignalsIndex(),
        conflicts: conflicts !== null && conflicts !== void 0 ? conflicts : 'abort',
        // https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update-by-query.html#_refreshing_shards_2
        // Note: Before we tried to use "refresh: wait_for" but I do not think that was available and instead it defaulted to "refresh: true"
        // but the tests do not pass with "refresh: false". If at some point a "refresh: wait_for" is implemented, we should use that instead.
        refresh: true,
        body: {
          script: {
            source: `if (ctx._source['${_ruleDataUtils.ALERT_WORKFLOW_STATUS}'] != null) {
                ctx._source['${_ruleDataUtils.ALERT_WORKFLOW_STATUS}'] = '${status}'
              }
              if (ctx._source.signal != null && ctx._source.signal.status != null) {
                ctx._source.signal.status = '${status}'
              }`,
            lang: 'painless'
          },
          query: queryObject
        },
        ignore_unavailable: true
      });
      return response.ok({
        body
      });
    } catch (err) {
      // error while getting or updating signal with id: id in signal index .siem-signals
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.setSignalsStatusRoute = setSignalsStatusRoute;