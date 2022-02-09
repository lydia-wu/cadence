"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRiskScoreQuery = void 0;

var _fp = require("lodash/fp");

var _search_strategy = require("../../../../../../common/search_strategy");

var _build_query = require("../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildRiskScoreQuery = ({
  defaultIndex,
  docValueFields,
  filterQuery,
  pagination: {
    querySize
  },
  sort,
  timerange: {
    from,
    to
  }
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
  return {
    allow_no_indices: true,
    index: defaultIndex,
    ignore_unavailable: true,
    track_total_hits: true,
    body: { ...(!(0, _fp.isEmpty)(docValueFields) ? {
        docvalue_fields: docValueFields
      } : {}),
      aggregations: {
        host_data: {
          terms: {
            field: 'host.name',
            order: {
              risk_score: _search_strategy.Direction.desc
            }
          },
          aggs: {
            risk_score: {
              sum: {
                field: 'risk_score'
              }
            },
            risk_keyword: {
              terms: {
                field: 'risk.keyword'
              }
            }
          }
        },
        host_count: {
          cardinality: {
            field: 'host.name'
          }
        }
      },
      query: {
        bool: {
          filter
        }
      },
      size: 0
    }
  };
};

exports.buildRiskScoreQuery = buildRiskScoreQuery;