"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildStatusesKuery = buildStatusesKuery;
exports.findAgentIdsByStatus = findAgentIdsByStatus;

var _services = require("../../../../../../fleet/common/services");

var _types = require("../../../../../common/endpoint/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getStatusQueryMap = (path = '') => new Map([[_types.HostStatus.HEALTHY.toString(), _services.AgentStatusKueryHelper.buildKueryForOnlineAgents(path)], [_types.HostStatus.OFFLINE.toString(), _services.AgentStatusKueryHelper.buildKueryForOfflineAgents(path)], [_types.HostStatus.UNHEALTHY.toString(), _services.AgentStatusKueryHelper.buildKueryForErrorAgents(path)], [_types.HostStatus.UPDATING.toString(), _services.AgentStatusKueryHelper.buildKueryForUpdatingAgents(path)], [_types.HostStatus.INACTIVE.toString(), _services.AgentStatusKueryHelper.buildKueryForInactiveAgents(path)]]);

function buildStatusesKuery(statusesToFilter) {
  if (!statusesToFilter.length) {
    return;
  }

  const STATUS_QUERY_MAP = getStatusQueryMap('united.agent.');
  const statusQueries = statusesToFilter.map(status => STATUS_QUERY_MAP.get(status));

  if (!statusQueries.length) {
    return;
  }

  return `(${statusQueries.join(' OR ')})`;
}

async function findAgentIdsByStatus(agentService, esClient, statuses, pageSize = 1000) {
  if (!statuses.length) {
    return [];
  }

  const STATUS_QUERY_MAP = getStatusQueryMap();
  const helpers = statuses.map(s => STATUS_QUERY_MAP.get(s));

  const searchOptions = pageNum => {
    return {
      page: pageNum,
      perPage: pageSize,
      showInactive: true,
      kuery: `(packages : "endpoint" AND (${helpers.join(' OR ')}))`
    };
  };

  let page = 1;
  const result = [];
  let hasMore = true;

  while (hasMore) {
    const agents = await agentService.listAgents(esClient, searchOptions(page++));
    result.push(...agents.agents.map(agent => agent.id));
    hasMore = agents.agents.length > 0;
  }

  return result;
}