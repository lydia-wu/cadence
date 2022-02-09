"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.casesFeatureId = void 0;
Object.defineProperty(exports, "enableComparisonByDefault", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.enableComparisonByDefault;
  }
});
Object.defineProperty(exports, "enableInspectEsQueries", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.enableInspectEsQueries;
  }
});
Object.defineProperty(exports, "maxSuggestions", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.maxSuggestions;
  }
});
exports.observabilityFeatureId = exports.observabilityAppId = void 0;

var _ui_settings_keys = require("./ui_settings_keys");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const casesFeatureId = 'observabilityCases'; // The ID of the observability app. Should more appropriately be called
// 'observability' but it's used in telemetry by applicationUsage so we don't
// want to change it.

exports.casesFeatureId = casesFeatureId;
const observabilityAppId = 'observability-overview'; // Used by feature and "solution" registration

exports.observabilityAppId = observabilityAppId;
const observabilityFeatureId = 'observability';
exports.observabilityFeatureId = observabilityFeatureId;