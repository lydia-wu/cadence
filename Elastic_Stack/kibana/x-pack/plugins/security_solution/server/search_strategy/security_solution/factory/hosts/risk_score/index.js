"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.riskScore = void 0;

var _build_query = require("../../../../../utils/build_query");

var _queryHosts_risk = require("./query.hosts_risk.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const riskScore = {
  buildDsl: options => (0, _queryHosts_risk.buildHostsRiskScoreQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryHosts_risk.buildHostsRiskScoreQuery)(options))]
    };
    return { ...response,
      inspect
    };
  }
};
exports.riskScore = riskScore;