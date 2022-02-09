"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = void 0;

var _rxjs = require("rxjs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const settings = {
  'theme:darkMode': false
};

const get = key => settings[key];

const uiSettings = {
  get$: key => (0, _rxjs.of)(get(key)),
  get,
  getAll: () => settings,
  isCustom: () => false,
  isOverridden: () => false,
  isDeclared: () => true,
  isDefault: () => true,
  remove: async () => true,
  set: async () => true,
  getUpdate$: () => (0, _rxjs.of)({
    key: 'setting',
    newValue: get('setting'),
    oldValue: get('setting')
  }),
  getUpdateErrors$: () => (0, _rxjs.of)(new Error())
};

const getUiSettings = () => uiSettings;

exports.getUiSettings = getUiSettings;