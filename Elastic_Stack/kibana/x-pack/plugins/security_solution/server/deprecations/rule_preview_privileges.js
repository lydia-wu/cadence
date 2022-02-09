"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.roleIsExternal = exports.roleHasReadAccess = exports.registerRulePreviewPrivilegeDeprecations = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const PREVIEW_INDEX_PREFIX = '.preview.alerts-security.alerts';
const READ_PRIVILEGES = ['all', 'read'];

const roleHasReadAccess = (role, indexPrefix = _constants.DEFAULT_SIGNALS_INDEX) => role.elasticsearch.indices.some(index => index.names.some(indexName => indexName.startsWith(indexPrefix)) && index.privileges.some(indexPrivilege => READ_PRIVILEGES.includes(indexPrivilege)));

exports.roleHasReadAccess = roleHasReadAccess;

const roleIsExternal = role => {
  var _role$metadata;

  return ((_role$metadata = role.metadata) === null || _role$metadata === void 0 ? void 0 : _role$metadata._reserved) !== true;
};

exports.roleIsExternal = roleIsExternal;

const buildManualSteps = roleNames => {
  const baseSteps = [_i18n.i18n.translate('xpack.securitySolution.deprecations.rulePreviewPrivileges.manualStep1', {
    defaultMessage: 'Update your roles to include read privileges for the detection alerts preview indices appropriate for that role and space(s).'
  }), _i18n.i18n.translate('xpack.securitySolution.deprecations.rulePreviewPrivileges.manualStep2', {
    defaultMessage: 'In 8.0, users will be unable to view preview results until those permissions are added.'
  })];

  const informationalStep = _i18n.i18n.translate('xpack.securitySolution.deprecations.rulePreviewPrivileges.manualStep3', {
    defaultMessage: 'The roles that currently have read access to detection alerts indices are: {roles}',
    values: {
      roles: roleNames.join(', ')
    }
  });

  if (roleNames.length === 0) {
    return baseSteps;
  } else {
    return [...baseSteps, informationalStep];
  }
};

const registerRulePreviewPrivilegeDeprecations = ({
  deprecationsService,
  getKibanaRoles,
  packageInfo
}) => {
  deprecationsService.registerDeprecations({
    getDeprecations: async context => {
      let rolesWhichReadSignals = [];

      if (getKibanaRoles) {
        var _roles$filter;

        const {
          roles,
          errors
        } = await getKibanaRoles({
          context
        });

        if (errors !== null && errors !== void 0 && errors.length) {
          return errors;
        }

        rolesWhichReadSignals = (_roles$filter = roles === null || roles === void 0 ? void 0 : roles.filter(role => roleIsExternal(role) && roleHasReadAccess(role) && !roleHasReadAccess(role, PREVIEW_INDEX_PREFIX))) !== null && _roles$filter !== void 0 ? _roles$filter : [];
      }

      if (rolesWhichReadSignals.length === 0) {
        return [];
      }

      const roleNamesWhichReadSignals = rolesWhichReadSignals.map(role => role.name);
      return [{
        title: _i18n.i18n.translate('xpack.securitySolution.deprecations.rulePreviewPrivileges.title', {
          defaultMessage: 'The Detections Rule Preview feature is changing'
        }),
        message: _i18n.i18n.translate('xpack.securitySolution.deprecations.rulePreviewPrivileges.message', {
          values: {
            previewIndexPrefix: PREVIEW_INDEX_PREFIX,
            signalsIndexPrefix: _constants.DEFAULT_SIGNALS_INDEX
          },
          defaultMessage: 'In order to enable a more robust preview in 8.0+, users will need read privileges to new detection alerts preview indices ({previewIndexPrefix}-<KIBANA_SPACE>), analogous to existing detection alerts indices ({signalsIndexPrefix}-<KIBANA_SPACE>).'
        }),
        level: 'warning',
        deprecationType: 'feature',
        documentationUrl: `https://www.elastic.co/guide/en/security/${packageInfo.branch}/rules-ui-create.html#preview-rules`,
        correctiveActions: {
          manualSteps: buildManualSteps(roleNamesWhichReadSignals)
        }
      }];
    }
  });
};

exports.registerRulePreviewPrivilegeDeprecations = registerRulePreviewPrivilegeDeprecations;