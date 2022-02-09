"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPendingActionCounts = exports.getAuditLogResponse = void 0;

var _common = require("../../../../fleet/common");

var _constants = require("../../../common/endpoint/constants");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const PENDING_ACTION_RESPONSE_MAX_LAPSED_TIME = 300000; // 300k ms === 5 minutes

const getAuditLogResponse = async ({
  elasticAgentId,
  page,
  pageSize,
  startDate,
  endDate,
  context,
  logger
}) => {
  const size = Math.floor(pageSize / 2);
  const from = page <= 1 ? 0 : page * size - size + 1;
  const data = await getActivityLog({
    context,
    from,
    size,
    startDate,
    endDate,
    elasticAgentId,
    logger
  });
  return {
    page,
    pageSize,
    startDate,
    endDate,
    data
  };
};

exports.getAuditLogResponse = getAuditLogResponse;

const getActivityLog = async ({
  context,
  size,
  from,
  startDate,
  endDate,
  elasticAgentId,
  logger
}) => {
  var _actionsResult, _responsesResult, _responsesResult$body, _responsesResult$body2, _actionsResult2, _actionsResult2$body, _actionsResult2$body$;

  let actionsResult;
  let responsesResult;

  try {
    // fetch actions with matching agent_id
    const {
      actionIds,
      actionRequests
    } = await (0, _utils.getActionRequestsResult)({
      context,
      logger,
      elasticAgentId,
      startDate,
      endDate,
      size,
      from
    });
    actionsResult = actionRequests; // fetch responses with matching unique set of `action_id`s

    responsesResult = await (0, _utils.getActionResponsesResult)({
      actionIds: [...new Set(actionIds)],
      // de-dupe `action_id`s
      context,
      logger,
      elasticAgentId,
      startDate,
      endDate
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }

  if (((_actionsResult = actionsResult) === null || _actionsResult === void 0 ? void 0 : _actionsResult.statusCode) !== 200) {
    logger.error(`Error fetching actions log for agent_id ${elasticAgentId}`);
    throw new Error(`Error fetching actions log for agent_id ${elasticAgentId}`);
  } // label record as `action`, `fleetAction`


  const responses = (0, _utils.categorizeResponseResults)({
    results: (_responsesResult = responsesResult) === null || _responsesResult === void 0 ? void 0 : (_responsesResult$body = _responsesResult.body) === null || _responsesResult$body === void 0 ? void 0 : (_responsesResult$body2 = _responsesResult$body.hits) === null || _responsesResult$body2 === void 0 ? void 0 : _responsesResult$body2.hits
  }); // label record as `response`, `fleetResponse`

  const actions = (0, _utils.categorizeActionResults)({
    results: (_actionsResult2 = actionsResult) === null || _actionsResult2 === void 0 ? void 0 : (_actionsResult2$body = _actionsResult2.body) === null || _actionsResult2$body === void 0 ? void 0 : (_actionsResult2$body$ = _actionsResult2$body.hits) === null || _actionsResult2$body$ === void 0 ? void 0 : _actionsResult2$body$.hits
  }); // filter out the duplicate endpoint actions that also have fleetActions
  // include endpoint actions that have no fleet actions

  const uniqueLogData = (0, _utils.getUniqueLogData)([...responses, ...actions]); // sort by @timestamp in desc order, newest first

  const sortedData = (0, _utils.getTimeSortedData)(uniqueLogData);
  return sortedData;
};

const hasAckInResponse = response => {
  var _response$action_resp, _response$action_resp2, _response$action_resp3;

  return (_response$action_resp = (_response$action_resp2 = response.action_response) === null || _response$action_resp2 === void 0 ? void 0 : (_response$action_resp3 = _response$action_resp2.endpoint) === null || _response$action_resp3 === void 0 ? void 0 : _response$action_resp3.ack) !== null && _response$action_resp !== void 0 ? _response$action_resp : false;
}; // return TRUE if for given action_id/agent_id
// there is no doc in .logs-endpoint.action.response-default


const hasNoEndpointResponse = ({
  action,
  agentId,
  indexedActionIds
}) => {
  return action.agents.includes(agentId) && !indexedActionIds.includes(action.action_id);
}; // return TRUE if for given action_id/agent_id
// there is no doc in .fleet-actions-results


const hasNoFleetResponse = ({
  action,
  agentId,
  agentResponses
}) => {
  return action.agents.includes(agentId) && !agentResponses.map(e => e.action_id).includes(action.action_id);
};

const getPendingActionCounts = async (esClient, metadataService, agentIDs, isPendingActionResponsesWithAckEnabled) => {
  // retrieve the unexpired actions for the given hosts
  const recentActions = await esClient.search({
    index: _common.AGENT_ACTIONS_INDEX,
    size: 10000,
    from: 0,
    body: {
      query: {
        bool: {
          filter: [{
            term: {
              type: 'INPUT_ACTION'
            }
          }, // actions that are directed at agent children
          {
            term: {
              input_type: 'endpoint'
            }
          }, // filter for agent->endpoint actions
          {
            range: {
              expiration: {
                gte: 'now'
              }
            }
          }, // that have not expired yet
          {
            terms: {
              agents: agentIDs
            }
          } // for the requested agent IDs
          ]
        }
      }
    }
  }, {
    ignore: [404]
  }) // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  .then(result => {
    var _result$body, _result$body$hits, _result$body$hits$hit;

    return ((_result$body = result.body) === null || _result$body === void 0 ? void 0 : (_result$body$hits = _result$body.hits) === null || _result$body$hits === void 0 ? void 0 : (_result$body$hits$hit = _result$body$hits.hits) === null || _result$body$hits$hit === void 0 ? void 0 : _result$body$hits$hit.map(a => a._source)) || [];
  }).catch(_utils.catchAndWrapError); // retrieve any responses to those action IDs from these agents

  const responses = await fetchActionResponses(esClient, metadataService, recentActions.map(a => a.action_id), agentIDs);
  const pending = [];

  for (const agentId of agentIDs) {
    const agentResponses = responses[agentId]; // get response actionIds for responses with ACKs

    const ackResponseActionIdList = agentResponses.filter(hasAckInResponse).map(response => response.action_id); // actions Ids that are indexed in new response index

    const indexedActionIds = await hasEndpointResponseDoc({
      agentId,
      actionIds: ackResponseActionIdList,
      esClient
    });
    const pendingActions = recentActions.filter(action => {
      return ackResponseActionIdList.includes(action.action_id) // if has ack
      ? hasNoEndpointResponse({
        action,
        agentId,
        indexedActionIds
      }) // then find responses in new index
      : hasNoFleetResponse({
        // else use the legacy way
        action,
        agentId,
        agentResponses
      });
    });
    pending.push({
      agent_id: agentId,
      pending_actions: pendingActions.map(a => a.data.command).reduce((acc, cur) => {
        if (!isPendingActionResponsesWithAckEnabled) {
          acc[cur] = 0; // set pending counts to 0 when FF is disabled
        } else {
          // else do the usual counting
          if (cur in acc) {
            acc[cur] += 1;
          } else {
            acc[cur] = 1;
          }
        }

        return acc;
      }, {})
    });
  }

  return pending;
};
/**
 * Returns a string of action ids for search result
 *
 * @param esClient
 * @param actionIds
 * @param agentId
 */


