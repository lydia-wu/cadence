"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceErrorGroupMainStatistics = getServiceErrorGroupMainStatistics;

var _server = require("../../../../../observability/server");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _environment_query = require("../../../../common/utils/environment_query");

var _get_error_name = require("../../helpers/get_error_name");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceErrorGroupMainStatistics({
  kuery,
  serviceName,
  setup,
  transactionType,
  environment,
  start,
  end
}) {
  var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4;

  const {
    apmEventClient
  } = setup;
  const response = await apmEventClient.search('get_service_error_group_main_statistics', {
    apm: {
      events: [_processor_event.ProcessorEvent.error]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, {
            term: {
              [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
            }
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        error_groups: {
          terms: {
            field: _elasticsearch_fieldnames.ERROR_GROUP_ID,
            size: 500,
            order: {
              _count: 'desc'
            }
          },
          aggs: {
            sample: {
              top_hits: {
                size: 1,
                _source: [_elasticsearch_fieldnames.ERROR_LOG_MESSAGE, _elasticsearch_fieldnames.ERROR_EXC_MESSAGE, '@timestamp'],
                sort: {
                  '@timestamp': 'desc'
                }
              }
            }
          }
        }
      }
    }
  });
  const errorGroups = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.error_groups.buckets.map(bucket => {
    var _bucket$sample$hits$h;

    return {
      group_id: bucket.key,
      name: (0, _get_error_name.getErrorName)(bucket.sample.hits.hits[0]._source),
      lastSeen: new Date((_bucket$sample$hits$h = bucket.sample.hits.hits[0]) === null || _bucket$sample$hits$h === void 0 ? void 0 : _bucket$sample$hits$h._source['@timestamp']).getTime(),
      occurrences: bucket.doc_count
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
  return {
    is_aggregation_accurate: ((_response$aggregation3 = (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.error_groups.sum_other_doc_count) !== null && _response$aggregation3 !== void 0 ? _response$aggregation3 : 0) === 0,
    error_groups: errorGroups
  };
}