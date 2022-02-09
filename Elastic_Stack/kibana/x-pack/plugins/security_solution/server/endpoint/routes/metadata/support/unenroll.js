"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAllUnenrolledAgentIds = findAllUnenrolledAgentIds;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function findAllUnenrolledAgentIds(agentService, esClient, endpointPolicyIds, pageSize = 1000) {
  // We want:
  // 1.  if no endpoint policies exist, then get all Agents
  // 2.  if we have a list of agent policies, then Agents that are Active and that are
  //      NOT enrolled with an Agent Policy that has endpoint
  const kuery = endpointPolicyIds.length > 0 ? `(active : false) OR (active: true AND NOT policy_id:("${endpointPolicyIds.join('" OR "')}"))` : undefined;

  const searchOptions = pageNum => {
    return {
      page: pageNum,
      perPage: pageSize,
      showInactive: true,
      kuery
    };
  };

  let page = 1;
  const result = [];
  let hasMore = true;

  while (hasMore) {
    const unenrolledAgents = await agentService.listAgents(esClient, searchOptions(page++));
    result.push(...unenrolledAgents.agents.map(agent => agent.id));
    hasMore = unenrolledAgents.agents.length > 0;
  }

  return result;
}