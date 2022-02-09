"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStylesheetPaths = exports.getSettingValue = void 0;

var _uiSharedDepsNpm = _interopRequireDefault(require("@kbn/ui-shared-deps-npm"));

var _uiSharedDepsSrc = _interopRequireDefault(require("@kbn/ui-shared-deps-src"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getSettingValue = (settingName, settings, convert) => {
  var _settings$user$settin, _settings$user, _settings$user$settin2;

  const value = (_settings$user$settin = (_settings$user = settings.user) === null || _settings$user === void 0 ? void 0 : (_settings$user$settin2 = _settings$user[settingName]) === null || _settings$user$settin2 === void 0 ? void 0 : _settings$user$settin2.userValue) !== null && _settings$user$settin !== void 0 ? _settings$user$settin : settings.defaults[settingName].value;
  return convert(value);
};

exports.getSettingValue = getSettingValue;

const getStylesheetPaths = ({
  themeVersion,
  darkMode,
  basePath,
  buildNum
}) => {
  const regularBundlePath = `${basePath}/${buildNum}/bundles`;
  return [...(darkMode ? [themeVersion === 'v7' ? `${regularBundlePath}/kbn-ui-shared-deps-npm/${_uiSharedDepsNpm.default.darkCssDistFilename}` : `${regularBundlePath}/kbn-ui-shared-deps-npm/${_uiSharedDepsNpm.default.darkV8CssDistFilename}`, `${regularBundlePath}/kbn-ui-shared-deps-src/${_uiSharedDepsSrc.default.cssDistFilename}`, `${basePath}/node_modules/@kbn/ui-framework/dist/kui_dark.css`, `${basePath}/ui/legacy_dark_theme.css`] : [themeVersion === 'v7' ? `${regularBundlePath}/kbn-ui-shared-deps-npm/${_uiSharedDepsNpm.default.lightCssDistFilename}` : `${regularBundlePath}/kbn-ui-shared-deps-npm/${_uiSharedDepsNpm.default.lightV8CssDistFilename}`, `${regularBundlePath}/kbn-ui-shared-deps-src/${_uiSharedDepsSrc.default.cssDistFilename}`, `${basePath}/node_modules/@kbn/ui-framework/dist/kui_light.css`, `${basePath}/ui/legacy_light_theme.css`])];
};

exports.getStylesheetPaths = getStylesheetPaths;