"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dataset = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Options that a plugin/solution provides to rule_registry in order to
 * define and initialize an index for alerts-as-data.
 *
 * IMPORTANT: All names provided in these options are relative. For example:
 * - component template refs will be 'ecs-mappings', not '.alerts-ecs-mappings'
 * - component template names will be 'mappings', not '.alerts-security.alerts-mappings'
 * - etc
 */

/**
 * Dataset suffix restricted to a few values. All alerts-as-data indices
 * are designed to contain only documents of these "kinds".
 */

let Dataset;
exports.Dataset = Dataset;

(function (Dataset) {
  Dataset["alerts"] = "alerts";
  Dataset["events"] = "events";
})(Dataset || (exports.Dataset = Dataset = {}));