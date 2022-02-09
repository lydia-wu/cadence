"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildHostRulesQuery = void 0;

var _fp = require("lodash/fp");

var _search_strategy = require("../../../../../../common/search_strategy");

var _build_query = require("../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildHostRulesQuery = ({
  defaultIndex,
  docValueFields,
  filterQuery,
  hostName,
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
    // can stop getting this from sourcerer and assume default detections index if we want
    ignore_unavailable: true,
    track_total_hits: true,
    body: { ...(!(0, _fp.isEmpty)(docValueFields) ? {
        docvalue_fields: docValueFields
      } : {}),
      aggs: {
        risk_score: {
          sum: {
            field: 'signal.rule.risk_score'
          }
        },
        rule_name: {
          terms: {
            field: 'signal.rule.name',
            order: {
              risk_score: _search_strategy.Direction.desc
            }
          },
          aggs: {
            risk_score: {
              sum: {
                field: 'signal.rule.risk_score'
              }
            },
            rule_type: {
              terms: {
                field: 'signal.rule.type'
              }
            }
          }
        },
        rule_count: {
          cardinality: {
            field: 'signal.rule.name'
          }
        }
      },
      query: {
        bool: {
          filter,
          must: [{
            term: {
              'host.name': hostName
            }
          }]
        }
      },
      size: 0
    }
  };
};

exports.buildHostRulesQuery = buildHostRulesQuery;