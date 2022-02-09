"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = exports.getCheckPermissionsHandler = exports.generateServiceTokenHandler = void 0;

var _constants = require("../../constants");

var _services = require("../../services");

var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getCheckPermissionsHandler = async (context, request, response) => {
  const missingSecurityBody = {
    success: false,
    error: 'MISSING_SECURITY'
  };

  if (!_services.appContextService.hasSecurity() || !_services.appContextService.getSecurityLicense().isEnabled()) {
    return response.ok({
      body: missingSecurityBody
    });
  } else {
    const security = _services.appContextService.getSecurity();

    const user = security.authc.getCurrentUser(request); // Defensively handle situation where user is undefined (should only happen when ES security is disabled)
    // This should be covered by the `getSecurityLicense().isEnabled()` check above, but we leave this for robustness.

    if (!user) {
      return response.ok({
        body: missingSecurityBody
      });
    }

    if (!(user !== null && user !== void 0 && user.roles.includes('superuser'))) {
      return response.ok({
        body: {
          success: false,
          error: 'MISSING_SUPERUSER_ROLE'
        }
      });
    }

    return response.ok({
      body: {
        success: true
      }
    });
  }
};

exports.getCheckPermissionsHandler = getCheckPermissionsHandler;

const generateServiceTokenHandler = async (context, request, response) => {
  const esClient = context.core.elasticsearch.client.asCurrentUser;

  try {
    const {
      body: tokenResponse
    } = await esClient.transport.request({
      method: 'POST',
      path: `_security/service/elastic/fleet-server/credential/token/token-${Date.now()}`
    });

    if (tokenResponse.created && tokenResponse.token) {
      const body = tokenResponse.token;
      return response.ok({
        body
      });
    } else {
      const error = new _errors.GenerateServiceTokenError('Unable to generate service token');
      return (0, _errors.defaultIngestErrorHandler)({
        error,
        response
      });
    }
  } catch (e) {
    const error = new _errors.GenerateServiceTokenError(e);
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.generateServiceTokenHandler = generateServiceTokenHandler;

const registerRoutes = router => {
  router.get({
    path: _constants.APP_API_ROUTES.CHECK_PERMISSIONS_PATTERN,
    validate: {},
    options: {
      tags: []
    }
  }, getCheckPermissionsHandler);
  router.post({
    path: _constants.APP_API_ROUTES.GENERATE_SERVICE_TOKEN_PATTERN,
    validate: {},
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, generateServiceTokenHandler);
};

exports.registerRoutes = registerRoutes;