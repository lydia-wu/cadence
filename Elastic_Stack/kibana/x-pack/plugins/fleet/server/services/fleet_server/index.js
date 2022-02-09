"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awaitIfFleetServerSetupPending = awaitIfFleetServerSetupPending;
exports.hasFleetServers = hasFleetServers;
exports.isFleetServerSetup = isFleetServerSetup;
exports.startFleetServerSetup = startFleetServerSetup;

var _operators = require("rxjs/operators");

var _app_context = require("../app_context");

var _license = require("../license");

var _constants = require("../../constants");

var _saved_object_migrations = require("./saved_object_migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let _isFleetServerSetup = false;
let _isPending = false;

let _status;

let _onResolve;

function isFleetServerSetup() {
  return _isFleetServerSetup;
}
/**
 * Check if at least one fleet server is connected
 */


async function hasFleetServers(esClient) {
  const res = await esClient.search({
    index: _constants.FLEET_SERVER_SERVERS_INDEX,
    ignore_unavailable: true
  }); // @ts-expect-error value is number | TotalHits

  return res.body.hits.total.value > 0;
}

async function awaitIfFleetServerSetupPending() {
  if (!_isPending) {
    return;
  }

  return _status;
}

async function startFleetServerSetup() {
  var _appContextService$ge;

  _isPending = true;
  _status = new Promise(resolve => {
    _onResolve = resolve;
  });

  const logger = _app_context.appContextService.getLogger(); // Check for security


  if (!_app_context.appContextService.hasSecurity()) {
    // Fleet will not work if security is not enabled
    logger === null || logger === void 0 ? void 0 : logger.warn('Fleet requires the security plugin to be enabled.');
    return;
  } // Log information about custom registry URL


  const customUrl = (_appContextService$ge = _app_context.appContextService.getConfig()) === null || _appContextService$ge === void 0 ? void 0 : _appContextService$ge.registryUrl;

  if (customUrl) {
    logger.info(`Custom registry url is an experimental feature and is unsupported. Using custom registry at ${customUrl}`);
  }

  try {
    var _licenseService$getLi, _licenseService$getLi2; // We need licence to be initialized before using the SO service.


    await ((_licenseService$getLi = _license.licenseService.getLicenseInformation$()) === null || _licenseService$getLi === void 0 ? void 0 : (_licenseService$getLi2 = _licenseService$getLi.pipe((0, _operators.first)())) === null || _licenseService$getLi2 === void 0 ? void 0 : _licenseService$getLi2.toPromise());
    await (0, _saved_object_migrations.runFleetServerMigration)();
    _isFleetServerSetup = true;
  } catch (err) {
    logger === null || logger === void 0 ? void 0 : logger.error('Setup for central management of agents failed.');
    logger === null || logger === void 0 ? void 0 : logger.error(err);
  }

  _isPending = false;

  if (_onResolve) {
    _onResolve();
  }
}