"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodePlugin = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Represents Code Plugin instance that will be managed by the Kibana plugin system.
 */


class CodePlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;
  }

  async setup(core) {
    const config = this.initializerContext.config.get();
    core.deprecations.registerDeprecations({
      getDeprecations: context => {
        const deprecations = [];

        if (config && Object.keys(config).length > 0) {
          deprecations.push({
            level: 'critical',
            deprecationType: 'feature',
            title: _i18n.i18n.translate('xpack.code.deprecations.removed.title', {
              defaultMessage: 'The experimental plugin "Code" has been removed from Kibana'
            }),
            message: _i18n.i18n.translate('xpack.code.deprecations.removed.message', {
              defaultMessage: 'The experimental plugin "Code" has been removed from Kibana. The associated configuration ' + 'properties need to be removed from the Kibana configuration file.'
            }),
            requireRestart: true,
            correctiveActions: {
              manualSteps: [_i18n.i18n.translate('xpack.code.deprecations.removed.manualSteps1', {
                defaultMessage: 'Remove all xpack.code.* properties from the Kibana config file.'
              })]
            }
          });
        }

        return deprecations;
      }
    });
  }

  start() {}

  stop() {}

}

exports.CodePlugin = CodePlugin;