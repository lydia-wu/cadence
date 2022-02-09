"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostsKpiAuthenticationsEntities = exports.hostsKpiAuthentications = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../../utils/build_query");

var _queryHosts_kpi_authentications = require("./query.hosts_kpi_authentications.dsl");

var _helpers = require("./helpers");

var _queryHosts_kpi_authentications_entities = require("./query.hosts_kpi_authentications_entities.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const hostsKpiAuthentications = {
  buildDsl: options => (0, _queryHosts_kpi_authentications.buildHostsKpiAuthenticationsQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryHosts_kpi_authentications.buildHostsKpiAuthenticationsQuery)(options))]
    };
    const authenticationsSuccessHistogram = (0, _fp.getOr)(null, 'aggregations.authentication_success_histogram.buckets', response.rawResponse);
    const authenticationsFailureHistogram = (0, _fp.getOr)(null, 'aggregations.authentication_failure_histogram.buckets', response.rawResponse);
    return { ...response,
      inspect,
      authenticationsSuccess: (0, _fp.getOr)(null, 'aggregations.authentication_success.doc_count', response.rawResponse),
      authenticationsSuccessHistogram: (0, _helpers.formatAuthenticationsHistogramData)(authenticationsSuccessHistogram),
      authenticationsFailure: (0, _fp.getOr)(null, 'aggregations.authentication_failure.doc_count', response.rawResponse),
      authenticationsFailureHistogram: (0, _helpers.formatAuthenticationsHistogramData)(authenticationsFailureHistogram)
    };
  }
};
exports.hostsKpiAuthentications = hostsKpiAuthentications;
const hostsKpiAuthenticationsEntities = {
  buildDsl: options => (0, _queryHosts_kpi_authentications_entities.buildHostsKpiAuthenticationsQueryEntities)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryHosts_kpi_authentications_entities.buildHostsKpiAuthenticationsQueryEntities)(options))]
    };
    const authenticationsSuccessHistogram = (0, _fp.getOr)(null, 'aggregations.authentication_success_histogram.buckets', response.rawResponse);
    const authenticationsFailureHistogram = (0, _fp.getOr)(null, 'aggregations.authentication_failure_histogram.buckets', response.rawResponse);
    return { ...response,
      inspect,
      authenticationsSuccess: (0, _fp.getOr)(null, 'aggregations.authentication_success.value', response.rawResponse),
      authenticationsSuccessHistogram: (0, _helpers.formatAuthenticationsHistogramDataEntities)(authenticationsSuccessHistogram),
      authenticationsFailure: (0, _fp.getOr)(null, 'aggregations.authentication_failure.value', response.rawResponse),
      authenticationsFailureHistogram: (0, _helpers.formatAuthenticationsHistogramDataEntities)(authenticationsFailureHistogram)
    };
  }
};
exports.hostsKpiAuthenticationsEntities = hostsKpiAuthenticationsEntities;