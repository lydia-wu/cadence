"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEnsureDefaultDataView = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createEnsureDefaultDataView = (uiSettings, onRedirectNoDefaultView) => {
  /**
   * Checks whether a default data view is set and exists and defines
   * one otherwise.
   */
  return async function ensureDefaultDataView() {
    const patterns = await this.getIds();
    let defaultId = await uiSettings.get('defaultIndex');
    let defined = !!defaultId;
    const exists = (0, _lodash.includes)(patterns, defaultId);

    if (defined && !exists) {
      await uiSettings.remove('defaultIndex');
      defaultId = defined = false;
    }

    if (defined) {
      return;
    } // If there is any user index pattern created, set the first as default
    // if there is 0 patterns, then don't even call `hasUserDataView()`


    if (patterns.length >= 1 && (await this.hasUserDataView().catch(() => true))) {
      defaultId = patterns[0];
      await uiSettings.set('defaultIndex', defaultId);
    } else {
      return onRedirectNoDefaultView();
    }
  };
};

exports.createEnsureDefaultDataView = createEnsureDefaultDataView;