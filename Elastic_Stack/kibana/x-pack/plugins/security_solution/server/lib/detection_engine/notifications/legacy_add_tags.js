"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyAddTags = void 0;

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */


const legacyAddTags = (tags, ruleAlertId) => Array.from(new Set([...tags, `${_constants.INTERNAL_RULE_ALERT_ID_KEY}:${ruleAlertId}`]));

exports.legacyAddTags = legacyAddTags;