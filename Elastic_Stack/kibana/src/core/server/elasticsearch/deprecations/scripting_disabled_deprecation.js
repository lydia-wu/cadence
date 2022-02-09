"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScriptingDisabledDeprecations = void 0;

var _i18n = require("@kbn/i18n");

var _is_scripting_disabled = require("./is_scripting_disabled");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getScriptingDisabledDeprecations = async ({
  esClient
}) => {
  const deprecations = [];

  if (await (0, _is_scripting_disabled.isInlineScriptingDisabled)({
    client: esClient.asInternalUser
  })) {
    deprecations.push({
      title: _i18n.i18n.translate('core.elasticsearch.deprecations.scriptingDisabled.title', {
        defaultMessage: 'Inline scripting is disabled on elasticsearch'
      }),
      message: _i18n.i18n.translate('core.elasticsearch.deprecations.scriptingDisabled.message', {
        defaultMessage: 'Starting in 8.0, Kibana will require inline scripting to be enabled,' + 'and will fail to start otherwise.'
      }),
      level: 'critical',
      requireRestart: false,
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('core.elasticsearch.deprecations.scriptingDisabled.manualSteps.1', {
          defaultMessage: 'Set `script.allowed_types=inline` in your elasticsearch config '
        })]
      }
    });
  }

  return deprecations;
};

exports.getScriptingDisabledDeprecations = getScriptingDisabledDeprecations;