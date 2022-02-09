"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telemetrySavedObjectType = void 0;

var _constants = require("../../common/constants");

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const telemetrySavedObjectType = {
  name: _constants.UPGRADE_ASSISTANT_TELEMETRY,
  hidden: false,
  namespaceType: 'agnostic',
  mappings: {
    properties: {
      features: {
        properties: {
          deprecation_logging: {
            properties: {
              enabled: {
                type: 'boolean',
                null_value: true
              }
            }
          }
        }
      }
    }
  },
  migrations: _migrations.telemetrySavedObjectMigrations
};
exports.telemetrySavedObjectType = telemetrySavedObjectType;