"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyGetRuleReference = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given an id this returns a legacy rule reference.
 * @param id The id of the alert
 * @deprecated Remove this once we've fully migrated to event-log and no longer require addition status SO (8.x)
 */

const legacyGetRuleReference = id => ({
  id,
  type: 'alert',
  name: 'alert_0'
});

exports.legacyGetRuleReference = legacyGetRuleReference;