"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VALUE_MUST_BE_GREATER_THAN_ZERO = exports.VALUE_MUST_BE_AN_INTEGER = exports.TlsTranslationsLegacy = exports.TlsTranslations = exports.MonitorStatusTranslations = exports.DurationAnomalyTranslations = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const VALUE_MUST_BE_GREATER_THAN_ZERO = _i18n.i18n.translate('xpack.uptime.settings.invalid.error', {
  defaultMessage: 'Value must be greater than 0.'
});

exports.VALUE_MUST_BE_GREATER_THAN_ZERO = VALUE_MUST_BE_GREATER_THAN_ZERO;

const VALUE_MUST_BE_AN_INTEGER = _i18n.i18n.translate('xpack.uptime.settings.invalid.nanError', {
  defaultMessage: 'Value must be an integer.'
});

exports.VALUE_MUST_BE_AN_INTEGER = VALUE_MUST_BE_AN_INTEGER;
const MonitorStatusTranslations = {
  defaultActionMessage: _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.defaultActionMessage', {
    defaultMessage: 'Monitor {monitorName} with url {monitorUrl} is {statusMessage} from {observerLocation}. The latest error message is {latestErrorMessage}',
    values: {
      monitorName: '{{state.monitorName}}',
      monitorUrl: '{{{state.monitorUrl}}}',
      statusMessage: '{{state.statusMessage}}',
      latestErrorMessage: '{{{state.latestErrorMessage}}}',
      observerLocation: '{{state.observerLocation}}'
    }
  }),
  name: _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.clientName', {
    defaultMessage: 'Uptime monitor status'
  }),
  description: _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.description', {
    defaultMessage: 'Alert when a monitor is down or an availability threshold is breached.'
  })
};
exports.MonitorStatusTranslations = MonitorStatusTranslations;
const TlsTranslations = {
  defaultActionMessage: _i18n.i18n.translate('xpack.uptime.alerts.tls.defaultActionMessage', {
    defaultMessage: `Detected TLS certificate {commonName} from issuer {issuer} is {status}. Certificate {summary}
`,
    values: {
      commonName: '{{state.commonName}}',
      issuer: '{{state.issuer}}',
      summary: '{{state.summary}}',
      status: '{{state.status}}'
    }
  }),
  name: _i18n.i18n.translate('xpack.uptime.alerts.tls.clientName', {
    defaultMessage: 'Uptime TLS'
  }),
  description: _i18n.i18n.translate('xpack.uptime.alerts.tls.description', {
    defaultMessage: 'Alert when the TLS certificate of an Uptime monitor is about to expire.'
  })
};
exports.TlsTranslations = TlsTranslations;
const TlsTranslationsLegacy = {
  defaultActionMessage: _i18n.i18n.translate('xpack.uptime.alerts.tls.legacy.defaultActionMessage', {
    defaultMessage: `Detected {count} TLS certificates expiring or becoming too old.
{expiringConditionalOpen}
Expiring cert count: {expiringCount}
Expiring Certificates: {expiringCommonNameAndDate}
{expiringConditionalClose}
{agingConditionalOpen}
Aging cert count: {agingCount}
Aging Certificates: {agingCommonNameAndDate}
{agingConditionalClose}
`,
    values: {
      count: '{{state.count}}',
      expiringCount: '{{state.expiringCount}}',
      expiringCommonNameAndDate: '{{state.expiringCommonNameAndDate}}',
      expiringConditionalOpen: '{{#state.hasExpired}}',
      expiringConditionalClose: '{{/state.hasExpired}}',
      agingCount: '{{state.agingCount}}',
      agingCommonNameAndDate: '{{state.agingCommonNameAndDate}}',
      agingConditionalOpen: '{{#state.hasAging}}',
      agingConditionalClose: '{{/state.hasAging}}'
    }
  }),
  name: _i18n.i18n.translate('xpack.uptime.alerts.tls.legacy.clientName', {
    defaultMessage: 'Uptime TLS (Legacy)'
  }),
  description: _i18n.i18n.translate('xpack.uptime.alerts.tls.legacy.description', {
    defaultMessage: 'Alert when the TLS certificate of an Uptime monitor is about to expire. This alert will be deprecated in a future version.'
  })
};
exports.TlsTranslationsLegacy = TlsTranslationsLegacy;
const DurationAnomalyTranslations = {
  defaultActionMessage: _i18n.i18n.translate('xpack.uptime.alerts.durationAnomaly.defaultActionMessage', {
    defaultMessage: `Abnormal ({severity} level) response time detected on {monitor} with url {monitorUrl} at {anomalyStartTimestamp}. Anomaly severity score is {severityScore}.
Response times as high as {slowestAnomalyResponse} have been detected from location {observerLocation}. Expected response time is {expectedResponseTime}.`,
    values: {
      severity: '{{state.severity}}',
      anomalyStartTimestamp: '{{state.anomalyStartTimestamp}}',
      monitor: '{{state.monitor}}',
      monitorUrl: '{{{state.monitorUrl}}}',
      slowestAnomalyResponse: '{{state.slowestAnomalyResponse}}',
      expectedResponseTime: '{{state.expectedResponseTime}}',
      severityScore: '{{state.severityScore}}',
      observerLocation: '{{state.observerLocation}}'
    }
  }),
  name: _i18n.i18n.translate('xpack.uptime.alerts.durationAnomaly.clientName', {
    defaultMessage: 'Uptime Duration Anomaly'
  }),
  description: _i18n.i18n.translate('xpack.uptime.alerts.durationAnomaly.description', {
    defaultMessage: 'Alert when the Uptime monitor duration is anomalous.'
  })
};
exports.DurationAnomalyTranslations = DurationAnomalyTranslations;