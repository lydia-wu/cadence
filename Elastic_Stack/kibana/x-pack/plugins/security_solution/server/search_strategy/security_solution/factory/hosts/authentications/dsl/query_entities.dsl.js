"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildQueryEntities = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildQueryEntities = ({
  filterQuery,
  timerange: {
    from,
    to
  },
  pagination: {
    querySize
  },
  defaultIndex,
  docValueFields
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    range: {
      '@timestamp': {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];
  const agg = {
    user_count: {
      cardinality: {
        field: 'user.name'
      }
    }
  };
  const dslQuery = {
    allow_no_indices: true,
    index: defaultIndex,
    ignore_unavailable: true,
    body: { ...(!(0, _fp.isEmpty)(docValueFields) ? {
        docvalue_fields: docValueFields
      } : {}),
      aggregations: { ...agg,
        group_by_users: {
          terms: {
            size: querySize,
            field: 'user.name',
            order: [{
              successes: 'desc'
            }, {
              failures: 'desc'
            }]
          },
          aggs: {
            failures: {
              sum: {
                field: 'metrics.event.authentication.failure.value_count'
              }
            },
            successes: {
              sum: {
                field: 'metrics.event.authentication.success.value_count'
              }
            }
          }
        }
      },
      query: {
        bool: {
          filter
        }
      },
      size: 0
    },
    track_total_hits: false
  };
  return dslQuery;
};

exports.buildQueryEntities = buildQueryEntities;