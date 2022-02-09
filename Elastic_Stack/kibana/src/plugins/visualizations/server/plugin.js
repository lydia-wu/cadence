"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisualizationsPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");

var _saved_objects = require("./saved_objects");

var _usage_collector = require("./usage_collector");

var _visualize_embeddable_factory = require("./embeddable/visualize_embeddable_factory");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class VisualizationsPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = initializerContext.logger.get();
  }

  setup(core, plugins) {
    this.logger.debug('visualizations: Setup');
    core.savedObjects.registerType(_saved_objects.visualizationSavedObjectType);
    core.uiSettings.register({
      [_constants.VISUALIZE_ENABLE_LABS_SETTING]: {
        name: _i18n.i18n.translate('visualizations.advancedSettings.visualizeEnableLabsTitle', {
          defaultMessage: 'Enable experimental visualizations'
        }),
        value: true,
        description: _i18n.i18n.translate('visualizations.advancedSettings.visualizeEnableLabsText', {
          defaultMessage: `Allows users to create, view, and edit experimental visualizations. If disabled,
            only visualizations that are considered production-ready are available to the user.`
        }),
        category: ['visualization'],
        schema: _configSchema.schema.boolean()
      }
    });

    if (plugins.usageCollection) {
      (0, _usage_collector.registerVisualizationsCollector)(plugins.usageCollection);
    }

    plugins.embeddable.registerEmbeddableFactory((0, _visualize_embeddable_factory.visualizeEmbeddableFactory)());
    return {};
  }

  start(core) {
    this.logger.debug('visualizations: Started');
    return {};
  }

  stop() {}

}

exports.VisualizationsPlugin = VisualizationsPlugin;