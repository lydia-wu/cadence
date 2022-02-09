"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDefaultPolicy = void 0;

var _policy_config = require("../../../common/endpoint/models/policy_config");

var _license = require("../../../common/license/license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Create the default endpoint policy based on the current license
 */


const createDefaultPolicy = licenseService => {
  return (0, _license.isAtLeast)(licenseService.getLicenseInformation(), 'platinum') ? (0, _policy_config.policyFactory)() : (0, _policy_config.policyFactoryWithoutPaidFeatures)();
};

exports.createDefaultPolicy = createDefaultPolicy;