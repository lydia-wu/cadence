"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetryReceiver = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _service = require("../../endpoint/routes/trusted_apps/service");

var _constants = require("./constants");

var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class TelemetryReceiver {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "agentService", void 0);
    (0, _defineProperty2.default)(this, "agentPolicyService", void 0);
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "exceptionListClient", void 0);
    (0, _defineProperty2.default)(this, "soClient", void 0);
    (0, _defineProperty2.default)(this, "kibanaIndex", void 0);
    (0, _defineProperty2.default)(this, "clusterInfo", void 0);
    (0, _defineProperty2.default)(this, "max_records", 10_000);
    this.logger = logger.get('telemetry_events');
  }

  async start(core, kibanaIndex, endpointContextService, exceptionListClient) {
    this.kibanaIndex = kibanaIndex;
    this.agentService = endpointContextService === null || endpointContextService === void 0 ? void 0 : endpointContextService.getAgentService();
    this.agentPolicyService = endpointContextService === null || endpointContextService === void 0 ? void 0 : endpointContextService.getAgentPolicyService();
    this.esClient = core === null || core === void 0 ? void 0 : core.elasticsearch.client.asInternalUser;
    this.exceptionListClient = exceptionListClient;
    this.soClient = core === null || core === void 0 ? void 0 : core.savedObjects.createInternalRepository();
    this.clusterInfo = await this.fetchClusterInfo();
  }

  getClusterInfo() {
    return this.clusterInfo;
  }

  async fetchFleetAgents() {
    var _this$agentService;

    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve fleet policy responses');
    }

    return (_this$agentService = this.agentService) === null || _this$agentService === void 0 ? void 0 : _this$agentService.listAgents(this.esClient, {
      perPage: this.max_records,
      showInactive: true,
      sortField: 'enrolled_at',
      sortOrder: 'desc'
    });
  }

  async fetchEndpointPolicyResponses(executeFrom, executeTo) {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve elastic endpoint policy responses');
    }

    const query = {
      expand_wildcards: 'open,hidden',
      index: `.ds-metrics-endpoint.policy*`,
      ignore_unavailable: false,
      size: 0,
      // no query results required - only aggregation quantity
      body: {
        query: {
          range: {
            '@timestamp': {
              gte: executeFrom,
              lt: executeTo
            }
          }
        },
        aggs: {
          policy_responses: {
            terms: {
              size: this.max_records,
              field: 'agent.id'
            },
            aggs: {
              latest_response: {
                top_hits: {
                  size: 1,
                  sort: [{
                    '@timestamp': {
                      order: 'desc'
                    }
                  }]
                }
              }
            }
          }
        }
      }
    };
    return this.esClient.search(query);
  }

  async fetchEndpointMetrics(executeFrom, executeTo) {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve elastic endpoint metrics');
    }

    const query = {
      expand_wildcards: 'open,hidden',
      index: `.ds-metrics-endpoint.metrics-*`,
      ignore_unavailable: false,
      size: 0,
      // no query results required - only aggregation quantity
      body: {
        query: {
          range: {
            '@timestamp': {
              gte: executeFrom,
              lt: executeTo
            }
          }
        },
        aggs: {
          endpoint_agents: {
            terms: {
              field: 'agent.id',
              size: this.max_records
            },
            aggs: {
              latest_metrics: {
                top_hits: {
                  size: 1,
                  sort: [{
                    '@timestamp': {
                      order: 'desc'
                    }
                  }]
                }
              }
            }
          }
        }
      }
    };
    return this.esClient.search(query);
  }

  async fetchDiagnosticAlerts(executeFrom, executeTo) {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve diagnostic alerts');
    }

    const query = {
      expand_wildcards: 'open,hidden',
      index: '.logs-endpoint.diagnostic.collection-*',
      ignore_unavailable: true,
      size: _constants.TELEMETRY_MAX_BUFFER_SIZE,
      body: {
        query: {
          range: {
            'event.ingested': {
              gte: executeFrom,
              lt: executeTo
            }
          }
        },
        sort: [{
          'event.ingested': {
            order: 'desc'
          }
        }]
      }
    };
    return (await this.esClient.search(query)).body;
  }

  async fetchPolicyConfigs(id) {
    var _this$agentPolicyServ;

    if (this.soClient === undefined || this.soClient === null) {
      throw Error('saved object client is unavailable: cannot retrieve endpoint policy configurations');
    }

    return (_this$agentPolicyServ = this.agentPolicyService) === null || _this$agentPolicyServ === void 0 ? void 0 : _this$agentPolicyServ.get(this.soClient, id);
  }

  async fetchTrustedApplications() {
    var _results$total, _results$page, _results$per_page;

    if ((this === null || this === void 0 ? void 0 : this.exceptionListClient) === undefined || (this === null || this === void 0 ? void 0 : this.exceptionListClient) === null) {
      throw Error('exception list client is unavailable: cannot retrieve trusted applications');
    }

    const results = await (0, _service.getTrustedAppsList)(this.exceptionListClient, {
      page: 1,
      per_page: 10_000
    });
    return {
      data: results === null || results === void 0 ? void 0 : results.data.map(_helpers.trustedApplicationToTelemetryEntry),
      total: (_results$total = results === null || results === void 0 ? void 0 : results.total) !== null && _results$total !== void 0 ? _results$total : 0,
      page: (_results$page = results === null || results === void 0 ? void 0 : results.page) !== null && _results$page !== void 0 ? _results$page : 1,
      per_page: (_results$per_page = results === null || results === void 0 ? void 0 : results.per_page) !== null && _results$per_page !== void 0 ? _results$per_page : this.max_records
    };
  }

  async fetchEndpointList(listId) {
    var _results$data$map, _results$total2, _results$page2, _results$per_page2;

    if ((this === null || this === void 0 ? void 0 : this.exceptionListClient) === undefined || (this === null || this === void 0 ? void 0 : this.exceptionListClient) === null) {
      throw Error('exception list client is unavailable: could not retrieve trusted applications');
    } // Ensure list is created if it does not exist


    await this.exceptionListClient.createTrustedAppsList();
    const results = await this.exceptionListClient.findExceptionListItem({
      listId,
      page: 1,
      perPage: this.max_records,
      filter: undefined,
      namespaceType: 'agnostic',
      sortField: 'name',
      sortOrder: 'asc'
    });
    return {
      data: (_results$data$map = results === null || results === void 0 ? void 0 : results.data.map(_helpers.exceptionListItemToTelemetryEntry)) !== null && _results$data$map !== void 0 ? _results$data$map : [],
      total: (_results$total2 = results === null || results === void 0 ? void 0 : results.total) !== null && _results$total2 !== void 0 ? _results$total2 : 0,
      page: (_results$page2 = results === null || results === void 0 ? void 0 : results.page) !== null && _results$page2 !== void 0 ? _results$page2 : 1,
      per_page: (_results$per_page2 = results === null || results === void 0 ? void 0 : results.per_page) !== null && _results$per_page2 !== void 0 ? _results$per_page2 : this.max_records
    };
  }

  async fetchDetectionRules() {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve diagnostic alerts');
    }

    const query = {
      expand_wildcards: 'open,hidden',
      index: `${this.kibanaIndex}*`,
      ignore_unavailable: true,
      size: this.max_records,
      body: {
        query: {
          bool: {
            filter: [{
              term: {
                'alert.alertTypeId': 'siem.signals'
              }
            }, {
              term: {
                'alert.params.immutable': true
              }
            }]
          }
        }
      }
    };
    return this.esClient.search(query);
  }

  async fetchDetectionExceptionList(listId, ruleVersion) {
    var _this$exceptionListCl, _results$data$map2, _results$total3, _results$page3, _results$per_page3;

    if ((this === null || this === void 0 ? void 0 : this.exceptionListClient) === undefined || (this === null || this === void 0 ? void 0 : this.exceptionListClient) === null) {
      throw Error('exception list client is unavailable: could not retrieve trusted applications');
    } // Ensure list is created if it does not exist


    await this.exceptionListClient.createTrustedAppsList();
    const results = await ((_this$exceptionListCl = this.exceptionListClient) === null || _this$exceptionListCl === void 0 ? void 0 : _this$exceptionListCl.findExceptionListsItem({
      listId: [listId],
      filter: [],
      perPage: this.max_records,
      page: 1,
      sortField: 'exception-list.created_at',
      sortOrder: 'desc',
      namespaceType: ['single']
    }));
    return {
      data: (_results$data$map2 = results === null || results === void 0 ? void 0 : results.data.map(r => (0, _helpers.ruleExceptionListItemToTelemetryEvent)(r, ruleVersion))) !== null && _results$data$map2 !== void 0 ? _results$data$map2 : [],
      total: (_results$total3 = results === null || results === void 0 ? void 0 : results.total) !== null && _results$total3 !== void 0 ? _results$total3 : 0,
      page: (_results$page3 = results === null || results === void 0 ? void 0 : results.page) !== null && _results$page3 !== void 0 ? _results$page3 : 1,
      per_page: (_results$per_page3 = results === null || results === void 0 ? void 0 : results.per_page) !== null && _results$per_page3 !== void 0 ? _results$per_page3 : this.max_records
    };
  }

  async fetchClusterInfo() {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve cluster infomation');
    }

    const {
      body
    } = await this.esClient.info();
    return body;
  }

  async fetchLicenseInfo() {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve license information');
    }

    try {
      const ret = (await this.esClient.transport.request({
        method: 'GET',
        path: '/_license',
        querystring: {
          local: true,
          // For versions >= 7.6 and < 8.0, this flag is needed otherwise 'platinum' is returned for 'enterprise' license.
          accept_enterprise: 'true'
        }
      })).body;
      return (await ret).license;
    } catch (err) {
      this.logger.debug(`failed retrieving license: ${err}`);
      return undefined;
    }
  }

  copyLicenseFields(lic) {
    return {
      uid: lic.uid,
      status: lic.status,
      type: lic.type,
      ...(lic.issued_to ? {
        issued_to: lic.issued_to
      } : {}),
      ...(lic.issuer ? {
        issuer: lic.issuer
      } : {})
    };
  }

}

exports.TelemetryReceiver = TelemetryReceiver;