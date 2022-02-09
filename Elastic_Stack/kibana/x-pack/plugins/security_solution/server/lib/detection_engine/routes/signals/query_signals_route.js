"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.querySignalsRoute = void 0;

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _experimental_features = require("../../../../../common/experimental_features");

var _constants = require("../../../../../common/constants");

var _utils = require("../utils");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _query_signals_index_schema = require("../../../../../common/detection_engine/schemas/request/query_signals_index_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const querySignalsRoute = (router, config) => {
  router.post({
    path: _constants.DETECTION_ENGINE_QUERY_SIGNALS_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_query_signals_index_schema.querySignalsSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      query,
      aggs,
      _source,
      track_total_hits,
      size
    } = request.body;
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    if (query == null && aggs == null && _source == null && track_total_hits == null && size == null) {
      return siemResponse.error({
        statusCode: 400,
        body: '"value" must have at least 1 children'
      });
    }

    const esClient = context.core.elasticsearch.client.asCurrentUser;
    const siemClient = context.securitySolution.getAppClient(); // TODO: Once we are past experimental phase this code should be removed

    const {
      ruleRegistryEnabled
    } = (0, _experimental_features.parseExperimentalConfigValue)(config.enableExperimental);

    try {
      const {
        body
      } = await esClient.search({
        index: ruleRegistryEnabled ? _constants.DEFAULT_ALERTS_INDEX : siemClient.getSignalsIndex(),
        body: {
          query,
          // Note: I use a spread operator to please TypeScript with aggs: { ...aggs }
          aggs: { ...aggs
          },
          _source,
          track_total_hits,
          size
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

exports.querySignalsRoute = querySignalsRoute;