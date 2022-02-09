"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventsQuery = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _serialized_query = require("../../../../utils/serialized_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Builds a query for retrieving events.
 */


class EventsQuery {
  constructor({
    pagination,
    indexPatterns,
    timeRange
  }) {
    (0, _defineProperty2.default)(this, "pagination", void 0);
    (0, _defineProperty2.default)(this, "indexPatterns", void 0);
    (0, _defineProperty2.default)(this, "timeRange", void 0);
    this.pagination = pagination;
    this.indexPatterns = indexPatterns;
    this.timeRange = timeRange;
  }

  query(filters) {
    return {
      query: {
        bool: {
          filter: [...filters, {
            range: {
              '@timestamp': {
                gte: this.timeRange.from,
                lte: this.timeRange.to,
                format: 'strict_date_optional_time'
              }
            }
          }, {
            term: {
              'event.kind': 'event'
            }
          }]
        }
      },
      ...this.pagination.buildQueryFields('event.id', 'desc')
    };
  }

  buildSearch(filters) {
    return {
      body: this.query(filters),
      index: this.indexPatterns
    };
  }

  static buildFilters(filter) {
    if (filter === undefined) {
      return [];
    }

    return [(0, _serialized_query.parseFilterQuery)(filter)];
  }
  /**
   * Searches ES for the specified events and format the response.
   *
   * @param client a client for searching ES
   * @param filter an optional string representation of a raw Elasticsearch clause for filtering the results
   */


  async search(client, filter) {
    const parsedFilters = EventsQuery.buildFilters(filter);
    const response = await client.asCurrentUser.search(this.buildSearch(parsedFilters)); // @ts-expect-error @elastic/elasticsearch _source is optional

    return response.body.hits.hits.map(hit => hit._source);
  }

}

exports.EventsQuery = EventsQuery;