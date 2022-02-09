"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHostEndpoint = exports.formatHostItem = exports.buildFieldsTermAggregation = exports.HOST_FIELDS = void 0;

var _fp = require("@elastic/safer-lodash-set/fp");

var _fp2 = require("lodash/fp");

var _ecs_fields = require("../../../../../../common/ecs/ecs_fields");

var _common = require("../../../../../../common/search_strategy/common");

var _to_array = require("../../../../../../common/utils/to_array");

var _services = require("../../../../../endpoint/services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const HOST_FIELDS = ['_id', 'host.architecture', 'host.id', 'host.ip', 'host.id', 'host.mac', 'host.name', 'host.os.family', 'host.os.name', 'host.os.platform', 'host.os.version', 'host.type', 'cloud.instance.id', 'cloud.machine.type', 'cloud.provider', 'cloud.region', 'endpoint.endpointPolicy', 'endpoint.policyStatus', 'endpoint.sensorVersion', 'agent.type', 'endpoint.id'];
exports.HOST_FIELDS = HOST_FIELDS;

const buildFieldsTermAggregation = esFields => esFields.reduce((res, field) => ({ ...res,
  ...getTermsAggregationTypeFromField(field)
}), {});

exports.buildFieldsTermAggregation = buildFieldsTermAggregation;

const getTermsAggregationTypeFromField = field => {
  if (field === 'host.ip') {
    return {
      host_ip: {
        terms: {
          script: {
            // We might be able to remove this when PR is fixed in Elasticsearch: https://github.com/elastic/elasticsearch/issues/72276
            // Currently we cannot use "value_type" with an aggregation when we have a mapping conflict which is why this painless script exists
            // See public ticket: https://github.com/elastic/kibana/pull/78912
            // See private ticket: https://github.com/elastic/security-team/issues/333
            // for more details on the use cases and causes of the conflicts and why this is here.
            source: "doc['host.ip']",
            lang: 'painless'
          },
          size: 10,
          order: {
            timestamp: _common.Direction.desc
          }
        },
        aggs: {
          timestamp: {
            max: {
              field: '@timestamp'
            }
          }
        }
      }
    };
  }

  return {
    [field.replace(/\./g, '_')]: {
      terms: {
        field,
        size: 10,
        order: {
          timestamp: _common.Direction.desc
        }
      },
      aggs: {
        timestamp: {
          max: {
            field: '@timestamp'
          }
        }
      }
    }
  };
};

const formatHostItem = bucket => {
  return HOST_FIELDS.reduce((flattenedFields, fieldName) => {
    const fieldValue = getHostFieldValue(fieldName, bucket);

    if (fieldValue != null) {
      if (fieldName === '_id') {
        return (0, _fp.set)('_id', fieldValue, flattenedFields);
      }

      return (0, _fp.set)(fieldName, (0, _to_array.toObjectArrayOfStrings)(fieldValue).map(({
        str
      }) => str), flattenedFields);
    }

    return flattenedFields;
  }, {});
};

exports.formatHostItem = formatHostItem;

const getHostFieldValue = (fieldName, bucket) => {
  const aggField = _ecs_fields.hostFieldsMap[fieldName] ? _ecs_fields.hostFieldsMap[fieldName].replace(/\./g, '_') : fieldName.replace(/\./g, '_');

  if (['host.ip', 'host.mac', 'cloud.instance.id', 'cloud.machine.type', 'cloud.provider', 'cloud.region'].includes(fieldName) && (0, _fp2.has)(aggField, bucket)) {
    const data = (0, _fp2.get)(aggField, bucket);
    return data.buckets.map(obj => obj.key);
  } else if ((0, _fp2.has)(`${aggField}.buckets`, bucket)) {
    return getFirstItem((0, _fp2.get)(`${aggField}`, bucket));
  } else if (['host.name', 'host.os.name', 'host.os.version', 'endpoint.id'].includes(fieldName)) {
    switch (fieldName) {
      case 'host.name':
        return (0, _fp2.get)('key', bucket) || null;

      case 'host.os.name':
        return (0, _fp2.get)('os.hits.hits[0]._source.host.os.name', bucket) || null;

      case 'host.os.version':
        return (0, _fp2.get)('os.hits.hits[0]._source.host.os.version', bucket) || null;

      case 'endpoint.id':
        return (0, _fp2.get)('endpoint_id.value.buckets[0].key', bucket) || null;
    }
  } else if ((0, _fp2.has)(aggField, bucket)) {
    const valueObj = (0, _fp2.get)(aggField, bucket);
    return valueObj.value_as_string;
  } else if (aggField === '_id') {
    const hostName = (0, _fp2.get)(`host_name`, bucket);
    return hostName ? getFirstItem(hostName) : null;
  }

  return null;
};

const getFirstItem = data => {
  const firstItem = (0, _fp2.head)(data.buckets);

  if (firstItem == null) {
    return null;
  }

  return firstItem.key;
};

const getHostEndpoint = async (id, deps) => {
  if (!id) {
    return null;
  }

  const {
    esClient,
    endpointContext
  } = deps;
  const logger = endpointContext.logFactory.get('metadata');

  try {
    var _endpointData$metadat, _endpointData$metadat2;

    const agentService = endpointContext.service.getAgentService();

    if (!agentService) {
      throw new Error('agentService not available');
    }

    const endpointData = await endpointContext.service.getEndpointMetadataService() // Using `internalUser` ES client below due to the fact that Fleet data has been moved to
    // system indices (`.fleet*`). Because this is a readonly action, this should be ok to do
    // here until proper RBOC controls are implemented
    .getEnrichedHostMetadata(esClient.asInternalUser, id);
    const fleetAgentId = endpointData.metadata.elastic.agent.id;
    const pendingActions = fleetAgentId ? (0, _services.getPendingActionCounts)(esClient.asInternalUser, endpointContext.service.getEndpointMetadataService(), [fleetAgentId], endpointContext.experimentalFeatures.pendingActionResponsesWithAck).then(results => {
      return results[0].pending_actions;
    }).catch(error => {
      // Failure in retrieving the number of pending actions should not fail the entire
      // call to get endpoint details. Log the error and return an empty object
      logger.warn(error);
      return {};
    }) : {};
    return {
      endpointPolicy: endpointData.metadata.Endpoint.policy.applied.name,
      policyStatus: endpointData.metadata.Endpoint.policy.applied.status,
      sensorVersion: endpointData.metadata.agent.version,
      elasticAgentStatus: endpointData.host_status,
      isolation: (_endpointData$metadat = (_endpointData$metadat2 = endpointData.metadata.Endpoint.state) === null || _endpointData$metadat2 === void 0 ? void 0 : _endpointData$metadat2.isolation) !== null && _endpointData$metadat !== void 0 ? _endpointData$metadat : false,
      pendingActions
    };
  } catch (err) {
    logger.warn(err);
    return null;
  }
};

exports.getHostEndpoint = getHostEndpoint;