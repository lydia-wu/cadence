"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLifecycleExecutor = void 0;

var _Either = require("fp-ts/lib/Either");

var rt = _interopRequireWildcard(require("io-ts"));

var _uuid = require("uuid");

var _parse_technical_fields = require("../../common/parse_technical_fields");

var _technical_rule_data_field_names = require("../../common/technical_rule_data_field_names");

var _get_common_alert_fields = require("./get_common_alert_fields");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const trackedAlertStateRt = rt.type({
  alertId: rt.string,
  alertUuid: rt.string,
  started: rt.string
});

const alertTypeStateRt = () => rt.record(rt.string, rt.unknown);

const wrappedStateRt = () => rt.type({
  wrapped: alertTypeStateRt(),
  trackedAlerts: rt.record(rt.string, trackedAlertStateRt)
});
/**
 * This is redefined instead of derived from above `wrappedStateRt` because
 * there's no easy way to instantiate generic values such as the runtime type
 * factory function.
 */


const createLifecycleExecutor = (logger, ruleDataClient) => wrappedExecutor => async options => {
  const {
    services: {
      alertInstanceFactory
    },
    state: previousState
  } = options;
  const state = (0, _Either.getOrElse)(() => ({
    wrapped: previousState,
    trackedAlerts: {}
  }))(wrappedStateRt().decode(previousState));
  const commonRuleFields = (0, _get_common_alert_fields.getCommonAlertFields)(options);
  const currentAlerts = {};
  const lifecycleAlertServices = {
    alertWithLifecycle: ({
      id,
      fields
    }) => {
      currentAlerts[id] = fields;
      return alertInstanceFactory(id);
    }
  };
  const nextWrappedState = await wrappedExecutor({ ...options,
    state: state.wrapped != null ? state.wrapped : {},
    services: { ...options.services,
      ...lifecycleAlertServices
    }
  });
  const currentAlertIds = Object.keys(currentAlerts);
  const trackedAlertIds = Object.keys(state.trackedAlerts);
  const newAlertIds = currentAlertIds.filter(alertId => !trackedAlertIds.includes(alertId));
  const allAlertIds = [...new Set(currentAlertIds.concat(trackedAlertIds))];
  const trackedAlertStates = Object.values(state.trackedAlerts);
  logger.debug(`Tracking ${allAlertIds.length} alerts (${newAlertIds.length} new, ${trackedAlertStates.length} previous)`);
  const trackedAlertsDataMap = {};

  if (trackedAlertStates.length) {
    const {
      hits
    } = await ruleDataClient.getReader().search({
      body: {
        query: {
          bool: {
            filter: [{
              term: {
                [_technical_rule_data_field_names.ALERT_RULE_UUID]: commonRuleFields[_technical_rule_data_field_names.ALERT_RULE_UUID]
              }
            }, {
              terms: {
                [_technical_rule_data_field_names.ALERT_UUID]: trackedAlertStates.map(trackedAlertState => trackedAlertState.alertUuid)
              }
            }]
          }
        },
        size: trackedAlertStates.length,
        collapse: {
          field: _technical_rule_data_field_names.ALERT_UUID
        },
        _source: false,
        fields: [{
          field: '*',
          include_unmapped: true
        }],
        sort: {
          [_technical_rule_data_field_names.TIMESTAMP]: 'desc'
        }
      },
      allow_no_indices: true
    });
    hits.hits.forEach(hit => {
      const fields = (0, _parse_technical_fields.parseTechnicalFields)(hit.fields);
      const indexName = hit._index;
      const alertId = fields[_technical_rule_data_field_names.ALERT_INSTANCE_ID];
      trackedAlertsDataMap[alertId] = {
        indexName,
        fields
      };
    });
  }

  const makeEventsDataMapFor = alertIds => alertIds.map(alertId => {
    var _state$trackedAlerts$, _alertData$fields$ALE;

    const alertData = trackedAlertsDataMap[alertId];
    const currentAlertData = currentAlerts[alertId];

    if (!alertData) {
      logger.warn(`Could not find alert data for ${alertId}`);
    }

    const isNew = !state.trackedAlerts[alertId];
    const isRecovered = !currentAlerts[alertId];
    const isActive = !isRecovered;
    const {
      alertUuid,
      started
    } = (_state$trackedAlerts$ = state.trackedAlerts[alertId]) !== null && _state$trackedAlerts$ !== void 0 ? _state$trackedAlerts$ : {
      alertUuid: (0, _uuid.v4)(),
      started: commonRuleFields[_technical_rule_data_field_names.TIMESTAMP]
    };
    const event = { ...(alertData === null || alertData === void 0 ? void 0 : alertData.fields),
      ...commonRuleFields,
      ...currentAlertData,
      [_technical_rule_data_field_names.ALERT_DURATION]: (options.startedAt.getTime() - new Date(started).getTime()) * 1000,
      [_technical_rule_data_field_names.ALERT_INSTANCE_ID]: alertId,
      [_technical_rule_data_field_names.ALERT_START]: started,
      [_technical_rule_data_field_names.ALERT_UUID]: alertUuid,
      [_technical_rule_data_field_names.ALERT_STATUS]: isRecovered ? _technical_rule_data_field_names.ALERT_STATUS_RECOVERED : _technical_rule_data_field_names.ALERT_STATUS_ACTIVE,
      [_technical_rule_data_field_names.ALERT_WORKFLOW_STATUS]: (_alertData$fields$ALE = alertData === null || alertData === void 0 ? void 0 : alertData.fields[_technical_rule_data_field_names.ALERT_WORKFLOW_STATUS]) !== null && _alertData$fields$ALE !== void 0 ? _alertData$fields$ALE : 'open',
      [_technical_rule_data_field_names.EVENT_KIND]: 'signal',
      [_technical_rule_data_field_names.EVENT_ACTION]: isNew ? 'open' : isActive ? 'active' : 'close',
      [_technical_rule_data_field_names.VERSION]: ruleDataClient.kibanaVersion,
      ...(isRecovered ? {
        [_technical_rule_data_field_names.ALERT_END]: commonRuleFields[_technical_rule_data_field_names.TIMESTAMP]
      } : {})
    };
    return {
      indexName: alertData === null || alertData === void 0 ? void 0 : alertData.indexName,
      event
    };
  });

  const trackedEventsToIndex = makeEventsDataMapFor(trackedAlertIds);
  const newEventsToIndex = makeEventsDataMapFor(newAlertIds);
  const allEventsToIndex = [...trackedEventsToIndex, ...newEventsToIndex];

  if (allEventsToIndex.length > 0 && ruleDataClient.isWriteEnabled()) {
    logger.debug(`Preparing to index ${allEventsToIndex.length} alerts.`);
    await ruleDataClient.getWriter().bulk({
      body: allEventsToIndex.flatMap(({
        event,
        indexName
      }) => [indexName ? {
        index: {
          _id: event[_technical_rule_data_field_names.ALERT_UUID],
          _index: indexName,
          require_alias: false
        }
      } : {
        index: {
          _id: event[_technical_rule_data_field_names.ALERT_UUID]
        }
      }, event])
    });
  }

  const nextTrackedAlerts = Object.fromEntries(allEventsToIndex.filter(({
    event
  }) => event[_technical_rule_data_field_names.ALERT_STATUS] !== _technical_rule_data_field_names.ALERT_STATUS_RECOVERED).map(({
    event
  }) => {
    const alertId = event[_technical_rule_data_field_names.ALERT_INSTANCE_ID];
    const alertUuid = event[_technical_rule_data_field_names.ALERT_UUID];
    const started = new Date(event[_technical_rule_data_field_names.ALERT_START]).toISOString();
    return [alertId, {
      alertId,
      alertUuid,
      started
    }];
  }));
  return {
    wrapped: nextWrappedState !== null && nextWrappedState !== void 0 ? nextWrappedState : {},
    trackedAlerts: ruleDataClient.isWriteEnabled() ? nextTrackedAlerts : {}
  };
};

exports.createLifecycleExecutor = createLifecycleExecutor;