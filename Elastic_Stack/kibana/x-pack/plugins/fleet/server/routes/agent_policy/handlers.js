"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAgentPolicyHandler = exports.getOneAgentPolicyHandler = exports.getFullAgentPolicy = exports.getAgentPoliciesHandler = exports.downloadFullAgentPolicy = exports.deleteAgentPoliciesHandler = exports.createAgentPolicyHandler = exports.copyAgentPolicyHandler = void 0;

var _bluebird = _interopRequireDefault(require("bluebird"));

var _jsYaml = require("js-yaml");

var _services = require("../../../common/services");

var _services2 = require("../../services");

var _agents = require("../../services/agents");

var _constants = require("../../constants");

var _common = require("../../../common");

var _errors = require("../../errors");

var _package_policy = require("../../services/package_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getAgentPoliciesHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;
  const {
    full: withPackagePolicies = false,
    ...restOfQuery
  } = request.query;

  try {
    const {
      items,
      total,
      page,
      perPage
    } = await _services2.agentPolicyService.list(soClient, {
      withPackagePolicies,
      ...restOfQuery
    });
    const body = {
      items,
      total,
      page,
      perPage
    };
    await _bluebird.default.map(items, agentPolicy => (0, _agents.getAgentsByKuery)(esClient, {
      showInactive: false,
      perPage: 0,
      page: 1,
      kuery: `${_constants.AGENT_SAVED_OBJECT_TYPE}.policy_id:${agentPolicy.id}`
    }).then(({
      total: agentTotal
    }) => agentPolicy.agents = agentTotal), {
      concurrency: 10
    });
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getAgentPoliciesHandler = getAgentPoliciesHandler;

const getOneAgentPolicyHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;

  try {
    const agentPolicy = await _services2.agentPolicyService.get(soClient, request.params.agentPolicyId);

    if (agentPolicy) {
      const body = {
        item: agentPolicy
      };
      return response.ok({
        body
      });
    } else {
      return response.customError({
        statusCode: 404,
        body: {
          message: 'Agent policy not found'
        }
      });
    }
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getOneAgentPolicyHandler = getOneAgentPolicyHandler;

const createAgentPolicyHandler = async (context, request, response) => {
  var _appContextService$ge, _request$query$sys_mo;

  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;
  const user = (await ((_appContextService$ge = _services2.appContextService.getSecurity()) === null || _appContextService$ge === void 0 ? void 0 : _appContextService$ge.authc.getCurrentUser(request))) || undefined;
  const withSysMonitoring = (_request$query$sys_mo = request.query.sys_monitoring) !== null && _request$query$sys_mo !== void 0 ? _request$query$sys_mo : false;

  try {
    // eslint-disable-next-line prefer-const
    let [agentPolicy, newSysPackagePolicy] = await Promise.all([_services2.agentPolicyService.create(soClient, esClient, request.body, {
      user
    }), // If needed, retrieve System package information and build a new package policy for the system package
    // NOTE: we ignore failures in attempting to create package policy, since agent policy might have been created
    // successfully
    withSysMonitoring ? _services2.packagePolicyService.buildPackagePolicyFromPackage(soClient, _common.FLEET_SYSTEM_PACKAGE).catch(() => undefined) : undefined]); // Create the system monitoring package policy and add it to agent policy.

    if (withSysMonitoring && newSysPackagePolicy !== undefined && agentPolicy !== undefined) {
      newSysPackagePolicy.policy_id = agentPolicy.id;
      newSysPackagePolicy.namespace = agentPolicy.namespace;
      newSysPackagePolicy.name = await (0, _package_policy.incrementPackageName)(soClient, _common.FLEET_SYSTEM_PACKAGE);
      await _services2.packagePolicyService.create(soClient, esClient, newSysPackagePolicy, {
        user,
        bumpRevision: false
      });
    }

    await _services2.agentPolicyService.createFleetServerPolicy(soClient, agentPolicy.id);
    const body = {
      item: agentPolicy
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.createAgentPolicyHandler = createAgentPolicyHandler;

const updateAgentPolicyHandler = async (context, request, response) => {
  var _appContextService$ge2;

  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;
  const user = await ((_appContextService$ge2 = _services2.appContextService.getSecurity()) === null || _appContextService$ge2 === void 0 ? void 0 : _appContextService$ge2.authc.getCurrentUser(request));

  try {
    const agentPolicy = await _services2.agentPolicyService.update(soClient, esClient, request.params.agentPolicyId, request.body, {
      user: user || undefined
    });
    const body = {
      item: agentPolicy
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.updateAgentPolicyHandler = updateAgentPolicyHandler;

const copyAgentPolicyHandler = async (context, request, response) => {
  var _appContextService$ge3;

  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;
  const user = await ((_appContextService$ge3 = _services2.appContextService.getSecurity()) === null || _appContextService$ge3 === void 0 ? void 0 : _appContextService$ge3.authc.getCurrentUser(request));

  try {
    const agentPolicy = await _services2.agentPolicyService.copy(soClient, esClient, request.params.agentPolicyId, request.body, {
      user: user || undefined
    });
    const body = {
      item: agentPolicy
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.copyAgentPolicyHandler = copyAgentPolicyHandler;

const deleteAgentPoliciesHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;

  try {
    const body = await _services2.agentPolicyService.delete(soClient, esClient, request.body.agentPolicyId);
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.deleteAgentPoliciesHandler = deleteAgentPoliciesHandler;

const getFullAgentPolicy = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;

  if (request.query.kubernetes === true) {
    try {
      const fullAgentConfigMap = await _services2.agentPolicyService.getFullAgentConfigMap(soClient, request.params.agentPolicyId, {
        standalone: request.query.standalone === true
      });

      if (fullAgentConfigMap) {
        const body = {
          item: fullAgentConfigMap
        };
        return response.ok({
          body
        });
      } else {
        return response.customError({
          statusCode: 404,
          body: {
            message: 'Agent config map not found'
          }
        });
      }
    } catch (error) {
      return (0, _errors.defaultIngestErrorHandler)({
        error,
        response
      });
    }
  } else {
    try {
      const fullAgentPolicy = await _services2.agentPolicyService.getFullAgentPolicy(soClient, request.params.agentPolicyId, {
        standalone: request.query.standalone === true
      });

      if (fullAgentPolicy) {
        const body = {
          item: fullAgentPolicy
        };
        return response.ok({
          body
        });
      } else {
        return response.customError({
          statusCode: 404,
          body: {
            message: 'Agent policy not found'
          }
        });
      }
    } catch (error) {
      return (0, _errors.defaultIngestErrorHandler)({
        error,
        response
      });
    }
  }
};

exports.getFullAgentPolicy = getFullAgentPolicy;

const downloadFullAgentPolicy = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const {
    params: {
      agentPolicyId
    }
  } = request;

  if (request.query.kubernetes === true) {
    try {
      const fullAgentConfigMap = await _services2.agentPolicyService.getFullAgentConfigMap(soClient, request.params.agentPolicyId, {
        standalone: request.query.standalone === true
      });

      if (fullAgentConfigMap) {
        const body = fullAgentConfigMap;
        const headers = {
          'content-type': 'text/x-yaml',
          'content-disposition': `attachment; filename="elastic-agent-standalone-kubernetes.yaml"`
        };
        return response.ok({
          body,
          headers
        });
      } else {
        return response.customError({
          statusCode: 404,
          body: {
            message: 'Agent config map not found'
          }
        });
      }
    } catch (error) {
      return (0, _errors.defaultIngestErrorHandler)({
        error,
        response
      });
    }
  } else {
    try {
      const fullAgentPolicy = await _services2.agentPolicyService.getFullAgentPolicy(soClient, agentPolicyId, {
        standalone: request.query.standalone === true
      });

      if (fullAgentPolicy) {
        const body = (0, _services.fullAgentPolicyToYaml)(fullAgentPolicy, _jsYaml.safeDump);
        const headers = {
          'content-type': 'text/x-yaml',
          'content-disposition': `attachment; filename="elastic-agent.yml"`
        };
        return response.ok({
          body,
          headers
        });
      } else {
        return response.customError({
          statusCode: 404,
          body: {
            message: 'Agent policy not found'
          }
        });
      }
    } catch (error) {
      return (0, _errors.defaultIngestErrorHandler)({
        error,
        response
      });
    }
  }
};

exports.downloadFullAgentPolicy = downloadFullAgentPolicy;