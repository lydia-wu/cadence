"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildHostTacticsQuery = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildHostTacticsQuery = ({
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
        tactic: {
          terms: {
            field: 'signal.rule.threat.tactic.name'
          },
          aggs: {
            technique: {
              terms: {
                field: 'signal.rule.threat.technique.name'
              },
              aggs: {
                risk_score: {
                  sum: {
                    field: 'signal.rule.risk_score'
                  }
                }
              }
            }
          }
        },
        tactic_count: {
          cardinality: {
            field: 'signal.rule.threat.tactic.name'
          }
        },
        technique_count: {
          cardinality: {
            field: 'signal.rule.threat.technique.name'
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

exports.buildHostTacticsQuery = buildHostTacticsQuery;