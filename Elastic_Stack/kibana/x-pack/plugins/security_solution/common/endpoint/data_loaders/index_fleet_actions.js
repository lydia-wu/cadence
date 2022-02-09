"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexFleetActionsForHost = exports.deleteIndexedFleetActions = void 0;

var _common = require("../../../../fleet/common");

var _fleet_action_generator = require("../data_generators/fleet_action_generator");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const defaultFleetActionGenerator = new _fleet_action_generator.FleetActionGenerator();
/**
 * Indexes a randome number of Endpoint (via Fleet) Actions for a given host
 * (NOTE: ensure that fleet is setup first before calling this loading function)
 *
 * @param esClient
 * @param endpointHost
 * @param [fleetActionGenerator]
 */

const indexFleetActionsForHost = async (esClient, endpointHost, fleetActionGenerator = defaultFleetActionGenerator) => {
  const ES_INDEX_OPTIONS = {
    headers: {
      'X-elastic-product-origin': 'fleet'
    }
  };
  const agentId = endpointHost.elastic.agent.id;
  const total = fleetActionGenerator.randomN(5);
  const response = {
    actions: [],
    actionResponses: [],
    actionsIndex: _common.AGENT_ACTIONS_INDEX,
    responsesIndex: _common.AGENT_ACTIONS_RESULTS_INDEX
  };

  for (let i = 0; i < total; i++) {
    // create an action
    const action = fleetActionGenerator.generate({
      data: {
        comment: 'data generator: this host is bad'
      }
    });
    action.agents = [agentId];
    esClient.index({
      index: _common.AGENT_ACTIONS_INDEX,
      body: action
    }, ES_INDEX_OPTIONS).catch(_utils.wrapErrorAndRejectPromise); // Create an action response for the above

    const actionResponse = fleetActionGenerator.generateResponse({
      action_id: action.action_id,
      agent_id: agentId,
      action_response: {
        endpoint: {
          // add ack to 4/5th of fleet response
          ack: fleetActionGenerator.randomFloat() < 0.8 ? true : undefined
        }
      }
    });
    esClient.index({
      index: _common.AGENT_ACTIONS_RESULTS_INDEX,
      body: actionResponse
    }, ES_INDEX_OPTIONS).catch(_utils.wrapErrorAndRejectPromise);
    response.actions.push(action);
    response.actionResponses.push(actionResponse);
  } // Add edge cases (maybe)


  if (fleetActionGenerator.randomFloat() < 0.3) {
    const randomFloat = fleetActionGenerator.randomFloat(); // 60% of the time just add either an Isolate -OR- an UnIsolate action

    if (randomFloat < 0.6) {
      let action;

      if (randomFloat < 0.3) {
        // add a pending isolation
        action = fleetActionGenerator.generateIsolateAction({
          '@timestamp': new Date().toISOString()
        });
      } else {
        // add a pending UN-isolation
        action = fleetActionGenerator.generateUnIsolateAction({
          '@timestamp': new Date().toISOString()
        });
      }

      action.agents = [agentId];
      await esClient.index({
        index: _common.AGENT_ACTIONS_INDEX,
        body: action
      }, ES_INDEX_OPTIONS).catch(_utils.wrapErrorAndRejectPromise);
      response.actions.push(action);
    } else {
      // Else (40% of the time) add a pending isolate AND pending un-isolate
      const action1 = fleetActionGenerator.generateIsolateAction({
        '@timestamp': new Date().toISOString()
      });
      const action2 = fleetActionGenerator.generateUnIsolateAction({
        '@timestamp': new Date().toISOString()
      });
      action1.agents = [agentId];
      action2.agents = [agentId];
      await Promise.all([esClient.index({
        index: _common.AGENT_ACTIONS_INDEX,
        body: action1
      }, ES_INDEX_OPTIONS).catch(_utils.wrapErrorAndRejectPromise), esClient.index({
        index: _common.AGENT_ACTIONS_INDEX,
        body: action2
      }, ES_INDEX_OPTIONS).catch(_utils.wrapErrorAndRejectPromise)]);
      response.actions.push(action1, action2);
    }
  }

  return response;
};

exports.indexFleetActionsForHost = indexFleetActionsForHost;

const deleteIndexedFleetActions = async (esClient, indexedData) => {
  const response = {
    actions: undefined,
    responses: undefined
  };

  if (indexedData.actions.length) {
    response.actions = (await esClient.deleteByQuery({
      index: `${indexedData.actionsIndex}-*`,
      wait_for_completion: true,
      body: {
        query: {
          bool: {
            filter: [{
              terms: {
                action_id: indexedData.actions.map(action => action.action_id)
              }
            }]
          }
        }
      }
    }).catch(_utils.wrapErrorAndRejectPromise)).body;
  }

  if (indexedData.actionResponses) {
    response.responses = (await esClient.deleteByQuery({
      index: `${indexedData.responsesIndex}-*`,
      wait_for_completion: true,
      body: {
        query: {
          bool: {
            filter: [{
              terms: {
                action_id: indexedData.actionResponses.map(action => action.action_id)
              }
            }]
          }
        }
      }
    }).catch(_utils.wrapErrorAndRejectPromise)).body;
  }

  return response;
};

exports.deleteIndexedFleetActions = deleteIndexedFleetActions;