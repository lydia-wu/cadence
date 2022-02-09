"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExecuteConnectorUrl = exports.getCreateConnectorUrl = exports.getAllConnectorsUrl = exports.getAllConnectorTypesUrl = void 0;

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Actions and connectors API endpoint helpers
 */

/**
 *
 * @returns {string} Connector types endpoint
 */


const getAllConnectorTypesUrl = () => _common.ACTION_TYPES_URL;
/**
 *
 * @param connectorId
 * @returns {string} Execute connector endpoint
 */


exports.getAllConnectorTypesUrl = getAllConnectorTypesUrl;

const getExecuteConnectorUrl = connectorId => `${_common.ACTION_URL}/connector/${connectorId}/_execute`;
/**
 *
 * @returns {string} Create connector endpoint
 */


exports.getExecuteConnectorUrl = getExecuteConnectorUrl;

const getCreateConnectorUrl = () => `${_common.ACTION_URL}/connector`;
/**
 *
 * @returns {string} All connectors endpoint
 */


exports.getCreateConnectorUrl = getCreateConnectorUrl;

const getAllConnectorsUrl = () => _common.CONNECTORS_URL;

exports.getAllConnectorsUrl = getAllConnectorsUrl;