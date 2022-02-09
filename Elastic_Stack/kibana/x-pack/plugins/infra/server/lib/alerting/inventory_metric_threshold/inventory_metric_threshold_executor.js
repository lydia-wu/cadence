"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInventoryMetricThresholdExecutor = exports.WARNING_ACTIONS_ID = exports.WARNING_ACTIONS = exports.FIRED_ACTIONS_ID = exports.FIRED_ACTIONS = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _moment = _interopRequireDefault(require("moment"));

var _get_custom_metric_label = require("../../../../common/formatters/get_custom_metric_label");

var _snapshot_metric_i18n = require("../../../../common/snapshot_metric_i18n");

var _types = require("./types");

var _common = require("../../../../../alerting/common");

var _snapshot_metric_formats = require("../../../../common/formatters/snapshot_metric_formats");

var _formatters = require("../../../../common/formatters");

var _messages = require("../common/messages");

var _evaluate_condition = require("./evaluate_condition");

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

const createInventoryMetricThresholdExecutor = libs => libs.metricsRules.createLifecycleRuleExecutor(async ({
  services,
  params
}) => {
  const {
    criteria,
    filterQuery,
    sourceId,
    nodeType,
    alertOnNoData
  } = params;
  if (criteria.length === 0) throw new Error('Cannot execute an alert with 0 conditions');
  const {
    alertWithLifecycle,
    savedObjectsClient
  } = services;

  const alertInstanceFactory = (id, reason) => alertWithLifecycle({
    id,
    fields: {
      [_ruleDataUtils.ALERT_REASON]: reason,
      [_ruleDataUtils.ALERT_RULE_PARAMS]: JSON.stringify(params)
    }
  });

  if (!params.filterQuery && params.filterQueryText) {
    try {
      const {
        fromKueryExpression
      } = await Promise.resolve().then(() => _interopRequireWildcard(require('@kbn/es-query')));
      fromKueryExpression(params.filterQueryText);
    } catch (e) {
      const actionGroupId = FIRED_ACTIONS.id; // Change this to an Error action group when able

      const reason = (0, _messages.buildInvalidQueryAlertReason)(params.filterQueryText);
      const alertInstance = alertInstanceFactory('*', reason);
      alertInstance.scheduleActions(actionGroupId, {
        group: '*',
        alertState: _messages.stateToAlertMessage[_types.AlertStates.ERROR],
        reason,
        timestamp: (0, _moment.default)().toISOString(),
        value: null,
        metric: mapToConditionsLookup(criteria, c => c.metric)
      });
      return {};
    }
  }

  const source = await libs.sources.getSourceConfiguration(savedObjectsClient, sourceId || 'default');
  const logQueryFields = await libs.getLogQueryFields(sourceId || 'default', services.savedObjectsClient, services.scopedClusterClient.asCurrentUser).catch(() => undefined);
  const compositeSize = libs.configuration.inventory.compositeSize;
  const results = await Promise.all(criteria.map(condition => (0, _evaluate_condition.evaluateCondition)({
    condition,
    nodeType,
    source,
    logQueryFields,
    esClient: services.scopedClusterClient.asCurrentUser,
    compositeSize,
    filterQuery
  })));
  const inventoryItems = Object.keys((0, _lodash.first)(results));

  for (const group of inventoryItems) {
    // AND logic; all criteria must be across the threshold
    const shouldAlertFire = results.every(result => {
      // Grab the result of the most recent bucket
      return (0, _lodash.last)(result[group].shouldFire);
    });
    const shouldAlertWarn = results.every(result => (0, _lodash.last)(result[group].shouldWarn)); // AND logic; because we need to evaluate all criteria, if one of them reports no data then the
    // whole alert is in a No Data/Error state

    const isNoData = results.some(result => (0, _lodash.last)(result[group].isNoData));
    const isError = results.some(result => result[group].isError);
    const nextState = isError ? _types.AlertStates.ERROR : isNoData ? _types.AlertStates.NO_DATA : shouldAlertFire ? _types.AlertStates.ALERT : shouldAlertWarn ? _types.AlertStates.WARNING : _types.AlertStates.OK;
    let reason;

    if (nextState === _types.AlertStates.ALERT || nextState === _types.AlertStates.WARNING) {
      reason = results.map(result => buildReasonWithVerboseMetricName(group, result[group], _messages.buildFiredAlertReason, nextState === _types.AlertStates.WARNING)).join('\n');
      /*
       * Custom recovery actions aren't yet available in the alerting framework
       * Uncomment the code below once they've been implemented
       * Reference: https://github.com/elastic/kibana/issues/87048
       */
      // } else if (nextState === AlertStates.OK && prevState?.alertState === AlertStates.ALERT) {
      // reason = results
      //   .map((result) => buildReasonWithVerboseMetricName(group, result[group], buildRecoveredAlertReason))
      //   .join('\n');
    }

    if (alertOnNoData) {
      if (nextState === _types.AlertStates.NO_DATA) {
        reason = results.filter(result => result[group].isNoData).map(result => buildReasonWithVerboseMetricName(group, result[group], _messages.buildNoDataAlertReason)).join('\n');
      } else if (nextState === _types.AlertStates.ERROR) {
        reason = results.filter(result => result[group].isError).map(result => buildReasonWithVerboseMetricName(group, result[group], _messages.buildErrorAlertReason)).join('\n');
      }
    }

    if (reason) {
      const actionGroupId = nextState === _types.AlertStates.OK ? _common.RecoveredActionGroup.id : nextState === _types.AlertStates.WARNING ? WARNING_ACTIONS.id : FIRED_ACTIONS.id;
      const alertInstance = alertInstanceFactory(`${group}`, reason);
      alertInstance.scheduleActions(
      /**
       * TODO: We're lying to the compiler here as explicitly  calling `scheduleActions` on
       * the RecoveredActionGroup isn't allowed
       */
      actionGroupId, {
        group,
        alertState: _messages.stateToAlertMessage[nextState],
        reason,
        timestamp: (0, _moment.default)().toISOString(),
        value: mapToConditionsLookup(results, result => formatMetric(result[group].metric, result[group].currentValue)),
        threshold: mapToConditionsLookup(criteria, c => c.threshold),
        metric: mapToConditionsLookup(criteria, c => c.metric)
      });
    }
  }
});

