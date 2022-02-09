"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndpointMetadataService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _server = require("../../../../../fleet/server");

var _errors = require("./errors");

var _query_builders = require("../../routes/metadata/query_builders");

var _query_strategies = require("../../routes/metadata/support/query_strategies");

var _utils = require("../../utils");

var _errors2 = require("../../errors");

var _create_internal_readonly_so_client = require("../../utils/create_internal_readonly_so_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class EndpointMetadataService {
  /**
   * For internal use only by the `this.DANGEROUS_INTERNAL_SO_CLIENT`
   * @deprecated
   */
  constructor(savedObjectsStart, agentService, agentPolicyService, logger) {
    (0, _defineProperty2.default)(this, "__DANGEROUS_INTERNAL_SO_CLIENT", void 0);
    this.savedObjectsStart = savedObjectsStart;
    this.agentService = agentService;
    this.agentPolicyService = agentPolicyService;
    this.logger = logger;
  }
  /**
   * An INTERNAL Saved Object client that is effectively the system user and has all privileges and permissions and
   * can access any saved object. Used primarly to retrieve fleet data for endpoint enrichment (so that users are
   * not required to have superuser role)
   *
   * **IMPORTANT: SHOULD BE USED ONLY FOR READ-ONLY ACCESS AND WITH DISCRETION**
   *
   * @private
   */


  get DANGEROUS_INTERNAL_SO_CLIENT() {
    // The INTERNAL SO client must be created during the first time its used. This is because creating it during
    // instance initialization (in `constructor(){}`) causes the SO Client to be invalid (perhaps because this
    // instantiation is happening during the plugin's the start phase)
    if (!this.__DANGEROUS_INTERNAL_SO_CLIENT) {
      this.__DANGEROUS_INTERNAL_SO_CLIENT = (0, _create_internal_readonly_so_client.createInternalReadonlySoClient)(this.savedObjectsStart);
    }

    return this.__DANGEROUS_INTERNAL_SO_CLIENT;
  }
  /**
   * Retrieve a single endpoint host metadata. Note that the return endpoint document, if found,
   * could be associated with a Fleet Agent that is no longer active. If wanting to ensure the
   * endpoint is associated with an active Fleet Agent, then use `getEnrichedHostMetadata()` instead
   *
   * @param esClient Elasticsearch Client (usually scoped to the user's context)
   * @param endpointId the endpoint id (from `agent.id`)
   *
   * @throws
   */


  async getHostMetadata(esClient, endpointId) {
    const query = (0, _query_builders.getESQueryHostMetadataByID)(endpointId);
    const queryResult = await esClient.search(query).catch(_utils.catchAndWrapError);
    const endpointMetadata = (0, _query_strategies.queryResponseToHostResult)(queryResult.body).result;

    if (endpointMetadata) {
      return endpointMetadata;
    }

    throw new _errors.EndpointHostNotFoundError(`Endpoint with id ${endpointId} not found`);
  }
  /**
   * Find a  list of Endpoint Host Metadata document associated with a given list of Fleet Agent Ids
   * @param esClient
   * @param fleetAgentIds
   */


  async findHostMetadataForFleetAgents(esClient, fleetAgentIds) {
    const query = (0, _query_builders.getESQueryHostMetadataByFleetAgentIds)(fleetAgentIds);
    query.size = fleetAgentIds.length;
    const searchResult = await esClient.search(query, {
      ignore: [404]
    }).catch(_utils.catchAndWrapError);
    return (0, _query_strategies.queryResponseToHostListResult)(searchResult.body).resultList;
  }
  /**
   * Retrieve a single endpoint host metadata along with fleet information
   *
   * @param esClient Elasticsearch Client (usually scoped to the user's context)
   * @param endpointId the endpoint id (from `agent.id`)
   *
   * @throws
   */


  async getEnrichedHostMetadata(esClient, endpointId) {
    const endpointMetadata = await this.getHostMetadata(esClient, endpointId);
    let fleetAgentId = endpointMetadata.elastic.agent.id;
    let fleetAgent; // Get Fleet agent

    try {
      if (!fleetAgentId) {
        var _this$logger;

        fleetAgentId = endpointMetadata.agent.id;
        (_this$logger = this.logger) === null || _this$logger === void 0 ? void 0 : _this$logger.warn(`Missing elastic agent id, using host id instead ${fleetAgentId}`);
      }

      fleetAgent = await this.getFleetAgent(esClient, fleetAgentId);
    } catch (error) {
      if (error instanceof _errors.FleetAgentNotFoundError) {
        var _this$logger2;

        (_this$logger2 = this.logger) === null || _this$logger2 === void 0 ? void 0 : _this$logger2.warn(`agent with id ${fleetAgentId} not found`);
      } else {
        throw error;
      }
    } // If the agent is not longer active, then that means that the Agent/Endpoint have been un-enrolled from the host


    if (fleetAgent && !fleetAgent.active) {
      throw new _errors.EndpointHostUnEnrolledError(`Endpoint with id ${endpointId} (Fleet agent id ${fleetAgentId}) is unenrolled`);
    } // ------------------------------------------------------------------------------
    // Any failures in enriching the Host form this point should NOT cause an error
    // ------------------------------------------------------------------------------


    try {
      var _fleetAgent$policy_re, _fleetAgent, _fleetAgent$policy_id, _fleetAgent2, _fleetAgentPolicy$rev, _fleetAgentPolicy, _fleetAgentPolicy$id, _fleetAgentPolicy2, _endpointPackagePolic, _endpointPackagePolic2, _endpointPackagePolic3, _endpointPackagePolic4;

      let fleetAgentPolicy;
      let endpointPackagePolicy; // Get Agent Policy and Endpoint Package Policy

      if (fleetAgent) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          fleetAgentPolicy = await this.getFleetAgentPolicy(fleetAgent.policy_id);
          endpointPackagePolicy = fleetAgentPolicy.package_policies.find(policy => {
            var _policy$package;

            return ((_policy$package = policy.package) === null || _policy$package === void 0 ? void 0 : _policy$package.name) === 'endpoint';
          });
        } catch (error) {
          var _this$logger3;

          (_this$logger3 = this.logger) === null || _this$logger3 === void 0 ? void 0 : _this$logger3.error(error);
        }
      }

      return {
        metadata: endpointMetadata,
        host_status: fleetAgent ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (0, _utils.fleetAgentStatusToEndpointHostStatus)(fleetAgent.status) : _utils.DEFAULT_ENDPOINT_HOST_STATUS,
        policy_info: {
          agent: {
            applied: {
              revision: (_fleetAgent$policy_re = (_fleetAgent = fleetAgent) === null || _fleetAgent === void 0 ? void 0 : _fleetAgent.policy_revision) !== null && _fleetAgent$policy_re !== void 0 ? _fleetAgent$policy_re : 0,
              id: (_fleetAgent$policy_id = (_fleetAgent2 = fleetAgent) === null || _fleetAgent2 === void 0 ? void 0 : _fleetAgent2.policy_id) !== null && _fleetAgent$policy_id !== void 0 ? _fleetAgent$policy_id : ''
            },
            configured: {
              revision: (_fleetAgentPolicy$rev = (_fleetAgentPolicy = fleetAgentPolicy) === null || _fleetAgentPolicy === void 0 ? void 0 : _fleetAgentPolicy.revision) !== null && _fleetAgentPolicy$rev !== void 0 ? _fleetAgentPolicy$rev : 0,
              id: (_fleetAgentPolicy$id = (_fleetAgentPolicy2 = fleetAgentPolicy) === null || _fleetAgentPolicy2 === void 0 ? void 0 : _fleetAgentPolicy2.id) !== null && _fleetAgentPolicy$id !== void 0 ? _fleetAgentPolicy$id : ''
            }
          },
          endpoint: {
            revision: (_endpointPackagePolic = (_endpointPackagePolic2 = endpointPackagePolicy) === null || _endpointPackagePolic2 === void 0 ? void 0 : _endpointPackagePolic2.revision) !== null && _endpointPackagePolic !== void 0 ? _endpointPackagePolic : 0,
            id: (_endpointPackagePolic3 = (_endpointPackagePolic4 = endpointPackagePolicy) === null || _endpointPackagePolic4 === void 0 ? void 0 : _endpointPackagePolic4.id) !== null && _endpointPackagePolic3 !== void 0 ? _endpointPackagePolic3 : ''
          }
        }
      };
    } catch (error) {
      throw (0, _utils.wrapErrorIfNeeded)(error);
    }
  }
  /**
   * Retrieve a single Fleet Agent data
   *
   * @param esClient Elasticsearch Client (usually scoped to the user's context)
   * @param agentId The elastic agent id (`from `elastic.agent.id`)
   */


  async getFleetAgent(esClient, agentId) {
    try {
      return await this.agentService.getAgent(esClient, agentId);
    } catch (error) {
      if (error instanceof _server.AgentNotFoundError) {
        throw new _errors.FleetAgentNotFoundError(`agent with id ${agentId} not found`, error);
      }

      throw new _errors2.EndpointError(error.message, error);
    }
  }
  /**
   * Retrieve a specific Fleet Agent Policy
   *
   * @param agentPolicyId
   *
   * @throws
   */


  async getFleetAgentPolicy(agentPolicyId) {
    const agentPolicy = await this.agentPolicyService.get(this.DANGEROUS_INTERNAL_SO_CLIENT, agentPolicyId, true).catch(_utils.catchAndWrapError);

    if (agentPolicy) {
      return agentPolicy;
    }

    throw new _errors.FleetAgentPolicyNotFoundError(`Fleet agent policy with id ${agentPolicyId} not found`);
  }

}

exports.EndpointMetadataService = EndpointMetadataService;