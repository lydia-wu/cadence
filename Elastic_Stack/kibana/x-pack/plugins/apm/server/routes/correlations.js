"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.correlationsRouteRepository = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var _to_number_rt = require("@kbn/io-ts-utils/to_number_rt");

var _license_check = require("../../common/license_check");

var _setup_request = require("../lib/helpers/setup_request");

var _queries = require("../lib/correlations/queries");

var _get_fields_stats = require("../lib/correlations/queries/field_stats/get_fields_stats");

var _with_apm_span = require("../utils/with_apm_span");

var _create_apm_server_route = require("./create_apm_server_route");

var _create_apm_server_route_repository = require("./create_apm_server_route_repository");

var _default_api_types = require("./default_api_types");

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


const INVALID_LICENSE = _i18n.i18n.translate('xpack.apm.correlations.license.text', {
  defaultMessage: 'To use the correlations API, you must be subscribed to an Elastic Platinum license.'
});

const fieldCandidatesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/correlations/field_candidates',
  params: t.type({
    query: t.intersection([t.partial({
      serviceName: t.string,
      transactionName: t.string,
      transactionType: t.string
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context
    } = resources;

    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(INVALID_LICENSE);
    }

    const {
      indices
    } = await (0, _setup_request.setupRequest)(resources);
    const esClient = resources.context.core.elasticsearch.client.asCurrentUser;
    return (0, _with_apm_span.withApmSpan)('get_correlations_field_candidates', async () => await (0, _queries.fetchTransactionDurationFieldCandidates)(esClient, { ...resources.params.query,
      index: indices.transaction
    }));
  }
});
const fieldStatsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/correlations/field_stats',
  params: t.type({
    body: t.intersection([t.partial({
      serviceName: t.string,
      transactionName: t.string,
      transactionType: t.string
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.type({
      fieldsToSample: t.array(t.string)
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context
    } = resources;

    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(INVALID_LICENSE);
    }

    const {
      indices
    } = await (0, _setup_request.setupRequest)(resources);
    const esClient = resources.context.core.elasticsearch.client.asCurrentUser;
    const {
      fieldsToSample,
      ...params
    } = resources.params.body;
    return (0, _with_apm_span.withApmSpan)('get_correlations_field_stats', async () => await (0, _get_fields_stats.fetchFieldsStats)(esClient, { ...params,
      index: indices.transaction
    }, fieldsToSample));
  }
});
const fieldValuePairsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/correlations/field_value_pairs',
  params: t.type({
    body: t.intersection([t.partial({
      serviceName: t.string,
      transactionName: t.string,
      transactionType: t.string
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.type({
      fieldCandidates: t.array(t.string)
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context
    } = resources;

    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(INVALID_LICENSE);
    }

    const {
      indices
    } = await (0, _setup_request.setupRequest)(resources);
    const esClient = resources.context.core.elasticsearch.client.asCurrentUser;
    const {
      fieldCandidates,
      ...params
    } = resources.params.body;
    return (0, _with_apm_span.withApmSpan)('get_correlations_field_value_pairs', async () => await (0, _queries.fetchTransactionDurationFieldValuePairs)(esClient, { ...params,
      index: indices.transaction
    }, fieldCandidates));
  }
});
const significantCorrelationsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/correlations/significant_correlations',
  params: t.type({
    body: t.intersection([t.partial({
      serviceName: t.string,
      transactionName: t.string,
      transactionType: t.string
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.type({
      fieldValuePairs: t.array(t.type({
        fieldName: t.string,
        fieldValue: t.union([t.string, _to_number_rt.toNumberRt])
      }))
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context
    } = resources;

    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(INVALID_LICENSE);
    }

    const {
      indices
    } = await (0, _setup_request.setupRequest)(resources);
    const esClient = resources.context.core.elasticsearch.client.asCurrentUser;
    const {
      fieldValuePairs,
      ...params
    } = resources.params.body;
    const paramsWithIndex = { ...params,
      index: indices.transaction
    };
    return (0, _with_apm_span.withApmSpan)('get_significant_correlations', async () => await (0, _queries.fetchSignificantCorrelations)(esClient, paramsWithIndex, fieldValuePairs));
  }
});
const pValuesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/correlations/p_values',
  params: t.type({
    body: t.intersection([t.partial({
      serviceName: t.string,
      transactionName: t.string,
      transactionType: t.string
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.type({
      fieldCandidates: t.array(t.string)
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context
    } = resources;

    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(INVALID_LICENSE);
    }

    const {
      indices
    } = await (0, _setup_request.setupRequest)(resources);
    const esClient = resources.context.core.elasticsearch.client.asCurrentUser;
    const {
      fieldCandidates,
      ...params
    } = resources.params.body;
    const paramsWithIndex = { ...params,
      index: indices.transaction
    };
    return (0, _with_apm_span.withApmSpan)('get_p_values', async () => await (0, _queries.fetchPValues)(esClient, paramsWithIndex, fieldCandidates));
  }
});
const correlationsRouteRepository = (0, _create_apm_server_route_repository.createApmServerRouteRepository)().add(pValuesRoute).add(fieldCandidatesRoute).add(fieldStatsRoute).add(fieldValuePairsRoute).add(significantCorrelationsRoute);
exports.correlationsRouteRepository = correlationsRouteRepository;