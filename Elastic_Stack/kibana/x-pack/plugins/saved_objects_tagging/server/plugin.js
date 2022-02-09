"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectTaggingPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _features = require("./features");

var _saved_objects = require("./saved_objects");

var _request_handler_context = require("./request_handler_context");

var _routes = require("./routes");

var _usage = require("./usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class SavedObjectTaggingPlugin {
  constructor(context) {
    (0, _defineProperty2.default)(this, "legacyConfig$", void 0);
    this.legacyConfig$ = context.config.legacy.globalConfig$;
  }

  setup({
    savedObjects,
    http
  }, {
    features,
    usageCollection,
    security
  }) {
    savedObjects.registerType(_saved_objects.tagType);
    const router = http.createRouter();
    (0, _routes.registerRoutes)({
      router
    });
    http.registerRouteHandlerContext('tags', async (context, req, res) => {
      return new _request_handler_context.TagsRequestHandlerContext(req, context.core, security);
    });
    features.registerKibanaFeature(_features.savedObjectsTaggingFeature);

    if (usageCollection) {
      usageCollection.registerCollector((0, _usage.createTagUsageCollector)({
        usageCollection,
        legacyConfig$: this.legacyConfig$
      }));
    }

    return {};
  }

  start(core) {
    return {};
  }

}

exports.SavedObjectTaggingPlugin = SavedObjectTaggingPlugin;