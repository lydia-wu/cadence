"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLegacy = registerLegacy;

var _configSchema = require("@kbn/config-schema");

var _querystring = _interopRequireDefault(require("querystring"));

var _constants = require("../../../common/constants");

var _authorized_user_pre_routing = require("../lib/authorized_user_pre_routing");

var _request_handler = require("../lib/request_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const BASE_GENERATE = `${_constants.API_BASE_URL}/generate`;

function registerLegacy(reporting, logger) {
  const {
    router
  } = reporting.getPluginSetupDeps();

  function createLegacyPdfRoute({
    path,
    objectType
  }) {
    const exportTypeId = 'printablePdf';
    router.post({
      path,
      validate: {
        params: _configSchema.schema.object({
          savedObjectId: _configSchema.schema.string({
            minLength: 3
          }),
          title: _configSchema.schema.string(),
          browserTimezone: _configSchema.schema.string()
        }),
        query: _configSchema.schema.maybe(_configSchema.schema.string())
      }
    }, (0, _authorized_user_pre_routing.authorizedUserPreRouting)(reporting, async (user, context, req, res) => {
      const requestHandler = new _request_handler.RequestHandler(reporting, user, context, req, res, logger);
      const message = `The following URL is deprecated and will stop working in the next major version: ${req.url.pathname}${req.url.search}`;
      logger.warn(message, ['deprecation']);

      try {
        const {
          title,
          savedObjectId,
          browserTimezone
        } = req.params;

        const queryString = _querystring.default.stringify(req.query);

        return await requestHandler.handleGenerateRequest(exportTypeId, {
          title,
          objectType,
          savedObjectId,
          browserTimezone,
          queryString,
          version: reporting.getKibanaPackageInfo().version
        });
      } catch (err) {
        throw requestHandler.handleError(err);
      }
    }));
  }

  createLegacyPdfRoute({
    path: `${BASE_GENERATE}/visualization/{savedId}`,
    objectType: 'visualization'
  });
  createLegacyPdfRoute({
    path: `${BASE_GENERATE}/search/{savedId}`,
    objectType: 'search'
  });
  createLegacyPdfRoute({
    path: `${BASE_GENERATE}/dashboard/{savedId}`,
    objectType: 'dashboard'
  });
}