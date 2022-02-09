"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReasonMessageForUngroupedRatioAlert = exports.getReasonMessageForUngroupedCountAlert = exports.getReasonMessageForGroupedRatioAlert = exports.getReasonMessageForGroupedCountAlert = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("../../../../common/alerting/logs/log_threshold/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getReasonMessageForUngroupedCountAlert = (actualCount, expectedCount, comparator) => _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.ungroupedCountAlertReasonDescription', {
  defaultMessage: '{actualCount, plural, one {{actualCount} log entry} other {{actualCount} log entries} } ({translatedComparator} {expectedCount}) match the conditions.',
  values: {
    actualCount,
    expectedCount,
    translatedComparator: _types.ComparatorToi18nMap[comparator]
  }
});

exports.getReasonMessageForUngroupedCountAlert = getReasonMessageForUngroupedCountAlert;

const getReasonMessageForGroupedCountAlert = (actualCount, expectedCount, comparator, groupName) => _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.groupedCountAlertReasonDescription', {
  defaultMessage: '{actualCount, plural, one {{actualCount} log entry} other {{actualCount} log entries} } ({translatedComparator} {expectedCount}) match the conditions for {groupName}.',
  values: {
    actualCount,
    expectedCount,
    groupName,
    translatedComparator: _types.ComparatorToi18nMap[comparator]
  }
});

exports.getReasonMessageForGroupedCountAlert = getReasonMessageForGroupedCountAlert;

const getReasonMessageForUngroupedRatioAlert = (actualRatio, expectedRatio, comparator) => _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.ungroupedRatioAlertReasonDescription', {
  defaultMessage: 'The log entries ratio is {actualRatio} ({translatedComparator} {expectedRatio}).',
  values: {
    actualRatio,
    expectedRatio,
    translatedComparator: _types.ComparatorToi18nMap[comparator]
  }
});

exports.getReasonMessageForUngroupedRatioAlert = getReasonMessageForUngroupedRatioAlert;

const getReasonMessageForGroupedRatioAlert = (actualRatio, expectedRatio, comparator, groupName) => _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.groupedRatioAlertReasonDescription', {
  defaultMessage: 'The log entries ratio is {actualRatio} ({translatedComparator} {expectedRatio}) for {groupName}.',
  values: {
    actualRatio,
    expectedRatio,
    groupName,
    translatedComparator: _types.ComparatorToi18nMap[comparator]
  }
});

exports.getReasonMessageForGroupedRatioAlert = getReasonMessageForGroupedRatioAlert;