"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
Object.defineProperty(exports, "isVisSeriesData", {
  enumerable: true,
  get: function () {
    return _vis_data_utils.isVisSeriesData;
  }
});
Object.defineProperty(exports, "isVisTableData", {
  enumerable: true,
  get: function () {
    return _vis_data_utils.isVisTableData;
  }
});
exports.plugin = plugin;

var _config = require("./config");

var _plugin = require("./plugin");

var _vis_data_utils = require("../common/vis_data_utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  deprecations: ({
    unused,
    renameFromRoot
  }) => [// In Kibana v7.8 plugin id was renamed from 'metrics' to 'vis_type_timeseries':
  renameFromRoot('metrics.enabled', 'vis_type_timeseries.enabled', {
    level: 'critical'
  }), renameFromRoot('metrics.chartResolution', 'vis_type_timeseries.chartResolution', {
    silent: true,
    level: 'critical'
  }), renameFromRoot('metrics.minimumBucketSize', 'vis_type_timeseries.minimumBucketSize', {
    silent: true,
    level: 'critical'
  }), // Unused properties which should be removed after releasing Kibana v8.0:
  unused('chartResolution', {
    level: 'critical'
  }), unused('minimumBucketSize', {
    level: 'critical'
  })],
  schema: _config.config
};
exports.config = config;

function plugin(initializerContext) {
  return new _plugin.VisTypeTimeseriesPlugin(initializerContext);
}