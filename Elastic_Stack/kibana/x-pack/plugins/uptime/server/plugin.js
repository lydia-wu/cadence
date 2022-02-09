"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _uptime_rule_field_map = require("../common/rules/uptime_rule_field_map");

var _kibana = require("./kibana.index");

var _adapters = require("./lib/adapters");

var _saved_objects = require("./lib/saved_objects");

var _mapping_from_field_map = require("../../rule_registry/common/mapping_from_field_map");

var _server = require("../../rule_registry/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class Plugin {
  constructor(_initializerContext) {
    (0, _defineProperty2.default)(this, "savedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "initContext", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.initContext = _initializerContext;
  }

  setup(core, plugins) {
    this.logger = this.initContext.logger.get();
    const {
      ruleDataService
    } = plugins.ruleRegistry;
    const ruleDataClient = ruleDataService.initializeIndex({
      feature: 'uptime',
      registrationContext: 'observability.uptime',
      dataset: _server.Dataset.alerts,
      componentTemplateRefs: [],
      componentTemplates: [{
        name: 'mappings',
        mappings: (0, _mapping_from_field_map.mappingFromFieldMap)(_uptime_rule_field_map.uptimeRuleFieldMap, 'strict')
      }]
    });
    (0, _kibana.initServerWithKibana)({
      router: core.http.createRouter()
    }, plugins, ruleDataClient, this.logger);
    core.savedObjects.registerType(_saved_objects.umDynamicSettings);

    _adapters.KibanaTelemetryAdapter.registerUsageCollector(plugins.usageCollection, () => this.savedObjectsClient);

    return {
      ruleRegistry: ruleDataClient
    };
  }

  start(core, _plugins) {
    this.savedObjectsClient = core.savedObjects.createInternalRepository();
  }

  stop() {}

}

exports.Plugin = Plugin;