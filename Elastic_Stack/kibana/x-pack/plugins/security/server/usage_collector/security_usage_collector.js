"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSecurityUsageCollector = registerSecurityUsageCollector;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// List of auth schemes collected from https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml

const WELL_KNOWN_AUTH_SCHEMES = ['basic', 'bearer', 'digest', 'hoba', 'mutual', 'negotiate', 'oauth', 'scram-sha-1', 'scram-sha-256', 'vapid', 'apikey' // not part of the spec, but used by the Elastic Stack for API Key authentication
];

function registerSecurityUsageCollector({
  usageCollection,
  config,
  license
}) {
  // usageCollection is an optional dependency, so make sure to return if it is not registered.
  if (!usageCollection) {
    return;
  } // create usage collector


  const securityCollector = usageCollection.makeUsageCollector({
    type: 'security',
    isReady: () => license.isLicenseAvailable(),
    schema: {
      auditLoggingEnabled: {
        type: 'boolean',
        _meta: {
          description: 'Indicates if audit logging is both enabled and supported by the current license.'
        }
      },
      auditLoggingType: {
        type: 'keyword',
        _meta: {
          description: 'If auditLoggingEnabled is true, indicates what type is enabled (ECS or legacy).'
        }
      },
      loginSelectorEnabled: {
        type: 'boolean',
        _meta: {
          description: 'Indicates if the login selector UI is enabled.'
        }
      },
      accessAgreementEnabled: {
        type: 'boolean',
        _meta: {
          description: 'Indicates if the access agreement UI is both enabled and supported by the current license.'
        }
      },
      authProviderCount: {
        type: 'long',
        _meta: {
          description: 'The number of configured auth providers (including disabled auth providers).'
        }
      },
      enabledAuthProviders: {
        type: 'array',
        items: {
          type: 'keyword',
          _meta: {
            description: 'The types of enabled auth providers (such as `saml`, `basic`, `pki`, etc).'
          }
        }
      },
      httpAuthSchemes: {
        type: 'array',
        items: {
          type: 'keyword',
          _meta: {
            description: 'The set of enabled http auth schemes. Used for api-based usage, and when credentials are provided via reverse-proxy.'
          }
        }
      },
      sessionIdleTimeoutInMinutes: {
        type: 'long',
        _meta: {
          description: 'The global session idle timeout expiration that is configured, in minutes (0 if disabled).'
        }
      },
      sessionLifespanInMinutes: {
        type: 'long',
        _meta: {
          description: 'The global session lifespan expiration that is configured, in minutes (0 if disabled).'
        }
      },
      sessionCleanupInMinutes: {
        type: 'long',
        _meta: {
          description: 'The session cleanup interval that is configured, in minutes (0 if disabled).'
        }
      }
    },
    fetch: () => {
      var _sessionExpirations$i, _sessionExpirations$i2, _sessionExpirations$l, _sessionExpirations$l2, _config$session$clean, _config$session$clean2;

      const {
        allowRbac,
        allowAccessAgreement,
        allowAuditLogging,
        allowLegacyAuditLogging
      } = license.getFeatures();

      if (!allowRbac) {
        return {
          auditLoggingEnabled: false,
          loginSelectorEnabled: false,
          accessAgreementEnabled: false,
          authProviderCount: 0,
          enabledAuthProviders: [],
          httpAuthSchemes: [],
          sessionIdleTimeoutInMinutes: 0,
          sessionLifespanInMinutes: 0,
          sessionCleanupInMinutes: 0
        };
      }

      const legacyAuditLoggingEnabled = allowLegacyAuditLogging && config.audit.enabled;
      const ecsAuditLoggingEnabled = allowAuditLogging && config.audit.enabled && config.audit.appender != null;
      let auditLoggingType;

      if (ecsAuditLoggingEnabled) {
        auditLoggingType = 'ecs';
      } else if (legacyAuditLoggingEnabled) {
        auditLoggingType = 'legacy';
      }

      const loginSelectorEnabled = config.authc.selector.enabled;
      const authProviderCount = config.authc.sortedProviders.length;
      const enabledAuthProviders = [...new Set(config.authc.sortedProviders.reduce((acc, provider) => [...acc, provider.type], []))];
      const accessAgreementEnabled = allowAccessAgreement && config.authc.sortedProviders.some(provider => provider.hasAccessAgreement);
      const httpAuthSchemes = config.authc.http.schemes.filter(scheme => WELL_KNOWN_AUTH_SCHEMES.includes(scheme.toLowerCase()));
      const sessionExpirations = config.session.getExpirationTimeouts(undefined); // use `undefined` to get global expiration values

      const sessionIdleTimeoutInMinutes = (_sessionExpirations$i = (_sessionExpirations$i2 = sessionExpirations.idleTimeout) === null || _sessionExpirations$i2 === void 0 ? void 0 : _sessionExpirations$i2.asMinutes()) !== null && _sessionExpirations$i !== void 0 ? _sessionExpirations$i : 0;
      const sessionLifespanInMinutes = (_sessionExpirations$l = (_sessionExpirations$l2 = sessionExpirations.lifespan) === null || _sessionExpirations$l2 === void 0 ? void 0 : _sessionExpirations$l2.asMinutes()) !== null && _sessionExpirations$l !== void 0 ? _sessionExpirations$l : 0;
      const sessionCleanupInMinutes = (_config$session$clean = (_config$session$clean2 = config.session.cleanupInterval) === null || _config$session$clean2 === void 0 ? void 0 : _config$session$clean2.asMinutes()) !== null && _config$session$clean !== void 0 ? _config$session$clean : 0;
      return {
        auditLoggingEnabled: legacyAuditLoggingEnabled || ecsAuditLoggingEnabled,
        auditLoggingType,
        loginSelectorEnabled,
        accessAgreementEnabled,
        authProviderCount,
        enabledAuthProviders,
        httpAuthSchemes,
        sessionIdleTimeoutInMinutes,
        sessionLifespanInMinutes,
        sessionCleanupInMinutes
      };
    }
  }); // register usage collector

  usageCollection.registerCollector(securityCollector);
}