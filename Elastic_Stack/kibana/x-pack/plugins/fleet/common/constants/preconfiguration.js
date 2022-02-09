"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UUID_V5_NAMESPACE = exports.PRECONFIGURATION_LATEST_KEYWORD = exports.PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE = exports.DEFAULT_SYSTEM_PACKAGE_POLICY_ID = exports.DEFAULT_PACKAGES = exports.DEFAULT_FLEET_SERVER_POLICY_ID = exports.DEFAULT_FLEET_SERVER_AGENT_POLICY_ID_SEED = exports.DEFAULT_FLEET_SERVER_AGENT_POLICY = exports.DEFAULT_AGENT_POLICY_ID_SEED = exports.DEFAULT_AGENT_POLICY = exports.AUTO_UPDATE_PACKAGES = void 0;

var _v = _interopRequireDefault(require("uuid/v5"));

var _epm = require("./epm");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// UUID v5 values require a namespace. We use UUID v5 for some of our preconfigured ID values.


const UUID_V5_NAMESPACE = 'dde7c2de-1370-4c19-9975-b473d0e03508';
exports.UUID_V5_NAMESPACE = UUID_V5_NAMESPACE;
const PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE = 'fleet-preconfiguration-deletion-record';
exports.PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE = PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE;
const PRECONFIGURATION_LATEST_KEYWORD = 'latest';
exports.PRECONFIGURATION_LATEST_KEYWORD = PRECONFIGURATION_LATEST_KEYWORD;
const DEFAULT_AGENT_POLICY_ID_SEED = 'default-agent-policy';
exports.DEFAULT_AGENT_POLICY_ID_SEED = DEFAULT_AGENT_POLICY_ID_SEED;
const DEFAULT_SYSTEM_PACKAGE_POLICY_ID = 'default-system-policy';
exports.DEFAULT_SYSTEM_PACKAGE_POLICY_ID = DEFAULT_SYSTEM_PACKAGE_POLICY_ID;
const DEFAULT_AGENT_POLICY = {
  id: (0, _v.default)(DEFAULT_AGENT_POLICY_ID_SEED, UUID_V5_NAMESPACE),
  name: 'Default policy',
  namespace: 'default',
  description: 'Default agent policy created by Kibana',
  package_policies: [{
    id: DEFAULT_SYSTEM_PACKAGE_POLICY_ID,
    name: `${_epm.FLEET_SYSTEM_PACKAGE}-1`,
    package: {
      name: _epm.FLEET_SYSTEM_PACKAGE
    }
  }],
  is_default: true,
  is_managed: false,
  monitoring_enabled: _epm.monitoringTypes
};
exports.DEFAULT_AGENT_POLICY = DEFAULT_AGENT_POLICY;
const DEFAULT_FLEET_SERVER_POLICY_ID = 'default-fleet-server-agent-policy';
exports.DEFAULT_FLEET_SERVER_POLICY_ID = DEFAULT_FLEET_SERVER_POLICY_ID;
const DEFAULT_FLEET_SERVER_AGENT_POLICY_ID_SEED = 'default-fleet-server';
exports.DEFAULT_FLEET_SERVER_AGENT_POLICY_ID_SEED = DEFAULT_FLEET_SERVER_AGENT_POLICY_ID_SEED;
const DEFAULT_FLEET_SERVER_AGENT_POLICY = {
  id: (0, _v.default)(DEFAULT_FLEET_SERVER_AGENT_POLICY_ID_SEED, UUID_V5_NAMESPACE),
  name: 'Default Fleet Server policy',
  namespace: 'default',
  description: 'Default Fleet Server agent policy created by Kibana',
  package_policies: [{
    id: DEFAULT_FLEET_SERVER_POLICY_ID,
    name: `${_epm.FLEET_SERVER_PACKAGE}-1`,
    package: {
      name: _epm.FLEET_SERVER_PACKAGE
    }
  }],
  is_default: false,
  is_default_fleet_server: true,
  is_managed: false,
  monitoring_enabled: _epm.monitoringTypes
};
exports.DEFAULT_FLEET_SERVER_AGENT_POLICY = DEFAULT_FLEET_SERVER_AGENT_POLICY;

const DEFAULT_PACKAGES = _epm.defaultPackages.map(name => ({
  name,
  version: PRECONFIGURATION_LATEST_KEYWORD
}));

exports.DEFAULT_PACKAGES = DEFAULT_PACKAGES;

const AUTO_UPDATE_PACKAGES = _epm.autoUpdatePackages.map(name => ({
  name,
  version: PRECONFIGURATION_LATEST_KEYWORD
}));

exports.AUTO_UPDATE_PACKAGES = AUTO_UPDATE_PACKAGES;