"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorGroupsProjection = getErrorGroupsProjection;

var _elasticsearch_fieldnames = require("../../common/elasticsearch_fieldnames");

var _server = require("../../../observability/server");

var _environment_query = require("../../common/utils/environment_query");

var _processor_event = require("../../common/processor_event");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getErrorGroupsProjection({
  environment,
  kuery,
  serviceName,
  start,
  end
}) {
  return {
    apm: {
      events: [_processor_event.ProcessorEvent.error]
    },
    body: {
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        error_groups: {
          terms: {
            field: _elasticsearch_fieldnames.ERROR_GROUP_ID
          }
        }
      }
    }
  };
}