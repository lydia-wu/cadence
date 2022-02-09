"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStats = void 0;

var _enums = require("../../common/enums");

var _server = require("../../../../dashboard/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const doTelemetryFoVisualizations = async (soClient, calculateTelemetry) => {
  const finder = await soClient.createPointInTimeFinder({
    type: 'visualization',
    perPage: 1000,
    namespaces: ['*']
  });

  for await (const response of finder.find()) {
    (response.saved_objects || []).forEach(({
      attributes
    }) => {
      if (attributes !== null && attributes !== void 0 && attributes.visState) {
        try {
          const visState = JSON.parse(attributes.visState);
          calculateTelemetry(visState);
        } catch {// nothing to be here, "so" not valid
        }
      }
    });
  }

  await finder.close();
};

const doTelemetryForByValueVisualizations = async (soClient, telemetryUseLastValueMode) => {
  const byValueVisualizations = await (0, _server.findByValueEmbeddables)(soClient, 'visualization');

  for (const item of byValueVisualizations) {
    telemetryUseLastValueMode(item.savedVis);
  }
};

const getStats = async soClient => {
  const timeseriesUsage = {
    timeseries_use_last_value_mode_total: 0,
    timeseries_table_use_aggregate_function: 0
  };

  function telemetryUseLastValueMode(visState) {
    if (visState.type === 'metrics' && visState.params.type !== 'timeseries' && (!visState.params.time_range_mode || visState.params.time_range_mode === _enums.TIME_RANGE_DATA_MODES.LAST_VALUE)) {
      timeseriesUsage.timeseries_use_last_value_mode_total++;
    }
  }

  function telemetryTableAggFunction(visState) {
    if (visState.type === 'metrics' && visState.params.type === 'table' && visState.params.series && visState.params.series.length > 0) {
      const usesAggregateFunction = visState.params.series.some(s => s.aggregate_by && s.aggregate_function);

      if (usesAggregateFunction) {
        timeseriesUsage.timeseries_table_use_aggregate_function++;
      }
    }
  }

  await Promise.all([// last value usage telemetry
  doTelemetryFoVisualizations(soClient, telemetryUseLastValueMode), doTelemetryForByValueVisualizations(soClient, telemetryUseLastValueMode), //  table aggregate function telemetry
  doTelemetryFoVisualizations(soClient, telemetryTableAggFunction), doTelemetryForByValueVisualizations(soClient, telemetryTableAggFunction)]);
  return timeseriesUsage.timeseries_use_last_value_mode_total || timeseriesUsage.timeseries_table_use_aggregate_function ? timeseriesUsage : undefined;
};

exports.getStats = getStats;