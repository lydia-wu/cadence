"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RAC_ALERTS_BULK_UPDATE_URL = exports.FILTER_OPEN = exports.FILTER_IN_PROGRESS = exports.FILTER_CLOSED = exports.FILTER_ACKNOWLEDGED = exports.DETECTION_ENGINE_SIGNALS_STATUS_URL = exports.DEFAULT_NUMBER_FORMAT = exports.DEFAULT_MAX_TABLE_QUERY_SIZE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_MAX_TABLE_QUERY_SIZE = 10000;
exports.DEFAULT_MAX_TABLE_QUERY_SIZE = DEFAULT_MAX_TABLE_QUERY_SIZE;
const DEFAULT_NUMBER_FORMAT = 'format:number:defaultPattern';
exports.DEFAULT_NUMBER_FORMAT = DEFAULT_NUMBER_FORMAT;
const FILTER_OPEN = 'open';
exports.FILTER_OPEN = FILTER_OPEN;
const FILTER_CLOSED = 'closed';
/**
 * @deprecated
 * TODO: Remove after `acknowledged` migration
 */

exports.FILTER_CLOSED = FILTER_CLOSED;
const FILTER_IN_PROGRESS = 'in-progress';
exports.FILTER_IN_PROGRESS = FILTER_IN_PROGRESS;
const FILTER_ACKNOWLEDGED = 'acknowledged';
exports.FILTER_ACKNOWLEDGED = FILTER_ACKNOWLEDGED;
const RAC_ALERTS_BULK_UPDATE_URL = '/internal/rac/alerts/bulk_update';
exports.RAC_ALERTS_BULK_UPDATE_URL = RAC_ALERTS_BULK_UPDATE_URL;
const DETECTION_ENGINE_SIGNALS_STATUS_URL = '/api/detection_engine/signals/status';
exports.DETECTION_ENGINE_SIGNALS_STATUS_URL = DETECTION_ENGINE_SIGNALS_STATUS_URL;