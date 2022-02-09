"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PromptPage = PromptPage;

var _empty_prompt = require("@elastic/eui/lib/components/empty_prompt");

var _alert = require("@elastic/eui/lib/components/icon/assets/alert");

var _icon = require("@elastic/eui/lib/components/icon/icon");

var _page = require("@elastic/eui/lib/components/page");

var _react = _interopRequireDefault(require("react"));

var _i18n = require("@kbn/i18n");

var _react2 = require("@kbn/i18n/react");

var _uiSharedDepsNpm = _interopRequireDefault(require("@kbn/ui-shared-deps-npm"));

var _uiSharedDepsSrc = _interopRequireDefault(require("@kbn/ui-shared-deps-src"));

var _fonts = require("../../../../src/core/server/rendering/views/fonts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error no definitions in component folder
// @ts-expect-error no definitions in component folder
// @ts-expect-error no definitions in component folder
// @ts-expect-error no definitions in component folder
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// Preload the alert icon used by `EuiEmptyPrompt` to ensure that it's loaded
// in advance the first time this page is rendered server-side. If not, the
// icon svg wouldn't contain any paths the first time the page was rendered.


(0, _icon.appendIconComponentCache)({
  alert: _alert.icon
});

function PromptPage({
  basePath,
  buildNumber,
  scriptPaths = [],
  title,
  body,
  actions
}) {
  const uiPublicURL = `${basePath.serverBasePath}/ui`;
  const regularBundlePath = `${basePath.serverBasePath}/${buildNumber}/bundles`;
  const styleSheetPaths = [`${regularBundlePath}/kbn-ui-shared-deps-src/${_uiSharedDepsSrc.default.cssDistFilename}`, `${regularBundlePath}/kbn-ui-shared-deps-npm/${_uiSharedDepsNpm.default.lightCssDistFilename}`, `${basePath.serverBasePath}/node_modules/@kbn/ui-framework/dist/kui_light.css`, `${basePath.serverBasePath}/ui/legacy_light_theme.css`];
  return /*#__PURE__*/_react.default.createElement("html", {
    lang: _i18n.i18n.getLocale()
  }, /*#__PURE__*/_react.default.createElement("head", null, /*#__PURE__*/_react.default.createElement("title", null, "Elastic"), styleSheetPaths.map(path => /*#__PURE__*/_react.default.createElement("link", {
    href: path,
    rel: "stylesheet",
    key: path
  })), /*#__PURE__*/_react.default.createElement(_fonts.Fonts, {
    url: uiPublicURL
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "alternate icon",
    type: "image/png",
    href: `${uiPublicURL}/favicons/favicon.png`
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "icon",
    type: "image/svg+xml",
    href: `${uiPublicURL}/favicons/favicon.svg`
  }), scriptPaths.map(path => /*#__PURE__*/_react.default.createElement("script", {
    src: basePath.prepend(path),
    key: path
  })), /*#__PURE__*/_react.default.createElement("meta", {
    name: "theme-color",
    content: "#ffffff"
  }), /*#__PURE__*/_react.default.createElement("meta", {
    name: "color-scheme",
    content: "light dark"
  })), /*#__PURE__*/_react.default.createElement("body", null, /*#__PURE__*/_react.default.createElement(_react2.I18nProvider, null, /*#__PURE__*/_react.default.createElement(_page.EuiPage, {
    paddingSize: "none",
    style: {
      minHeight: '100vh'
    },
    "data-test-subj": "promptPage"
  }, /*#__PURE__*/_react.default.createElement(_page.EuiPageBody, null, /*#__PURE__*/_react.default.createElement(_page.EuiPageContent, {
    verticalPosition: "center",
    horizontalPosition: "center"
  }, /*#__PURE__*/_react.default.createElement(_empty_prompt.EuiEmptyPrompt, {
    iconType: "alert",
    iconColor: "danger",
    title: /*#__PURE__*/_react.default.createElement("h2", null, title),
    body: body,
    actions: actions
  })))))));
}