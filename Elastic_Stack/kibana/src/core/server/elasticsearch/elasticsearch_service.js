"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _std = require("@kbn/std");

var _client = require("./client");

var _elasticsearch_config = require("./elasticsearch_config");

var _ensure_es_version = require("./version_check/ensure_es_version");

var _status = require("./status");

var _is_valid_connection = require("./is_valid_connection");

var _deprecations = require("./deprecations");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class ElasticsearchService {
  constructor(coreContext) {
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "config$", void 0);
    (0, _defineProperty2.default)(this, "stop$", new _rxjs.Subject());
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "getAuthHeaders", void 0);
    (0, _defineProperty2.default)(this, "executionContextClient", void 0);
    (0, _defineProperty2.default)(this, "esNodesCompatibility$", void 0);
    (0, _defineProperty2.default)(this, "client", void 0);
    this.coreContext = coreContext;
    this.kibanaVersion = coreContext.env.packageInfo.version;
    this.log = coreContext.logger.get('elasticsearch-service');
    this.config$ = coreContext.configService.atPath('elasticsearch').pipe((0, _operators.map)(rawConfig => new _elasticsearch_config.ElasticsearchConfig(rawConfig)));
  }

  async preboot() {
    this.log.debug('Prebooting elasticsearch service');
    const config = await this.config$.pipe((0, _operators.first)()).toPromise();
    return {
      config: {
        hosts: config.hosts,
        credentialsSpecified: config.username !== undefined || config.password !== undefined || config.serviceAccountToken !== undefined
      },
      createClient: (type, clientConfig) => this.createClusterClient(type, config, clientConfig)
    };
  }

  async setup(deps) {
    this.log.debug('Setting up elasticsearch service');
    const config = await this.config$.pipe((0, _operators.first)()).toPromise();
    this.getAuthHeaders = deps.http.getAuthHeaders;
    this.executionContextClient = deps.executionContext;
    this.client = this.createClusterClient('data', config);
    deps.deprecations.getRegistry('elasticsearch').registerDeprecations((0, _deprecations.getElasticsearchDeprecationsProvider)());
    const esNodesCompatibility$ = (0, _ensure_es_version.pollEsNodesVersion)({
      internalClient: this.client.asInternalUser,
      log: this.log,
      ignoreVersionMismatch: config.ignoreVersionMismatch,
      esVersionCheckInterval: config.healthCheckDelay.asMilliseconds(),
      kibanaVersion: this.kibanaVersion
    }).pipe((0, _operators.takeUntil)(this.stop$), (0, _operators.shareReplay)({
      refCount: true,
      bufferSize: 1
    }));
    this.esNodesCompatibility$ = esNodesCompatibility$;
    return {
      legacy: {
        config$: this.config$
      },
      esNodesCompatibility$,
      status$: (0, _status.calculateStatus$)(esNodesCompatibility$)
    };
  }

  async start() {
    if (!this.client || !this.esNodesCompatibility$) {
      throw new Error('ElasticsearchService needs to be setup before calling start');
    }

    const config = await this.config$.pipe((0, _operators.first)()).toPromise(); // Log every error we may encounter in the connection to Elasticsearch

    this.esNodesCompatibility$.subscribe(({
      isCompatible,
      message
    }) => {
      if (!isCompatible && message) {
        this.log.error(message);
      }
    });

    if (!config.skipStartupConnectionCheck) {
      // Ensure that the connection is established and the product is valid before moving on
      await (0, _is_valid_connection.isValidConnection)(this.esNodesCompatibility$);
    }

    return {
      client: this.client,
      createClient: (type, clientConfig) => this.createClusterClient(type, config, clientConfig),
      legacy: {
        config$: this.config$
      }
    };
  }

  async stop() {
    this.log.debug('Stopping elasticsearch service');
    this.stop$.next();

    if (this.client) {
      await this.client.close();
    }
  }

  createClusterClient(type, baseConfig, clientConfig) {
    const config = clientConfig ? (0, _std.merge)({}, baseConfig, clientConfig) : baseConfig;
    return new _client.ClusterClient(config, this.coreContext.logger.get('elasticsearch'), type, this.getAuthHeaders, () => {
      var _this$executionContex;

      return (_this$executionContex = this.executionContextClient) === null || _this$executionContex === void 0 ? void 0 : _this$executionContex.getAsHeader();
    });
  }

}

exports.ElasticsearchService = ElasticsearchService;