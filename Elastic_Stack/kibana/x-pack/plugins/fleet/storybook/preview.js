"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parameters = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _addonDocs = require("@storybook/addon-docs");

var _decorator = require("./decorator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


(0, _react2.addDecorator)(_decorator.decorator);
const parameters = {
  docs: {
    page: () => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_addonDocs.Title, null), /*#__PURE__*/_react.default.createElement(_addonDocs.Subtitle, null), /*#__PURE__*/_react.default.createElement(_addonDocs.Description, null), /*#__PURE__*/_react.default.createElement(_addonDocs.Primary, null), /*#__PURE__*/_react.default.createElement(_addonDocs.Stories, null))
  }
};
exports.parameters = parameters;