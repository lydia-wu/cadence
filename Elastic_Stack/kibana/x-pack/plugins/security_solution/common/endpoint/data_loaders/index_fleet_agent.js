"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexFleetAgentForHost = exports.deleteIndexedFleetAgents = void 0;

var _common = require("../../../../fleet/common");

var _fleet_agent_generator = require("../data_generators/fleet_agent_generator");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line import/no-extraneous-dependencies


const defaultFleetAgentGenerator = new _fleet_agent_generator.FleetAgentGenerator();
/**
 * Indexes a Fleet Agent
 * (NOTE: ensure that fleet is setup first before calling this loading function)
 *
 * @param esClient
 * @param kbnClient
 * @param endpointHost
 * @param agentPolicyId
 * @param [kibanaVersion]
 * @param [fleetAgentGenerator]
 */

const indexFleetAgentForHost = async (esClient, kbnClient, endpointHost, agentPolicyId, kibanaVersion = '8.0.0', fleetAgentGenerator = defaultFleetAgentGenerator) => {
  const agentDoc = fleetAgentGenerator.generateEsHit({
    _source: {
      agent: {
        id: endpointHost.agent.id,
        version: endpointHost.agent.version
      },
      local_metadata: {
        elastic: {
          agent: {
            version: kibanaVersion
          }
        },
        host: { ...endpointHost.host
        },
        os: { ...endpointHost.host.os
        }
      },
      policy_id: agentPolicyId
    }
  });
  const createdFleetAgent = await esClient.index({
    index: agentDoc._index,
    id: agentDoc._id,
    body: agentDoc._source,
    op_type: 'create'
  }).catch(_utils.wrapErrorAndRejectPromise);
  return {
    fleetAgentsIndex: agentDoc._index,
    agents: [await fetchFleetAgent(kbnClient, createdFleetAgent.body._id).catch(_utils.wrapErrorAndRejectPromise)]
  };
};

exports.indexFleetAgentForHost = indexFleetAgentForHost;

const fetchFleetAgent = async (kbnClient, agentId) => {
  return (await kbnClient.request({
    path: _common.AGENT_API_ROUTES.INFO_PATTERN.replace('{agentId}', agentId),
    method: 'GET'
  }).catch(_utils.wrapErrorAndRejectPromise)).data.item;
};

const deleteIndexedFleetAgents = async (esClient, indexedData) => {
  const response = {
    agents: undefined
  };

  if (indexedData.agents.length) {
    response.agents = (await esClient.deleteByQuery({
      index: `${indexedData.fleetAgentsIndex}-*`,
      wait_for_completion: true,
      body: {
        query: {
          bool: {
            filter: [{
              terms: {
                'local_metadata.elastic.agent.id': indexedData.agents.map(agent => agent.local_metadata.elastic.agent.id)
              }
            }]
          }
        }
      }
    }).catch(_utils.wrapErrorAndRejectPromise)).body;
  }

  return response;
};

exports.deleteIndexedFleetAgents = deleteIndexedFleetAgents;