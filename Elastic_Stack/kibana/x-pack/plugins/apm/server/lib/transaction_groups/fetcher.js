"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topTransactionGroupsFetcher = topTransactionGroupsFetcher;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _server = require("../../../../observability/server");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _as_mutable_array = require("../../../common/utils/as_mutable_array");

var _environment_query = require("../../../common/utils/environment_query");

var _join_by_key = require("../../../common/utils/join_by_key");

var _with_apm_span = require("../../utils/with_apm_span");

var _aggregated_transactions = require("../helpers/aggregated_transactions");

var _get_transaction_group_stats = require("./get_transaction_group_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getRequest(topTraceOptions) {
  const {
    searchAggregatedTransactions,
    environment,
    kuery,
    transactionName,
    start,
    end
  } = topTraceOptions;
  const transactionNameFilter = transactionName ? [{
    term: {
      [_elasticsearch_fieldnames.TRANSACTION_NAME]: transactionName
    }
  }] : [];
  return {
    apm: {
      events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...transactionNameFilter, ...(0, _aggregated_transactions.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(searchAggregatedTransactions ? [{
            term: {
              [_elasticsearch_fieldnames.TRANSACTION_ROOT]: true
            }
          }] : [])],
          must_not: [...(!searchAggregatedTransactions ? [{
            exists: {
              field: _elasticsearch_fieldnames.PARENT_ID
            }
          }] : [])]
        }
      },
      aggs: {
        transaction_groups: {
          composite: {
            sources: (0, _as_mutable_array.asMutableArray)([{
              [_elasticsearch_fieldnames.SERVICE_NAME]: {
                terms: {
                  field: _elasticsearch_fieldnames.SERVICE_NAME
                }
              }
            }, {
              [_elasticsearch_fieldnames.TRANSACTION_NAME]: {
                terms: {
                  field: _elasticsearch_fieldnames.TRANSACTION_NAME
                }
              }
            }]),
            // traces overview is hardcoded to 10000
            size: 10000
          }
        }
      }
    }
  };
}

function getItemsWithRelativeImpact(setup, items, start, end) {
  const values = items.map(({
    sum
  }) => sum).filter(value => value !== null);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const duration = _moment.default.duration(end - start);

  const minutes = duration.asMinutes();
  const itemsWithRelativeImpact = items.map(item => {
    var _item$count;

    return {
      key: item.key,
      averageResponseTime: item.avg,
      transactionsPerMinute: ((_item$count = item.count) !== null && _item$count !== void 0 ? _item$count : 0) / minutes,
      transactionType: item.transactionType || '',
      impact: item.sum !== null && item.sum !== undefined ? (item.sum - min) / (max - min) * 100 || 0 : 0
    };
  });
  return itemsWithRelativeImpact;
}

function topTransactionGroupsFetcher(topTraceOptions, setup) {
  return (0, _with_apm_span.withApmSpan)('get_top_traces', async () => {
    const request = getRequest(topTraceOptions);
    const params = {
      request,
      setup,
      searchAggregatedTransactions: topTraceOptions.searchAggregatedTransactions
    };
    const [counts, averages, sums] = await Promise.all([(0, _get_transaction_group_stats.getCounts)(params), (0, _get_transaction_group_stats.getAverages)(params), (0, _get_transaction_group_stats.getSums)(params)]);
    const stats = [...averages, ...counts, ...sums];
    const items = (0, _join_by_key.joinByKey)(stats, 'key');
    const {
      start,
      end
    } = topTraceOptions;
    const itemsWithRelativeImpact = getItemsWithRelativeImpact(setup, items, start, end);
    const itemsWithKeys = itemsWithRelativeImpact.map(item => ({ ...item,
      transactionName: item.key[_elasticsearch_fieldnames.TRANSACTION_NAME],
      serviceName: item.key[_elasticsearch_fieldnames.SERVICE_NAME]
    }));
    return {
      // sort by impact by default so most impactful services are not cut off
      items: (0, _lodash.sortBy)(itemsWithKeys, 'impact').reverse()
    };
  });
}