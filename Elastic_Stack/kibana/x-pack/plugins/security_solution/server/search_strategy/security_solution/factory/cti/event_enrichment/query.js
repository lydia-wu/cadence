"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildEventEnrichmentQuery = void 0;

var _lodash = require("lodash");

var _build_query = require("../../../../../utils/build_query");

var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildEventEnrichmentQuery = ({
  defaultIndex,
  docValueFields,
  eventFields,
  filterQuery,
  timerange: {
    from,
    to
  }
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    term: {
      'event.type': 'indicator'
    }
  }, {
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
    ignore_unavailable: true,
    index: defaultIndex,
    body: {
      _source: false,
      ...(!(0, _lodash.isEmpty)(docValueFields) && {
        docvalue_fields: docValueFields
      }),
      fields: ['*'],
      query: {
        bool: {
          should: (0, _helpers.buildIndicatorShouldClauses)(eventFields),
          filter,
          minimum_should_match: 1
        }
      }
    }
  };
};

exports.buildEventEnrichmentQuery = buildEventEnrichmentQuery;