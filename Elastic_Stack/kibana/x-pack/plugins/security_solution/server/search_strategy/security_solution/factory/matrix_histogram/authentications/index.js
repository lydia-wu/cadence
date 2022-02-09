"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticationsMatrixHistogramEntitiesConfig = exports.authenticationsMatrixHistogramConfig = void 0;

var _common = require("../../../../../../common");

var _helpers = require("../helpers");

var _queryAuthentications_histogram = require("./query.authentications_histogram.dsl");

var _queryAuthentications_histogram_entities = require("./query.authentications_histogram_entities.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const authenticationsMatrixHistogramConfig = {
  buildDsl: _queryAuthentications_histogram.buildAuthenticationsHistogramQuery,
  aggName: _common.MatrixHistogramTypeToAggName.authentications,
  parseKey: 'events.buckets'
};
exports.authenticationsMatrixHistogramConfig = authenticationsMatrixHistogramConfig;
const authenticationsMatrixHistogramEntitiesConfig = {
  buildDsl: _queryAuthentications_histogram_entities.buildAuthenticationsHistogramQueryEntities,
  aggName: _common.MatrixHistogramTypeToAggName.authenticationsEntities,
  parseKey: 'events.buckets',
  parser: _helpers.getEntitiesParser
};
exports.authenticationsMatrixHistogramEntitiesConfig = authenticationsMatrixHistogramEntitiesConfig;