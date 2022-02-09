"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatePolicyAgainstLicense = void 0;

var _policy_config = require("../../../common/license/policy_config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const validatePolicyAgainstLicense = (policyConfig, licenseService, logger) => {
  if (!(0, _policy_config.isEndpointPolicyValidForLicense)(policyConfig, licenseService.getLicenseInformation())) {
    logger.warn('Incorrect license tier for paid policy fields'); // The `statusCode` below is used by Fleet API handler to ensure that the proper HTTP code is used in the API response

    const licenseError = new Error('Requires Platinum license');
    licenseError.statusCode = 403;
    throw licenseError;
  }
};

exports.validatePolicyAgainstLicense = validatePolicyAgainstLicense;