"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostTactics = void 0;

var _fp = require("lodash/fp");

var _constants = require("../../../../../../common/constants");

var _queryHost_tactics = require("./query.host_tactics.dsl");

var _helpers = require("./helpers");

var _build_query = require("../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const hostTactics = {
  buildDsl: options => {
    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }

    return (0, _queryHost_tactics.buildHostTacticsQuery)(options);
  },
  parse: async (options, response) => {
    const {
      activePage,
      cursorStart,
      fakePossibleCount,
      querySize
    } = options.pagination;
    const totalCount = (0, _fp.getOr)(0, 'aggregations.tactic_count.value', response.rawResponse);
    const techniqueCount = (0, _fp.getOr)(0, 'aggregations.technique_count.value', response.rawResponse);
    const fakeTotalCount = fakePossibleCount <= totalCount ? fakePossibleCount : totalCount;
    const hostTacticsEdges = (0, _helpers.formatHostTacticsData)((0, _fp.getOr)([], 'aggregations.tactic.buckets', response.rawResponse));
    const edges = hostTacticsEdges.splice(cursorStart, querySize - cursorStart);
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryHost_tactics.buildHostTacticsQuery)(options))]
    };
    const showMorePagesIndicator = totalCount > fakeTotalCount;
    return { ...response,
      inspect,
      edges,
      techniqueCount,
      totalCount,
      pageInfo: {
        activePage: activePage !== null && activePage !== void 0 ? activePage : 0,
        fakeTotalCount,
        showMorePagesIndicator
      }
    };
  }
};
exports.hostTactics = hostTactics;