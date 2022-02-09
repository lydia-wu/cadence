"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlertsSubClient = void 0;

var _get = require("./get");

var _update_status = require("./update_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createAlertsSubClient = clientArgs => {
  const alertsSubClient = {
    get: params => (0, _get.get)(params, clientArgs),
    updateStatus: params => (0, _update_status.updateStatus)(params, clientArgs)
  };
  return Object.freeze(alertsSubClient);
};

exports.createAlertsSubClient = createAlertsSubClient;