exports.createInventoryMetricThresholdExecutor = createInventoryMetricThresholdExecutor;

const buildReasonWithVerboseMetricName = (group, resultItem, buildReason, useWarningThreshold) => {
  var _toMetricOpt;

  if (!resultItem) return '';
  const resultWithVerboseMetricName = { ...resultItem,
    group,
    metric: ((_toMetricOpt = (0, _snapshot_metric_i18n.toMetricOpt)(resultItem.metric)) === null || _toMetricOpt === void 0 ? void 0 : _toMetricOpt.text) || (resultItem.metric === 'custom' ? (0, _get_custom_metric_label.getCustomMetricLabel)(resultItem.customMetric) : resultItem.metric),
    currentValue: formatMetric(resultItem.metric, resultItem.currentValue),
    threshold: useWarningThreshold ? resultItem.warningThreshold : resultItem.threshold,
    comparator: useWarningThreshold ? resultItem.warningComparator : resultItem.comparator
  };
  return buildReason(resultWithVerboseMetricName);
};

const mapToConditionsLookup = (list, mapFn) => list.map(mapFn).reduce((result, value, i) => ({ ...result,
  [`condition${i}`]: value
}), {});

const FIRED_ACTIONS_ID = 'metrics.inventory_threshold.fired';
exports.FIRED_ACTIONS_ID = FIRED_ACTIONS_ID;
const FIRED_ACTIONS = {
  id: FIRED_ACTIONS_ID,
  name: _i18n.i18n.translate('xpack.infra.metrics.alerting.inventory.threshold.fired', {
    defaultMessage: 'Alert'
  })
};
exports.FIRED_ACTIONS = FIRED_ACTIONS;
const WARNING_ACTIONS_ID = 'metrics.inventory_threshold.warning';
exports.WARNING_ACTIONS_ID = WARNING_ACTIONS_ID;
const WARNING_ACTIONS = {
  id: WARNING_ACTIONS_ID,
  name: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.warning', {
    defaultMessage: 'Warning'
  })
};
exports.WARNING_ACTIONS = WARNING_ACTIONS;

const formatMetric = (metric, value) => {
  const metricFormatter = (0, _lodash.get)(_snapshot_metric_formats.METRIC_FORMATTERS, metric, _snapshot_metric_formats.METRIC_FORMATTERS.count);

  if (isNaN(value)) {
    return _i18n.i18n.translate('xpack.infra.metrics.alerting.inventory.noDataFormattedValue', {
      defaultMessage: '[NO DATA]'
    });
  }

  const formatter = (0, _formatters.createFormatter)(metricFormatter.formatter, metricFormatter.template);
  return formatter(value);
};