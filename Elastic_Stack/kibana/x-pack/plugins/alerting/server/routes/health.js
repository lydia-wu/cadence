"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.healthRoute = void 0;

var _lib = require("./lib");

var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const rewriteBodyRes = ({
  isSufficientlySecure,
  hasPermanentEncryptionKey,
  alertingFrameworkHeath,
  ...rest
}) => ({ ...rest,
  is_sufficiently_secure: isSufficientlySecure,
  has_permanent_encryption_key: hasPermanentEncryptionKey,
  alerting_framework_heath: {
    decryption_health: alertingFrameworkHeath.decryptionHealth,
    execution_health: alertingFrameworkHeath.executionHealth,
    read_health: alertingFrameworkHeath.readHealth
  }
});

const healthRoute = (router, licenseState, encryptedSavedObjects) => {
  router.get({
    path: `${_types.BASE_ALERTING_API_PATH}/_health`,
    validate: false
  }, router.handleLegacyErrors((0, _lib.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    try {
      const isEsSecurityEnabled = licenseState.getIsSecurityEnabled();
      const areApiKeysEnabled = await context.alerting.areApiKeysEnabled();
      const alertingFrameworkHeath = await context.alerting.getFrameworkHealth();
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
        body: rewriteBodyRes(frameworkHealth)
      });
    } catch (error) {
      return res.badRequest({
        body: error
      });
    }
  })));
};

exports.healthRoute = healthRoute;