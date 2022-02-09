"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BUILT_IN_ALERTS_FEATURE = void 0;

var _i18n = require("@kbn/i18n");

var _alert_type = require("./alert_types/index_threshold/alert_type");

var _alert_type2 = require("./alert_types/geo_containment/alert_type");

var _alert_type3 = require("./alert_types/es_query/alert_type");

var _common = require("../common");

var _server = require("../../../../src/core/server");

var _common2 = require("../../transform/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const TransformHealth = _common2.TRANSFORM_RULE_TYPE.TRANSFORM_HEALTH;
const BUILT_IN_ALERTS_FEATURE = {
  id: _common.STACK_ALERTS_FEATURE_ID,
  name: _i18n.i18n.translate('xpack.stackAlerts.featureRegistry.actionsFeatureName', {
    defaultMessage: 'Stack Rules'
  }),
  app: [],
  category: _server.DEFAULT_APP_CATEGORIES.management,
  management: {
    insightsAndAlerting: ['triggersActions']
  },
  alerting: [_alert_type.ID, _alert_type2.GEO_CONTAINMENT_ID, _alert_type3.ES_QUERY_ID, TransformHealth],
  privileges: {
    all: {
      app: [],
      catalogue: [],
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      alerting: {
        rule: {
          all: [_alert_type.ID, _alert_type2.GEO_CONTAINMENT_ID, _alert_type3.ES_QUERY_ID, TransformHealth]
        },
        alert: {
          all: [_alert_type.ID, _alert_type2.GEO_CONTAINMENT_ID, _alert_type3.ES_QUERY_ID, TransformHealth]
        }
      },
      savedObject: {
        all: [],
        read: []
      },
      api: [],
      ui: []
    },
    read: {
      app: [],
      catalogue: [],
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      alerting: {
        rule: {
          read: [_alert_type.ID, _alert_type2.GEO_CONTAINMENT_ID, _alert_type3.ES_QUERY_ID, TransformHealth]
        },
        alert: {
          read: [_alert_type.ID, _alert_type2.GEO_CONTAINMENT_ID, _alert_type3.ES_QUERY_ID, TransformHealth]
        }
      },
      savedObject: {
        all: [],
        read: []
      },
      api: [],
      ui: []
    }
  }
};
exports.BUILT_IN_ALERTS_FEATURE = BUILT_IN_ALERTS_FEATURE;