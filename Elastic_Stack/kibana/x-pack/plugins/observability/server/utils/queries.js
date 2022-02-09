"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kqlQuery = kqlQuery;
exports.rangeQuery = rangeQuery;

var _esQuery = require("@kbn/es-query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function rangeQuery(start, end, field = '@timestamp') {
  return [{
    range: {
      [field]: {
        gte: start,
        lte: end,
        format: 'epoch_millis'
      }
    }
  }];
}

function kqlQuery(kql) {
  if (!kql) {
    return [];
  }

  const ast = (0, _esQuery.fromKueryExpression)(kql);
  return [(0, _esQuery.toElasticsearchQuery)(ast)];
}