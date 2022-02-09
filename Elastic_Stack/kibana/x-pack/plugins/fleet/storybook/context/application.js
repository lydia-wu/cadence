"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApplication = void 0;

var _rxjs = require("rxjs");

var _addonActions = require("@storybook/addon-actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const applications = new Map();

const getApplication = () => {
  const application = {
    currentAppId$: (0, _rxjs.of)('fleet'),
    navigateToUrl: async url => {
      (0, _addonActions.action)(`Navigate to: ${url}`);
    },
    navigateToApp: async app => {
      (0, _addonActions.action)(`Navigate to: ${app}`);
    },
    getUrlForApp: url => url,
    capabilities: {
      catalogue: {},
      management: {},
      navLinks: {},
      fleet: {
        write: true
      }
    },
    applications$: (0, _rxjs.of)(applications)
  };
  return application;
};

exports.getApplication = getApplication;