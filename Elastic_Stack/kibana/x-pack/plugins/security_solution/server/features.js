"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanaPrivilegesFeaturePrivileges = exports.getAlertsSubFeature = void 0;

var _i18n = require("@kbn/i18n");

var _server = require("../../../../src/core/server");

var _constants = require("../common/constants");

var _saved_objects = require("./saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CASES_SUB_FEATURE = {
  name: 'Cases',
  privilegeGroups: [{
    groupType: 'mutually_exclusive',
    privileges: [{
      id: 'cases_all',
      includeIn: 'all',
      name: 'All',
      savedObject: {
        all: [],
        read: []
      },
      // using variables with underscores here otherwise when we retrieve them from the kibana
      // capabilities in a hook I get type errors regarding boolean | ReadOnly<{[x: string]: boolean}>
      ui: ['crud_cases', 'read_cases'],
      // uiCapabilities.siem.crud_cases
      cases: {
        all: [_constants.APP_ID]
      }
    }, {
      id: 'cases_read',
      includeIn: 'read',
      name: 'Read',
      savedObject: {
        all: [],
        read: []
      },
      // using variables with underscores here otherwise when we retrieve them from the kibana
      // capabilities in a hook I get type errors regarding boolean | ReadOnly<{[x: string]: boolean}>
      ui: ['read_cases'],
      // uiCapabilities.siem.read_cases
      cases: {
        read: [_constants.APP_ID]
      }
    }]
  }]
};

const getAlertsSubFeature = ruleTypes => ({
  name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.manageAlertsName', {
    defaultMessage: 'Alerts'
  }),
  privilegeGroups: [{
    groupType: 'mutually_exclusive',
    privileges: [{
      id: 'alerts_all',
      name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subfeature.alertsAllName', {
        defaultMessage: 'All'
      }),
      includeIn: 'all',
      alerting: {
        alert: {
          all: ruleTypes
        }
      },
      savedObject: {
        all: [],
        read: []
      },
      ui: ['crud_alerts', 'read_alerts']
    }, {
      id: 'alerts_read',
      name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subfeature.alertsReadName', {
        defaultMessage: 'Read'
      }),
      includeIn: 'read',
      alerting: {
        alert: {
          read: ruleTypes
        }
      },
      savedObject: {
        all: [],
        read: []
      },
      ui: ['read_alerts']
    }]
  }]
});

exports.getAlertsSubFeature = getAlertsSubFeature;

const getKibanaPrivilegesFeaturePrivileges = ruleTypes => ({
  id: _constants.SERVER_APP_ID,
  name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.linkSecuritySolutionTitle', {
    defaultMessage: 'Security'
  }),
  order: 1100,
  category: _server.DEFAULT_APP_CATEGORIES.security,
  app: [_constants.APP_ID, 'kibana'],
  catalogue: ['securitySolution'],
  management: {
    insightsAndAlerting: ['triggersActions']
  },
  alerting: ruleTypes,
  cases: [_constants.APP_ID],
  subFeatures: [{ ...CASES_SUB_FEATURE
  }
  /* , { ...getAlertsSubFeature(ruleTypes) } */
  ],
  privileges: {
    all: {
      app: [_constants.APP_ID, 'kibana'],
      catalogue: ['securitySolution'],
      api: ['securitySolution', 'lists-all', 'lists-read', 'rac'],
      savedObject: {
        all: ['alert', 'exception-list', 'exception-list-agnostic', ..._saved_objects.savedObjectTypes],
        read: []
      },
      alerting: {
        rule: {
          all: ruleTypes
        }
      },
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      ui: ['show', 'crud']
    },
    read: {
      app: [_constants.APP_ID, 'kibana'],
      catalogue: ['securitySolution'],
      api: ['securitySolution', 'lists-read', 'rac'],
      savedObject: {
        all: [],
        read: ['exception-list', 'exception-list-agnostic', ..._saved_objects.savedObjectTypes]
      },
      alerting: {
        rule: {
          read: ruleTypes
        }
      },
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      ui: ['show']
    }
  }
});

exports.getKibanaPrivilegesFeaturePrivileges = getKibanaPrivilegesFeaturePrivileges;