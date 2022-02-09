"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALERT_RULE_THRESHOLD_FIELD = exports.ALERT_ORIGINAL_TIME = exports.ALERT_ORIGINAL_EVENT = exports.ALERT_GROUP_INDEX = exports.ALERT_GROUP_ID = exports.ALERT_DEPTH = exports.ALERT_BUILDING_BLOCK_TYPE = exports.ALERT_ANCESTORS = void 0;

var _technical_field_names = require("@kbn/rule-data-utils/technical_field_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ALERT_ANCESTORS = `${_technical_field_names.ALERT_NAMESPACE}.ancestors`;
exports.ALERT_ANCESTORS = ALERT_ANCESTORS;
const ALERT_BUILDING_BLOCK_TYPE = `${_technical_field_names.ALERT_NAMESPACE}.building_block_type`;
exports.ALERT_BUILDING_BLOCK_TYPE = ALERT_BUILDING_BLOCK_TYPE;
const ALERT_DEPTH = `${_technical_field_names.ALERT_NAMESPACE}.depth`;
exports.ALERT_DEPTH = ALERT_DEPTH;
const ALERT_GROUP_ID = `${_technical_field_names.ALERT_NAMESPACE}.group.id`;
exports.ALERT_GROUP_ID = ALERT_GROUP_ID;
const ALERT_GROUP_INDEX = `${_technical_field_names.ALERT_NAMESPACE}.group.index`;
exports.ALERT_GROUP_INDEX = ALERT_GROUP_INDEX;
const ALERT_ORIGINAL_EVENT = `${_technical_field_names.ALERT_NAMESPACE}.original_event`;
exports.ALERT_ORIGINAL_EVENT = ALERT_ORIGINAL_EVENT;
const ALERT_ORIGINAL_TIME = `${_technical_field_names.ALERT_NAMESPACE}.original_time`;
exports.ALERT_ORIGINAL_TIME = ALERT_ORIGINAL_TIME;
const ALERT_RULE_THRESHOLD = `${_technical_field_names.ALERT_RULE_NAMESPACE}.threshold`;
const ALERT_RULE_THRESHOLD_FIELD = `${ALERT_RULE_THRESHOLD}.field`;
exports.ALERT_RULE_THRESHOLD_FIELD = ALERT_RULE_THRESHOLD_FIELD;