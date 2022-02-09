"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResetSessionPage = ResetSessionPage;

var _button = require("@elastic/eui/lib/components/button");

var _react = _interopRequireDefault(require("react"));

var _i18n = require("@kbn/i18n");

var _react2 = require("@kbn/i18n/react");

var _prompt_page = require("../prompt_page");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error no definitions in component folder


function ResetSessionPage({
  logoutUrl,
  buildNumber,
  basePath
}) {
  return /*#__PURE__*/_react.default.createElement(_prompt_page.PromptPage, {
    buildNumber: buildNumber,
    basePath: basePath,
    scriptPaths: ['/internal/security/reset_session_page.js'],
    title: _i18n.i18n.translate('xpack.security.resetSession.title', {
      defaultMessage: 'You do not have permission to access the requested page'
    }),
    body: /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement(_react2.FormattedMessage, {
      id: "xpack.security.resetSession.description",
      defaultMessage: "Either go back to the previous page or log in as a different user."
    })),
    actions: [/*#__PURE__*/_react.default.createElement(_button.EuiButton, {
      color: "primary",
      fill: true,
      href: logoutUrl,
      "data-test-subj": "ResetSessionButton"
    }, /*#__PURE__*/_react.default.createElement(_react2.FormattedMessage, {
      id: "xpack.security.resetSession.logOutButtonLabel",
      defaultMessage: "Log in as different user"
    })), /*#__PURE__*/_react.default.createElement(_button.EuiButtonEmpty, {
      id: "goBackButton"
    }, /*#__PURE__*/_react.default.createElement(_react2.FormattedMessage, {
      id: "xpack.security.resetSession.goBackButtonLabel",
      defaultMessage: "Go back"
    }))]
  });
}