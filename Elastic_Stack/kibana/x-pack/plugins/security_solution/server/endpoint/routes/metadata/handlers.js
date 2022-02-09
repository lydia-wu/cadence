"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enrichHostMetadata = enrichHostMetadata;
exports.getHostData = getHostData;
exports.getHostMetaData = getHostMetaData;
exports.getMetadataRequestHandler = exports.getMetadataListRequestHandler = exports.getLogger = void 0;
exports.mapToHostResultList = mapToHostResultList;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _types = require("../../../../common/endpoint/types");

var _query_builders = require("./query_builders");

var _server = require("../../../../../fleet/server");

var _unenroll = require("./support/unenroll");

var _endpoint_package_policies = require("./support/endpoint_package_policies");

var _agent_status = require("./support/agent_status");

var _utils = require("../../utils");

var _query_strategies = require("./support/query_strategies");

var _errors = require("../../errors");

var _metadata = require("../../services/metadata");

var _agent_status2 = require("../../../../../fleet/common/services/agent_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * 00000000-0000-0000-0000-000000000000 is initial Elastic Agent id sent by Endpoint before policy is configured
 * 11111111-1111-1111-1111-111111111111 is Elastic Agent id sent by Endpoint when policy does not contain an id
 */


const IGNORED_ELASTIC_AGENT_IDS = ['00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'];

const getLogger = endpointAppContext => {
  return endpointAppContext.logFactory.get('metadata');
};

exports.getLogger = getLogger;

const errorHandler = (logger, res, error) => {
  var _error$output;

  if (error instanceof _errors.NotFoundError) {
    return res.notFound({
      body: error
    });
  }

  if (error instanceof _metadata.EndpointHostUnEnrolledError) {
    return res.badRequest({
      body: error
    });
  } // legacy check for Boom errors. for the errors around non-standard error properties
  // @ts-expect-error TS2339


  const boomStatusCode = error.isBoom && (error === null || error === void 0 ? void 0 : (_error$output = error.output) === null || _error$output === void 0 ? void 0 : _error$output.statusCode);

  if (boomStatusCode) {
    return res.customError({
      statusCode: boomStatusCode,
      body: error
    });
  } // Kibana CORE will take care of `500` errors when the handler `throw`'s, including logging the error


  throw error;
};

const getMetadataListRequestHandler = function (endpointAppContext, logger) {
  return async (context, request, response) => {
    const agentService = endpointAppContext.service.getAgentService();

    if (agentService === undefined) {
      throw new Error('agentService not available');
    }

    const endpointPolicies = await (0, _endpoint_package_policies.getAllEndpointPackagePolicies)( // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    endpointAppContext.service.getPackagePolicyService(), context.core.savedObjects.client);
    const {
      unitedIndexExists,
      unitedQueryResponse
    } = await queryUnitedIndex(context, request, endpointAppContext, logger, endpointPolicies);

    if (unitedIndexExists) {
      return response.ok({
        body: unitedQueryResponse
      });
    }

    return response.ok({
      body: await legacyListMetadataQuery(context, request, endpointAppContext, logger, endpointPolicies)
    });
  };
};

exports.getMetadataListRequestHandler = getMetadataListRequestHandler;

const getMetadataRequestHandler = function (endpointAppContext, logger) {
  return async (context, request, response) => {
    const endpointMetadataService = endpointAppContext.service.getEndpointMetadataService();

    try {
      return response.ok({
        body: await endpointMetadataService.getEnrichedHostMetadata(context.core.elasticsearch.client.asCurrentUser, request.params.id)
      });
    } catch (error) {
      return errorHandler(logger, response, error);
    }
  };
};

exports.getMetadataRequestHandler = getMetadataRequestHandler;

async function getHostMetaData(metadataRequestContext, id) {
  var _metadataRequestConte, _metadataRequestConte2, _metadataRequestConte3, _metadataRequestConte4;

  if (!metadataRequestContext.esClient && !((_metadataRequestConte = metadataRequestContext.requestHandlerContext) !== null && _metadataRequestConte !== void 0 && _metadataRequestConte.core.elasticsearch.client)) {
    throw _boom.default.badRequest('esClient not found');
  }

  if (!metadataRequestContext.savedObjectsClient && !((_metadataRequestConte2 = metadataRequestContext.requestHandlerContext) !== null && _metadataRequestConte2 !== void 0 && _metadataRequestConte2.core.savedObjects)) {
    throw _boom.default.badRequest('savedObjectsClient not found');
  }

  const esClient = (_metadataRequestConte3 = metadataRequestContext === null || metadataRequestContext === void 0 ? void 0 : metadataRequestContext.esClient) !== null && _metadataRequestConte3 !== void 0 ? _metadataRequestConte3 : (_metadataRequestConte4 = metadataRequestContext.requestHandlerContext) === null || _metadataRequestConte4 === void 0 ? void 0 : _metadataRequestConte4.core.elasticsearch.client;
  const query = (0, _query_builders.getESQueryHostMetadataByID)(id);
  const response = await esClient.asCurrentUser.search(query).catch(_utils.catchAndWrapError);
  const hostResult = (0, _query_strategies.queryResponseToHostResult)(response.body);
  const hostMetadata = hostResult.result;

  if (!hostMetadata) {
    return undefined;
  }

  return hostMetadata;
}

async function getHostData(metadataRequestContext, id) {
  var _metadataRequestConte5;

  if (!metadataRequestContext.savedObjectsClient) {
    throw _boom.default.badRequest('savedObjectsClient not found');
  }

  if (!metadataRequestContext.esClient && !((_metadataRequestConte5 = metadataRequestContext.requestHandlerContext) !== null && _metadataRequestConte5 !== void 0 && _metadataRequestConte5.core.elasticsearch.client)) {
    throw _boom.default.badRequest('esClient not found');
  }

  const hostMetadata = await getHostMetaData(metadataRequestContext, id);

  if (!hostMetadata) {
    return undefined;
  }

  const agent = await findAgent(metadataRequestContext, hostMetadata);

  if (agent && !agent.active) {
    throw _boom.default.badRequest('the requested endpoint is unenrolled');
  }

  const metadata = await enrichHostMetadata(hostMetadata, metadataRequestContext);
  return metadata;
}

async function findAgent(metadataRequestContext, hostMetadata) {
  try {
    var _metadataRequestConte6, _metadataRequestConte7, _metadataRequestConte8, _metadataRequestConte9, _metadataRequestConte10;

    if (!metadataRequestContext.esClient && !((_metadataRequestConte6 = metadataRequestContext.requestHandlerContext) !== null && _metadataRequestConte6 !== void 0 && _metadataRequestConte6.core.elasticsearch.client)) {
      throw new Error('esClient not found');
    }

    const esClient = (_metadataRequestConte7 = metadataRequestContext === null || metadataRequestContext === void 0 ? void 0 : metadataRequestContext.esClient) !== null && _metadataRequestConte7 !== void 0 ? _metadataRequestConte7 : (_metadataRequestConte8 = metadataRequestContext.requestHandlerContext) === null || _metadataRequestConte8 === void 0 ? void 0 : _metadataRequestConte8.core.elasticsearch.client;
    return await ((_metadataRequestConte9 = metadataRequestContext.endpointAppContextService) === null || _metadataRequestConte9 === void 0 ? void 0 : (_metadataRequestConte10 = _metadataRequestConte9.getAgentService()) === null || _metadataRequestConte10 === void 0 ? void 0 : _metadataRequestConte10.getAgent(esClient.asCurrentUser, hostMetadata.elastic.agent.id));
  } catch (e) {
    if (e instanceof _server.AgentNotFoundError) {
      metadataRequestContext.logger.warn(`agent with id ${hostMetadata.elastic.agent.id} not found`);
      return undefined;
    } else {
      throw e;
    }
  }
}

async function mapToHostResultList( // eslint-disable-next-line @typescript-eslint/no-explicit-any
queryParams, hostListQueryResult, metadataRequestContext) {
  var _hostListQueryResult$, _hostListQueryResult$2;

  const totalNumberOfHosts = hostListQueryResult.resultLength;

  if (((_hostListQueryResult$ = (_hostListQueryResult$2 = hostListQueryResult.resultList) === null || _hostListQueryResult$2 === void 0 ? void 0 : _hostListQueryResult$2.length) !== null && _hostListQueryResult$ !== void 0 ? _hostListQueryResult$ : 0) > 0) {
    return {
      request_page_size: queryParams.size,
      request_page_index: queryParams.from,
      hosts: await Promise.all(hostListQueryResult.resultList.map(async entry => enrichHostMetadata(entry, metadataRequestContext))),
      total: totalNumberOfHosts
    };
  } else {
    return {
      request_page_size: queryParams.size,
      request_page_index: queryParams.from,
      total: totalNumberOfHosts,
      hosts: []
    };
  }
}

async function enrichHostMetadata(hostMetadata, metadataRequestContext) {
  var _hostMetadata$elastic, _hostMetadata$elastic2, _metadataRequestConte13, _metadataRequestConte14, _metadataRequestConte15, _metadataRequestConte16;

  let hostStatus = _types.HostStatus.UNHEALTHY;
  let elasticAgentId = hostMetadata === null || hostMetadata === void 0 ? void 0 : (_hostMetadata$elastic = hostMetadata.elastic) === null || _hostMetadata$elastic === void 0 ? void 0 : (_hostMetadata$elastic2 = _hostMetadata$elastic.agent) === null || _hostMetadata$elastic2 === void 0 ? void 0 : _hostMetadata$elastic2.id;
  const log = metadataRequestContext.logger;

  try {
    var _metadataRequestConte11, _metadataRequestConte12;

    if (!metadataRequestContext.esClient && !((_metadataRequestConte11 = metadataRequestContext.requestHandlerContext) !== null && _metadataRequestConte11 !== void 0 && _metadataRequestConte11.core.elasticsearch.client)) {
      throw new Error('esClient not found');
    }

    if (!metadataRequestContext.savedObjectsClient && !((_metadataRequestConte12 = metadataRequestContext.requestHandlerContext) !== null && _metadataRequestConte12 !== void 0 && _metadataRequestConte12.core.savedObjects)) {
      throw new Error('esSavedObjectClient not found');
    }
  } catch (e) {
    log.error(e);
    throw e;
  }

  const esClient = (_metadataRequestConte13 = metadataRequestContext === null || metadataRequestContext === void 0 ? void 0 : metadataRequestContext.esClient) !== null && _metadataRequestConte13 !== void 0 ? _metadataRequestConte13 : (_metadataRequestConte14 = metadataRequestContext.requestHandlerContext) === null || _metadataRequestConte14 === void 0 ? void 0 : _metadataRequestConte14.core.elasticsearch.client;
  const esSavedObjectClient = (_metadataRequestConte15 = metadataRequestContext === null || metadataRequestContext === void 0 ? void 0 : metadataRequestContext.savedObjectsClient) !== null && _metadataRequestConte15 !== void 0 ? _metadataRequestConte15 : (_metadataRequestConte16 = metadataRequestContext.requestHandlerContext) === null || _metadataRequestConte16 === void 0 ? void 0 : _metadataRequestConte16.core.savedObjects.client;

  try {
    var _metadataRequestConte17, _metadataRequestConte18;
    /**
     * Get agent status by elastic agent id if available or use the endpoint-agent id.
     */


    if (!elasticAgentId) {
      elasticAgentId = hostMetadata.agent.id;
      log.warn(`Missing elastic agent id, using host id instead ${elasticAgentId}`);
    }

    const status = await ((_metadataRequestConte17 = metadataRequestContext.endpointAppContextService) === null || _metadataRequestConte17 === void 0 ? void 0 : (_metadataRequestConte18 = _metadataRequestConte17.getAgentService()) === null || _metadataRequestConte18 === void 0 ? void 0 : _metadataRequestConte18.getAgentStatusById(esClient.asCurrentUser, elasticAgentId)); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    hostStatus = (0, _utils.fleetAgentStatusToEndpointHostStatus)(status);
  } catch (e) {
    if (e instanceof _server.AgentNotFoundError) {
      log.warn(`agent with id ${elasticAgentId} not found`);
    } else {
      log.error(e);
      throw e;
    }
  }

  let policyInfo;

  try {
    var _metadataRequestConte19, _metadataRequestConte20, _metadataRequestConte21;

    const agent = await ((_metadataRequestConte19 = metadataRequestContext.endpointAppContextService) === null || _metadataRequestConte19 === void 0 ? void 0 : (_metadataRequestConte20 = _metadataRequestConte19.getAgentService()) === null || _metadataRequestConte20 === void 0 ? void 0 : _metadataRequestConte20.getAgent(esClient.asCurrentUser, elasticAgentId));
    const agentPolicy = await ((_metadataRequestConte21 = metadataRequestContext.endpointAppContextService.getAgentPolicyService() // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ) === null || _metadataRequestConte21 === void 0 ? void 0 : _metadataRequestConte21.get(esSavedObjectClient, agent === null || agent === void 0 ? void 0 : agent.policy_id, true));
    const endpointPolicy = ((agentPolicy === null || agentPolicy === void 0 ? void 0 : agentPolicy.package_policies) || []).find(policy => {
      var _policy$package;

      return ((_policy$package = policy.package) === null || _policy$package === void 0 ? void 0 : _policy$package.name) === 'endpoint';
    });
    policyInfo = {
      agent: {
        applied: {
          revision: (agent === null || agent === void 0 ? void 0 : agent.policy_revision) || 0,
          id: (agent === null || agent === void 0 ? void 0 : agent.policy_id) || ''
        },
        configured: {
          revision: (agentPolicy === null || agentPolicy === void 0 ? void 0 : agentPolicy.revision) || 0,
          id: (agentPolicy === null || agentPolicy === void 0 ? void 0 : agentPolicy.id) || ''
        }
      },
      endpoint: {
        revision: (endpointPolicy === null || endpointPolicy === void 0 ? void 0 : endpointPolicy.revision) || 0,
        id: (endpointPolicy === null || endpointPolicy === void 0 ? void 0 : endpointPolicy.id) || ''
      }
    };
  } catch (e) {
    // this is a non-vital enrichment of expected policy revisions.
    // if we fail just fetching these, the rest of the endpoint
    // data should still be returned. log the error and move on
    log.error(e);
  }

  return {
    metadata: hostMetadata,
    host_status: hostStatus,
    policy_info: policyInfo
  };
}

async function legacyListMetadataQuery(context, // eslint-disable-next-line @typescript-eslint/no-explicit-any
request, endpointAppContext, logger, endpointPolicies) {
  var _request$body$filters, _request$body, _request$body$filters2; // eslint-disable-next-line @typescript-eslint/no-non-null-assertion


  const agentService = endpointAppContext.service.getAgentService();
  const metadataRequestContext = {
    esClient: context.core.elasticsearch.client,
    endpointAppContextService: endpointAppContext.service,
    logger,
    requestHandlerContext: context,
    savedObjectsClient: context.core.savedObjects.client
  };
  const endpointPolicyIds = endpointPolicies.map(policy => policy.policy_id);
  const unenrolledAgentIds = await (0, _unenroll.findAllUnenrolledAgentIds)(agentService, context.core.elasticsearch.client.asCurrentUser, endpointPolicyIds);
  const statusesToFilter = (_request$body$filters = request === null || request === void 0 ? void 0 : (_request$body = request.body) === null || _request$body === void 0 ? void 0 : (_request$body$filters2 = _request$body.filters) === null || _request$body$filters2 === void 0 ? void 0 : _request$body$filters2.host_status) !== null && _request$body$filters !== void 0 ? _request$body$filters : [];
  const statusIds = await (0, _agent_status.findAgentIdsByStatus)(agentService, context.core.elasticsearch.client.asCurrentUser, statusesToFilter);
  const queryParams = await (0, _query_builders.kibanaRequestToMetadataListESQuery)(request, endpointAppContext, {
    unenrolledAgentIds: unenrolledAgentIds.concat(IGNORED_ELASTIC_AGENT_IDS),
    statusAgentIds: statusIds
  });
  const result = await context.core.elasticsearch.client.asCurrentUser.search(queryParams);
  const hostListQueryResult = (0, _query_strategies.queryResponseToHostListResult)(result.body);
  return mapToHostResultList(queryParams, hostListQueryResult, metadataRequestContext);
}

async function queryUnitedIndex(context, request, endpointAppContext, logger, endpointPolicies) {
  var _unitedMetadataQueryR, _unitedMetadataQueryR2, _await$endpointAppCon, _endpointAppContext$s;

  const endpointPolicyIds = endpointPolicies.map(policy => policy.policy_id);
  const unitedIndexQuery = await (0, _query_builders.buildUnitedIndexQuery)(request, endpointAppContext, IGNORED_ELASTIC_AGENT_IDS, endpointPolicyIds);
  let unitedMetadataQueryResponse;

  try {
    unitedMetadataQueryResponse = await context.core.elasticsearch.client.asCurrentUser.search(unitedIndexQuery);
  } catch (error) {
    var _error$meta$body$erro, _error$meta, _error$meta$body, _error$meta$body$erro2;

    const errorType = (_error$meta$body$erro = error === null || error === void 0 ? void 0 : (_error$meta = error.meta) === null || _error$meta === void 0 ? void 0 : (_error$meta$body = _error$meta.body) === null || _error$meta$body === void 0 ? void 0 : (_error$meta$body$erro2 = _error$meta$body.error) === null || _error$meta$body$erro2 === void 0 ? void 0 : _error$meta$body$erro2.type) !== null && _error$meta$body$erro !== void 0 ? _error$meta$body$erro : ''; // no united index means that the endpoint package hasn't been upgraded yet
    // this is expected so we fall back to the legacy query
    // errors other than index_not_found_exception are unexpected

    if (errorType !== 'index_not_found_exception') {
      logger.error(error);
      throw error;
    }

    return {
      unitedIndexExists: false,
      unitedQueryResponse: {}
    };
  }

  const {
    hits: docs,
    total: docsCount
  } = ((_unitedMetadataQueryR = unitedMetadataQueryResponse) === null || _unitedMetadataQueryR === void 0 ? void 0 : (_unitedMetadataQueryR2 = _unitedMetadataQueryR.body) === null || _unitedMetadataQueryR2 === void 0 ? void 0 : _unitedMetadataQueryR2.hits) || {};
  const agentPolicyIds = docs.map(doc => {
    var _doc$_source$united$a, _doc$_source, _doc$_source$united, _doc$_source$united$a2;

    return (_doc$_source$united$a = (_doc$_source = doc._source) === null || _doc$_source === void 0 ? void 0 : (_doc$_source$united = _doc$_source.united) === null || _doc$_source$united === void 0 ? void 0 : (_doc$_source$united$a2 = _doc$_source$united.agent) === null || _doc$_source$united$a2 === void 0 ? void 0 : _doc$_source$united$a2.policy_id) !== null && _doc$_source$united$a !== void 0 ? _doc$_source$united$a : '';
  });
  const agentPolicies = (_await$endpointAppCon = await ((_endpointAppContext$s = endpointAppContext.service.getAgentPolicyService()) === null || _endpointAppContext$s === void 0 ? void 0 : _endpointAppContext$s.getByIds(context.core.savedObjects.client, agentPolicyIds))) !== null && _await$endpointAppCon !== void 0 ? _await$endpointAppCon : [];
  const agentPoliciesMap = agentPolicies.reduce((acc, agentPolicy) => ({ ...acc,
    [agentPolicy.id]: { ...agentPolicy
    }
  }), {});
  const endpointPoliciesMap = endpointPolicies.reduce((acc, packagePolicy) => ({ ...acc,
    [packagePolicy.policy_id]: packagePolicy
  }), {});
  const hosts = docs.filter(doc => {
    var _doc$_source$united2, _doc$_source2;

    const {
      endpoint: metadata,
      agent
    } = (_doc$_source$united2 = doc === null || doc === void 0 ? void 0 : (_doc$_source2 = doc._source) === null || _doc$_source2 === void 0 ? void 0 : _doc$_source2.united) !== null && _doc$_source$united2 !== void 0 ? _doc$_source$united2 : {};
    return metadata && agent;
  }).map(doc => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const {
      endpoint: metadata,
      agent
    } = doc._source.united; // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    const agentPolicy = agentPoliciesMap[agent.policy_id]; // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    const endpointPolicy = endpointPoliciesMap[agent.policy_id];
    const fleetAgentStatus = (0, _agent_status2.getAgentStatus)(agent);
    return {
      metadata,
      host_status: (0, _utils.fleetAgentStatusToEndpointHostStatus)(fleetAgentStatus),
      policy_info: {
        agent: {
          applied: {
            id: agent.policy_id || '',
            revision: agent.policy_revision || 0
          },
          configured: {
            id: (agentPolicy === null || agentPolicy === void 0 ? void 0 : agentPolicy.id) || '',
            revision: (agentPolicy === null || agentPolicy === void 0 ? void 0 : agentPolicy.revision) || 0
          }
        },
        endpoint: {
          id: (endpointPolicy === null || endpointPolicy === void 0 ? void 0 : endpointPolicy.id) || '',
          revision: (endpointPolicy === null || endpointPolicy === void 0 ? void 0 : endpointPolicy.revision) || 0
        }
      }
    };
  });
  const unitedQueryResponse = {
    request_page_size: unitedIndexQuery.size,
    request_page_index: unitedIndexQuery.from,
    total: docsCount.value,
    hosts
  };
  return {
    unitedIndexExists: true,
    unitedQueryResponse
  };
}