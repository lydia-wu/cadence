"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  separator: true,
  registerConnectors: true,
  isCommentGeneratedAlert: true,
  isCommentAlert: true,
  createAlertsString: true,
  transformConnectorComment: true,
  casesConnectors: true
};
Object.defineProperty(exports, "casesConnectors", {
  enumerable: true,
  get: function () {
    return _factory.casesConnectors;
  }
});
exports.createAlertsString = createAlertsString;
exports.separator = exports.registerConnectors = exports.isCommentGeneratedAlert = exports.isCommentAlert = void 0;
Object.defineProperty(exports, "transformConnectorComment", {
  enumerable: true,
  get: function () {
    return _case.transformConnectorComment;
  }
});

var _case = require("./case");

var _common = require("../../common");

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _factory = require("./factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Separator used for creating a json parsable array from the mustache syntax that the alerting framework
 * sends.
 */


const separator = '__SEPARATOR__';
exports.separator = separator;

const registerConnectors = ({
  registerActionType,
  logger,
  factory
}) => {
  registerActionType((0, _case.getActionType)({
    logger,
    factory
  }));
};

exports.registerConnectors = registerConnectors;

const isCommentGeneratedAlert = comment => {
  return comment.type === _common.CommentType.generatedAlert && 'alerts' in comment && comment.alerts !== undefined;
};

exports.isCommentGeneratedAlert = isCommentGeneratedAlert;

const isCommentAlert = comment => {
  return comment.type === _common.CommentType.alert;
};

exports.isCommentAlert = isCommentAlert;
/**
 * Creates the format that the connector's parser is expecting, it should result in something like this:
 * [{"_id":"1","_index":"index1"}__SEPARATOR__{"_id":"id2","_index":"index2"}__SEPARATOR__]
 *
 * This should only be used for testing purposes.
 */

function createAlertsString(alerts) {
  return `[${alerts.reduce((acc, alert) => {
    return `${acc}${JSON.stringify(alert)}${separator}`;
  }, '')}]`;
}