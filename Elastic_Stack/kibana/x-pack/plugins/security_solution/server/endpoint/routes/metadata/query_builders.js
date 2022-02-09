"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetadataSortMethod = void 0;
exports.buildUnitedIndexQuery = buildUnitedIndexQuery;
exports.getESQueryHostMetadataByFleetAgentIds = getESQueryHostMetadataByFleetAgentIds;
exports.getESQueryHostMetadataByID = getESQueryHostMetadataByID;
exports.getESQueryHostMetadataByIDs = getESQueryHostMetadataByIDs;
exports.kibanaRequestToMetadataListESQuery = kibanaRequestToMetadataListESQuery;

var _esQuery = require("@kbn/es-query");

var _constants = require("../../../../common/endpoint/constants");

var _agent_status = require("./support/agent_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// sort using either event.created, or HostDetails.event.created,
// depending on whichever exists. This works for QueryStrat v1 and v2, and the v2+ schema change.
// using unmapped_type avoids errors when the given field doesn't exist, and sets to the 0-value for that type
// effectively ignoring it
// https://www.elastic.co/guide/en/elasticsearch/reference/current/sort-search-results.html#_ignoring_unmapped_fields


const MetadataSortMethod = [{
  'event.created': {
    order: 'desc',
    unmapped_type: 'date'
  }
}, {
  'HostDetails.event.created': {
    order: 'desc',
    unmapped_type: 'date'
  }
}];
exports.MetadataSortMethod = MetadataSortMethod;

async function kibanaRequestToMetadataListESQuery( // eslint-disable-next-line @typescript-eslint/no-explicit-any
request, endpointAppContext, queryBuilderOptions) {
  const pagingProperties = await getPagingProperties(request, endpointAppContext);
  return {
    body: {
      query: buildQueryBody(request, queryBuilderOptions === null || queryBuilderOptions === void 0 ? void 0 : queryBuilderOptions.unenrolledAgentIds, queryBuilderOptions === null || queryBuilderOptions === void 0 ? void 0 : queryBuilderOptions.statusAgentIds),
      track_total_hits: true,
      sort: MetadataSortMethod
    },
    from: pagingProperties.pageIndex * pagingProperties.pageSize,
    size: pagingProperties.pageSize,
    index: _constants.metadataCurrentIndexPattern
  };
}

async function getPagingProperties( // eslint-disable-next-line @typescript-eslint/no-explicit-any
request, endpointAppContext) {
  var _request$body;

  const config = await endpointAppContext.config();
  const pagingProperties = {};

  if (request !== null && request !== void 0 && (_request$body = request.body) !== null && _request$body !== void 0 && _request$body.paging_properties) {
    for (const property of request.body.paging_properties) {
      Object.assign(pagingProperties, ...Object.keys(property).map(key => ({
        [key]: property[key]
      })));
    }
  }

  return {
    pageSize: pagingProperties.page_size || config.endpointResultListDefaultPageSize,
    pageIndex: pagingProperties.page_index || config.endpointResultListDefaultFirstPageIndex
  };
}

function buildQueryBody( // eslint-disable-next-line @typescript-eslint/no-explicit-any
request, unerolledAgentIds, statusAgentIds) {
  var _request$body2, _request$body2$filter; // the filtered properties may be preceded by 'HostDetails' under an older index mapping


  const filterUnenrolledAgents = unerolledAgentIds && unerolledAgentIds.length > 0 ? {
    must_not: [{
      terms: {
        'elastic.agent.id': unerolledAgentIds
      }
    }, // OR
    {
      terms: {
        'HostDetails.elastic.agent.id': unerolledAgentIds
      }
    }]
  } : null;
  const filterStatusAgents = statusAgentIds && statusAgentIds.length ? {
    filter: [{
      bool: {
        // OR's the two together
        should: [{
          terms: {
            'elastic.agent.id': statusAgentIds
          }
        }, {
          terms: {
            'HostDetails.elastic.agent.id': statusAgentIds
          }
        }]
      }
    }]
  } : null;
  const idFilter = {
    bool: { ...filterUnenrolledAgents,
      ...filterStatusAgents
    }
  };

  if (request !== null && request !== void 0 && (_request$body2 = request.body) !== null && _request$body2 !== void 0 && (_request$body2$filter = _request$body2.filters) !== null && _request$body2$filter !== void 0 && _request$body2$filter.kql) {
    const kqlQuery = (0, _esQuery.toElasticsearchQuery)((0, _esQuery.fromKueryExpression)(request.body.filters.kql));
    const q = [];

    if (filterUnenrolledAgents || filterStatusAgents) {
      q.push(idFilter);
    }

    q.push({ ...kqlQuery
    });
    return {
      bool: {
        must: q
      }
    };
  }

  return filterUnenrolledAgents || filterStatusAgents ? idFilter : {
    match_all: {}
  };
}

function getESQueryHostMetadataByID(agentID) {
  return {
    body: {
      query: {
        bool: {
          filter: [{
            bool: {
              should: [{
                term: {
                  'agent.id': agentID
                }
              }, {
                term: {
                  'HostDetails.agent.id': agentID
                }
              }]
            }
          }]
        }
      },
      sort: MetadataSortMethod,
      size: 1
    },
    index: _constants.metadataCurrentIndexPattern
  };
}

function getESQueryHostMetadataByFleetAgentIds(fleetAgentIds) {
  return {
    body: {
      query: {
        bool: {
          filter: [{
            bool: {
              should: [{
                terms: {
                  'elastic.agent.id': fleetAgentIds
                }
              }]
            }
          }]
        }
      },
      sort: MetadataSortMethod
    },
    index: _constants.metadataCurrentIndexPattern
  };
}

function getESQueryHostMetadataByIDs(agentIDs) {
  return {
    body: {
      query: {
        bool: {
          filter: [{
            bool: {
              should: [{
                terms: {
                  'agent.id': agentIDs
                }
              }, {
                terms: {
                  'HostDetails.agent.id': agentIDs
                }
              }]
            }
          }]
        }
      },
      sort: MetadataSortMethod
    },
    index: _constants.metadataCurrentIndexPattern
  };
}

async function buildUnitedIndexQuery( // eslint-disable-next-line @typescript-eslint/no-explicit-any
request, endpointAppContext, ignoredAgentIds, endpointPolicyIds = [] // eslint-disable-next-line @typescript-eslint/no-explicit-any
) {
  var _request$body$filters, _request$body3, _request$body3$filter, _request$body4, _request$body4$filter;

  const pagingProperties = await getPagingProperties(request, endpointAppContext);
  const statusesToFilter = (_request$body$filters = request === null || request === void 0 ? void 0 : (_request$body3 = request.body) === null || _request$body3 === void 0 ? void 0 : (_request$body3$filter = _request$body3.filters) === null || _request$body3$filter === void 0 ? void 0 : _request$body3$filter.host_status) !== null && _request$body$filters !== void 0 ? _request$body$filters : [];
  const statusesKuery = (0, _agent_status.buildStatusesKuery)(statusesToFilter);
  const filterIgnoredAgents = ignoredAgentIds && ignoredAgentIds.length > 0 ? {
    must_not: {
      terms: {
        'agent.id': ignoredAgentIds
      }
    }
  } : null;
  const filterEndpointPolicyAgents = {
    filter: [// must contain an endpoint policy id
    {
      terms: {
        'united.agent.policy_id': endpointPolicyIds
      }
    }, // doc contains both agent and metadata
    {
      exists: {
        field: 'united.endpoint.agent.id'
      }
    }, {
      exists: {
        field: 'united.agent.agent.id'
      }
    }, // agent is enrolled
    {
      term: {
        'united.agent.active': {
          value: true
        }
      }
    }]
  };
  const idFilter = {
    bool: { ...filterIgnoredAgents,
      ...filterEndpointPolicyAgents
    }
  }; // eslint-disable-next-line @typescript-eslint/no-explicit-any

  let query = filterIgnoredAgents || filterEndpointPolicyAgents ? idFilter : {
    match_all: {}
  };

  if (statusesKuery || request !== null && request !== void 0 && (_request$body4 = request.body) !== null && _request$body4 !== void 0 && (_request$body4$filter = _request$body4.filters) !== null && _request$body4$filter !== void 0 && _request$body4$filter.kql) {
    const kqlQuery = (0, _esQuery.toElasticsearchQuery)((0, _esQuery.fromKueryExpression)(request.body.filters.kql));
    const q = [];

    if (filterIgnoredAgents || filterEndpointPolicyAgents) {
      q.push(idFilter);
    }

    if (statusesKuery) {
      q.push((0, _esQuery.toElasticsearchQuery)((0, _esQuery.fromKueryExpression)(statusesKuery)));
    }

    q.push({ ...kqlQuery
    });
    query = {
      bool: {
        must: q
      }
    };
  }

  return {
    body: {
      query,
      track_total_hits: true,
      sort: MetadataSortMethod
    },
    from: pagingProperties.pageIndex * pagingProperties.pageSize,
    size: pagingProperties.pageSize,
    index: _constants.METADATA_UNITED_INDEX
  };
}