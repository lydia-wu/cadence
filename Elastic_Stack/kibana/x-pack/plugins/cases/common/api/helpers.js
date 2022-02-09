"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSubCasesUrl = exports.getSubCaseUserActionUrl = exports.getSubCaseDetailsUrl = exports.getCasesFromAlertsUrl = exports.getCaseUserActionUrl = exports.getCasePushUrl = exports.getCaseDetailsUrl = exports.getCaseConfigurationDetailsUrl = exports.getCaseCommentsUrl = exports.getCaseCommentDetailsUrl = void 0;

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getCaseDetailsUrl = id => {
  return _constants.CASE_DETAILS_URL.replace('{case_id}', id);
};

exports.getCaseDetailsUrl = getCaseDetailsUrl;

const getSubCasesUrl = caseID => {
  return _constants.SUB_CASES_URL.replace('{case_id}', caseID);
};

exports.getSubCasesUrl = getSubCasesUrl;

const getSubCaseDetailsUrl = (caseID, subCaseId) => {
  return _constants.SUB_CASE_DETAILS_URL.replace('{case_id}', caseID).replace('{sub_case_id}', subCaseId);
};

exports.getSubCaseDetailsUrl = getSubCaseDetailsUrl;

const getCaseCommentsUrl = id => {
  return _constants.CASE_COMMENTS_URL.replace('{case_id}', id);
};

exports.getCaseCommentsUrl = getCaseCommentsUrl;

const getCaseCommentDetailsUrl = (caseId, commentId) => {
  return _constants.CASE_COMMENT_DETAILS_URL.replace('{case_id}', caseId).replace('{comment_id}', commentId);
};

exports.getCaseCommentDetailsUrl = getCaseCommentDetailsUrl;

const getCaseUserActionUrl = id => {
  return _constants.CASE_USER_ACTIONS_URL.replace('{case_id}', id);
};

exports.getCaseUserActionUrl = getCaseUserActionUrl;

const getSubCaseUserActionUrl = (caseID, subCaseId) => {
  return _constants.SUB_CASE_USER_ACTIONS_URL.replace('{case_id}', caseID).replace('{sub_case_id}', subCaseId);
};

exports.getSubCaseUserActionUrl = getSubCaseUserActionUrl;

const getCasePushUrl = (caseId, connectorId) => {
  return _constants.CASE_PUSH_URL.replace('{case_id}', caseId).replace('{connector_id}', connectorId);
};

exports.getCasePushUrl = getCasePushUrl;

const getCaseConfigurationDetailsUrl = configureID => {
  return _constants.CASE_CONFIGURE_DETAILS_URL.replace('{configuration_id}', configureID);
};

exports.getCaseConfigurationDetailsUrl = getCaseConfigurationDetailsUrl;

const getCasesFromAlertsUrl = alertId => {
  return _constants.CASE_ALERTS_URL.replace('{alert_id}', alertId);
};

exports.getCasesFromAlertsUrl = getCasesFromAlertsUrl;