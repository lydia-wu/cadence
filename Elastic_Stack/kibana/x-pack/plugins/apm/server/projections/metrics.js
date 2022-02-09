"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetricsProjection = getMetricsProjection;

var _elasticsearch_fieldnames = require("../../common/elasticsearch_fieldnames");

var _server = require("../../../observability/server");

var _environment_query = require("../../common/utils/environment_query");

var _service_nodes = require("../../common/service_nodes");

var _processor_event = require("../../common/processor_event");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServiceNodeNameFilters(serviceNodeName) {
  if (!serviceNodeName) {
    return [];
  }

  if (serviceNodeName === _service_nodes.SERVICE_NODE_NAME_MISSING) {
    return [{
      bool: {
        must_not: [{
          exists: {
            field: _elasticsearch_fieldnames.SERVICE_NODE_NAME
          }
        }]
      }
    }];
  }

  return [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NODE_NAME]: serviceNodeName
    }
  }];
}

function getMetricsProjection({
  environment,
  kuery,
  serviceName,
  serviceNodeName,
  start,
  end
}) {
  const filter = [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
    }
  }, ...getServiceNodeNameFilters(serviceNodeName), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)];
  return {
    apm: {
      events: [_processor_event.ProcessorEvent.metric]
    },
    body: {
      query: {
        bool: {
          filter
        }
      }
    }
  };
}