"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildHostsRiskScoreQuery = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildHostsRiskScoreQuery = ({
  timerange,
  hostName,
  defaultIndex
}) => {
  const filter = [];

  if (timerange) {
    filter.push({
      range: {
        '@timestamp': {
          gte: timerange.from,
          lte: timerange.to,
          format: 'strict_date_optional_time'
        }
      }
    });
  }

  if (hostName) {
    filter.push({
      term: {
        'host.name': hostName
      }
    });
  }

  const dslQuery = {
    index: defaultIndex,
    allow_no_indices: false,
    ignore_unavailable: true,
    track_total_hits: false,
    body: {
      query: {
        bool: {
          filter
        }
      }
    }
  };
  return dslQuery;
};

exports.buildHostsRiskScoreQuery = buildHostsRiskScoreQuery;