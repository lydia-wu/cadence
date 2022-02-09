"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonAlertFields = void 0;

var _technical_rule_data_field_names = require("../../common/technical_rule_data_field_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const commonAlertFieldNames = [_technical_rule_data_field_names.ALERT_RULE_CATEGORY, _technical_rule_data_field_names.ALERT_RULE_CONSUMER, _technical_rule_data_field_names.ALERT_RULE_NAME, _technical_rule_data_field_names.ALERT_RULE_PRODUCER, _technical_rule_data_field_names.ALERT_RULE_TYPE_ID, _technical_rule_data_field_names.ALERT_RULE_UUID, _technical_rule_data_field_names.SPACE_IDS, _technical_rule_data_field_names.TAGS, _technical_rule_data_field_names.TIMESTAMP];
const commonAlertIdFieldNames = [_technical_rule_data_field_names.ALERT_INSTANCE_ID, _technical_rule_data_field_names.ALERT_UUID];

const getCommonAlertFields = options => {
  return {
    [_technical_rule_data_field_names.ALERT_RULE_CATEGORY]: options.rule.ruleTypeName,
    [_technical_rule_data_field_names.ALERT_RULE_CONSUMER]: options.rule.consumer,
    [_technical_rule_data_field_names.ALERT_RULE_NAME]: options.rule.name,
    [_technical_rule_data_field_names.ALERT_RULE_PRODUCER]: options.rule.producer,
    [_technical_rule_data_field_names.ALERT_RULE_TYPE_ID]: options.rule.ruleTypeId,
    [_technical_rule_data_field_names.ALERT_RULE_UUID]: options.alertId,
    [_technical_rule_data_field_names.SPACE_IDS]: [options.spaceId],
    [_technical_rule_data_field_names.TAGS]: options.tags,
    [_technical_rule_data_field_names.TIMESTAMP]: options.startedAt.toISOString()
  };
};

exports.getCommonAlertFields = getCommonAlertFields;