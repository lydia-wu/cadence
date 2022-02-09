"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.healthRoute = healthRoute;

var _license_api_access = require("../../lib/license_api_access");

var _track_legacy_route_usage = require("../../lib/track_legacy_route_usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function healthRoute(router, licenseState, encryptedSavedObjects, usageCounter) {
  router.get({
    path: '/api/alerts/_health',
    validate: false
  }, router.handleLegacyErrors(async function (context, req, res) {
    (0, _license_api_access.verifyApiAccess)(licenseState);

    if (!context.alerting) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for alerting'
      });
    }

    (0, _track_legacy_route_usage.trackLegacyRouteUsage)('health', usageCounter);

    try {
      const isEsSecurityEnabled = licenseState.getIsSecurityEnabled();
      const alertingFrameworkHeath = await context.alerting.getFrameworkHealth();
      const areApiKeysEnabled = await context.alerting.areApiKeysEnabled();
      let isSufficientlySecure;

      if (isEsSecurityEnabled === null) {
        isSufficientlySecure = false;
      } else {
        // if isEsSecurityEnabled = true, then areApiKeysEnabled must be true to enable alerting
        // if isEsSecurityEnabled = false, then it does not matter what areApiKeysEnabled is
        isSufficientlySecure = !isEsSecurityEnabled || isEsSecurityEnabled && areApiKeysEnabled;
      }

      const frameworkHealth = {
        isSufficientlySecure,
        hasPermanentEncryptionKey: encryptedSavedObjects.canEncrypt,
        alertingFrameworkHeath
      };
      return res.ok({
        body: frameworkHealth
      });
    } catch (error) {
      return res.badRequest({
        body: error
      });
    }
  }));
}