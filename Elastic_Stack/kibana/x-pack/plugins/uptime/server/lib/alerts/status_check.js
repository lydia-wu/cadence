"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatusMessage = exports.getMonitorSummary = exports.getMonitorAlertDocument = exports.getInstanceId = exports.generateFilterDSL = exports.formatFilterString = void 0;
exports.getTimestampRange = getTimestampRange;
exports.statusCheckAlertFactory = exports.hasFilters = exports.getUniqueIdsByLoc = void 0;

var _lodash = require("lodash");

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

var _configSchema = require("@kbn/config-schema");

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _i18n = require("@kbn/i18n");

var _esQuery = require("@kbn/es-query");

var _alerts = require("../../../common/constants/alerts");

var _common = require("./common");

var _translations = require("./translations");

var _lib = require("../../../common/lib");

var _constants = require("../../../common/constants");

var _translations2 = require("../../../common/translations");

var _get_index_pattern = require("../requests/get_index_pattern");

var _lib2 = require("../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns the appropriate range for filtering the documents by `@timestamp`.
 *
 * We check monitor status by `monitor.timespan`, but need to first cut down on the number of documents
 * searched by filtering by `@timestamp`. To ensure that we catch as many documents as possible which could
 * likely contain a down monitor with a `monitor.timespan` in the given timerange, we create a filter
 * range for `@timestamp` that is the greater of either: from now to now - timerange interval - 24 hours
 * OR from now to now - rule interval
 * @param ruleScheduleLookback - string representing now minus the interval at which the rule is ran
 * @param timerangeLookback - string representing now minus the timerange configured by the user for checking down monitors
 */


function getTimestampRange({
  ruleScheduleLookback,
  timerangeLookback
}) {
  var _datemath$parse, _datemath$parse2, _min;

  const scheduleIntervalAbsoluteTime = (_datemath$parse = _datemath.default.parse(ruleScheduleLookback)) === null || _datemath$parse === void 0 ? void 0 : _datemath$parse.valueOf();
  const defaultIntervalAbsoluteTime = (_datemath$parse2 = _datemath.default.parse(timerangeLookback)) === null || _datemath$parse2 === void 0 ? void 0 : _datemath$parse2.subtract('24', 'hours').valueOf();
  const from = (_min = (0, _lodash.min)([scheduleIntervalAbsoluteTime, defaultIntervalAbsoluteTime])) !== null && _min !== void 0 ? _min : 'now-24h';
  return {
    to: 'now',
    from
  };
}

const getMonIdByLoc = (monitorId, location) => {
  return monitorId + '-' + location;
};

const uniqueDownMonitorIds = items => items.reduce((acc, {
  monitorId,
  location
}) => acc.add(getMonIdByLoc(monitorId, location)), new Set());

const uniqueAvailMonitorIds = items => items.reduce((acc, {
  monitorId,
  location
}) => acc.add(getMonIdByLoc(monitorId, location)), new Set());

const getUniqueIdsByLoc = (downMonitorsByLocation, availabilityResults) => {
  const uniqueDownsIdsByLoc = uniqueDownMonitorIds(downMonitorsByLocation);
  const uniqueAvailIdsByLoc = uniqueAvailMonitorIds(availabilityResults);
  return new Set([...uniqueDownsIdsByLoc, ...uniqueAvailIdsByLoc]);
};

exports.getUniqueIdsByLoc = getUniqueIdsByLoc;

const hasFilters = filters => {
  if (!filters) return false;

  for (const list of Object.values(filters)) {
    if (list.length > 0) {
      return true;
    }
  }

  return false;
};

exports.hasFilters = hasFilters;

const generateFilterDSL = async (getIndexPattern, filters, search) => {
  const filtersExist = hasFilters(filters);
  if (!filtersExist && !search) return undefined;
  let filterString = '';

  if (filtersExist) {
    filterString = (0, _lib.stringifyKueries)(new Map(Object.entries(filters !== null && filters !== void 0 ? filters : {})));
  }

  const combinedString = (0, _lib.combineFiltersAndUserSearch)(filterString, search);
  return (0, _esQuery.toElasticsearchQuery)((0, _esQuery.fromKueryExpression)(combinedString !== null && combinedString !== void 0 ? combinedString : ''), await getIndexPattern());
};

exports.generateFilterDSL = generateFilterDSL;

const formatFilterString = async (uptimeEsClient, filters, search, libs) => await generateFilterDSL(() => {
  var _libs$requests, _libs$requests2;

  return libs !== null && libs !== void 0 && (_libs$requests = libs.requests) !== null && _libs$requests !== void 0 && _libs$requests.getIndexPattern ? libs === null || libs === void 0 ? void 0 : (_libs$requests2 = libs.requests) === null || _libs$requests2 === void 0 ? void 0 : _libs$requests2.getIndexPattern({
    uptimeEsClient
  }) : (0, _get_index_pattern.getUptimeIndexPattern)({
    uptimeEsClient
  });
}, filters, search);

exports.formatFilterString = formatFilterString;

const getMonitorSummary = (monitorInfo, statusMessage) => {
  var _monitorInfo$url, _monitorInfo$monitor, _monitorInfo$monitor$, _monitorInfo$monitor2, _monitorInfo$monitor3, _monitorInfo$monitor4, _monitorInfo$error, _monitorInfo$observer, _monitorInfo$observer2, _monitorInfo$observer3, _monitorInfo$agent;

  const summary = {
    monitorUrl: (_monitorInfo$url = monitorInfo.url) === null || _monitorInfo$url === void 0 ? void 0 : _monitorInfo$url.full,
    monitorId: (_monitorInfo$monitor = monitorInfo.monitor) === null || _monitorInfo$monitor === void 0 ? void 0 : _monitorInfo$monitor.id,
    monitorName: (_monitorInfo$monitor$ = (_monitorInfo$monitor2 = monitorInfo.monitor) === null || _monitorInfo$monitor2 === void 0 ? void 0 : _monitorInfo$monitor2.name) !== null && _monitorInfo$monitor$ !== void 0 ? _monitorInfo$monitor$ : (_monitorInfo$monitor3 = monitorInfo.monitor) === null || _monitorInfo$monitor3 === void 0 ? void 0 : _monitorInfo$monitor3.id,
    monitorType: (_monitorInfo$monitor4 = monitorInfo.monitor) === null || _monitorInfo$monitor4 === void 0 ? void 0 : _monitorInfo$monitor4.type,
    latestErrorMessage: (_monitorInfo$error = monitorInfo.error) === null || _monitorInfo$error === void 0 ? void 0 : _monitorInfo$error.message,
    observerLocation: (_monitorInfo$observer = (_monitorInfo$observer2 = monitorInfo.observer) === null || _monitorInfo$observer2 === void 0 ? void 0 : (_monitorInfo$observer3 = _monitorInfo$observer2.geo) === null || _monitorInfo$observer3 === void 0 ? void 0 : _monitorInfo$observer3.name) !== null && _monitorInfo$observer !== void 0 ? _monitorInfo$observer : _constants.UNNAMED_LOCATION,
    observerHostname: (_monitorInfo$agent = monitorInfo.agent) === null || _monitorInfo$agent === void 0 ? void 0 : _monitorInfo$agent.name
  };
  const reason = (0, _common.generateAlertMessage)(_translations2.MonitorStatusTranslations.defaultActionMessage, { ...summary,
    statusMessage
  });
  return { ...summary,
    reason
  };
};

exports.getMonitorSummary = getMonitorSummary;

const getMonitorAlertDocument = monitorSummary => ({
  'monitor.id': monitorSummary.monitorId,
  'monitor.type': monitorSummary.monitorType,
  'monitor.name': monitorSummary.monitorName,
  'url.full': monitorSummary.monitorUrl,
  'observer.geo.name': monitorSummary.observerLocation,
  'error.message': monitorSummary.latestErrorMessage,
  'agent.name': monitorSummary.observerHostname,
  [_ruleDataUtils.ALERT_SEVERITY]: _ruleDataUtils.ALERT_SEVERITY_WARNING,
  [_ruleDataUtils.ALERT_REASON]: monitorSummary.reason
});

exports.getMonitorAlertDocument = getMonitorAlertDocument;

const getStatusMessage = (downMonInfo, availMonInfo, availability) => {
  let statusMessage = '';

  if (downMonInfo) {
    statusMessage = _translations.DOWN_LABEL;
  }

  let availabilityMessage = '';

  if (availMonInfo) {
    availabilityMessage = _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.actionVariables.availabilityMessage', {
      defaultMessage: 'below threshold with {availabilityRatio}% availability expected is {expectedAvailability}%',
      values: {
        availabilityRatio: (availMonInfo.availabilityRatio * 100).toFixed(2),
        expectedAvailability: availability === null || availability === void 0 ? void 0 : availability.threshold
      }
    });
  }

  if (availMonInfo && downMonInfo) {
    return _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.actionVariables.downAndAvailabilityMessage', {
      defaultMessage: '{statusMessage} and also {availabilityMessage}',
      values: {
        statusMessage,
        availabilityMessage
      }
    });
  }

  return statusMessage + availabilityMessage;
};

