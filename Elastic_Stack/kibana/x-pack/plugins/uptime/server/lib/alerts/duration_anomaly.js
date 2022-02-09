"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnomalySummary = exports.durationAnomalyAlertFactory = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _configSchema = require("@kbn/config-schema");

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _common = require("./common");

var _alerts = require("../../../common/constants/alerts");

var _translations = require("./translations");

var _anomaly_utils = require("../../../../ml/common/util/anomaly_utils");

var _lib = require("../../../common/lib");

var _translations2 = require("../../../common/translations");

var _lib2 = require("../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getAnomalySummary = (anomaly, monitorInfo) => {
  var _monitorInfo$url;

  return {
    severity: (0, _anomaly_utils.getSeverityType)(anomaly.severity),
    severityScore: Math.round(anomaly.severity),
    anomalyStartTimestamp: (0, _moment.default)(anomaly.source.timestamp).toISOString(),
    monitor: anomaly.source['monitor.id'],
    monitorUrl: (_monitorInfo$url = monitorInfo.url) === null || _monitorInfo$url === void 0 ? void 0 : _monitorInfo$url.full,
    slowestAnomalyResponse: Math.round(anomaly.actualSort / 1000) + ' ms',
    expectedResponseTime: Math.round(anomaly.typicalSort / 1000) + ' ms',
    observerLocation: anomaly.entityValue,
    bucketSpan: anomaly.source.bucket_span
  };
};

exports.getAnomalySummary = getAnomalySummary;

const getAnomalies = async (plugins, savedObjectsClient, params, lastCheckedAt) => {
  const fakeRequest = {};
  const {
    getAnomaliesTableData
  } = plugins.ml.resultsServiceProvider(fakeRequest, savedObjectsClient);
  return await getAnomaliesTableData([(0, _lib.getMLJobId)(params.monitorId)], [], [], 'auto', params.severity, (0, _moment.default)(lastCheckedAt).valueOf(), (0, _moment.default)().valueOf(), Intl.DateTimeFormat().resolvedOptions().timeZone, 500, 10, undefined);
};

const durationAnomalyAlertFactory = (_server, libs, plugins) => ({
  id: 'xpack.uptime.alerts.durationAnomaly',
  producer: 'uptime',
  name: _translations.durationAnomalyTranslations.alertFactoryName,
  validate: {
    params: _configSchema.schema.object({
      monitorId: _configSchema.schema.string(),
      severity: _configSchema.schema.number()
    })
  },
  defaultActionGroupId: _alerts.DURATION_ANOMALY.id,
  actionGroups: [{
    id: _alerts.DURATION_ANOMALY.id,
    name: _alerts.DURATION_ANOMALY.name
  }],
  actionVariables: {
    context: [],
    state: [..._translations.durationAnomalyTranslations.actionVariables, ..._translations.commonStateTranslations]
  },
  isExportable: true,
  minimumLicenseRequired: 'platinum',

  async executor({
    params,
    services: {
      alertWithLifecycle,
      scopedClusterClient,
      savedObjectsClient
    },
    state
  }) {
    var _await$getAnomalies;

    const uptimeEsClient = (0, _lib2.createUptimeESClient)({
      esClient: scopedClusterClient.asCurrentUser,
      savedObjectsClient
    });
    const {
      anomalies
    } = (_await$getAnomalies = await getAnomalies(plugins, savedObjectsClient, params, state.lastCheckedAt)) !== null && _await$getAnomalies !== void 0 ? _await$getAnomalies : {};
    const foundAnomalies = (anomalies === null || anomalies === void 0 ? void 0 : anomalies.length) > 0;

    if (foundAnomalies) {
      const monitorInfo = await libs.requests.getLatestMonitor({
        uptimeEsClient,
        dateStart: 'now-15m',
        dateEnd: 'now',
        monitorId: params.monitorId
      });
      anomalies.forEach((anomaly, index) => {
        const summary = getAnomalySummary(anomaly, monitorInfo);
        const alertInstance = alertWithLifecycle({
          id: _alerts.DURATION_ANOMALY.id + index,
          fields: {
            'monitor.id': params.monitorId,
            'url.full': summary.monitorUrl,
            'observer.geo.name': summary.observerLocation,
            'anomaly.start': summary.anomalyStartTimestamp,
            'anomaly.bucket_span.minutes': summary.bucketSpan,
            [_ruleDataUtils.ALERT_EVALUATION_VALUE]: anomaly.actualSort,
            [_ruleDataUtils.ALERT_EVALUATION_THRESHOLD]: anomaly.typicalSort,
            [_ruleDataUtils.ALERT_SEVERITY]: summary.severity,
            [_ruleDataUtils.ALERT_REASON]: (0, _common.generateAlertMessage)(_translations2.DurationAnomalyTranslations.defaultActionMessage, summary)
          }
        });
        alertInstance.replaceState({ ...(0, _common.updateState)(state, false),
          ...summary
        });
        alertInstance.scheduleActions(_alerts.DURATION_ANOMALY.id);
      });
    }

    return (0, _common.updateState)(state, foundAnomalies);
  }

});

exports.durationAnomalyAlertFactory = durationAnomalyAlertFactory;