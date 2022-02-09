"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnauthenticatedPage = UnauthenticatedPage;
exports.renderUnauthenticatedPage = renderUnauthenticatedPage;

var _button = require("@elastic/eui/lib/components/button");

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

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


function UnauthenticatedPage({
  basePath,
  originalURL,
  buildNumber
}) {
  return /*#__PURE__*/_react.default.createElement(_prompt_page.PromptPage, {
    buildNumber: buildNumber,
    basePath: basePath,
    title: _i18n.i18n.translate('xpack.security.unauthenticated.pageTitle', {
      defaultMessage: "We couldn't log you in"
    }),
    body: /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement(_react2.FormattedMessage, {
      id: "xpack.security.unauthenticated.errorDescription",
      defaultMessage: "We hit an authentication error. Please check your credentials and try again. If you still can't log in, contact your system administrator."
    })),
    actions: [/*#__PURE__*/_react.default.createElement(_button.EuiButton, {
      color: "primary",
      fill: true,
      href: originalURL,
      "data-test-subj": "logInButton"
    }, /*#__PURE__*/_react.default.createElement(_react2.FormattedMessage, {
      id: "xpack.security.unauthenticated.loginButtonLabel",
      defaultMessage: "Log in"
    }))]
  });
}

function renderUnauthenticatedPage(props) {
  return (0, _server.renderToStaticMarkup)( /*#__PURE__*/_react.default.createElement(UnauthenticatedPage, props));
}