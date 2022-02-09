"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  plugin: true,
  RuleDataClient: true,
  createLifecycleRuleTypeFactory: true,
  createLifecycleExecutor: true,
  createPersistenceRuleTypeWrapper: true
};
Object.defineProperty(exports, "RuleDataClient", {
  enumerable: true,
  get: function () {
    return _rule_data_client.RuleDataClient;
  }
});
Object.defineProperty(exports, "createLifecycleExecutor", {
  enumerable: true,
  get: function () {
    return _create_lifecycle_executor.createLifecycleExecutor;
  }
});
Object.defineProperty(exports, "createLifecycleRuleTypeFactory", {
  enumerable: true,
  get: function () {
    return _create_lifecycle_rule_type_factory.createLifecycleRuleTypeFactory;
  }
});
Object.defineProperty(exports, "createPersistenceRuleTypeWrapper", {
  enumerable: true,
  get: function () {
    return _create_persistence_rule_type_wrapper.createPersistenceRuleTypeWrapper;
  }
});
exports.plugin = void 0;

var _plugin = require("./plugin");

var _rule_data_client = require("./rule_data_client");

Object.keys(_rule_data_client).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _rule_data_client[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rule_data_client[key];
    }
  });
});

var _config = require("./config");

Object.keys(_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _config[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _config[key];
    }
  });
});

var _rule_data_plugin_service = require("./rule_data_plugin_service");

Object.keys(_rule_data_plugin_service).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _rule_data_plugin_service[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rule_data_plugin_service[key];
    }
  });
});

var _audit_events = require("./alert_data_client/audit_events");

Object.keys(_audit_events).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _audit_events[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _audit_events[key];
    }
  });
});

var _create_lifecycle_rule_type_factory = require("./utils/create_lifecycle_rule_type_factory");

var _create_lifecycle_executor = require("./utils/create_lifecycle_executor");

var _create_persistence_rule_type_wrapper = require("./utils/create_persistence_rule_type_wrapper");

var _persistence_types = require("./utils/persistence_types");

Object.keys(_persistence_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _persistence_types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _persistence_types[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO: https://github.com/elastic/kibana/issues/110907

/* eslint-disable @kbn/eslint/no_export_all */

const plugin = initContext => new _plugin.RuleRegistryPlugin(initContext);

exports.plugin = plugin;