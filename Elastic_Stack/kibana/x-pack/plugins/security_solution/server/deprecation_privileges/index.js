"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSecuritySolutionPrivileges = exports.registerPrivilegeDeprecations = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateSecuritySolutionPrivileges = siemPrivileges => {
  const casesPrivs = new Set();

  for (const priv of siemPrivileges) {
    switch (priv) {
      case 'all':
        casesPrivs.add('all');
        break;

      case 'read':
        casesPrivs.add('read');
        break;

      case 'cases_all':
        casesPrivs.add('all');
        break;

      case 'cases_read':
        casesPrivs.add('read');
        break;
    }
  }

  const casePrivileges = casesPrivs.has('all') ? ['all'] : casesPrivs.has('read') ? ['read'] : [];
  return { ...(siemPrivileges.length > 0 ? {
      [_constants.SERVER_APP_ID]: siemPrivileges
    } : {}),
    ...(casePrivileges.length > 0 ? {
      [_constants.CASES_FEATURE_ID]: casePrivileges
    } : {})
  };
};

exports.updateSecuritySolutionPrivileges = updateSecuritySolutionPrivileges;
const SIEM_PRIVILEGES_FOR_CASES = new Set(['all', 'read', 'cases_all', 'cases_read']);

function outdatedSiemRolePredicate(role) {
  return role.kibana.some(({
    feature
  }) => !feature[_constants.CASES_FEATURE_ID] && feature.siem.some(x => SIEM_PRIVILEGES_FOR_CASES.has(x)));
}

const registerPrivilegeDeprecations = ({
  deprecationsService,
  getKibanaRoles,
  logger
}) => {
  deprecationsService.registerDeprecations({
    getDeprecations: async context => {
      let deprecatedRoles = [];

      if (!getKibanaRoles) {
        return deprecatedRoles;
      }

      const responseRoles = await getKibanaRoles({
        context,
        featureId: 'siem'
      });

      if (responseRoles.errors && responseRoles.errors.length > 0) {
        return responseRoles.errors;
      }

      try {
        var _responseRoles$roles;

        const filteredRoles = ((_responseRoles$roles = responseRoles.roles) !== null && _responseRoles$roles !== void 0 ? _responseRoles$roles : []).filter(outdatedSiemRolePredicate);
        deprecatedRoles = filteredRoles.map(role => {
          const {
            metadata,
            elasticsearch,
            kibana,
            name: roleName
          } = role;
          const updatedKibana = kibana.map(privilege => {
            const {
              siem,
              ...otherFeatures
            } = privilege.feature;
            const privilegeContainsSiem = Array.isArray(siem) && siem.length > 0;

            if (privilegeContainsSiem) {
              return { ...privilege,
                feature: { ...otherFeatures,
                  ...updateSecuritySolutionPrivileges(siem)
                }
              };
            }

            return privilege;
          });
          const updatedRole = {
            metadata,
            elasticsearch,
            kibana: updatedKibana
          };
          return {
            title: _i18n.i18n.translate('xpack.securitySolution.privilegeDeprecations.casesSubFeaturePrivileges.title', {
              defaultMessage: 'The Security feature is changing, and the "{roleName}" role requires an update',
              values: {
                roleName
              }
            }),
            message: _i18n.i18n.translate('xpack.securitySolution.privilegeDeprecations.casesSubFeaturePrivileges.message', {
              defaultMessage: 'The Security feature will be split into the Security and Cases features in 8.0. The "{roleName}" role grants access to the Security feature only. Update the role to also grant access to the Cases feature.',
              values: {
                roleName
              }
            }),
            level: 'warning',
            deprecationType: 'feature',
            correctiveActions: {
              api: {
                method: 'PUT',
                path: `/api/security/role/${encodeURIComponent(role.name)}`,
                body: updatedRole,
                omitContextFromBody: true
              },
              manualSteps: []
            }
          };
        });
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'n/a';

        const message = _i18n.i18n.translate('xpack.securitySolution.privilegeDeprecations.error.casesSubFeaturePrivileges.message', {
          defaultMessage: `Failed to create cases roles from siem roles, unexpected error: {message}`,
          values: {
            message: errMsg
          }
        });

        logger.error(`Failed to create cases roles from siem roles, unexpected error: ${errMsg !== null && errMsg !== void 0 ? errMsg : ''}`);
        return [{
          title: _i18n.i18n.translate('xpack.securitySolution.privilegeDeprecations.error.casesSubFeaturePrivileges.title', {
            defaultMessage: `Error in security solution to deprecate cases sub feature`
          }),
          level: 'fetch_error',
          message,
          correctiveActions: {
            manualSteps: [_i18n.i18n.translate('xpack.securitySolution.privilegeDeprecations.manualSteps.casesSubFeaturePrivileges.message', {
              defaultMessage: 'A user will have to set cases privileges manually in your associated role'
            })]
          }
        }];
      }

      return deprecatedRoles;
    }
  });
};

exports.registerPrivilegeDeprecations = registerPrivilegeDeprecations;