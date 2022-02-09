"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toUpdateTrustedApp = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const NEW_TRUSTED_APP_KEYS = ['name', 'effectScope', 'entries', 'description', 'os', 'version'];

const toUpdateTrustedApp = trustedApp => {
  const trustedAppForUpdate = {};

  for (const key of NEW_TRUSTED_APP_KEYS) {
    // This should be safe. Its needed due to the inter-dependency on property values (`os` <=> `entries`)
    // @ts-expect-error
    trustedAppForUpdate[key] = trustedApp[key];
  }

  return trustedAppForUpdate;
};

exports.toUpdateTrustedApp = toUpdateTrustedApp;