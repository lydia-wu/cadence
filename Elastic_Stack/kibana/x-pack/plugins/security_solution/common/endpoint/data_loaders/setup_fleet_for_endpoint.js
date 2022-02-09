"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupFleetForEndpoint = exports.installOrUpgradeEndpointFleetPackage = void 0;

var _common = require("../../../../fleet/common");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line import/no-extraneous-dependencies

/**
 * Calls the fleet setup APIs and then installs the latest Endpoint package
 * @param kbnClient
 */


const setupFleetForEndpoint = async kbnClient => {
  // We try to use the kbnClient **private** logger, bug if unable to access it, then just use console
  // @ts-expect-error TS2341
  const log = kbnClient.log ? kbnClient.log : console; // Setup Fleet

  try {
    const setupResponse = await kbnClient.request({
      path: _common.SETUP_API_ROUTE,
      method: 'POST'
    }).catch(_utils.wrapErrorAndRejectPromise);

    if (!setupResponse.data.isInitialized) {
      log.error(setupResponse.data);
      throw new Error('Initializing the ingest manager failed, existing');
    }
  } catch (error) {
    log.error(error);
    throw error;
  } // Setup Agents


  try {
    const setupResponse = await kbnClient.request({
      path: _common.AGENTS_SETUP_API_ROUTES.CREATE_PATTERN,
      method: 'POST'
    }).catch(_utils.wrapErrorAndRejectPromise);

    if (!setupResponse.data.isInitialized) {
      log.error(setupResponse.data);
      throw new Error('Initializing Fleet failed, existing');
    }
  } catch (error) {
    log.error(error);
    throw error;
  } // Install/upgrade the endpoint package


  let endpointPackage;

  try {
    endpointPackage = await installOrUpgradeEndpointFleetPackage(kbnClient);
  } catch (error) {
    log.error(error);
    throw error;
  }

  return {
    endpointPackage
  };
};
/**
 * Installs the Endpoint package (or upgrades it) in Fleet to the latest available in the registry
 *
 * @param kbnClient
 */


exports.setupFleetForEndpoint = setupFleetForEndpoint;

const installOrUpgradeEndpointFleetPackage = async kbnClient => {
  const installEndpointPackageResp = await kbnClient.request({
    path: _common.EPM_API_ROUTES.BULK_INSTALL_PATTERN,
    method: 'POST',
    body: {
      packages: ['endpoint']
    }
  }).catch(_utils.wrapErrorAndRejectPromise);
  const bulkResp = installEndpointPackageResp.data.response;

  if (bulkResp.length <= 0) {
    throw new _utils.EndpointDataLoadingError('Installing the Endpoint package failed, response was empty, existing', bulkResp);
  }

  const firstError = bulkResp[0];

  if (isFleetBulkInstallError(firstError)) {
    if (firstError.error instanceof Error) {
      throw new _utils.EndpointDataLoadingError(`Installing the Endpoint package failed: ${firstError.error.message}, exiting`, bulkResp);
    } // Ignore `409` (conflicts due to Concurrent install or upgrades of package) errors


    if (firstError.statusCode !== 409) {
      throw new _utils.EndpointDataLoadingError(firstError.error, bulkResp);
    }
  }

  return bulkResp[0];
};

exports.installOrUpgradeEndpointFleetPackage = installOrUpgradeEndpointFleetPackage;

function isFleetBulkInstallError(installResponse) {
  return 'error' in installResponse && installResponse.error !== undefined;
}