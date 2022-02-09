"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerKibanaUserRoleDeprecation = exports.KIBANA_USER_ROLE_NAME = exports.KIBANA_ADMIN_ROLE_NAME = void 0;

var _i18n = require("@kbn/i18n");

var _errors = require("../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const KIBANA_USER_ROLE_NAME = 'kibana_user';
exports.KIBANA_USER_ROLE_NAME = KIBANA_USER_ROLE_NAME;
const KIBANA_ADMIN_ROLE_NAME = 'kibana_admin';
exports.KIBANA_ADMIN_ROLE_NAME = KIBANA_ADMIN_ROLE_NAME;

function getDeprecationMessage() {
  return _i18n.i18n.translate('xpack.security.deprecations.kibanaUser.deprecationMessage', {
    defaultMessage: 'Use the "{kibanaAdminRoleName}" role to grant access to all Kibana features in all spaces.',
    values: {
      kibanaAdminRoleName: KIBANA_ADMIN_ROLE_NAME
    }
  });
}

const registerKibanaUserRoleDeprecation = ({
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

exports.registerKibanaUserRoleDeprecation = registerKibanaUserRoleDeprecation;

async function getUsersDeprecations(client, logger, packageInfo) {
  const deprecationTitle = _i18n.i18n.translate('xpack.security.deprecations.kibanaUser.usersDeprecationTitle', {
    defaultMessage: 'The "{kibanaUserRoleName}" role is deprecated: check user roles',
    values: {
      kibanaUserRoleName: KIBANA_USER_ROLE_NAME
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

  const usersWithKibanaUserRole = Object.values(users).filter(user => user.roles.includes(KIBANA_USER_ROLE_NAME)).map(user => user.username);

  if (usersWithKibanaUserRole.length === 0) {
    return [];
  }

  return [{
    title: deprecationTitle,
    message: getDeprecationMessage(),
    level: 'warning',
    deprecationType: 'feature',
    documentationUrl: `https://www.elastic.co/guide/en/elasticsearch/reference/${packageInfo.branch}/built-in-roles.html`,
    correctiveActions: {
      api: {
        method: 'POST',
        path: '/internal/security/deprecations/kibana_user_role/_fix_users'
      },
      manualSteps: [_i18n.i18n.translate('xpack.security.deprecations.kibanaUser.usersDeprecationCorrectiveAction', {
        defaultMessage: 'Remove the "{kibanaUserRoleName}" role from all users and add the "{kibanaAdminRoleName}" role. The affected users are: {users}.',
        values: {
          kibanaUserRoleName: KIBANA_USER_ROLE_NAME,
          kibanaAdminRoleName: KIBANA_ADMIN_ROLE_NAME,
          users: usersWithKibanaUserRole.join(', ')
        }
      })]
    }
  }];
}

async function getRoleMappingsDeprecations(client, logger, packageInfo) {
  const deprecationTitle = _i18n.i18n.translate('xpack.security.deprecations.kibanaUser.roleMappingsDeprecationTitle', {
    defaultMessage: 'The "{kibanaUserRoleName}" role is deprecated: check role mappings',
    values: {
      kibanaUserRoleName: KIBANA_USER_ROLE_NAME
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

  const roleMappingsWithKibanaUserRole = Object.entries(roleMappings).filter(([, roleMapping]) => roleMapping.roles.includes(KIBANA_USER_ROLE_NAME)).map(([mappingName]) => mappingName);

  if (roleMappingsWithKibanaUserRole.length === 0) {
    return [];
  }

  return [{
    title: deprecationTitle,
    message: getDeprecationMessage(),
    level: 'warning',
    deprecationType: 'feature',
    documentationUrl: `https://www.elastic.co/guide/en/elasticsearch/reference/${packageInfo.branch}/built-in-roles.html`,
    correctiveActions: {
      api: {
        method: 'POST',
        path: '/internal/security/deprecations/kibana_user_role/_fix_role_mappings'
      },
      manualSteps: [_i18n.i18n.translate('xpack.security.deprecations.kibanaUser.roleMappingsDeprecationCorrectiveAction', {
        defaultMessage: 'Remove the "{kibanaUserRoleName}" role from all role mappings and add the "{kibanaAdminRoleName}" role. The affected role mappings are: {roleMappings}.',
        values: {
          kibanaUserRoleName: KIBANA_USER_ROLE_NAME,
          kibanaAdminRoleName: KIBANA_ADMIN_ROLE_NAME,
          roleMappings: roleMappingsWithKibanaUserRole.join(', ')
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
      message: _i18n.i18n.translate('xpack.security.deprecations.kibanaUser.forbiddenErrorMessage', {
        defaultMessage: 'You do not have enough permissions to fix this deprecation.'
      }),
      documentationUrl: `https://www.elastic.co/guide/en/kibana/${packageInfo.branch}/xpack-security.html#_required_permissions_7`,
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.security.deprecations.kibanaUser.forbiddenErrorCorrectiveAction', {
          defaultMessage: 'Make sure you have a "manage_security" cluster privilege assigned.'
        })]
      }
    }];
  }

  return [{
    title: deprecationTitle,
    level: 'fetch_error',
    deprecationType: 'feature',
    message: _i18n.i18n.translate('xpack.security.deprecations.kibanaUser.unknownErrorMessage', {
      defaultMessage: 'Failed to perform deprecation check. Check Kibana logs for more details.'
    }),
    correctiveActions: {
      manualSteps: [_i18n.i18n.translate('xpack.security.deprecations.kibanaUser.unknownErrorCorrectiveAction', {
        defaultMessage: 'Check Kibana logs for more details.'
      })]
    }
  }];
}