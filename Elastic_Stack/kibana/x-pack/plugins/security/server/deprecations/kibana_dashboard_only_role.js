"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerKibanaDashboardOnlyRoleDeprecation = exports.KIBANA_DASHBOARD_ONLY_USER_ROLE_NAME = void 0;

var _i18n = require("@kbn/i18n");

var _errors = require("../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const KIBANA_DASHBOARD_ONLY_USER_ROLE_NAME = 'kibana_dashboard_only_user';
exports.KIBANA_DASHBOARD_ONLY_USER_ROLE_NAME = KIBANA_DASHBOARD_ONLY_USER_ROLE_NAME;

function getDeprecationMessage() {
  return _i18n.i18n.translate('xpack.security.deprecations.kibanaDashboardOnlyUser.deprecationMessage', {
    defaultMessage: 'Users with the "{kibanaDashboardOnlyUserRoleName}" role will not be able to access the Dashboard app. Use Kibana privileges instead.',
    values: {
      kibanaDashboardOnlyUserRoleName: KIBANA_DASHBOARD_ONLY_USER_ROLE_NAME
    }
  });
}

const registerKibanaDashboardOnlyRoleDeprecation = ({
  deprecationsService,
  logger,
  license,
  packageInfo
}) => {
  deprecationsService.registerDeprecations({
    getDeprecations: async context => {
      // Nothing to do if security is disabled
      if (!license.isEnabled()) {
        return [];
      }

      return [...(await getUsersDeprecations(context.esClient.asCurrentUser, logger, packageInfo)), ...(await getRoleMappingsDeprecations(context.esClient.asCurrentUser, logger, packageInfo))];
    }
  });
};

exports.registerKibanaDashboardOnlyRoleDeprecation = registerKibanaDashboardOnlyRoleDeprecation;

async function getUsersDeprecations(client, logger, packageInfo) {
  const deprecationTitle = _i18n.i18n.translate('xpack.security.deprecations.kibanaDashboardOnlyUser.usersDeprecationTitle', {
    defaultMessage: 'The "{kibanaDashboardOnlyUserRoleName}" role is deprecated: check user roles',
    values: {
      kibanaDashboardOnlyUserRoleName: KIBANA_DASHBOARD_ONLY_USER_ROLE_NAME
    }
  });

  let users;

  try {
    users = (await client.security.getUser()).body;
  } catch (err) {
    if ((0, _errors.getErrorStatusCode)(err) === 403) {
      logger.warn(`Failed to retrieve users when checking for deprecations: the "manage_security" cluster privilege is required.`);
    } else {
      logger.error(`Failed to retrieve users when checking for deprecations, unexpected error: ${(0, _errors.getDetailedErrorMessage)(err)}.`);
    }

    return deprecationError(deprecationTitle, packageInfo, err);
  }

  const usersWithKibanaDashboardOnlyRole = Object.values(users).filter(user => user.roles.includes(KIBANA_DASHBOARD_ONLY_USER_ROLE_NAME)).map(user => user.username);

  if (usersWithKibanaDashboardOnlyRole.length === 0) {
    return [];
  }

  return [{
    title: deprecationTitle,
    message: getDeprecationMessage(),
    level: 'warning',
    deprecationType: 'feature',
    documentationUrl: `https://www.elastic.co/guide/en/elasticsearch/reference/${packageInfo.branch}/built-in-roles.html`,
    correctiveActions: {
      manualSteps: [_i18n.i18n.translate('xpack.security.deprecations.kibanaDashboardOnlyUser.usersDeprecationCorrectiveActionOne', {
        defaultMessage: 'Create a custom role with Kibana privileges to grant access to Dashboard only.'
      }), _i18n.i18n.translate('xpack.security.deprecations.kibanaDashboardOnlyUser.usersDeprecationCorrectiveActionTwo', {
        defaultMessage: 'Remove the "{kibanaDashboardOnlyUserRoleName}" role from all users and add the custom role. The affected users are: {users}.',
        values: {
          kibanaDashboardOnlyUserRoleName: KIBANA_DASHBOARD_ONLY_USER_ROLE_NAME,
          users: usersWithKibanaDashboardOnlyRole.join(', ')
        }
      })]
    }
  }];
}

async function getRoleMappingsDeprecations(client, logger, packageInfo) {
  const deprecationTitle = _i18n.i18n.translate('xpack.security.deprecations.kibanaDashboardOnlyUser.roleMappingsDeprecationTitle', {
    defaultMessage: 'The "{kibanaDashboardOnlyUserRoleName}" role is deprecated: check role mappings',
    values: {
      kibanaDashboardOnlyUserRoleName: KIBANA_DASHBOARD_ONLY_USER_ROLE_NAME
    }
  });

  let roleMappings;

  try {
    roleMappings = (await client.security.getRoleMapping()).body;
  } catch (err) {
    if ((0, _errors.getErrorStatusCode)(err) === 403) {
      logger.warn(`Failed to retrieve role mappings when checking for deprecations: the "manage_security" cluster privilege is required.`);
    } else {
      logger.error(`Failed to retrieve role mappings when checking for deprecations, unexpected error: ${(0, _errors.getDetailedErrorMessage)(err)}.`);
    }

    return deprecationError(deprecationTitle, packageInfo, err);
  }

  const roleMappingsWithKibanaDashboardOnlyRole = Object.entries(roleMappings).filter(([, roleMapping]) => roleMapping.roles.includes(KIBANA_DASHBOARD_ONLY_USER_ROLE_NAME)).map(([mappingName]) => mappingName);

  if (roleMappingsWithKibanaDashboardOnlyRole.length === 0) {
    return [];
  }

  return [{
    title: deprecationTitle,
    message: getDeprecationMessage(),
    level: 'warning',
    deprecationType: 'feature',
    documentationUrl: `https://www.elastic.co/guide/en/elasticsearch/reference/${packageInfo.branch}/built-in-roles.html`,
    correctiveActions: {
      manualSteps: [_i18n.i18n.translate('xpack.security.deprecations.kibanaDashboardOnlyUser.roleMappingsDeprecationCorrectiveActionOne', {
        defaultMessage: 'Create a custom role with Kibana privileges to grant access to Dashboard only.'
      }), _i18n.i18n.translate('xpack.security.deprecations.kibanaDashboardOnlyUser.roleMappingsDeprecationCorrectiveActionTwo', {
        defaultMessage: 'Remove the "{kibanaDashboardOnlyUserRoleName}" role from all role mappings and add the custom role. The affected role mappings are: {roleMappings}.',
        values: {
          kibanaDashboardOnlyUserRoleName: KIBANA_DASHBOARD_ONLY_USER_ROLE_NAME,
          roleMappings: roleMappingsWithKibanaDashboardOnlyRole.join(', ')
        }
      })]
    }
  }];
}

function deprecationError(deprecationTitle, packageInfo, error) {
  if ((0, _errors.getErrorStatusCode)(error) === 403) {
    return [{
      title: deprecationTitle,
      level: 'fetch_error',
      deprecationType: 'feature',
      message: _i18n.i18n.translate('xpack.security.deprecations.kibanaDashboardOnlyUser.forbiddenErrorMessage', {
        defaultMessage: 'You do not have enough permissions to fix this deprecation.'
      }),
      documentationUrl: `https://www.elastic.co/guide/en/kibana/${packageInfo.branch}/xpack-security.html#_required_permissions_7`,
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.security.deprecations.kibanaDashboardOnlyUser.forbiddenErrorCorrectiveAction', {
          defaultMessage: 'Make sure you have a "manage_security" cluster privilege assigned.'
        })]
      }
    }];
  }

  return [{
    title: deprecationTitle,
    level: 'fetch_error',
    deprecationType: 'feature',
    message: _i18n.i18n.translate('xpack.security.deprecations.kibanaDashboardOnlyUser.unknownErrorMessage', {
      defaultMessage: 'Failed to perform deprecation check. Check Kibana logs for more details.'
    }),
    correctiveActions: {
      manualSteps: [_i18n.i18n.translate('xpack.security.deprecations.kibanaDashboardOnlyUser.unknownErrorCorrectiveAction', {
        defaultMessage: 'Check Kibana logs for more details.'
      })]
    }
  }];
}