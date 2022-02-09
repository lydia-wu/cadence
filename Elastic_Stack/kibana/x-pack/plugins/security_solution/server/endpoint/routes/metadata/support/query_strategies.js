"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryResponseToHostResult = exports.queryResponseToHostListResult = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// remove the top-level 'HostDetails' property if found, from previous schemas

function stripHostDetails(host) {
  return 'HostDetails' in host ? host.HostDetails : host;
}

const queryResponseToHostResult = searchResponse => {
  const response = searchResponse;
  return {
    resultLength: response.hits.hits.length,
    result: response.hits.hits.length > 0 ? stripHostDetails(response.hits.hits[0]._source) : undefined
  };
};

exports.queryResponseToHostResult = queryResponseToHostResult;

const queryResponseToHostListResult = searchResponse => {
  var _response$hits;

  const response = searchResponse;
  const list = response.hits.hits.length > 0 ? response.hits.hits.map(entry => stripHostDetails(entry === null || entry === void 0 ? void 0 : entry._source)) : [];
  return {
    resultLength: ((_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.total).value || 0,
    resultList: list
  };
};

exports.queryResponseToHostListResult = queryResponseToHostListResult;