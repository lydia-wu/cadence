"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChrome = void 0;

var _addonActions = require("@storybook/addon-actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getChrome = () => {
  const chrome = {
    docTitle: {
      change: (0, _addonActions.action)('Change Doc Title'),
      reset: (0, _addonActions.action)('Reset Doc Title')
    },
    setBreadcrumbs: (0, _addonActions.action)('Set Breadcrumbs')
  };
  return chrome;
};

exports.getChrome = getChrome;