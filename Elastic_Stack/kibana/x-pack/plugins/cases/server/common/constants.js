"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.USER_ACTION_OLD_PUSH_ID_REF_NAME = exports.USER_ACTION_OLD_ID_REF_NAME = exports.SUB_CASE_REF_NAME = exports.PUSH_CONNECTOR_ID_REFERENCE_NAME = exports.CONNECTOR_ID_REFERENCE_NAME = exports.COMMENT_REF_NAME = exports.CASE_REF_NAME = void 0;

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The name of the saved object reference indicating the action connector ID. This is stored in the Saved Object reference
 * field's name property.
 */


const CONNECTOR_ID_REFERENCE_NAME = 'connectorId';
/**
 * The name of the saved object reference indicating the action connector ID that was used to push a case.
 */

exports.CONNECTOR_ID_REFERENCE_NAME = CONNECTOR_ID_REFERENCE_NAME;
const PUSH_CONNECTOR_ID_REFERENCE_NAME = 'pushConnectorId';
/**
 * The name of the saved object reference indicating the action connector ID that was used for
 * adding a connector, or updating the existing connector for a user action's old_value field.
 */

exports.PUSH_CONNECTOR_ID_REFERENCE_NAME = PUSH_CONNECTOR_ID_REFERENCE_NAME;
const USER_ACTION_OLD_ID_REF_NAME = 'oldConnectorId';
/**
 * The name of the saved object reference indicating the action connector ID that was used for pushing a case,
 * for a user action's old_value field.
 */

exports.USER_ACTION_OLD_ID_REF_NAME = USER_ACTION_OLD_ID_REF_NAME;
const USER_ACTION_OLD_PUSH_ID_REF_NAME = 'oldPushConnectorId';
/**
 * The name of the saved object reference indicating the caseId reference
 */

exports.USER_ACTION_OLD_PUSH_ID_REF_NAME = USER_ACTION_OLD_PUSH_ID_REF_NAME;
const CASE_REF_NAME = `associated-${_common.CASE_SAVED_OBJECT}`;
/**
 * The name of the saved object reference indicating the commentId reference
 */

exports.CASE_REF_NAME = CASE_REF_NAME;
const COMMENT_REF_NAME = `associated-${_common.CASE_COMMENT_SAVED_OBJECT}`;
/**
 * The name of the saved object reference indicating the subCaseId reference
 */

exports.COMMENT_REF_NAME = COMMENT_REF_NAME;
const SUB_CASE_REF_NAME = `associated-${_common.SUB_CASE_SAVED_OBJECT}`;
exports.SUB_CASE_REF_NAME = SUB_CASE_REF_NAME;