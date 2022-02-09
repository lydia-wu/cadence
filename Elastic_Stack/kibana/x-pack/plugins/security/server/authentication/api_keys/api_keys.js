"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APIKeys = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _http_authentication = require("../http_authentication");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Class responsible for managing Elasticsearch API keys.
 */


class APIKeys {
  constructor({
    logger,
    clusterClient,
    license
  }) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "clusterClient", void 0);
    (0, _defineProperty2.default)(this, "license", void 0);
    this.logger = logger;
    this.clusterClient = clusterClient;
    this.license = license;
  }
  /**
   * Determines if API Keys are enabled in Elasticsearch.
   */


  async areAPIKeysEnabled() {
    if (!this.license.isEnabled()) {
      return false;
    }

    const id = `kibana-api-key-service-test`;
    this.logger.debug(`Testing if API Keys are enabled by attempting to invalidate a non-existant key: ${id}`);

    try {
      await this.clusterClient.asInternalUser.security.invalidateApiKey({
        body: {
          ids: [id]
        }
      });
      return true;
    } catch (e) {
      if (this.doesErrorIndicateAPIKeysAreDisabled(e)) {
        return false;
      }

      throw e;
    }
  }
  /**
   * Tries to create an API key for the current user.
   *
   * Returns newly created API key or `null` if API keys are disabled.
   *
   * @param request Request instance.
   * @param params The params to create an API key
   */


  async create(request, params) {
    if (!this.license.isEnabled()) {
      return null;
    }

    this.logger.debug('Trying to create an API key'); // User needs `manage_api_key` privilege to use this API

    let result;

    try {
      result = (await this.clusterClient.asScoped(request).asCurrentUser.security.createApiKey({
        body: params
      })).body;
      this.logger.debug('API key was created successfully');
    } catch (e) {
      this.logger.error(`Failed to create API key: ${e.message}`);
      throw e;
    }

    return result;
  }
  /**
   * Tries to grant an API key for the current user.
   * @param request Request instance.
   * @param createParams Create operation parameters.
   */


  async grantAsInternalUser(request, createParams) {
    if (!this.license.isEnabled()) {
      return null;
    }

    this.logger.debug('Trying to grant an API key');

    const authorizationHeader = _http_authentication.HTTPAuthorizationHeader.parseFromRequest(request);

    if (authorizationHeader == null) {
      throw new Error(`Unable to grant an API Key, request does not contain an authorization header`);
    }

    const params = this.getGrantParams(createParams, authorizationHeader); // User needs `manage_api_key` or `grant_api_key` privilege to use this API

    let result;

    try {
      result = (await this.clusterClient.asInternalUser.security.grantApiKey({
        // @ts-expect-error @elastic/elasticsearch api_key.role_descriptors  doesn't support `Record<string, any>`
        body: params
      })).body;
      this.logger.debug('API key was granted successfully');
    } catch (e) {
      this.logger.error(`Failed to grant API key: ${e.message}`);
      throw e;
    }

    return result;
  }
  /**
   * Tries to invalidate an API keys.
   * @param request Request instance.
   * @param params The params to invalidate an API keys.
   */


  async invalidate(request, params) {
    if (!this.license.isEnabled()) {
      return null;
    }

    this.logger.debug(`Trying to invalidate ${params.ids.length} an API key as current user`);
    let result;

    try {
      // User needs `manage_api_key` privilege to use this API
      result = (await this.clusterClient.asScoped(request).asCurrentUser.security.invalidateApiKey({
        body: {
          ids: params.ids
        }
      })).body;
      this.logger.debug(`API keys by ids=[${params.ids.join(', ')}] was invalidated successfully as current user`);
    } catch (e) {
      this.logger.error(`Failed to invalidate API keys by ids=[${params.ids.join(', ')}] as current user: ${e.message}`);
      throw e;
    }

    return result;
  }
  /**
   * Tries to invalidate the API keys by using the internal user.
   * @param params The params to invalidate the API keys.
   */


  async invalidateAsInternalUser(params) {
    if (!this.license.isEnabled()) {
      return null;
    }

    this.logger.debug(`Trying to invalidate ${params.ids.length} API keys`);
    let result;

    try {
      // Internal user needs `cluster:admin/xpack/security/api_key/invalidate` privilege to use this API
      result = (await this.clusterClient.asInternalUser.security.invalidateApiKey({
        body: {
          ids: params.ids
        }
      })).body;
      this.logger.debug(`API keys by ids=[${params.ids.join(', ')}] was invalidated successfully`);
    } catch (e) {
      this.logger.error(`Failed to invalidate API keys by ids=[${params.ids.join(', ')}]: ${e.message}`);
      throw e;
    }

    return result;
  }

  doesErrorIndicateAPIKeysAreDisabled(e) {
    var _e$body, _e$body$error;

    const disabledFeature = (_e$body = e.body) === null || _e$body === void 0 ? void 0 : (_e$body$error = _e$body.error) === null || _e$body$error === void 0 ? void 0 : _e$body$error['disabled.feature'];
    return disabledFeature === 'api_keys';
  }

  getGrantParams(createParams, authorizationHeader) {
    if (authorizationHeader.scheme.toLowerCase() === 'bearer') {
      return {
        api_key: createParams,
        grant_type: 'access_token',
        access_token: authorizationHeader.credentials
      };
    }

    if (authorizationHeader.scheme.toLowerCase() === 'basic') {
      const basicCredentials = _http_authentication.BasicHTTPAuthorizationHeaderCredentials.parseFromCredentials(authorizationHeader.credentials);

      return {
        api_key: createParams,
        grant_type: 'password',
        username: basicCredentials.username,
        password: basicCredentials.password
      };
    }

    throw new Error(`Unsupported scheme "${authorizationHeader.scheme}" for granting API Key`);
  }

}

exports.APIKeys = APIKeys;