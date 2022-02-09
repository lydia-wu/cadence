"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "IndexPatternsFetcher", {
  enumerable: true,
  get: function () {
    return _fetcher.IndexPatternsFetcher;
  }
});
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _plugin.DataViewsServerPlugin;
  }
});
Object.defineProperty(exports, "findIndexPatternById", {
  enumerable: true,
  get: function () {
    return _utils.findIndexPatternById;
  }
});
Object.defineProperty(exports, "getCapabilitiesForRollupIndices", {
  enumerable: true,
  get: function () {
    return _fetcher.getCapabilitiesForRollupIndices;
  }
});
Object.defineProperty(exports, "getFieldByName", {
  enumerable: true,
  get: function () {
    return _utils.getFieldByName;
  }
});
Object.defineProperty(exports, "mergeCapabilitiesWithFields", {
  enumerable: true,
  get: function () {
    return _fetcher.mergeCapabilitiesWithFields;
  }
});
exports.plugin = plugin;
Object.defineProperty(exports, "shouldReadFieldFromDocValues", {
  enumerable: true,
  get: function () {
    return _fetcher.shouldReadFieldFromDocValues;
  }
});

var _utils = require("./utils");

var _fetcher = require("./fetcher");

var _plugin = require("./plugin");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Static code to be shared externally
 * @public
 */
function plugin(initializerContext) {
  return new _plugin.DataViewsServerPlugin(initializerContext);
}