"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LensServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _routes = require("./routes");

var _usage = require("./usage");

var _saved_objects = require("./saved_objects");

var _lens_embeddable_factory = require("./embeddable/lens_embeddable_factory");

var _expressions = require("./expressions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class LensServerPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "kibanaIndexConfig", void 0);
    (0, _defineProperty2.default)(this, "telemetryLogger", void 0);
    this.initializerContext = initializerContext;
    this.kibanaIndexConfig = initializerContext.config.legacy.globalConfig$;
    this.telemetryLogger = initializerContext.logger.get('usage');
  }

  setup(core, plugins) {
    (0, _saved_objects.setupSavedObjects)(core);
    (0, _routes.setupRoutes)(core, this.initializerContext.logger.get());
    (0, _expressions.setupExpressions)(core, plugins.expressions);

    if (plugins.usageCollection && plugins.taskManager) {
      (0, _usage.registerLensUsageCollector)(plugins.usageCollection, core.getStartServices().then(([_, {
        taskManager
      }]) => taskManager));
      (0, _usage.initializeLensTelemetry)(this.telemetryLogger, core, this.kibanaIndexConfig, plugins.taskManager);
    }

    plugins.embeddable.registerEmbeddableFactory((0, _lens_embeddable_factory.lensEmbeddableFactory)());
    return {
      lensEmbeddableFactory: _lens_embeddable_factory.lensEmbeddableFactory
    };
  }

  start(core, plugins) {
    if (plugins.taskManager) {
      (0, _usage.scheduleLensTelemetry)(this.telemetryLogger, plugins.taskManager);
    }

    return {};
  }

  stop() {}

}

exports.LensServerPlugin = LensServerPlugin;