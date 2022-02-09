"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexFleetEndpointPolicy = exports.deleteIndexedFleetEndpointPolicies = void 0;

var _common = require("../../../../fleet/common");

var _policy_config = require("../models/policy_config");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line import/no-extraneous-dependencies

/**
 * Create an endpoint Integration Policy (and associated Agent Policy) via Fleet
 * (NOTE: ensure that fleet is setup first before calling this loading function)
 */


const indexFleetEndpointPolicy = async (kbnClient, policyName, endpointPackageVersion = '8.0.0') => {
  const response = {
    integrationPolicies: [],
    agentPolicies: []
  }; // Create Agent Policy first

  const newAgentPolicyData = {
    name: `Policy for ${policyName} (${Math.random().toString(36).substr(2, 5)})`,
    description: `Policy created with endpoint data generator (${policyName})`,
    namespace: 'default'
  };
  let agentPolicy;

  try {
    agentPolicy = await kbnClient.request({
      path: _common.AGENT_POLICY_API_ROUTES.CREATE_PATTERN,
      method: 'POST',
      body: newAgentPolicyData
    }).catch(_utils.wrapErrorAndRejectPromise);
  } catch (error) {
    throw new Error(`create fleet agent policy failed ${error}`);
  }

  response.agentPolicies.push(agentPolicy.data.item); // Create integration (package) policy

  const newPackagePolicyData = {
    name: policyName,
    description: 'Protect the worlds data',
    policy_id: agentPolicy.data.item.id,
    enabled: true,
    output_id: '',
    inputs: [{
      type: 'endpoint',
      enabled: true,
      streams: [],
      config: {
        policy: {
          value: (0, _policy_config.policyFactory)()
        }
      }
    }],
    namespace: 'default',
    package: {
      name: 'endpoint',
      title: 'endpoint',
      version: endpointPackageVersion
    }
  };
  const packagePolicy = await kbnClient.request({
    path: _common.PACKAGE_POLICY_API_ROUTES.CREATE_PATTERN,
    method: 'POST',
    body: newPackagePolicyData
  }).catch(_utils.wrapErrorAndRejectPromise);
  response.integrationPolicies.push(packagePolicy.data.item);
  return response;
};

exports.indexFleetEndpointPolicy = indexFleetEndpointPolicy;
/**
 * Delete indexed Fleet Endpoint integration policies along with their respective Agent Policies.
 * Prior to calling this function, ensure that no agents are associated with the Agent Policy.
 * (NOTE: ensure that fleet is setup first before calling this loading function)
 * @param kbnClient
 * @param indexData
 */

const deleteIndexedFleetEndpointPolicies = async (kbnClient, indexData) => {
  const response = {
    integrationPolicies: undefined,
    agentPolicies: undefined
  };

  if (indexData.integrationPolicies.length) {
    response.integrationPolicies = (await kbnClient.request({
      path: _common.PACKAGE_POLICY_API_ROUTES.DELETE_PATTERN,
      method: 'POST',
      body: {
        packagePolicyIds: indexData.integrationPolicies.map(policy => policy.id)
      }
    }).catch(_utils.wrapErrorAndRejectPromise)).data;
  }

  if (indexData.agentPolicies.length) {
    response.agentPolicies = [];

    for (const agentPolicy of indexData.agentPolicies) {
      response.agentPolicies.push((await kbnClient.request({
        path: _common.AGENT_POLICY_API_ROUTES.DELETE_PATTERN,
        method: 'POST',
        body: {
          agentPolicyId: agentPolicy.id
        }
      }).catch(_utils.wrapErrorAndRejectPromise)).data);
    }
  }

  return response;
};

exports.deleteIndexedFleetEndpointPolicies = deleteIndexedFleetEndpointPolicies;