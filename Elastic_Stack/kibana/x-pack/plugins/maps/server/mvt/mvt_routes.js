"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMVTRoutes = initMVTRoutes;

var _risonNode = _interopRequireDefault(require("rison-node"));

var _configSchema = require("@kbn/config-schema");

var _cjsPonyfill = require("abortcontroller-polyfill/dist/cjs-ponyfill");

var _constants = require("../../common/constants");

var _get_tile = require("./get_tile");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore not typed


const CACHE_TIMEOUT_SECONDS = 60 * 60;

function initMVTRoutes({
  router,
  logger
}) {
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.MVT_GETTILE_API_PATH}/{z}/{x}/{y}.pbf`,
    validate: {
      params: _configSchema.schema.object({
        x: _configSchema.schema.number(),
        y: _configSchema.schema.number(),
        z: _configSchema.schema.number()
      }),
      query: _configSchema.schema.object({
        geometryFieldName: _configSchema.schema.string(),
        requestBody: _configSchema.schema.string(),
        index: _configSchema.schema.string(),
        geoFieldType: _configSchema.schema.string(),
        searchSessionId: _configSchema.schema.maybe(_configSchema.schema.string()),
        token: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    const {
      query,
      params
    } = request;
    const abortController = new _cjsPonyfill.AbortController();
    request.events.aborted$.subscribe(() => {
      abortController.abort();
    });

    const requestBodyDSL = _risonNode.default.decode(query.requestBody);

    const tile = await (0, _get_tile.getTile)({
      logger,
      context,
      geometryFieldName: query.geometryFieldName,
      x: parseInt(params.x, 10),
      y: parseInt(params.y, 10),
      z: parseInt(params.z, 10),
      index: query.index,
      requestBody: requestBodyDSL,
      geoFieldType: query.geoFieldType,
      searchSessionId: query.searchSessionId,
      abortSignal: abortController.signal
    });
    return sendResponse(response, tile);
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.MVT_GETGRIDTILE_API_PATH}/{z}/{x}/{y}.pbf`,
    validate: {
      params: _configSchema.schema.object({
        x: _configSchema.schema.number(),
        y: _configSchema.schema.number(),
        z: _configSchema.schema.number()
      }),
      query: _configSchema.schema.object({
        geometryFieldName: _configSchema.schema.string(),
        requestBody: _configSchema.schema.string(),
        index: _configSchema.schema.string(),
        requestType: _configSchema.schema.string(),
        geoFieldType: _configSchema.schema.string(),
        searchSessionId: _configSchema.schema.maybe(_configSchema.schema.string()),
        token: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    const {
      query,
      params
    } = request;
    const abortController = new _cjsPonyfill.AbortController();
    request.events.aborted$.subscribe(() => {
      abortController.abort();
    });

    const requestBodyDSL = _risonNode.default.decode(query.requestBody);

    const tile = await (0, _get_tile.getGridTile)({
      logger,
      context,
      geometryFieldName: query.geometryFieldName,
      x: parseInt(params.x, 10),
      y: parseInt(params.y, 10),
      z: parseInt(params.z, 10),
      index: query.index,
      requestBody: requestBodyDSL,
      requestType: query.requestType,
      geoFieldType: query.geoFieldType,
      searchSessionId: query.searchSessionId,
      abortSignal: abortController.signal
    });
    return sendResponse(response, tile);
  });
}

function sendResponse(response, tile) {
  const headers = {
    'content-disposition': 'inline',
    'content-length': tile ? `${tile.length}` : `0`,
    'Content-Type': 'application/x-protobuf',
    'Cache-Control': `public, max-age=${CACHE_TIMEOUT_SECONDS}`,
    'Last-Modified': `${new Date().toUTCString()}`
  };

  if (tile) {
    return response.ok({
      body: tile,
      headers
    });
  } else {
    return response.ok({
      headers
    });
  }
}