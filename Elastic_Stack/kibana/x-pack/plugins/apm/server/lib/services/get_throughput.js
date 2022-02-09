"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThroughput = getThroughput;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _server = require("../../../../observability/server");

var _environment_query = require("../../../common/utils/environment_query");

var _aggregated_transactions = require("../helpers/aggregated_transactions");

var _calculate_throughput = require("../helpers/calculate_throughput");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getThroughput({
  environment,
  kuery,
  searchAggregatedTransactions,
  serviceName,
  setup,
  transactionType,
  transactionName,
  start,
  end,
  intervalString,
  bucketSize
}) {
  var _response$aggregation, _response$aggregation2;

  const {
    apmEventClient
  } = setup;
  const filter = [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
    }
  }, {
    term: {
      [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
    }
  }, ...(0, _aggregated_transactions.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)];

  if (transactionName) {
    filter.push({
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_NAME]: transactionName
      }
    });
  }

  const params = {
    apm: {
      events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter
        }
      },
      aggs: {
        timeseries: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: intervalString,
            min_doc_count: 0,
            extended_bounds: {
              min: start,
              max: end
            }
          }
        }
      }
    }
  };
  const response = await apmEventClient.search('get_throughput_for_service', params);
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.timeseries.buckets.map(bucket => {
    return {
      x: bucket.key,
      y: (0, _calculate_throughput.calculateThroughputWithInterval)({
        bucketSize,
        value: bucket.doc_count
      })
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
}