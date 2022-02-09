"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.duplicateRule = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

var _i18n = require("@kbn/i18n");

var _constants = require("../../../../common/constants");

var _add_tags = require("./add_tags");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DUPLICATE_TITLE = _i18n.i18n.translate('xpack.securitySolution.detectionEngine.rules.cloneRule.duplicateTitle', {
  defaultMessage: 'Duplicate'
});

const duplicateRule = rule => {
  const newRuleId = _uuid.default.v4();

  return {
    name: `${rule.name} [${DUPLICATE_TITLE}]`,
    tags: (0, _add_tags.addTags)(rule.tags, newRuleId, false),
    alertTypeId: _constants.SIGNALS_ID,
    consumer: _constants.SERVER_APP_ID,
    params: { ...rule.params,
      immutable: false,
      ruleId: newRuleId
    },
    schedule: rule.schedule,
    enabled: false,
    actions: rule.actions,
    throttle: null,
    notifyWhen: null
  };
};

exports.duplicateRule = duplicateRule;