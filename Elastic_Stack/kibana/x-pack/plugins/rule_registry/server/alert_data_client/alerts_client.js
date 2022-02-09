"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertsClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _esQuery = require("@kbn/es-query");

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _alerts_as_data_rbac = require("@kbn/rule-data-utils/target_node/alerts_as_data_rbac");

var _server = require("../../../alerting/server");

var _audit_events = require("./audit_events");

var _technical_rule_data_field_names = require("../../common/technical_rule_data_field_names");

var _rule_data_plugin_service = require("../rule_data_plugin_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getEsQueryConfig = _alerts_as_data_rbac.getEsQueryConfig;
const getSafeSortIds = _alerts_as_data_rbac.getSafeSortIds;
const isValidFeatureId = _alerts_as_data_rbac.isValidFeatureId; // TODO: Fix typings https://github.com/elastic/kibana/issues/101776

const isValidAlert = source => {
  var _source$_source, _source$_source2, _source$_source3, _source$fields, _source$fields2, _source$fields3;

  return (source === null || source === void 0 ? void 0 : (_source$_source = source._source) === null || _source$_source === void 0 ? void 0 : _source$_source[_technical_rule_data_field_names.ALERT_RULE_TYPE_ID]) != null && (source === null || source === void 0 ? void 0 : (_source$_source2 = source._source) === null || _source$_source2 === void 0 ? void 0 : _source$_source2[_technical_rule_data_field_names.ALERT_RULE_CONSUMER]) != null && (source === null || source === void 0 ? void 0 : (_source$_source3 = source._source) === null || _source$_source3 === void 0 ? void 0 : _source$_source3[_technical_rule_data_field_names.SPACE_IDS]) != null || (source === null || source === void 0 ? void 0 : (_source$fields = source.fields) === null || _source$fields === void 0 ? void 0 : _source$fields[_technical_rule_data_field_names.ALERT_RULE_TYPE_ID][0]) != null && (source === null || source === void 0 ? void 0 : (_source$fields2 = source.fields) === null || _source$fields2 === void 0 ? void 0 : _source$fields2[_technical_rule_data_field_names.ALERT_RULE_CONSUMER][0]) != null && (source === null || source === void 0 ? void 0 : (_source$fields3 = source.fields) === null || _source$fields3 === void 0 ? void 0 : _source$fields3[_technical_rule_data_field_names.SPACE_IDS][0]) != null;
};
/**
 * Provides apis to interact with alerts as data
 * ensures the request is authorized to perform read / write actions
 * on alerts as data.
 */


class AlertsClient {
  constructor(options) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "auditLogger", void 0);
    (0, _defineProperty2.default)(this, "authorization", void 0);
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "spaceId", void 0);
    (0, _defineProperty2.default)(this, "ruleDataService", void 0);
    this.logger = options.logger;
    this.authorization = options.authorization;
    this.esClient = options.esClient;
    this.auditLogger = options.auditLogger; // If spaceId is undefined, it means that spaces is disabled
    // Otherwise, if space is enabled and not specified, it is "default"

    this.spaceId = this.authorization.getSpaceId();
    this.ruleDataService = options.ruleDataService;
  }

  getOutcome(operation) {
    return {
      outcome: operation === _server.WriteOperations.Update ? 'unknown' : 'success'
    };
  }

  getAlertStatusFieldUpdate(source, status) {
    return (source === null || source === void 0 ? void 0 : source[_technical_rule_data_field_names.ALERT_WORKFLOW_STATUS]) == null ? {
      signal: {
        status
      }
    } : {
      [_technical_rule_data_field_names.ALERT_WORKFLOW_STATUS]: status
    };
  }
  /**
   * Accepts an array of ES documents and executes ensureAuthorized for the given operation
   * @param items
   * @param operation
   * @returns
   */


  async ensureAllAuthorized(items, operation) {
    const {
      hitIds,
      ownersAndRuleTypeIds
    } = items.reduce((acc, hit) => {
      var _hit$_source, _hit$_source2;

      return {
        hitIds: [hit._id, ...acc.hitIds],
        ownersAndRuleTypeIds: [{
          [_technical_rule_data_field_names.ALERT_RULE_TYPE_ID]: hit === null || hit === void 0 ? void 0 : (_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : _hit$_source[_technical_rule_data_field_names.ALERT_RULE_TYPE_ID],
          [_technical_rule_data_field_names.ALERT_RULE_CONSUMER]: hit === null || hit === void 0 ? void 0 : (_hit$_source2 = hit._source) === null || _hit$_source2 === void 0 ? void 0 : _hit$_source2[_technical_rule_data_field_names.ALERT_RULE_CONSUMER]
        }]
      };
    }, {
      hitIds: [],
      ownersAndRuleTypeIds: []
    });

    const assertString = hit => hit !== null && hit !== undefined;

    return Promise.all(ownersAndRuleTypeIds.map(hit => {
      const alertOwner = hit === null || hit === void 0 ? void 0 : hit[_technical_rule_data_field_names.ALERT_RULE_CONSUMER];
      const ruleId = hit === null || hit === void 0 ? void 0 : hit[_technical_rule_data_field_names.ALERT_RULE_TYPE_ID];

      if (hit != null && assertString(alertOwner) && assertString(ruleId)) {
        return this.authorization.ensureAuthorized({
          ruleTypeId: ruleId,
          consumer: alertOwner,
          operation,
          entity: _server.AlertingAuthorizationEntity.Alert
        });
      }
    })).catch(error => {
      for (const hitId of hitIds) {
        var _this$auditLogger;

        (_this$auditLogger = this.auditLogger) === null || _this$auditLogger === void 0 ? void 0 : _this$auditLogger.log((0, _audit_events.alertAuditEvent)({
          action: _audit_events.operationAlertAuditActionMap[operation],
          id: hitId,
          error
        }));
      }

      throw error;
    });
  }
  /**
   * This will be used as a part of the "find" api
   * In the future we will add an "aggs" param
   * @param param0
   * @returns
   */


  async singleSearchAfterAndAudit({
    id,
    query,
    aggs,
    _source,
    track_total_hits: trackTotalHits,
    size,
    index,
    operation,
    lastSortIds = []
  }) {
    try {
      var _result$body, _result$body$hits;

      const alertSpaceId = this.spaceId;

      if (alertSpaceId == null) {
        const errorMessage = 'Failed to acquire spaceId from authorization client';
        this.logger.error(`fetchAlertAndAudit threw an error: ${errorMessage}`);
        throw _boom.default.failedDependency(`fetchAlertAndAudit threw an error: ${errorMessage}`);
      }

      const config = getEsQueryConfig();
      let queryBody = {
        fields: [_technical_rule_data_field_names.ALERT_RULE_TYPE_ID, _technical_rule_data_field_names.ALERT_RULE_CONSUMER, _technical_rule_data_field_names.ALERT_WORKFLOW_STATUS, _technical_rule_data_field_names.SPACE_IDS],
        query: await this.buildEsQueryWithAuthz(query, id, alertSpaceId, operation, config),
        aggs,
        _source,
        track_total_hits: trackTotalHits,
        size,
        sort: [{
          '@timestamp': {
            order: 'asc',
            unmapped_type: 'date'
          }
        }]
      };

      if (lastSortIds.length > 0) {
        queryBody = { ...queryBody,
          // @ts-expect-error
          search_after: lastSortIds
        };
      }

      const result = await this.esClient.search({
        index: index !== null && index !== void 0 ? index : '.alerts-*',
        ignore_unavailable: true,
        // @ts-expect-error
        body: queryBody,
        seq_no_primary_term: true
      });

      if (!(result !== null && result !== void 0 && result.body.hits.hits.every(hit => isValidAlert(hit)))) {
        const errorMessage = `Invalid alert found with id of "${id}" or with query "${query}" and operation ${operation}`;
        this.logger.error(errorMessage);
        throw _boom.default.badData(errorMessage);
      }

      if ((result === null || result === void 0 ? void 0 : (_result$body = result.body) === null || _result$body === void 0 ? void 0 : (_result$body$hits = _result$body.hits) === null || _result$body$hits === void 0 ? void 0 : _result$body$hits.hits) != null && (result === null || result === void 0 ? void 0 : result.body.hits.hits.length) > 0) {
        await this.ensureAllAuthorized(result.body.hits.hits, operation);
        result === null || result === void 0 ? void 0 : result.body.hits.hits.map(item => {
          var _this$auditLogger2;

          return (_this$auditLogger2 = this.auditLogger) === null || _this$auditLogger2 === void 0 ? void 0 : _this$auditLogger2.log((0, _audit_events.alertAuditEvent)({
            action: _audit_events.operationAlertAuditActionMap[operation],
            id: item._id,
            ...this.getOutcome(operation)
          }));
        });
      }

      return result.body;
    } catch (error) {
      const errorMessage = `Unable to retrieve alert details for alert with id of "${id}" or with query "${query}" and operation ${operation} \nError: ${error}`;
      this.logger.error(errorMessage);
      throw _boom.default.notFound(errorMessage);
    }
  }
  /**
   * When an update by ids is requested, do a multi-get, ensure authz and audit alerts, then execute bulk update
   * @param param0
   * @returns
   */


  async mgetAlertsAuditOperate({
    ids,
    status,
    indexName,
    operation
  }) {
    try {
      const mgetRes = await this.esClient.mget({
        index: indexName,
        body: {
          ids
        }
      });
      await this.ensureAllAuthorized(mgetRes.body.docs, operation);

      for (const id of ids) {
        var _this$auditLogger3;

        (_this$auditLogger3 = this.auditLogger) === null || _this$auditLogger3 === void 0 ? void 0 : _this$auditLogger3.log((0, _audit_events.alertAuditEvent)({
          action: _audit_events.operationAlertAuditActionMap[operation],
          id,
          ...this.getOutcome(operation)
        }));
      }

      const bulkUpdateRequest = mgetRes.body.docs.flatMap(item => {
        const fieldToUpdate = this.getAlertStatusFieldUpdate(item === null || item === void 0 ? void 0 : item._source, status);
        return [{
          update: {
            _index: item._index,
            _id: item._id
          }
        }, {
          doc: { ...fieldToUpdate
          }
        }];
      });
      const bulkUpdateResponse = await this.esClient.bulk({
        refresh: 'wait_for',
        body: bulkUpdateRequest
      });
      return bulkUpdateResponse;
    } catch (exc) {
      this.logger.error(`error in mgetAlertsAuditOperate ${exc}`);
      throw exc;
    }
  }

  async buildEsQueryWithAuthz(query, id, alertSpaceId, operation, config) {
    try {
      const {
        filter: authzFilter
      } = await this.authorization.getAuthorizationFilter(_server.AlertingAuthorizationEntity.Alert, {
        type: _server.AlertingAuthorizationFilterType.ESDSL,
        fieldNames: {
          consumer: _technical_rule_data_field_names.ALERT_RULE_CONSUMER,
          ruleTypeId: _technical_rule_data_field_names.ALERT_RULE_TYPE_ID
        }
      }, operation);
      let esQuery;

      if (id != null) {
        esQuery = {
          query: `_id:${id}`,
          language: 'kuery'
        };
      } else if (typeof query === 'string') {
        esQuery = {
          query,
          language: 'kuery'
        };
      } else if (query != null && typeof query === 'object') {
        esQuery = [];
      }

      const builtQuery = (0, _esQuery.buildEsQuery)(undefined, esQuery == null ? {
        query: ``,
        language: 'kuery'
      } : esQuery, [authzFilter, {
        query: {
          term: {
            [_technical_rule_data_field_names.SPACE_IDS]: alertSpaceId
          }
        }
      }], config);

      if (query != null && typeof query === 'object') {
        return { ...builtQuery,
          bool: { ...builtQuery.bool,
            must: [...builtQuery.bool.must, query]
          }
        };
      }

      return builtQuery;
    } catch (exc) {
      this.logger.error(exc);
      throw _boom.default.expectationFailed(`buildEsQueryWithAuthz threw an error: unable to get authorization filter \n ${exc}`);
    }
  }
  /**
   * executes a search after to find alerts with query (+ authz filter)
   * @param param0
   * @returns
   */


  async queryAndAuditAllAlerts({
    index,
    query,
    operation
  }) {
    let lastSortIds;
    let hasSortIds = true;
    const alertSpaceId = this.spaceId;

    if (alertSpaceId == null) {
      this.logger.error('Failed to acquire spaceId from authorization client');
      return;
    }

    const config = getEsQueryConfig();
    const authorizedQuery = await this.buildEsQueryWithAuthz(query, null, alertSpaceId, operation, config);

    while (hasSortIds) {
      try {
        var _result$hits$hits;

        const result = await this.singleSearchAfterAndAudit({
          id: null,
          query,
          index,
          operation,
          lastSortIds
        });

        if (lastSortIds != null && (result === null || result === void 0 ? void 0 : result.hits.hits.length) === 0) {
          return {
            auditedAlerts: true,
            authorizedQuery
          };
        }

        if (result == null) {
          this.logger.error('RESULT WAS EMPTY');
          return {
            auditedAlerts: false,
            authorizedQuery
          };
        }

        if (result.hits.hits.length === 0) {
          this.logger.error('Search resulted in no hits');
          return {
            auditedAlerts: true,
            authorizedQuery
          };
        }

        lastSortIds = getSafeSortIds((_result$hits$hits = result.hits.hits[result.hits.hits.length - 1]) === null || _result$hits$hits === void 0 ? void 0 : _result$hits$hits.sort);

        if (lastSortIds != null && lastSortIds.length !== 0) {
          hasSortIds = true;
        } else {
          hasSortIds = false;
          return {
            auditedAlerts: true,
            authorizedQuery
          };
        }
      } catch (error) {
        const errorMessage = `queryAndAuditAllAlerts threw an error: Unable to retrieve alerts with query "${query}" and operation ${operation} \n ${error}`;
        this.logger.error(errorMessage);
        throw _boom.default.notFound(errorMessage);
      }
    }
  }

  async get({
    id,
    index
  }) {
    try {
      // first search for the alert by id, then use the alert info to check if user has access to it
      const alert = await this.singleSearchAfterAndAudit({
        id,
        index,
        operation: _server.ReadOperations.Get
      });

      if (alert == null || alert.hits.hits.length === 0) {
        const errorMessage = `Unable to retrieve alert details for alert with id of "${id}" and operation ${_server.ReadOperations.Get}`;
        this.logger.error(errorMessage);
        throw _boom.default.notFound(errorMessage);
      } // move away from pulling data from _source in the future


      return alert.hits.hits[0]._source;
    } catch (error) {
      this.logger.error(`get threw an error: ${error}`);
      throw error;
    }
  }

  async update({
    id,
    status,
    _version,
    index
  }) {
    try {
      const alert = await this.singleSearchAfterAndAudit({
        id,
        index,
        operation: _server.WriteOperations.Update
      });

      if (alert == null || alert.hits.hits.length === 0) {
        const errorMessage = `Unable to retrieve alert details for alert with id of "${id}" and operation ${_server.ReadOperations.Get}`;
        this.logger.error(errorMessage);
        throw _boom.default.notFound(errorMessage);
      }

      const fieldToUpdate = this.getAlertStatusFieldUpdate(alert === null || alert === void 0 ? void 0 : alert.hits.hits[0]._source, status);
      const {
        body: response
      } = await this.esClient.update({ ...(0, _securitysolutionEsUtils.decodeVersion)(_version),
        id,
        index,
        body: {
          doc: { ...fieldToUpdate
          }
        },
        refresh: 'wait_for'
      });
      return { ...response,
        _version: (0, _securitysolutionEsUtils.encodeHitVersion)(response)
      };
    } catch (error) {
      this.logger.error(`update threw an error: ${error}`);
      throw error;
    }
  }

  async bulkUpdate({
    ids,
    query,
    index,
    status
  }) {
    // rejects at the route level if more than 1000 id's are passed in
    if (ids != null) {
      return this.mgetAlertsAuditOperate({
        ids,
        status,
        indexName: index,
        operation: _server.WriteOperations.Update
      });
    } else if (query != null) {
      try {
        // execute search after with query + authorization filter
        // audit results of that query
        const fetchAndAuditResponse = await this.queryAndAuditAllAlerts({
          query,
          index,
          operation: _server.WriteOperations.Update
        });

        if (!(fetchAndAuditResponse !== null && fetchAndAuditResponse !== void 0 && fetchAndAuditResponse.auditedAlerts)) {
          throw _boom.default.forbidden('Failed to audit alerts');
        } // executes updateByQuery with query + authorization filter
        // used in the queryAndAuditAllAlerts function


        const result = await this.esClient.updateByQuery({
          index,
          conflicts: 'proceed',
          refresh: true,
          body: {
            script: {
              source: `if (ctx._source['${_technical_rule_data_field_names.ALERT_WORKFLOW_STATUS}'] != null) {
                ctx._source['${_technical_rule_data_field_names.ALERT_WORKFLOW_STATUS}'] = '${status}'
              }
              if (ctx._source.signal != null && ctx._source.signal.status != null) {
                ctx._source.signal.status = '${status}'
              }`,
              lang: 'painless'
            },
            query: fetchAndAuditResponse.authorizedQuery
          },
          ignore_unavailable: true
        });
        return result;
      } catch (err) {
        this.logger.error(`bulkUpdate threw an error: ${err}`);
        throw err;
      }
    } else {
      throw _boom.default.badRequest('no ids or query were provided for updating');
    }
  }

  async find({
    query,
    aggs,
    _source,
    track_total_hits: trackTotalHits,
    size,
    index
  }) {
    try {
      // first search for the alert by id, then use the alert info to check if user has access to it
      const alertsSearchResponse = await this.singleSearchAfterAndAudit({
        query,
        aggs,
        _source,
        track_total_hits: trackTotalHits,
        size,
        index,
        operation: _server.ReadOperations.Find
      });

      if (alertsSearchResponse == null) {
        const errorMessage = `Unable to retrieve alert details for alert with query and operation ${_server.ReadOperations.Find}`;
        this.logger.error(errorMessage);
        throw _boom.default.notFound(errorMessage);
      }

      return alertsSearchResponse;
    } catch (error) {
      this.logger.error(`find threw an error: ${error}`);
      throw error;
    }
  }

  async getAuthorizedAlertsIndices(featureIds) {
    try {
      // ATTENTION FUTURE DEVELOPER when you are a super user the augmentedRuleTypes.authorizedRuleTypes will
      // return all of the features that you can access and does not care about your featureIds
      const augmentedRuleTypes = await this.authorization.getAugmentedRuleTypesWithAuthorization(featureIds, [_server.ReadOperations.Find, _server.ReadOperations.Get, _server.WriteOperations.Update], _server.AlertingAuthorizationEntity.Alert); // As long as the user can read a minimum of one type of rule type produced by the provided feature,
      // the user should be provided that features' alerts index.
      // Limiting which alerts that user can read on that index will be done via the findAuthorizationFilter

      const authorizedFeatures = new Set();

      for (const ruleType of augmentedRuleTypes.authorizedRuleTypes) {
        authorizedFeatures.add(ruleType.producer);
      }

      const validAuthorizedFeatures = Array.from(authorizedFeatures).filter(feature => featureIds.includes(feature) && isValidFeatureId(feature));
      const toReturn = validAuthorizedFeatures.flatMap(feature => {
        const indices = this.ruleDataService.findIndicesByFeature(feature, _rule_data_plugin_service.Dataset.alerts);

        if (feature === 'siem') {
          return indices.map(i => `${i.baseName}-${this.spaceId}`);
        } else {
          return indices.map(i => i.baseName);
        }
      });
      return toReturn;
    } catch (exc) {
      const errMessage = `getAuthorizedAlertsIndices failed to get authorized rule types: ${exc}`;
      this.logger.error(errMessage);
      throw _boom.default.failedDependency(errMessage);
    }
  }

}

exports.AlertsClient = AlertsClient;