"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOppositeField = exports.buildTopCountriesQueryEntities = void 0;

var _build_query = require("../../../../../utils/build_query");

var _utility_types = require("../../../../../../common/utility_types");

var _search_strategy = require("../../../../../../common/search_strategy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO: This is the same as the other one, so move this into helpers.


const getCountAgg = flowTarget => ({
  top_countries_count: {
    cardinality: {
      field: `${flowTarget}.geo.country_iso_code`
    }
  }
});

const buildTopCountriesQueryEntities = ({
  defaultIndex,
  filterQuery,
  flowTarget,
  sort,
  pagination: {
    querySize
  },
  timerange: {
    from,
    to
  },
  ip
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
  const dslQuery = {
    allow_no_indices: true,
    index: defaultIndex,
    ignore_unavailable: true,
    body: {
      aggregations: { ...getCountAgg(flowTarget),
        ...getFlowTargetAggs(sort, flowTarget, querySize)
      },
      query: {
        bool: ip ? {
          filter,
          should: [{
            term: {
              [`${getOppositeField(flowTarget)}.ip`]: ip
            }
          }],
          minimum_should_match: 1
        } : {
          filter
        }
      }
    },
    size: 0,
    track_total_hits: false
  };
  return dslQuery;
};

exports.buildTopCountriesQueryEntities = buildTopCountriesQueryEntities;

const getFlowTargetAggs = (sort, flowTarget, querySize) => ({
  [flowTarget]: {
    terms: {
      field: `${flowTarget}.geo.country_iso_code`,
      size: querySize,
      order: { ...getQueryOrder(sort)
      }
    },
    aggs: {
      bytes_in: {
        sum: {
          field: `metrics.${getOppositeField(flowTarget)}.bytes.sum`
        }
      },
      bytes_out: {
        sum: {
          field: `metrics.${flowTarget}.bytes.sum`
        }
      },
      flows: {
        // TODO: Should we use max here and/or do a hybrid with a max here for performance?
        avg: {
          field: 'metrics.network.community_id.cardinality'
        }
      },
      source_ips: {
        avg: {
          field: 'metrics.source.ip.cardinality'
        }
      },
      destination_ips: {
        avg: {
          field: 'metrics.destination.ip.cardinality'
        }
      }
    }
  }
}); // TODO: This is the same as the other one, so move this to helpers and use it from there.


const getOppositeField = flowTarget => {
  switch (flowTarget) {
    case _search_strategy.FlowTargetSourceDest.source:
      return _search_strategy.FlowTargetSourceDest.destination;

    case _search_strategy.FlowTargetSourceDest.destination:
      return _search_strategy.FlowTargetSourceDest.source;
  }

  (0, _utility_types.assertUnreachable)(flowTarget);
}; // TODO: This is the same as the other one, so move this to helpers and use it from there.


exports.getOppositeField = getOppositeField; // TODO: This is the same as the other one, so move this to helpers and use it from there.

const getQueryOrder = networkTopCountriesSortField => {
  switch (networkTopCountriesSortField.field) {
    case _search_strategy.NetworkTopTablesFields.bytes_in:
      return {
        bytes_in: networkTopCountriesSortField.direction
      };

    case _search_strategy.NetworkTopTablesFields.bytes_out:
      return {
        bytes_out: networkTopCountriesSortField.direction
      };

    case _search_strategy.NetworkTopTablesFields.flows:
      return {
        flows: networkTopCountriesSortField.direction
      };

    case _search_strategy.NetworkTopTablesFields.destination_ips:
      return {
        destination_ips: networkTopCountriesSortField.direction
      };

    case _search_strategy.NetworkTopTablesFields.source_ips:
      return {
        source_ips: networkTopCountriesSortField.direction
      };
  }

  (0, _utility_types.assertUnreachable)(networkTopCountriesSortField.field);
};