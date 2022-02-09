"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildLastEventTimeQuery = void 0;

var _fp = require("lodash/fp");

var _search_strategy = require("../../../../../../common/search_strategy");

var _utility_types = require("../../../../../../common/utility_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildLastEventTimeQuery = ({
  indexKey,
  details,
  defaultIndex,
  docValueFields
}) => {
  const indicesToQuery = {
    hosts: defaultIndex,
    network: defaultIndex
  };

  const getHostDetailsFilter = hostName => [{
    term: {
      'host.name': hostName
    }
  }];

  const getIpDetailsFilter = ip => [{
    term: {
      'source.ip': ip
    }
  }, {
    term: {
      'destination.ip': ip
    }
  }];

  const getQuery = eventIndexKey => {
    switch (eventIndexKey) {
      case _search_strategy.LastEventIndexKey.ipDetails:
        if (details.ip) {
          return {
            allow_no_indices: true,
            index: indicesToQuery.network,
            ignore_unavailable: true,
            track_total_hits: false,
            body: { ...(!(0, _fp.isEmpty)(docValueFields) ? {
                docvalue_fields: docValueFields
              } : {}),
              query: {
                bool: {
                  filter: {
                    bool: {
                      should: getIpDetailsFilter(details.ip)
                    }
                  }
                }
              },
              _source: ['@timestamp'],
              size: 1,
              sort: [{
                '@timestamp': {
                  order: 'desc'
                }
              }]
            }
          };
        }

        throw new Error('buildLastEventTimeQuery - no IP argument provided');

      case _search_strategy.LastEventIndexKey.hostDetails:
        if (details.hostName) {
          return {
            allow_no_indices: true,
            index: indicesToQuery.hosts,
            ignore_unavailable: true,
            track_total_hits: false,
            body: { ...(!(0, _fp.isEmpty)(docValueFields) ? {
                docvalue_fields: docValueFields
              } : {}),
              query: {
                bool: {
                  filter: getHostDetailsFilter(details.hostName)
                }
              },
              _source: ['@timestamp'],
              size: 1,
              sort: [{
                '@timestamp': {
                  order: 'desc'
                }
              }]
            }
          };
        }

        throw new Error('buildLastEventTimeQuery - no hostName argument provided');

      case _search_strategy.LastEventIndexKey.hosts:
      case _search_strategy.LastEventIndexKey.network:
      case _search_strategy.LastEventIndexKey.ueba:
        return {
          allow_no_indices: true,
          index: indicesToQuery[indexKey],
          ignore_unavailable: true,
          track_total_hits: false,
          body: { ...(!(0, _fp.isEmpty)(docValueFields) ? {
              docvalue_fields: docValueFields
            } : {}),
            query: {
              match_all: {}
            },
            _source: ['@timestamp'],
            size: 1,
            sort: [{
              '@timestamp': {
                order: 'desc'
              }
            }]
          }
        };

      default:
        return (0, _utility_types.assertUnreachable)(eventIndexKey);
    }
  }; // TODO: Yes, TypeScript defeated me. Need to remove this type
  // cast, typing issue seemed to have slipped into codebase previously


  return getQuery(indexKey);
};

exports.buildLastEventTimeQuery = buildLastEventTimeQuery;