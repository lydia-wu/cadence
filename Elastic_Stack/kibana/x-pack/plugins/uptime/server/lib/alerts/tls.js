"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tlsAlertFactory = exports.getCertSummary = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _configSchema = require("@kbn/config-schema");

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _common = require("./common");

var _alerts = require("../../../common/constants/alerts");

var _constants = require("../../../common/constants");

var _translations = require("./translations");

var _translations2 = require("../../../common/translations");

var _saved_objects = require("../saved_objects");

var _lib = require("../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const mapCertsToSummaryString = (cert, certLimitMessage) => certLimitMessage(cert);

const getValidAfter = ({
  not_after: date
}) => {
  if (!date) return {
    summary: 'Error, missing `certificate_not_valid_after` date.'
  };
  const relativeDate = (0, _moment.default)().diff(date, 'days');
  const formattedDate = (0, _moment.default)(date).format('MMM D, YYYY z');
  return relativeDate >= 0 ? {
    summary: _translations.tlsTranslations.validAfterExpiredString(formattedDate, relativeDate),
    status: _translations.tlsTranslations.expiredLabel
  } : {
    summary: _translations.tlsTranslations.validAfterExpiringString(formattedDate, Math.abs(relativeDate)),
    status: _translations.tlsTranslations.expiringLabel
  };
};

const getValidBefore = ({
  not_before: date
}) => {
  if (!date) return {
    summary: 'Error, missing `certificate_not_valid_before` date.'
  };
  const relativeDate = (0, _moment.default)().diff(date, 'days');
  const formattedDate = (0, _moment.default)(date).format('MMM D, YYYY z');
  return relativeDate >= 0 ? {
    summary: _translations.tlsTranslations.validBeforeExpiredString(formattedDate, relativeDate),
    status: _translations.tlsTranslations.agingLabel
  } : {
    summary: _translations.tlsTranslations.validBeforeExpiringString(formattedDate, Math.abs(relativeDate)),
    status: _translations.tlsTranslations.invalidLabel
  };
};

const getCertSummary = (cert, expirationThreshold, ageThreshold) => {
  var _cert$not_after, _cert$not_before, _cert$common_name, _cert$issuer;

  const isExpiring = new Date((_cert$not_after = cert.not_after) !== null && _cert$not_after !== void 0 ? _cert$not_after : '').valueOf() < expirationThreshold;
  const isAging = new Date((_cert$not_before = cert.not_before) !== null && _cert$not_before !== void 0 ? _cert$not_before : '').valueOf() < ageThreshold;
  let content = null;

  if (isExpiring) {
    content = mapCertsToSummaryString(cert, getValidAfter);
  } else if (isAging) {
    content = mapCertsToSummaryString(cert, getValidBefore);
  }

  const {
    summary = '',
    status = ''
  } = content || {};
  return {
    commonName: (_cert$common_name = cert.common_name) !== null && _cert$common_name !== void 0 ? _cert$common_name : '',
    issuer: (_cert$issuer = cert.issuer) !== null && _cert$issuer !== void 0 ? _cert$issuer : '',
    summary,
    status
  };
};

exports.getCertSummary = getCertSummary;

const tlsAlertFactory = (_server, libs) => ({
  id: 'xpack.uptime.alerts.tlsCertificate',
  producer: 'uptime',
  name: _translations.tlsTranslations.alertFactoryName,
  validate: {
    params: _configSchema.schema.object({})
  },
  defaultActionGroupId: _alerts.TLS.id,
  actionGroups: [{
    id: _alerts.TLS.id,
    name: _alerts.TLS.name
  }],
  actionVariables: {
    context: [],
    state: [..._translations.tlsTranslations.actionVariables, ..._translations.commonStateTranslations]
  },
  isExportable: true,
  minimumLicenseRequired: 'basic',

  async executor({
    services: {
      alertWithLifecycle,
      savedObjectsClient,
      scopedClusterClient
    },
    state
  }) {
    var _dynamicSettings$cert, _dynamicSettings$cert2;

    const dynamicSettings = await _saved_objects.savedObjectsAdapter.getUptimeDynamicSettings(savedObjectsClient);
    const uptimeEsClient = (0, _lib.createUptimeESClient)({
      esClient: scopedClusterClient.asCurrentUser,
      savedObjectsClient
    });
    const {
      certs,
      total
    } = await libs.requests.getCerts({
      uptimeEsClient,
      pageIndex: 0,
      size: 1000,
      notValidAfter: `now+${(_dynamicSettings$cert = dynamicSettings === null || dynamicSettings === void 0 ? void 0 : dynamicSettings.certExpirationThreshold) !== null && _dynamicSettings$cert !== void 0 ? _dynamicSettings$cert : _constants.DYNAMIC_SETTINGS_DEFAULTS.certExpirationThreshold}d`,
      notValidBefore: `now-${(_dynamicSettings$cert2 = dynamicSettings === null || dynamicSettings === void 0 ? void 0 : dynamicSettings.certAgeThreshold) !== null && _dynamicSettings$cert2 !== void 0 ? _dynamicSettings$cert2 : _constants.DYNAMIC_SETTINGS_DEFAULTS.certAgeThreshold}d`,
      sortBy: 'common_name',
      direction: 'desc'
    });
    const foundCerts = total > 0;

    if (foundCerts) {
      certs.forEach(cert => {
        var _dynamicSettings$cert3, _dynamicSettings$cert4, _cert$issuer2;

        const absoluteExpirationThreshold = (0, _moment.default)().add((_dynamicSettings$cert3 = dynamicSettings.certExpirationThreshold) !== null && _dynamicSettings$cert3 !== void 0 ? _dynamicSettings$cert3 : _constants.DYNAMIC_SETTINGS_DEFAULTS.certExpirationThreshold, 'd').valueOf();
        const absoluteAgeThreshold = (0, _moment.default)().subtract((_dynamicSettings$cert4 = dynamicSettings.certAgeThreshold) !== null && _dynamicSettings$cert4 !== void 0 ? _dynamicSettings$cert4 : _constants.DYNAMIC_SETTINGS_DEFAULTS.certAgeThreshold, 'd').valueOf();
        const summary = getCertSummary(cert, absoluteExpirationThreshold, absoluteAgeThreshold);
        const alertInstance = alertWithLifecycle({
          id: `${cert.common_name}-${(_cert$issuer2 = cert.issuer) === null || _cert$issuer2 === void 0 ? void 0 : _cert$issuer2.replace(/\s/g, '_')}-${cert.sha256}`,
          fields: {
            'tls.server.x509.subject.common_name': cert.common_name,
            'tls.server.x509.issuer.common_name': cert.issuer,
            'tls.server.x509.not_after': cert.not_after,
            'tls.server.x509.not_before': cert.not_before,
            'tls.server.hash.sha256': cert.sha256,
            [_ruleDataUtils.ALERT_SEVERITY]: _ruleDataUtils.ALERT_SEVERITY_WARNING,
            [_ruleDataUtils.ALERT_REASON]: (0, _common.generateAlertMessage)(_translations2.TlsTranslations.defaultActionMessage, summary)
          }
        });
        alertInstance.replaceState({ ...(0, _common.updateState)(state, foundCerts),
          ...summary
        });
        alertInstance.scheduleActions(_alerts.TLS.id);
      });
    }

    return (0, _common.updateState)(state, foundCerts);
  }

});

exports.tlsAlertFactory = tlsAlertFactory;