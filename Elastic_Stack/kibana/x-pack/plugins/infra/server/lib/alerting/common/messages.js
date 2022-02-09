"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.valueActionVariableDescription = exports.timestampActionVariableDescription = exports.thresholdActionVariableDescription = exports.stateToAlertMessage = exports.reasonActionVariableDescription = exports.metricActionVariableDescription = exports.groupActionVariableDescription = exports.buildRecoveredAlertReason = exports.buildNoDataAlertReason = exports.buildInvalidQueryAlertReason = exports.buildFiredAlertReason = exports.buildErrorAlertReason = exports.alertStateActionVariableDescription = exports.DOCUMENT_COUNT_I18N = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DOCUMENT_COUNT_I18N = _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.documentCount', {
  defaultMessage: 'Document count'
});

exports.DOCUMENT_COUNT_I18N = DOCUMENT_COUNT_I18N;
const stateToAlertMessage = {
  [_types.AlertStates.ALERT]: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.alertState', {
    defaultMessage: 'ALERT'
  }),
  [_types.AlertStates.WARNING]: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.warningState', {
    defaultMessage: 'WARNING'
  }),
  [_types.AlertStates.NO_DATA]: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.noDataState', {
    defaultMessage: 'NO DATA'
  }),
  [_types.AlertStates.ERROR]: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.errorState', {
    defaultMessage: 'ERROR'
  }),
  [_types.AlertStates.OK]: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.okState', {
    defaultMessage: 'OK [Recovered]'
  })
};
exports.stateToAlertMessage = stateToAlertMessage;

const toNumber = value => typeof value === 'string' ? parseFloat(value) : value;

const comparatorToI18n = (comparator, threshold, currentValue) => {
  const gtText = _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.gtComparator', {
    defaultMessage: 'greater than'
  });

  const ltText = _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.ltComparator', {
    defaultMessage: 'less than'
  });

  const eqText = _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.eqComparator', {
    defaultMessage: 'equal to'
  });

  switch (comparator) {
    case _types.Comparator.BETWEEN:
      return _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.betweenComparator', {
        defaultMessage: 'between'
      });

    case _types.Comparator.OUTSIDE_RANGE:
      return _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.outsideRangeComparator', {
        defaultMessage: 'not between'
      });

    case _types.Comparator.GT:
      return gtText;

    case _types.Comparator.LT:
      return ltText;

    case _types.Comparator.GT_OR_EQ:
    case _types.Comparator.LT_OR_EQ:
      {
        if (currentValue === threshold[0]) {
          return eqText;
        } else if (currentValue < threshold[0]) {
          return ltText;
        } else {
          return gtText;
        }
      }
  }
};

const recoveredComparatorToI18n = (comparator, threshold, currentValue) => {
  const belowText = _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.belowRecovery', {
    defaultMessage: 'below'
  });

  const aboveText = _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.aboveRecovery', {
    defaultMessage: 'above'
  });

  switch (comparator) {
    case _types.Comparator.BETWEEN:
      return currentValue < threshold[0] ? belowText : aboveText;

    case _types.Comparator.OUTSIDE_RANGE:
      return _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.betweenRecovery', {
        defaultMessage: 'between'
      });

    case _types.Comparator.GT:
    case _types.Comparator.GT_OR_EQ:
      return belowText;

    case _types.Comparator.LT:
    case _types.Comparator.LT_OR_EQ:
      return aboveText;
  }
};

const thresholdToI18n = ([a, b]) => {
  if (typeof b === 'undefined') return a;
  return _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.thresholdRange', {
    defaultMessage: '{a} and {b}',
    values: {
      a,
      b
    }
  });
};

const buildFiredAlertReason = ({
  group,
  metric,
  comparator,
  threshold,
  currentValue
}) => _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.firedAlertReason', {
  defaultMessage: '{metric} is {comparator} a threshold of {threshold} (current value is {currentValue}) for {group}',
  values: {
    group,
    metric,
    comparator: comparatorToI18n(comparator, threshold.map(toNumber), toNumber(currentValue)),
    threshold: thresholdToI18n(threshold),
    currentValue
  }
});

exports.buildFiredAlertReason = buildFiredAlertReason;

const buildRecoveredAlertReason = ({
  group,
  metric,
  comparator,
  threshold,
  currentValue
}) => _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.recoveredAlertReason', {
  defaultMessage: '{metric} is now {comparator} a threshold of {threshold} (current value is {currentValue}) for {group}',
  values: {
    metric,
    comparator: recoveredComparatorToI18n(comparator, threshold.map(toNumber), toNumber(currentValue)),
    threshold: thresholdToI18n(threshold),
    currentValue,
    group
  }
});

exports.buildRecoveredAlertReason = buildRecoveredAlertReason;

const buildNoDataAlertReason = ({
  group,
  metric,
  timeSize,
  timeUnit
}) => _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.noDataAlertReason', {
  defaultMessage: '{metric} has reported no data over the past {interval} for {group}',
  values: {
    metric,
    interval: `${timeSize}${timeUnit}`,
    group
  }
});

exports.buildNoDataAlertReason = buildNoDataAlertReason;

const buildErrorAlertReason = metric => _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.errorAlertReason', {
  defaultMessage: 'Elasticsearch failed when attempting to query data for {metric}',
  values: {
    metric
  }
});

exports.buildErrorAlertReason = buildErrorAlertReason;

const buildInvalidQueryAlertReason = filterQueryText => _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.queryErrorAlertReason', {
  defaultMessage: 'Alert is using a malformed KQL query: {filterQueryText}',
  values: {
    filterQueryText
  }
});

exports.buildInvalidQueryAlertReason = buildInvalidQueryAlertReason;

const groupActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.groupActionVariableDescription', {
  defaultMessage: 'Name of the group reporting data'
});

exports.groupActionVariableDescription = groupActionVariableDescription;

const alertStateActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.alertStateActionVariableDescription', {
  defaultMessage: 'Current state of the alert'
});

exports.alertStateActionVariableDescription = alertStateActionVariableDescription;

const reasonActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.reasonActionVariableDescription', {
  defaultMessage: 'A description of why the alert is in this state, including which metrics have crossed which thresholds'
});

exports.reasonActionVariableDescription = reasonActionVariableDescription;

const timestampActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.timestampDescription', {
  defaultMessage: 'A timestamp of when the alert was detected.'
});

exports.timestampActionVariableDescription = timestampActionVariableDescription;

const valueActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.valueActionVariableDescription', {
  defaultMessage: 'The value of the metric in the specified condition. Usage: (ctx.value.condition0, ctx.value.condition1, etc...).'
});

exports.valueActionVariableDescription = valueActionVariableDescription;

const metricActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.metricActionVariableDescription', {
  defaultMessage: 'The metric name in the specified condition. Usage: (ctx.metric.condition0, ctx.metric.condition1, etc...).'
});

exports.metricActionVariableDescription = metricActionVariableDescription;

const thresholdActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.thresholdActionVariableDescription', {
  defaultMessage: 'The threshold value of the metric for the specified condition. Usage: (ctx.threshold.condition0, ctx.threshold.condition1, etc...).'
});

exports.thresholdActionVariableDescription = thresholdActionVariableDescription;