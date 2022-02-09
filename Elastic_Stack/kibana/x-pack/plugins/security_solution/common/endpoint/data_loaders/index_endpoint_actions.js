"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexEndpointActionsForHost = exports.deleteIndexedEndpointActions = void 0;

var _endpoint_action_generator = require("../data_generators/endpoint_action_generator");

var _utils = require("./utils");

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const defaultEndpointActionGenerator = new _endpoint_action_generator.EndpointActionGenerator();
/**
 * Indexes a random number of Endpoint Actions for a given host
 *
 * @param esClient
 * @param endpointHost
 * @param [endpointActionGenerator]
 */

const indexEndpointActionsForHost = async (esClient, endpointHost, endpointActionGenerator = defaultEndpointActionGenerator) => {
  const agentId = endpointHost.elastic.agent.id;
  const total = endpointActionGenerator.randomN(5);
  const response = {
    endpointActions: [],
    endpointActionResponses: [],
    endpointActionsIndex: _constants.ENDPOINT_ACTIONS_INDEX,
    endpointActionResponsesIndex: _constants.ENDPOINT_ACTION_RESPONSES_INDEX
  };

  for (let i = 0; i < total; i++) {
    // create an action
    const action = endpointActionGenerator.generate({
      EndpointActions: {
        data: {
          comment: 'data generator: this host is same as bad'
        }
      }
    });
    action.agent.id = [agentId];
    await esClient.index({
      index: _constants.ENDPOINT_ACTIONS_INDEX,
      body: action
    }).catch(_utils.wrapErrorAndRejectPromise); // Create an action response for the above

    const actionResponse = endpointActionGenerator.generateResponse({
      agent: {
        id: agentId
      },
      EndpointActions: {
        action_id: action.EndpointActions.action_id,
        data: action.EndpointActions.data
      }
    });
    await esClient.index({
      index: _constants.ENDPOINT_ACTION_RESPONSES_INDEX,
      body: actionResponse
    }).catch(_utils.wrapErrorAndRejectPromise);
    response.endpointActions.push(action);
    response.endpointActionResponses.push(actionResponse);
  } // Add edge cases (maybe)


  if (endpointActionGenerator.randomFloat() < 0.3) {
    const randomFloat = endpointActionGenerator.randomFloat(); // 60% of the time just add either an Isolate -OR- an UnIsolate action

    if (randomFloat < 0.6) {
      let action;

      if (randomFloat < 0.3) {
        // add a pending isolation
        action = endpointActionGenerator.generateIsolateAction({
          '@timestamp': new Date().toISOString()
        });
      } else {
        // add a pending UN-isolation
        action = endpointActionGenerator.generateUnIsolateAction({
          '@timestamp': new Date().toISOString()
        });
      }

      action.agent.id = [agentId];
      await esClient.index({
        index: _constants.ENDPOINT_ACTIONS_INDEX,
        body: action
      }).catch(_utils.wrapErrorAndRejectPromise);
      response.endpointActions.push(action);
    } else {
      // Else (40% of the time) add a pending isolate AND pending un-isolate
      const action1 = endpointActionGenerator.generateIsolateAction({
        '@timestamp': new Date().toISOString()
      });
      const action2 = endpointActionGenerator.generateUnIsolateAction({
        '@timestamp': new Date().toISOString()
      });
      action1.agent.id = [agentId];
      action2.agent.id = [agentId];
      await Promise.all([esClient.index({
        index: _constants.ENDPOINT_ACTIONS_INDEX,
        body: action1
      }).catch(_utils.wrapErrorAndRejectPromise), esClient.index({
        index: _constants.ENDPOINT_ACTIONS_INDEX,
        body: action2
      }).catch(_utils.wrapErrorAndRejectPromise)]);
      response.endpointActions.push(action1, action2);
    }
  }

  return response;
};

exports.indexEndpointActionsForHost = indexEndpointActionsForHost;

const deleteIndexedEndpointActions = async (esClient, indexedData) => {
  const response = {
    endpointActionRequests: undefined,
    endpointActionResponses: undefined
  };

  if (indexedData.endpointActions.length) {
    response.endpointActionRequests = (await esClient.deleteByQuery({
      index: `${indexedData.endpointActionsIndex}-*`,
      wait_for_completion: true,
      body: {
        query: {
          bool: {
            filter: [{
              terms: {
                action_id: indexedData.endpointActions.map(action => action.EndpointActions.action_id)
              }
            }]
          }
        }
      }
    }).catch(_utils.wrapErrorAndRejectPromise)).body;
  }

  if (indexedData.endpointActionResponses) {
    response.endpointActionResponses = (await esClient.deleteByQuery({
      index: `${indexedData.endpointActionResponsesIndex}-*`,
      wait_for_completion: true,
      body: {
        query: {
          bool: {
            filter: [{
              terms: {
                action_id: indexedData.endpointActionResponses.map(action => action.EndpointActions.action_id)
              }
            }]
          }
        }
      }
    }).catch(_utils.wrapErrorAndRejectPromise)).body;
  }

  return response;
};

exports.deleteIndexedEndpointActions = deleteIndexedEndpointActions;