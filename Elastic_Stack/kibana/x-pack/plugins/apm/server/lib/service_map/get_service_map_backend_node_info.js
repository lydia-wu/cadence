"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceMapBackendNodeInfo = getServiceMapBackendNodeInfo;

var _server = require("../../../../observability/server");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _event_outcome = require("../../../common/event_outcome");

var _processor_event = require("../../../common/processor_event");

var _environment_query = require("../../../common/utils/environment_query");

var _with_apm_span = require("../../utils/with_apm_span");

var _calculate_throughput = require("../helpers/calculate_throughput");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServiceMapBackendNodeInfo({
  environment,
  backendName,
  setup,
  start,
  end
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_map_backend_node_stats', async () => {
    var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4, _response$aggregation5, _response$aggregation6, _response$aggregation7;

    const {
      apmEventClient
    } = setup;
    const response = await apmEventClient.search('get_service_map_backend_node_stats', {
      apm: {
        events: [_processor_event.ProcessorEvent.metric]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]: backendName
              }
            }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment)]
          }
        },
        aggs: {
          latency_sum: {
            sum: {
              field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_SUM
            }
          },
          count: {
            sum: {
              field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT
            }
          },
          [_elasticsearch_fieldnames.EVENT_OUTCOME]: {
            terms: {
              field: _elasticsearch_fieldnames.EVENT_OUTCOME,
              include: [_event_outcome.EventOutcome.failure]
            }
          }
        }
      }
    });
    const count = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.count.value) !== null && _response$aggregation !== void 0 ? _response$aggregation : 0;
    const errorCount = (_response$aggregation3 = (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : (_response$aggregation5 = _response$aggregation4[_elasticsearch_fieldnames.EVENT_OUTCOME].buckets[0]) === null || _response$aggregation5 === void 0 ? void 0 : _response$aggregation5.doc_count) !== null && _response$aggregation3 !== void 0 ? _response$aggregation3 : 0;
    const latencySum = (_response$aggregation6 = (_response$aggregation7 = response.aggregations) === null || _response$aggregation7 === void 0 ? void 0 : _response$aggregation7.latency_sum.value) !== null && _response$aggregation6 !== void 0 ? _response$aggregation6 : 0;
    const avgErrorRate = errorCount / count;
    const avgTransactionDuration = latencySum / count;
    const avgRequestsPerMinute = (0, _calculate_throughput.calculateThroughput)({
      start,
      end,
      value: count
    });

    if (count === 0) {
      return {
        avgErrorRate: null,
        transactionStats: {
          avgRequestsPerMinute: null,
          avgTransactionDuration: null
        }
      };
    }

    return {
      avgErrorRate,
      transactionStats: {
        avgRequestsPerMinute,
        avgTransactionDuration
      }
    };
  });
}