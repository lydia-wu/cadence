"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthenticationService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _constants = require("../../common/constants");

var _model = require("../../common/model");

var _errors = require("../errors");

var _tags = require("../routes/tags");

var _api_keys = require("./api_keys");

var _authenticator = require("./authenticator");

var _can_redirect_request = require("./can_redirect_request");

var _unauthenticated_page = require("./unauthenticated_page");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class AuthenticationService {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "license", void 0);
    (0, _defineProperty2.default)(this, "authenticator", void 0);
    (0, _defineProperty2.default)(this, "session", void 0);
    this.logger = logger;
  }

  setup({
    config,
    http,
    license,
    buildNumber
  }) {
    this.license = license; // If we cannot automatically authenticate users we should redirect them straight to the login
    // page if possible, so that they can try other methods to log in. If not possible, we should
    // render a dedicated `Unauthenticated` page from which users can explicitly trigger a new
    // login attempt. There are two cases when we can redirect to the login page:
    // 1. Login selector is enabled
    // 2. Login selector is disabled, but the provider with the lowest `order` uses login form

    const isLoginPageAvailable = config.authc.selector.enabled || config.authc.sortedProviders.length > 0 && (0, _model.shouldProviderUseLoginForm)(config.authc.sortedProviders[0].type);
    http.registerAuth(async (request, response, t) => {
      if (!license.isLicenseAvailable()) {
        this.logger.error('License is not available, authentication is not possible.');
        return response.customError({
          body: 'License is not available.',
          statusCode: 503,
          headers: {
            'Retry-After': '30'
          }
        });
      } // If security is disabled, then continue with no user credentials.


      if (!license.isEnabled()) {
        this.logger.debug('Current license does not support any security features, authentication is not needed.');
        return t.authenticated();
      }

      if (!this.authenticator) {
        this.logger.error('Authentication sub-system is not fully initialized yet.');
        return response.customError({
          body: 'Authentication sub-system is not fully initialized yet.',
          statusCode: 503,
          headers: {
            'Retry-After': '30'
          }
        });
      }

      const authenticationResult = await this.authenticator.authenticate(request);

      if (authenticationResult.succeeded()) {
        return t.authenticated({
          state: authenticationResult.user,
          requestHeaders: authenticationResult.authHeaders,
          responseHeaders: authenticationResult.authResponseHeaders
        });
      }

      if (authenticationResult.redirected()) {
        // Some authentication mechanisms may require user to be redirected to another location to
        // initiate or complete authentication flow. It can be Kibana own login page for basic
        // authentication (username and password) or arbitrary external page managed by 3rd party
        // Identity Provider for SSO authentication mechanisms. Authentication provider is the one who
        // decides what location user should be redirected to.
        return t.redirected({
          location: authenticationResult.redirectURL,
          ...(authenticationResult.authResponseHeaders || {})
        });
      }

      if (authenticationResult.failed()) {
        const error = authenticationResult.error;
        this.logger.info(`Authentication attempt failed: ${(0, _errors.getDetailedErrorMessage)(error)}`); // proxy Elasticsearch "native" errors

        const statusCode = (0, _errors.getErrorStatusCode)(error);

        if (typeof statusCode === 'number') {
          return response.customError({
            body: error,
            statusCode,
            headers: authenticationResult.authResponseHeaders
          });
        }

        return response.unauthorized({
          headers: authenticationResult.authResponseHeaders
        });
      }

      this.logger.debug('Could not handle authentication attempt');
      return t.notHandled();
    });
    http.registerOnPreResponse(async (request, preResponse, toolkit) => {
      var _this$session;

      if (preResponse.statusCode !== 401 || !(0, _can_redirect_request.canRedirectRequest)(request)) {
        return toolkit.next();
      }

      if (!this.authenticator) {
        // Core doesn't allow returning error here.
        this.logger.error('Authentication sub-system is not fully initialized yet.');
        return toolkit.next();
      } // If users can eventually re-login we want to redirect them directly to the page they tried
      // to access initially, but we only want to do that for routes that aren't part of the various
      // authentication flows that wouldn't make any sense after successful authentication.


      const originalURL = !request.route.options.tags.includes(_tags.ROUTE_TAG_AUTH_FLOW) ? this.authenticator.getRequestOriginalURL(request) : `${http.basePath.get(request)}/`;

      if (!isLoginPageAvailable) {
        return toolkit.render({
          body: (0, _unauthenticated_page.renderUnauthenticatedPage)({
            buildNumber,
            basePath: http.basePath,
            originalURL
          }),
          headers: {
            'Content-Security-Policy': http.csp.header
          }
        });
      }

      const needsToLogout = (await ((_this$session = this.session) === null || _this$session === void 0 ? void 0 : _this$session.getSID(request))) !== undefined;

      if (needsToLogout) {
        this.logger.warn('Could not authenticate user with the existing session. Forcing logout.');
      }

      return toolkit.render({
        body: '<div/>',
        headers: {
          'Content-Security-Policy': http.csp.header,
          Refresh: `0;url=${http.basePath.prepend(`${needsToLogout ? '/logout' : '/login'}?msg=UNAUTHENTICATED&${_constants.NEXT_URL_QUERY_STRING_PARAMETER}=${encodeURIComponent(originalURL)}`)}`
        }
      });
    });
  }

  start({
    audit,
    config,
    clusterClient,
    featureUsageService,
    http,
    legacyAuditLogger,
    loggers,
    session
  }) {
    const apiKeys = new _api_keys.APIKeys({
      clusterClient,
      logger: this.logger.get('api-key'),
      license: this.license
    });
    /**
     * Retrieves server protocol name/host name/port and merges it with `xpack.security.public` config
     * to construct a server base URL (deprecated, used by the SAML provider only).
     */

    const getServerBaseURL = () => {
      const {
        protocol,
        hostname,
        port
      } = http.getServerInfo();
      const serverConfig = {
        protocol,
        hostname,
        port,
        ...config.public
      };
      return `${serverConfig.protocol}://${serverConfig.hostname}:${serverConfig.port}`;
    };

    const getCurrentUser = request => {
      var _http$auth$get$state;

      return (_http$auth$get$state = http.auth.get(request).state) !== null && _http$auth$get$state !== void 0 ? _http$auth$get$state : null;
    };

    this.session = session;
    this.authenticator = new _authenticator.Authenticator({
      legacyAuditLogger,
      audit,
      loggers,
      clusterClient,
      basePath: http.basePath,
      config: {
        authc: config.authc
      },
      getCurrentUser,
      featureUsageService,
      getServerBaseURL,
      license: this.license,
      session
    });
    return {
      apiKeys: {
        areAPIKeysEnabled: apiKeys.areAPIKeysEnabled.bind(apiKeys),
        create: apiKeys.create.bind(apiKeys),
        grantAsInternalUser: apiKeys.grantAsInternalUser.bind(apiKeys),
        invalidate: apiKeys.invalidate.bind(apiKeys),
        invalidateAsInternalUser: apiKeys.invalidateAsInternalUser.bind(apiKeys)
      },
      login: this.authenticator.login.bind(this.authenticator),
      logout: this.authenticator.logout.bind(this.authenticator),
      acknowledgeAccessAgreement: this.authenticator.acknowledgeAccessAgreement.bind(this.authenticator),

      /**
       * Retrieves currently authenticated user associated with the specified request.
       * @param request
       */
      getCurrentUser
    };
  }

}

exports.AuthenticationService = AuthenticationService;