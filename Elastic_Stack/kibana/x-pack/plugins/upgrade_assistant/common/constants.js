"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexSettingDeprecations = exports.UPGRADE_ASSISTANT_TELEMETRY = exports.SYSTEM_INDICES_MIGRATION_POLL_INTERVAL_MS = exports.MAJOR_VERSION = exports.DEPRECATION_WARNING_UPPER_LIMIT = exports.DEPRECATION_LOGS_SOURCE_ID = exports.DEPRECATION_LOGS_INDEX_PATTERN = exports.DEPRECATION_LOGS_INDEX = exports.DEPRECATION_LOGS_COUNT_POLL_INTERVAL_MS = exports.CLUSTER_UPGRADE_STATUS_POLL_INTERVAL_MS = exports.CLOUD_SNAPSHOT_REPOSITORY = exports.CLOUD_BACKUP_STATUS_POLL_INTERVAL_MS = exports.API_BASE_PATH = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * On master, the version should represent the next major version (e.g., master --> 8.0.0)
 * The release branch should match the release version (e.g., 7.x --> 7.0.0)
 */

const MAJOR_VERSION = '7.16.0';
/*
 * Map of 7.0 --> 8.0 index setting deprecation log messages and associated settings
 * We currently only support one setting deprecation (translog retention), but the code is written
 * in a way to be able to support any number of deprecated index settings defined here
 */

exports.MAJOR_VERSION = MAJOR_VERSION;
const indexSettingDeprecations = {
  translog: {
    deprecationMessage: 'translog retention settings are ignored',
    // expected message from ES deprecation info API
    settings: ['translog.retention.size', 'translog.retention.age']
  }
};
exports.indexSettingDeprecations = indexSettingDeprecations;
const API_BASE_PATH = '/api/upgrade_assistant'; // Telemetry constants

exports.API_BASE_PATH = API_BASE_PATH;
const UPGRADE_ASSISTANT_TELEMETRY = 'upgrade-assistant-telemetry';
/**
 * This is the repository where Cloud stores its backup snapshots.
 */

exports.UPGRADE_ASSISTANT_TELEMETRY = UPGRADE_ASSISTANT_TELEMETRY;
const CLOUD_SNAPSHOT_REPOSITORY = 'found-snapshots';
exports.CLOUD_SNAPSHOT_REPOSITORY = CLOUD_SNAPSHOT_REPOSITORY;
const DEPRECATION_WARNING_UPPER_LIMIT = 999999;
exports.DEPRECATION_WARNING_UPPER_LIMIT = DEPRECATION_WARNING_UPPER_LIMIT;
const DEPRECATION_LOGS_SOURCE_ID = 'deprecation_logs';
exports.DEPRECATION_LOGS_SOURCE_ID = DEPRECATION_LOGS_SOURCE_ID;
const DEPRECATION_LOGS_INDEX = '.logs-deprecation.elasticsearch-default';
exports.DEPRECATION_LOGS_INDEX = DEPRECATION_LOGS_INDEX;
const DEPRECATION_LOGS_INDEX_PATTERN = '.logs-deprecation.elasticsearch-default';
exports.DEPRECATION_LOGS_INDEX_PATTERN = DEPRECATION_LOGS_INDEX_PATTERN;
const CLUSTER_UPGRADE_STATUS_POLL_INTERVAL_MS = 45000;
exports.CLUSTER_UPGRADE_STATUS_POLL_INTERVAL_MS = CLUSTER_UPGRADE_STATUS_POLL_INTERVAL_MS;
const CLOUD_BACKUP_STATUS_POLL_INTERVAL_MS = 60000;
exports.CLOUD_BACKUP_STATUS_POLL_INTERVAL_MS = CLOUD_BACKUP_STATUS_POLL_INTERVAL_MS;
const DEPRECATION_LOGS_COUNT_POLL_INTERVAL_MS = 15000;
exports.DEPRECATION_LOGS_COUNT_POLL_INTERVAL_MS = DEPRECATION_LOGS_COUNT_POLL_INTERVAL_MS;
const SYSTEM_INDICES_MIGRATION_POLL_INTERVAL_MS = 15000;
exports.SYSTEM_INDICES_MIGRATION_POLL_INTERVAL_MS = SYSTEM_INDICES_MIGRATION_POLL_INTERVAL_MS;