"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layout = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class Layout {
  constructor(id) {
    (0, _defineProperty2.default)(this, "id", '');
    (0, _defineProperty2.default)(this, "groupCount", 0);
    (0, _defineProperty2.default)(this, "hasHeader", true);
    (0, _defineProperty2.default)(this, "hasFooter", true);
    (0, _defineProperty2.default)(this, "useReportingBranding", true);
    this.id = id;
  }

}

exports.Layout = Layout;