"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeScaleFn = void 0;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _i18n = require("@kbn/i18n");

var _common = require("../../../../../../src/plugins/expressions/common");

var _common2 = require("../../../../../../src/plugins/data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const unitInMs = {
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24
};

const timeScaleFn = getTimezone => async (input, {
  dateColumnId,
  inputColumnId,
  outputColumnId,
  outputColumnName,
  targetUnit
}, context) => {
  const dateColumnDefinition = input.columns.find(column => column.id === dateColumnId);

  if (!dateColumnDefinition) {
    throw new Error(_i18n.i18n.translate('xpack.lens.functions.timeScale.dateColumnMissingMessage', {
      defaultMessage: 'Specified dateColumnId {columnId} does not exist.',
      values: {
        columnId: dateColumnId
      }
    }));
  }

  const resultColumns = (0, _common.buildResultColumns)(input, outputColumnId, inputColumnId, outputColumnName, {
    allowColumnOverwrite: true
  });

  if (!resultColumns) {
    return input;
  }

  const targetUnitInMs = unitInMs[targetUnit];
  const timeInfo = (0, _common2.getDateHistogramMetaDataByDatatableColumn)(dateColumnDefinition, {
    timeZone: await getTimezone(context)
  });
  const intervalDuration = (timeInfo === null || timeInfo === void 0 ? void 0 : timeInfo.interval) && (0, _common2.parseInterval)(timeInfo.interval);

  if (!timeInfo || !intervalDuration) {
    throw new Error(_i18n.i18n.translate('xpack.lens.functions.timeScale.timeInfoMissingMessage', {
      defaultMessage: 'Could not fetch date histogram information'
    }));
  } // the datemath plugin always parses dates by using the current default moment time zone.
  // to use the configured time zone, we are switching just for the bounds calculation.


  const defaultTimezone = (0, _momentTimezone.default)().zoneName();

  _momentTimezone.default.tz.setDefault(timeInfo.timeZone);

  const timeBounds = timeInfo.timeRange && (0, _common2.calculateBounds)(timeInfo.timeRange);
  const result = { ...input,
    columns: resultColumns,
    rows: input.rows.map(row => {
      const newRow = { ...row
      };
      let startOfBucket = (0, _momentTimezone.default)(row[dateColumnId]);
      let endOfBucket = startOfBucket.clone().add(intervalDuration);

      if (timeBounds && timeBounds.min) {
        startOfBucket = _momentTimezone.default.max(startOfBucket, timeBounds.min);
      }

      if (timeBounds && timeBounds.max) {
        endOfBucket = _momentTimezone.default.min(endOfBucket, timeBounds.max);
      }

      const bucketSize = endOfBucket.diff(startOfBucket);
      const factor = bucketSize / targetUnitInMs;
      const currentValue = newRow[inputColumnId];

      if (currentValue != null) {
        newRow[outputColumnId] = Number(currentValue) / factor;
      }

      return newRow;
    })
  }; // reset default moment timezone

  _momentTimezone.default.tz.setDefault(defaultTimezone);

  return result;
};

exports.timeScaleFn = timeScaleFn;