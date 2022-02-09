"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anomalyDetectionRouteRepository = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _common = require("../../../../observability/common");

var _license_check = require("../../../common/license_check");

var _anomaly_detection = require("../../../common/anomaly_detection");

var _create_apm_server_route = require("../create_apm_server_route");

var _get_anomaly_detection_jobs = require("../../lib/anomaly_detection/get_anomaly_detection_jobs");

var _create_anomaly_detection_jobs = require("../../lib/anomaly_detection/create_anomaly_detection_jobs");

var _setup_request = require("../../lib/helpers/setup_request");

var _get_all_environments = require("../../lib/environments/get_all_environments");

var _has_legacy_jobs = require("../../lib/anomaly_detection/has_legacy_jobs");

var _aggregated_transactions = require("../../lib/helpers/aggregated_transactions");

var _feature = require("../../feature");

var _with_apm_span = require("../../utils/with_apm_span");

var _create_apm_server_route_repository = require("../create_apm_server_route_repository");

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
// get ML anomaly detection jobs for each environment


const anomalyDetectionJobsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/settings/anomaly-detection/jobs',
  options: {
    tags: ['access:apm', 'access:ml:canGetJobs']
  },
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      context,
      logger
    } = resources;

    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_anomaly_detection.ML_ERRORS.INVALID_LICENSE);
    }

    const [jobs, legacyJobs] = await (0, _with_apm_span.withApmSpan)('get_available_ml_jobs', () => Promise.all([(0, _get_anomaly_detection_jobs.getAnomalyDetectionJobs)(setup, logger), (0, _has_legacy_jobs.hasLegacyJobs)(setup)]));
    return {
      jobs,
      hasLegacyJobs: legacyJobs
    };
  }
}); // create new ML anomaly detection jobs for each given environment

const createAnomalyDetectionJobsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/settings/anomaly-detection/jobs',
  options: {
    tags: ['access:apm', 'access:apm_write', 'access:ml:canCreateJob']
  },
  params: t.type({
    body: t.type({
      environments: t.array(t.string)
    })
  }),
  handler: async resources => {
    const {
      params,
      context,
      logger
    } = resources;
    const {
      environments
    } = params.body;
    const setup = await (0, _setup_request.setupRequest)(resources);

    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_anomaly_detection.ML_ERRORS.INVALID_LICENSE);
    }

    await (0, _create_anomaly_detection_jobs.createAnomalyDetectionJobs)(setup, environments, logger);
    (0, _feature.notifyFeatureUsage)({
      licensingPlugin: context.licensing,
      featureName: 'ml'
    });
    return {
      jobCreated: true
    };
  }
}); // get all available environments to create anomaly detection jobs for

const anomalyDetectionEnvironmentsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/settings/anomaly-detection/environments',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)({
      apmEventClient: setup.apmEventClient,
      config: setup.config,
      kuery: ''
    });
    const size = await resources.context.core.uiSettings.client.get(_common.maxSuggestions);
    const environments = await (0, _get_all_environments.getAllEnvironments)({
      includeMissing: true,
      searchAggregatedTransactions,
      setup,
      size
    });
    return {
      environments
    };
  }
});
const anomalyDetectionRouteRepository = (0, _create_apm_server_route_repository.createApmServerRouteRepository)().add(anomalyDetectionJobsRoute).add(createAnomalyDetectionJobsRoute).add(anomalyDetectionEnvironmentsRoute);
exports.anomalyDetectionRouteRepository = anomalyDetectionRouteRepository;