exports.getPendingActionCounts = getPendingActionCounts;

const hasEndpointResponseDoc = async ({
  actionIds,
  agentId,
  esClient
}) => {
  const response = await esClient.search({
    index: _constants.ENDPOINT_ACTION_RESPONSES_INDEX,
    size: 10000,
    body: {
      query: {
        bool: {
          filter: [{
            terms: {
              action_id: actionIds
            }
          }, {
            term: {
              agent_id: agentId
            }
          }]
        }
      }
    }
  }, {
    ignore: [404]
  }).then(result => {
    var _result$body2, _result$body2$hits, _result$body2$hits$hi;

    return ((_result$body2 = result.body) === null || _result$body2 === void 0 ? void 0 : (_result$body2$hits = _result$body2.hits) === null || _result$body2$hits === void 0 ? void 0 : (_result$body2$hits$hi = _result$body2$hits.hits) === null || _result$body2$hits$hi === void 0 ? void 0 : _result$body2$hits$hi.map(a => {
      var _a$_source;

      return (_a$_source = a._source) === null || _a$_source === void 0 ? void 0 : _a$_source.EndpointActions.action_id;
    })) || [];
  }).catch(_utils.catchAndWrapError);
  return response.filter(action => action !== undefined);
};
/**
 * Returns back a map of elastic Agent IDs to array of action responses that have a response.
 *
 * @param esClient
 * @param metadataService
 * @param actionIds
 * @param agentIds
 */


