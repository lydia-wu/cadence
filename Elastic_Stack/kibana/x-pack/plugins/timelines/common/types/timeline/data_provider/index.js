"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IS_OPERATOR = exports.EXISTS_OPERATOR = exports.DataProviderType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/** Represents the Timeline data providers */

/** The `is` operator in a KQL query */

const IS_OPERATOR = ':';
/** The `exists` operator in a KQL query */

exports.IS_OPERATOR = IS_OPERATOR;
const EXISTS_OPERATOR = ':*';
/** The operator applied to a field */

exports.EXISTS_OPERATOR = EXISTS_OPERATOR;
let DataProviderType;
exports.DataProviderType = DataProviderType;

(function (DataProviderType) {
  DataProviderType["default"] = "default";
  DataProviderType["template"] = "template";
})(DataProviderType || (exports.DataProviderType = DataProviderType = {}));