"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timelineSearchStrategyProvider = void 0;

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _operators = require("rxjs/operators");

var _rxjs = require("rxjs");

var _server = require("../../../../alerting/server");

var _server2 = require("../../../../../../src/plugins/data/server");

var _timeline = require("../../../common/search_strategy/timeline");

var _factory = require("./factory");

var _common = require("../../../../../../src/plugins/data/common");

var _server3 = require("../../../../rule_registry/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const timelineSearchStrategyProvider = (data, alerting, security) => {
  const esAsInternal = data.search.searchAsInternalUser;
  const es = data.search.getSearchStrategy(_common.ENHANCED_ES_SEARCH_STRATEGY);
  return {
    search: (request, options, deps) => {
      const securityAuditLogger = security === null || security === void 0 ? void 0 : security.audit.asScoped(deps.request);
      const factoryQueryType = request.factoryQueryType;
      const entityType = request.entityType;

      if (factoryQueryType == null) {
        throw new Error('factoryQueryType is required');
      }

      const queryFactory = _factory.timelineFactory[factoryQueryType];

      if (entityType != null && entityType === _timeline.EntityType.ALERTS) {
        return timelineAlertsSearchStrategy({
          es: esAsInternal,
          request,
          options,
          deps,
          queryFactory,
          alerting,
          auditLogger: securityAuditLogger
        });
      } else {
        return timelineSearchStrategy({
          es,
          request,
          options,
          deps,
          queryFactory
        });
      }
    },
    cancel: async (id, options, deps) => {
      if (es.cancel) {
        return es.cancel(id, options, deps);
      }
    }
  };
};

exports.timelineSearchStrategyProvider = timelineSearchStrategyProvider;

const timelineSearchStrategy = ({
  es,
  request,
  options,
  deps,
  queryFactory
}) => {
  const dsl = queryFactory.buildDsl(request);
  return es.search({ ...request,
    params: dsl
  }, options, deps).pipe((0, _operators.map)(response => {
    return { ...response,
      rawResponse: (0, _server2.shimHitsTotal)(response.rawResponse, options)
    };
  }), (0, _operators.mergeMap)(esSearchRes => queryFactory.parse(request, esSearchRes)));
};

const timelineAlertsSearchStrategy = ({
  es,
  request,
  options,
  deps,
  queryFactory,
  alerting,
  auditLogger
}) => {
  var _request$defaultIndex;

  const indices = (_request$defaultIndex = request.defaultIndex) !== null && _request$defaultIndex !== void 0 ? _request$defaultIndex : request.indexType;
  const requestWithAlertsIndices = { ...request,
    defaultIndex: indices,
    indexName: indices
  }; // Note: Alerts RBAC are built off of the alerting's authorization class, which
  // is why we are pulling from alerting, not ther alertsClient here

  const alertingAuthorizationClient = alerting.getAlertingAuthorizationWithRequest(deps.request);

  const getAuthFilter = async () => alertingAuthorizationClient.getFindAuthorizationFilter(_server.AlertingAuthorizationEntity.Alert, {
    type: _server.AlertingAuthorizationFilterType.ESDSL,
    // Not passing in values, these are the paths for these fields
    fieldNames: {
      consumer: _ruleDataUtils.ALERT_RULE_CONSUMER,
      ruleTypeId: _ruleDataUtils.ALERT_RULE_TYPE_ID,
      spaceIds: _ruleDataUtils.SPACE_IDS
    }
  });

  return (0, _rxjs.from)(getAuthFilter()).pipe((0, _operators.mergeMap)(({
    filter
  }) => {
    const dsl = queryFactory.buildDsl({ ...requestWithAlertsIndices,
      authFilter: filter
    });
    return es.search({ ...requestWithAlertsIndices,
      params: dsl
    }, options, deps);
  }), (0, _operators.map)(response => {
    const rawResponse = (0, _server2.shimHitsTotal)(response.rawResponse, options); // Do we have to loop over each hit? Yes.
    // ecs auditLogger requires that we log each alert independently

    if (auditLogger != null) {
      var _rawResponse$hits, _rawResponse$hits$hit;

      (_rawResponse$hits = rawResponse.hits) === null || _rawResponse$hits === void 0 ? void 0 : (_rawResponse$hits$hit = _rawResponse$hits.hits) === null || _rawResponse$hits$hit === void 0 ? void 0 : _rawResponse$hits$hit.forEach(hit => {
        auditLogger.log((0, _server3.alertAuditEvent)({
          action: _server3.AlertAuditAction.FIND,
          id: hit._id,
          outcome: 'success'
        }));
      });
    }

    return { ...response,
      rawResponse
    };
  }), (0, _operators.mergeMap)(esSearchRes => queryFactory.parse(requestWithAlertsIndices, esSearchRes)), (0, _operators.catchError)(err => {
    var _err$output; // check if auth error, if yes, write to ecs logger


    if (auditLogger != null && (err === null || err === void 0 ? void 0 : (_err$output = err.output) === null || _err$output === void 0 ? void 0 : _err$output.statusCode) === 403) {
      auditLogger.log((0, _server3.alertAuditEvent)({
        action: _server3.AlertAuditAction.FIND,
        outcome: 'failure',
        error: err
      }));
    }

    throw err;
  }));
};