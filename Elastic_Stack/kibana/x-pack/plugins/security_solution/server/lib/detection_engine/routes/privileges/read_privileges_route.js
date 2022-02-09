"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readPrivilegesRoute = void 0;

var _fp = require("lodash/fp");

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _constants = require("../../../../../common/constants");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const readPrivilegesRoute = (router, hasEncryptionKey) => {
  router.get({
    path: _constants.DETECTION_ENGINE_PRIVILEGES_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      var _context$securitySolu, _request$auth$isAuthe;

      const esClient = context.core.elasticsearch.client.asCurrentUser;
      const siemClient = (_context$securitySolu = context.securitySolution) === null || _context$securitySolu === void 0 ? void 0 : _context$securitySolu.getAppClient();

      if (!siemClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      const index = siemClient.getSignalsIndex();
      const clusterPrivileges = await (0, _securitysolutionEsUtils.readPrivileges)(esClient, index);
      const privileges = (0, _fp.merge)(clusterPrivileges, {
        is_authenticated: (_request$auth$isAuthe = request.auth.isAuthenticated) !== null && _request$auth$isAuthe !== void 0 ? _request$auth$isAuthe : false,
        has_encryption_key: hasEncryptionKey
      });
      return response.ok({
        body: privileges
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.readPrivilegesRoute = readPrivilegesRoute;