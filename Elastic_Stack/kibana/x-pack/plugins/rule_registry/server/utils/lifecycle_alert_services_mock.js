"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLifecycleAlertServicesMock = void 0;

var _mocks = require("../../../alerting/server/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This wraps the alerts to enable the preservation of the generic type
 * arguments of the factory function.
 **/


class AlertsMockWrapper {
  createAlertServices() {
    return _mocks.alertsMock.createAlertServices();
  }

}

const createLifecycleAlertServicesMock = alertServices => ({
  alertWithLifecycle: ({
    id
  }) => alertServices.alertInstanceFactory(id)
});

exports.createLifecycleAlertServicesMock = createLifecycleAlertServicesMock;