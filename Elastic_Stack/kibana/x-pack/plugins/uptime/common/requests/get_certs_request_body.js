"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processCertsResult = exports.getCertsRequestBody = exports.DEFAULT_TO = exports.DEFAULT_SORT = exports.DEFAULT_SIZE = exports.DEFAULT_FROM = exports.DEFAULT_DIRECTION = void 0;

var _es_search = require("../utils/es_search");

var _as_mutable_array = require("../utils/as_mutable_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


var SortFields;

(function (SortFields) {
  SortFields["issuer"] = "tls.server.x509.issuer.common_name";
  SortFields["not_after"] = "tls.server.x509.not_after";
  SortFields["not_before"] = "tls.server.x509.not_before";
  SortFields["common_name"] = "tls.server.x509.subject.common_name";
})(SortFields || (SortFields = {}));

const DEFAULT_SORT = 'not_after';
exports.DEFAULT_SORT = DEFAULT_SORT;
const DEFAULT_DIRECTION = 'asc';
exports.DEFAULT_DIRECTION = DEFAULT_DIRECTION;
const DEFAULT_SIZE = 20;
exports.DEFAULT_SIZE = DEFAULT_SIZE;
const DEFAULT_FROM = 'now-5m';
exports.DEFAULT_FROM = DEFAULT_FROM;
const DEFAULT_TO = 'now';
exports.DEFAULT_TO = DEFAULT_TO;

const getCertsRequestBody = ({
  pageIndex,
  search,
  notValidBefore,
  notValidAfter,
  size = DEFAULT_SIZE,
  to = DEFAULT_TO,
  from = DEFAULT_FROM,
  sortBy = DEFAULT_SORT,
  direction = DEFAULT_DIRECTION
}) => {
  const sort = SortFields[sortBy];
  const searchRequest = (0, _es_search.createEsQuery)({
    body: {
      from: pageIndex * size,
      size,
      // @ts-expect-error direction is not a string, but a union of literals
      sort: (0, _as_mutable_array.asMutableArray)([{
        [sort]: {
          order: direction
        }
      }]),
      query: {
        bool: { ...(search ? {
            minimum_should_match: 1,
            should: [{
              multi_match: {
                query: escape(search),
                type: 'phrase_prefix',
                fields: ['monitor.id.text', 'monitor.name.text', 'url.full.text', 'tls.server.x509.subject.common_name.text', 'tls.server.x509.issuer.common_name.text']
              }
            }]
          } : {}),
          filter: [{
            exists: {
              field: 'tls.server.hash.sha256'
            }
          }, {
            range: {
              'monitor.timespan': {
                gte: from,
                lte: to
              }
            }
          }, {
            bool: {
              // these notValidBefore and notValidAfter should be inside should block, since
              // we want to match either of the condition, making ir an OR operation
              minimum_should_match: 1,
              should: [...(notValidBefore ? [{
                range: {
                  'tls.certificate_not_valid_before': {
                    lte: notValidBefore
                  }
                }
              }] : []), ...(notValidAfter ? [{
                range: {
                  'tls.certificate_not_valid_after': {
                    lte: notValidAfter
                  }
                }
              }] : [])]
            }
          }]
        }
      },
      _source: ['monitor.id', 'monitor.name', 'tls.server.x509.issuer.common_name', 'tls.server.x509.subject.common_name', 'tls.server.hash.sha1', 'tls.server.hash.sha256', 'tls.server.x509.not_after', 'tls.server.x509.not_before'],
      collapse: {
        field: 'tls.server.hash.sha256',
        inner_hits: {
          _source: {
            includes: ['monitor.id', 'monitor.name', 'url.full']
          },
          collapse: {
            field: 'monitor.id'
          },
          name: 'monitors',
          sort: [{
            'monitor.id': 'asc'
          }]
        }
      },
      aggs: {
        total: {
          cardinality: {
            field: 'tls.server.hash.sha256'
          }
        }
      }
    }
  });
  return searchRequest.body;
};

exports.getCertsRequestBody = getCertsRequestBody;

const processCertsResult = result => {
  var _result$hits, _result$hits$hits, _result$aggregations$, _result$aggregations, _result$aggregations$2;

  const certs = (_result$hits = result.hits) === null || _result$hits === void 0 ? void 0 : (_result$hits$hits = _result$hits.hits) === null || _result$hits$hits === void 0 ? void 0 : _result$hits$hits.map(hit => {
    var _ping$tls, _server$x, _server$x2, _server$x3, _server$x3$issuer, _server$x4, _server$x4$subject, _server$hash, _server$hash2;

    const ping = hit._source;
    const server = (_ping$tls = ping.tls) === null || _ping$tls === void 0 ? void 0 : _ping$tls.server;
    const notAfter = server === null || server === void 0 ? void 0 : (_server$x = server.x509) === null || _server$x === void 0 ? void 0 : _server$x.not_after;
    const notBefore = server === null || server === void 0 ? void 0 : (_server$x2 = server.x509) === null || _server$x2 === void 0 ? void 0 : _server$x2.not_before;
    const issuer = server === null || server === void 0 ? void 0 : (_server$x3 = server.x509) === null || _server$x3 === void 0 ? void 0 : (_server$x3$issuer = _server$x3.issuer) === null || _server$x3$issuer === void 0 ? void 0 : _server$x3$issuer.common_name;
    const commonName = server === null || server === void 0 ? void 0 : (_server$x4 = server.x509) === null || _server$x4 === void 0 ? void 0 : (_server$x4$subject = _server$x4.subject) === null || _server$x4$subject === void 0 ? void 0 : _server$x4$subject.common_name;
    const sha1 = server === null || server === void 0 ? void 0 : (_server$hash = server.hash) === null || _server$hash === void 0 ? void 0 : _server$hash.sha1;
    const sha256 = server === null || server === void 0 ? void 0 : (_server$hash2 = server.hash) === null || _server$hash2 === void 0 ? void 0 : _server$hash2.sha256;
    const monitors = hit.inner_hits.monitors.hits.hits.map(monitor => {
      var _monitorPing$url;

      const monitorPing = monitor._source;
      return {
        name: monitorPing === null || monitorPing === void 0 ? void 0 : monitorPing.monitor.name,
        id: monitorPing === null || monitorPing === void 0 ? void 0 : monitorPing.monitor.id,
        url: monitorPing === null || monitorPing === void 0 ? void 0 : (_monitorPing$url = monitorPing.url) === null || _monitorPing$url === void 0 ? void 0 : _monitorPing$url.full
      };
    });
    return {
      monitors,
      issuer,
      sha1,
      sha256: sha256,
      not_after: notAfter,
      not_before: notBefore,
      common_name: commonName
    };
  }); // @ts-expect-error aggregations is unknown

  const total = (_result$aggregations$ = (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : (_result$aggregations$2 = _result$aggregations.total) === null || _result$aggregations$2 === void 0 ? void 0 : _result$aggregations$2.value) !== null && _result$aggregations$ !== void 0 ? _result$aggregations$ : 0;
  return {
    certs,
    total
  };
};

exports.processCertsResult = processCertsResult;