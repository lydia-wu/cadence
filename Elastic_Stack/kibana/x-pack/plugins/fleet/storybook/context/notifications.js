"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNotifications = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

var _rxjs = require("rxjs");

var _addonActions = require("@storybook/addon-actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const handler = (type, ...rest) => {
  (0, _addonActions.action)(`${type} Toast`)(rest);
  return {
    id: (0, _uuid.default)()
  };
};

const notifications = {
  toasts: {
    add: params => handler('add', params),
    addDanger: params => handler('danger', params),
    addError: params => handler('error', params),
    addWarning: params => handler('warning', params),
    addSuccess: params => handler('success', params),
    addInfo: params => handler('info', params),
    remove: () => {},
    get$: () => (0, _rxjs.of)([])
  }
};

const getNotifications = () => notifications;

exports.getNotifications = getNotifications;