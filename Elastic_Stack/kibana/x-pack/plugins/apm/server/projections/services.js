"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServicesProjection = getServicesProjection;

var _elasticsearch_fieldnames = require("../../common/elasticsearch_fieldnames");

var _server = require("../../../observability/server");

var _processor_event = require("../../common/processor_event");

var _aggregated_transactions = require("../lib/helpers/aggregated_transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServicesProjection({
  kuery,
  setup,
  searchAggregatedTransactions,
  start,
  end
}) {
  return {
    apm: {
      events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions), _processor_event.ProcessorEvent.metric, _processor_event.ProcessorEvent.error]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...(0, _server.rangeQuery)(start, end), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        services: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_NAME
          }
        }
      }
    }
  };
}