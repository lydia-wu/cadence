"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrivilegeDeprecationsService = void 0;

var _i18n = require("@kbn/i18n");

var _authorization = require("../authorization");

var _errors = require("../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getPrivilegeDeprecationsService = (authz, license, logger) => {
  const getKibanaRoles = async ({
    context,
    featureId
  }) => {
    // Nothing to do if security is disabled
    if (!license.isEnabled()) {
      return {
        roles: []
      };
    }

    let kibanaRoles;

    try {
      const {
        body: elasticsearchRoles
      } = await context.esClient.asCurrentUser.security.getRole();
      kibanaRoles = Object.entries(elasticsearchRoles).map(([roleName, elasticsearchRole]) => (0, _authorization.transformElasticsearchRoleToRole)( // @ts-expect-error `SecurityIndicesPrivileges.names` expected to be `string[]`
      elasticsearchRole, roleName, authz.applicationName));
    } catch (e) {
      const statusCode = (0, _errors.getErrorStatusCode)(e);
      const isUnauthorized = statusCode === 403;
      const message = isUnauthorized ? _i18n.i18n.translate('xpack.security.privilegeDeprecationsService.error.unauthorized.message', {
        defaultMessage: `You must have the 'manage_security' cluster privilege to fix role deprecations.`
      }) : _i18n.i18n.translate('xpack.security.privilegeDeprecationsService.error.retrievingRoles.message', {
        defaultMessage: `Error retrieving roles for privilege deprecations: {message}`,
        values: {
          message: (0, _errors.getDetailedErrorMessage)(e)
        }
      });

      if (isUnauthorized) {
        logger.warn(`Failed to retrieve roles when checking for deprecations: the manage_security cluster privilege is required`);
      } else {
        logger.error(`Failed to retrieve roles when checking for deprecations, unexpected error: ${(0, _errors.getDetailedErrorMessage)(e)}`);
      }

      return {
        errors: [{
          title: _i18n.i18n.translate('xpack.security.privilegeDeprecationsService.error.title', {
            defaultMessage: `Error in privilege deprecations services`
          }),
          level: 'fetch_error',
          message,
          correctiveActions: {
            manualSteps: [_i18n.i18n.translate('xpack.security.privilegeDeprecationsService.manualSteps.message', {
              defaultMessage: 'A user with the "manage_security" cluster privilege is required to perform this check.'
            })]
          }
        }]
      };
    }

    return {
      roles: featureId ? kibanaRoles.filter(role => role.kibana.find(privilege => Object.hasOwnProperty.call(privilege.feature, featureId))) : kibanaRoles
    };
  };

  return Object.freeze({
    getKibanaRoles
  });
};

exports.getPrivilegeDeprecationsService = getPrivilegeDeprecationsService;