exports.getStatusMessage = getStatusMessage;

const getInstanceId = (monitorInfo, monIdByLoc) => {
  var _monitorInfo$url2;

  const normalizeText = txt => {
    // replace url and name special characters with -
    return txt.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
  };

  const urlText = normalizeText(((_monitorInfo$url2 = monitorInfo.url) === null || _monitorInfo$url2 === void 0 ? void 0 : _monitorInfo$url2.full) || '');
  const monName = normalizeText(monitorInfo.monitor.name || '');

  if (monName) {
    return `${monName}_${urlText}_${monIdByLoc}`;
  }

  return `${urlText}_${monIdByLoc}`;
};

exports.getInstanceId = getInstanceId;

const statusCheckAlertFactory = (_server, libs) => ({
  id: 'xpack.uptime.alerts.monitorStatus',
  producer: 'uptime',
  name: _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus', {
    defaultMessage: 'Uptime monitor status'
  }),
  validate: {
    params: _configSchema.schema.object({
      availability: _configSchema.schema.maybe(_configSchema.schema.object({
        range: _configSchema.schema.number(),
        rangeUnit: _configSchema.schema.string(),
        threshold: _configSchema.schema.string()
      })),
      filters: _configSchema.schema.maybe(_configSchema.schema.oneOf([// deprecated
      _configSchema.schema.object({
        'monitor.type': _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        'observer.geo.name': _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        tags: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        'url.port': _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
      }), _configSchema.schema.string()])),
      // deprecated
      locations: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
      numTimes: _configSchema.schema.number(),
      search: _configSchema.schema.maybe(_configSchema.schema.string()),
      shouldCheckStatus: _configSchema.schema.boolean(),
      shouldCheckAvailability: _configSchema.schema.boolean(),
      timerangeCount: _configSchema.schema.maybe(_configSchema.schema.number()),
      timerangeUnit: _configSchema.schema.maybe(_configSchema.schema.string()),
      // deprecated
      timerange: _configSchema.schema.maybe(_configSchema.schema.object({
        from: _configSchema.schema.string(),
        to: _configSchema.schema.string()
      })),
      version: _configSchema.schema.maybe(_configSchema.schema.number()),
      isAutoGenerated: _configSchema.schema.maybe(_configSchema.schema.boolean())
    })
  },
  defaultActionGroupId: _alerts.MONITOR_STATUS.id,
  actionGroups: [{
    id: _alerts.MONITOR_STATUS.id,
    name: _alerts.MONITOR_STATUS.name
  }],
  actionVariables: {
    context: [{
      name: 'message',
      description: _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.actionVariables.context.message.description', {
        defaultMessage: 'A generated message summarizing the currently down monitors'
      })
    }, {
      name: 'downMonitorsWithGeo',
      description: _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.actionVariables.context.downMonitorsWithGeo.description', {
        defaultMessage: 'A generated summary that shows some or all of the monitors detected as "down" by the alert'
      })
    }],
    state: [..._translations.commonMonitorStateI18, ..._translations.commonStateTranslations]
  },
  isExportable: true,
  minimumLicenseRequired: 'basic',

  async executor({
    params: rawParams,
    state,
    services: {
      savedObjectsClient,
      scopedClusterClient,
      alertWithLifecycle
    },
    rule: {
      schedule: {
        interval
      }
    }
  }) {
    const {
      filters,
      search,
      numTimes,
      timerangeCount,
      timerangeUnit,
      availability,
      shouldCheckAvailability,
      shouldCheckStatus,
      isAutoGenerated,
      timerange: oldVersionTimeRange
    } = rawParams;
    const uptimeEsClient = (0, _lib2.createUptimeESClient)({
      esClient: scopedClusterClient.asCurrentUser,
      savedObjectsClient
    });
    const filterString = await formatFilterString(uptimeEsClient, filters, search, libs);
    const timespanInterval = `${String(timerangeCount)}${timerangeUnit}`; // Range filter for `monitor.timespan`, the range of time the ping is valid

    const timespanRange = oldVersionTimeRange || {
      from: `now-${timespanInterval}`,
      to: 'now'
    }; // Range filter for `@timestamp`, the time the document was indexed

    const timestampRange = getTimestampRange({
      ruleScheduleLookback: `now-${interval}`,
      timerangeLookback: timespanRange.from
    });
    let downMonitorsByLocation = []; // if oldVersionTimeRange present means it's 7.7 format and
    // after that shouldCheckStatus should be explicitly false

    if (!(!oldVersionTimeRange && shouldCheckStatus === false)) {
      downMonitorsByLocation = await libs.requests.getMonitorStatus({
        uptimeEsClient,
        timespanRange,
        timestampRange,
        numTimes,
        locations: [],
        filters: filterString
      });
    }

    if (isAutoGenerated) {
      for (const monitorLoc of downMonitorsByLocation) {
        const monitorInfo = monitorLoc.monitorInfo;
        const statusMessage = getStatusMessage(monitorInfo);
        const monitorSummary = getMonitorSummary(monitorInfo, statusMessage);
        const alert = alertWithLifecycle({
          id: getInstanceId(monitorInfo, monitorLoc.location),
          fields: getMonitorAlertDocument(monitorSummary)
        });
        alert.replaceState({ ...state,
          ...monitorSummary,
          statusMessage,
          ...(0, _common.updateState)(state, true)
        });
        alert.scheduleActions(_alerts.MONITOR_STATUS.id);
      }

      return (0, _common.updateState)(state, downMonitorsByLocation.length > 0);
    }

    let availabilityResults = [];

    if (shouldCheckAvailability) {
      availabilityResults = await libs.requests.getMonitorAvailability({
        uptimeEsClient,
        ...availability,
        filters: JSON.stringify(filterString) || undefined
      });
    }

    const mergedIdsByLoc = getUniqueIdsByLoc(downMonitorsByLocation, availabilityResults);
    mergedIdsByLoc.forEach(monIdByLoc => {
      var _downMonitorsByLocati;

      const availMonInfo = availabilityResults.find(({
        monitorId,
        location
      }) => getMonIdByLoc(monitorId, location) === monIdByLoc);
      const downMonInfo = (_downMonitorsByLocati = downMonitorsByLocation.find(({
        monitorId,
        location
      }) => getMonIdByLoc(monitorId, location) === monIdByLoc)) === null || _downMonitorsByLocati === void 0 ? void 0 : _downMonitorsByLocati.monitorInfo;
      const monitorInfo = downMonInfo || (availMonInfo === null || availMonInfo === void 0 ? void 0 : availMonInfo.monitorInfo);
      const statusMessage = getStatusMessage(downMonInfo, availMonInfo, availability);
      const monitorSummary = getMonitorSummary(monitorInfo, statusMessage);
      const alert = alertWithLifecycle({
        id: getInstanceId(monitorInfo, monIdByLoc),
        fields: getMonitorAlertDocument(monitorSummary)
      });
      alert.replaceState({ ...(0, _common.updateState)(state, true),
        ...monitorSummary,
        statusMessage
      });
      alert.scheduleActions(_alerts.MONITOR_STATUS.id);
    });
    return (0, _common.updateState)(state, downMonitorsByLocation.length > 0);
  }

});

exports.statusCheckAlertFactory = statusCheckAlertFactory;