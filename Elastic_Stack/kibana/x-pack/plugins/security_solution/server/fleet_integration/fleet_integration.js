"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPackagePolicyUpdateCallback = exports.getPackagePolicyDeleteCallback = exports.getPackagePolicyCreateCallback = void 0;

var _install_prepackaged_rules = require("./handlers/install_prepackaged_rules");

var _create_policy_artifact_manifest = require("./handlers/create_policy_artifact_manifest");

var _create_default_policy = require("./handlers/create_default_policy");

var _validate_policy_against_license = require("./handlers/validate_policy_against_license");

var _remove_policy_from_trusted_apps = require("./handlers/remove_policy_from_trusted_apps");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isEndpointPackagePolicy = packagePolicy => {
  var _packagePolicy$packag;

  return ((_packagePolicy$packag = packagePolicy.package) === null || _packagePolicy$packag === void 0 ? void 0 : _packagePolicy$packag.name) === 'endpoint';
};
/**
 * Callback to handle creation of PackagePolicies in Fleet
 */


const getPackagePolicyCreateCallback = (logger, manifestManager, securitySolutionRequestContextFactory, alerts, licenseService, exceptionsClient) => {
  return async (newPackagePolicy, context, request) => {
    // We only care about Endpoint package policies
    if (!isEndpointPackagePolicy(newPackagePolicy)) {
      return newPackagePolicy;
    } // In this callback we are handling an HTTP request to the fleet plugin. Since we use
    // code from the security_solution plugin to handle it (installPrepackagedRules),
    // we need to build the context that is native to security_solution and pass it there.


    const securitySolutionContext = await securitySolutionRequestContextFactory.create(context, request); // perform these operations in parallel in order to help in not delaying the API response too much

    const [, manifestValue] = await Promise.all([// Install Detection Engine prepackaged rules
    exceptionsClient && (0, _install_prepackaged_rules.installPrepackagedRules)({
      logger,
      context: securitySolutionContext,
      request,
      alerts,
      exceptionsClient
    }), // create the Artifact Manifest for this policy
    (0, _create_policy_artifact_manifest.createPolicyArtifactManifest)(logger, manifestManager)]); // Add the default endpoint security policy

    const defaultPolicyValue = (0, _create_default_policy.createDefaultPolicy)(licenseService);
    return { // We cast the type here so that any changes to the Endpoint
      // specific data follow the types/schema expected
      ...newPackagePolicy,
      inputs: [{
        type: 'endpoint',
        enabled: true,
        streams: [],
        config: {
          artifact_manifest: {
            value: manifestValue
          },
          policy: {
            value: defaultPolicyValue
          }
        }
      }]
    };
  };
};

exports.getPackagePolicyCreateCallback = getPackagePolicyCreateCallback;

const getPackagePolicyUpdateCallback = (logger, licenseService) => {
  return async newPackagePolicy => {
    var _newPackagePolicy$inp, _newPackagePolicy$inp2;

    if (!isEndpointPackagePolicy(newPackagePolicy)) {
      return newPackagePolicy;
    } // Validate that Endpoint Security policy is valid against current license


    (0, _validate_policy_against_license.validatePolicyAgainstLicense)( // The cast below is needed in order to ensure proper typing for
    // the policy configuration specific for endpoint
    (_newPackagePolicy$inp = newPackagePolicy.inputs[0].config) === null || _newPackagePolicy$inp === void 0 ? void 0 : (_newPackagePolicy$inp2 = _newPackagePolicy$inp.policy) === null || _newPackagePolicy$inp2 === void 0 ? void 0 : _newPackagePolicy$inp2.value, licenseService, logger);
    return newPackagePolicy;
  };
};

exports.getPackagePolicyUpdateCallback = getPackagePolicyUpdateCallback;

const getPackagePolicyDeleteCallback = (exceptionsClient, experimentalFeatures) => {
  return async deletePackagePolicy => {
    if (!exceptionsClient) {
      return;
    }

    const policiesToRemove = [];

    for (const policy of deletePackagePolicy) {
      if (isEndpointPackagePolicy(policy) && experimentalFeatures !== null && experimentalFeatures !== void 0 && experimentalFeatures.trustedAppsByPolicyEnabled) {
        policiesToRemove.push((0, _remove_policy_from_trusted_apps.removePolicyFromTrustedApps)(exceptionsClient, policy));
      }
    }

    await Promise.all(policiesToRemove);
  };
};

exports.getPackagePolicyDeleteCallback = getPackagePolicyDeleteCallback;