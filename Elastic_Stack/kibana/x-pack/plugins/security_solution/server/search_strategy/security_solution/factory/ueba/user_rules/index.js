"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRules = void 0;

var _fp = require("lodash/fp");

var _common = require("../../../../../../common");

var _constants = require("../../../../../../common/constants");

var _queryUser_rules = require("./query.user_rules.dsl");

var _helpers = require("./helpers");

var _build_query = require("../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const userRules = {
  buildDsl: options => {
    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }

    return (0, _queryUser_rules.buildUserRulesQuery)(options);
  },
  parse: async (options, response) => {
    const {
      activePage,
      cursorStart,
      fakePossibleCount,
      querySize
    } = options.pagination;
    const userRulesByUser = (0, _helpers.formatUserRulesData)((0, _fp.getOr)([], 'aggregations.user_data.buckets', response.rawResponse));
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryUser_rules.buildUserRulesQuery)(options))]
    };
    return { ...response,
      inspect,
      data: userRulesByUser.map(user => {
        const edges = user[_common.UserRulesFields.rules].splice(cursorStart, querySize - cursorStart);

        const totalCount = user[_common.UserRulesFields.ruleCount];
        const fakeTotalCount = fakePossibleCount <= totalCount ? fakePossibleCount : totalCount;
        const showMorePagesIndicator = totalCount > fakeTotalCount;
        return {
          [_common.UserRulesFields.userName]: user[_common.UserRulesFields.userName],
          [_common.UserRulesFields.riskScore]: user[_common.UserRulesFields.riskScore],
          edges,
          totalCount,
          pageInfo: {
            activePage: activePage !== null && activePage !== void 0 ? activePage : 0,
            fakeTotalCount,
            showMorePagesIndicator
          }
        };
      })
    };
  }
};
exports.userRules = userRules;