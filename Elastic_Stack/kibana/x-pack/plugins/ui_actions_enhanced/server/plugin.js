"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdvancedUiActionsServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _dynamic_action_enhancement = require("./dynamic_action_enhancement");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class AdvancedUiActionsServerPlugin {
  constructor() {
    (0, _defineProperty2.default)(this, "actionFactories", new Map());
    (0, _defineProperty2.default)(this, "registerActionFactory", definition => {
      if (this.actionFactories.has(definition.id)) {
        throw new Error(`ActionFactory [actionFactory.id = ${definition.id}] already registered.`);
      }

      this.actionFactories.set(definition.id, {
        id: definition.id,
        telemetry: definition.telemetry || ((state, stats) => stats),
        inject: definition.inject || _lodash.identity,
        extract: definition.extract || (state => {
          return {
            state,
            references: []
          };
        }),
        migrations: definition.migrations || {}
      });
    });
  }

  setup(core, {
    embeddable
  }) {
    const getActionFactory = actionFactoryId => this.actionFactories.get(actionFactoryId);

    embeddable.registerEnhancement((0, _dynamic_action_enhancement.dynamicActionEnhancement)(getActionFactory));
    return {
      registerActionFactory: this.registerActionFactory
    };
  }

  start() {}

  stop() {}
  /**
   * Register an action factory. Action factories are used to configure and
   * serialize/deserialize dynamic actions.
   */


}

exports.AdvancedUiActionsServerPlugin = AdvancedUiActionsServerPlugin;