const fetchActionResponses = async (esClient, metadataService, actionIds, agentIds) => {
  const actionResponsesByAgentId = agentIds.reduce((acc, agentId) => {
    acc[agentId] = [];
    return acc;
  }, {});
  const actionResponses = await esClient.search({
    index: _common.AGENT_ACTIONS_RESULTS_INDEX,
    size: 10000,
    from: 0,
    body: {
      query: {
        bool: {
          filter: [{
            terms: {
              action_id: actionIds
            }
          }, // get results for these actions
          {
            terms: {
              agent_id: agentIds
            }
          } // ONLY responses for the agents we are interested in (ignore others)
          ]
        }
      }
    }
  }, {
    ignore: [404]
  }) // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  .then(result => {
    var _result$body3, _result$body3$hits, _result$body3$hits$hi;

    return ((_result$body3 = result.body) === null || _result$body3 === void 0 ? void 0 : (_result$body3$hits = _result$body3.hits) === null || _result$body3$hits === void 0 ? void 0 : (_result$body3$hits$hi = _result$body3$hits.hits) === null || _result$body3$hits$hi === void 0 ? void 0 : _result$body3$hits$hi.map(a => a._source)) || [];
  }).catch(_utils.catchAndWrapError);

  if (actionResponses.length === 0) {
    return actionResponsesByAgentId;
  } // Get the latest docs from the metadata data-stream for the Elastic Agent IDs in the action responses
  // This will be used determine if we should withhold the action id from the returned list in cases where
  // the Endpoint might not yet have sent an updated metadata document (which would be representative of
  // the state of the endpoint post-action)


  const latestEndpointMetadataDocs = await metadataService.findHostMetadataForFleetAgents(esClient, agentIds); // Object of Elastic Agent Ids to event created date

  const endpointLastEventCreated = latestEndpointMetadataDocs.reduce((acc, endpointMetadata) => {
    acc[endpointMetadata.elastic.agent.id] = new Date(endpointMetadata.event.created);
    return acc;
  }, {});

  for (const actionResponse of actionResponses) {
    const lastEndpointMetadataEventTimestamp = endpointLastEventCreated[actionResponse.agent_id];
    const actionCompletedAtTimestamp = new Date(actionResponse.completed_at); // If enough time has lapsed in checking for updated Endpoint metadata doc so that we don't keep
    // checking it forever.
    // It uses the `@timestamp` in order to ensure we are looking at times that were set by the server

    const enoughTimeHasLapsed = Date.now() - new Date(actionResponse['@timestamp']).getTime() > PENDING_ACTION_RESPONSE_MAX_LAPSED_TIME;

    if (!lastEndpointMetadataEventTimestamp || enoughTimeHasLapsed || lastEndpointMetadataEventTimestamp > actionCompletedAtTimestamp) {
      actionResponsesByAgentId[actionResponse.agent_id].push(actionResponse);
    }
  }

  return actionResponsesByAgentId;
};