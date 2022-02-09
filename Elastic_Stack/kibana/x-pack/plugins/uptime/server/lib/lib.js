"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUptimeESClient = createUptimeESClient;
exports.debugESCall = debugESCall;
exports.inspectableEsQueriesMap = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _saved_objects = require("./saved_objects");

var _inspector = require("../../../../../src/plugins/inspector");

var _server = require("../../../observability/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const inspectableEsQueriesMap = new WeakMap();
exports.inspectableEsQueriesMap = inspectableEsQueriesMap;

function createUptimeESClient({
  esClient,
  request,
  savedObjectsClient
}) {
  return {
    baseESClient: esClient,

    async search(params, operationName) {
      let res;
      let esError;
      const dynamicSettings = await _saved_objects.savedObjectsAdapter.getUptimeDynamicSettings(savedObjectsClient);
      const esParams = {
        index: dynamicSettings.heartbeatIndices,
        ...params
      };
      const startTime = process.hrtime();
      const startTimeNow = Date.now();
      let esRequestStatus = _inspector.RequestStatus.PENDING;

      try {
        res = await esClient.search(esParams);
        esRequestStatus = _inspector.RequestStatus.OK;
      } catch (e) {
        esError = e;
        esRequestStatus = _inspector.RequestStatus.ERROR;
      }

      const inspectableEsQueries = inspectableEsQueriesMap.get(request);

      if (inspectableEsQueries) {
        inspectableEsQueries.push((0, _server.getInspectResponse)({
          esError,
          esRequestParams: esParams,
          esRequestStatus,
          esResponse: res.body,
          kibanaRequest: request,
          operationName: operationName !== null && operationName !== void 0 ? operationName : '',
          startTime: startTimeNow
        }));

        if (request) {
          debugESCall({
            startTime,
            request,
            esError,
            operationName: 'search',
            params: esParams
          });
        }
      }

      if (esError) {
        throw esError;
      }

      return res;
    },

    async count(params) {
      let res;
      let esError;
      const dynamicSettings = await _saved_objects.savedObjectsAdapter.getUptimeDynamicSettings(savedObjectsClient);
      const esParams = {
        index: dynamicSettings.heartbeatIndices,
        ...params
      };
      const startTime = process.hrtime();

      try {
        res = await esClient.count(esParams);
      } catch (e) {
        esError = e;
      }

      const inspectableEsQueries = inspectableEsQueriesMap.get(request);

      if (inspectableEsQueries && request) {
        debugESCall({
          startTime,
          request,
          esError,
          operationName: 'count',
          params: esParams
        });
      }

      if (esError) {
        throw esError;
      }

      return {
        result: res,
        indices: dynamicSettings.heartbeatIndices
      };
    },

    getSavedObjectsClient() {
      return savedObjectsClient;
    }

  };
}
/* eslint-disable no-console */


function formatObj(obj) {
  return JSON.stringify(obj);
}

function debugESCall({
  operationName,
  params,
  request,
  esError,
  startTime
}) {
  const highlightColor = esError ? 'bgRed' : 'inverse';
  const diff = process.hrtime(startTime);
  const duration = `${Math.round(diff[0] * 1000 + diff[1] / 1e6)}ms`;
  const routeInfo = `${request.route.method.toUpperCase()} ${request.route.path}`;
  console.log(_chalk.default.bold[highlightColor](`=== Debug: ${routeInfo} (${duration}) ===`));

  if (operationName === 'search') {
    console.log(`GET ${params.index}/_${operationName}`);
    console.log(formatObj(params.body));
  } else {
    console.log(_chalk.default.bold('ES operation:'), operationName);
    console.log(_chalk.default.bold('ES query:'));
    console.log(formatObj(params));
  }

  console.log(`\n`);
}