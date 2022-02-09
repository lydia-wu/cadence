"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClusterClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _http = require("../../http");

var _router = require("../../http/router");

var _configure_client = require("./configure_client");

var _scoped_cluster_client = require("./scoped_cluster_client");

var _default_headers = require("../default_headers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const noop = () => undefined;
/**
 * Represents an Elasticsearch cluster API client created by the platform.
 * It allows to call API on behalf of the internal Kibana user and
 * the actual user that is derived from the request headers (via `asScoped(...)`).
 *
 * @public
 **/


/** @internal **/
class ClusterClient {
  constructor(config, logger, type, getAuthHeaders = noop, getExecutionContext = noop) {
    (0, _defineProperty2.default)(this, "asInternalUser", void 0);
    (0, _defineProperty2.default)(this, "rootScopedClient", void 0);
    (0, _defineProperty2.default)(this, "allowListHeaders", void 0);
    (0, _defineProperty2.default)(this, "isClosed", false);
    this.config = config;
    this.getAuthHeaders = getAuthHeaders;
    this.asInternalUser = (0, _configure_client.configureClient)(config, {
      logger,
      type,
      getExecutionContext
    });
    this.rootScopedClient = (0, _configure_client.configureClient)(config, {
      logger,
      type,
      getExecutionContext,
      scoped: true
    });
    this.allowListHeaders = ['x-opaque-id', ...this.config.requestHeadersWhitelist];
  }

  asScoped(request) {
    const scopedHeaders = this.getScopedHeaders(request);
    const scopedClient = this.rootScopedClient.child({
      headers: scopedHeaders
    });
    return new _scoped_cluster_client.ScopedClusterClient(this.asInternalUser, scopedClient);
  }

  async close() {
    if (this.isClosed) {
      return;
    }

    this.isClosed = true;
    await Promise.all([this.asInternalUser.close(), this.rootScopedClient.close()]);
  }

  getScopedHeaders(request) {
    let scopedHeaders;

    if ((0, _http.isRealRequest)(request)) {
      const requestHeaders = (0, _router.ensureRawRequest)(request).headers;
      const requestIdHeaders = (0, _http.isKibanaRequest)(request) ? {
        'x-opaque-id': request.id
      } : {};
      const authHeaders = this.getAuthHeaders(request);
      scopedHeaders = (0, _router.filterHeaders)({ ...requestHeaders,
        ...requestIdHeaders,
        ...authHeaders
      }, this.allowListHeaders);
    } else {
      var _request$headers;

      scopedHeaders = (0, _router.filterHeaders)((_request$headers = request === null || request === void 0 ? void 0 : request.headers) !== null && _request$headers !== void 0 ? _request$headers : {}, this.config.requestHeadersWhitelist);
    }

    return { ..._default_headers.DEFAULT_HEADERS,
      ...this.config.customHeaders,
      ...scopedHeaders
    };
  }

}

exports.ClusterClient = ClusterClient;