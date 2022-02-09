"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telemetryIndexPattern = exports.policyIndexPattern = exports.metadataTransformPrefix = exports.metadataIndexPattern = exports.metadataCurrentIndexPattern = exports.failedFleetActionErrorCode = exports.eventsIndexPattern = exports.alertsIndexPattern = exports.UNISOLATE_HOST_ROUTE = exports.TRUSTED_APPS_UPDATE_API = exports.TRUSTED_APPS_SUMMARY_API = exports.TRUSTED_APPS_LIST_API = exports.TRUSTED_APPS_GET_API = exports.TRUSTED_APPS_DELETE_API = exports.TRUSTED_APPS_CREATE_API = exports.METADATA_UNITED_TRANSFORM = exports.METADATA_UNITED_INDEX = exports.METADATA_TRANSFORMS_PATTERN = exports.LIMITED_CONCURRENCY_ENDPOINT_ROUTE_TAG = exports.LIMITED_CONCURRENCY_ENDPOINT_COUNT = exports.ISOLATE_HOST_ROUTE = exports.HOST_METADATA_LIST_ROUTE = exports.HOST_METADATA_GET_ROUTE = exports.ENDPOINT_ACTION_RESPONSES_INDEX = exports.ENDPOINT_ACTION_RESPONSES_DS = exports.ENDPOINT_ACTION_LOG_ROUTE = exports.ENDPOINT_ACTIONS_INDEX = exports.ENDPOINT_ACTIONS_DS = exports.BASE_POLICY_ROUTE = exports.BASE_POLICY_RESPONSE_ROUTE = exports.BASE_ENDPOINT_ROUTE = exports.AGENT_POLICY_SUMMARY_ROUTE = exports.ACTION_STATUS_ROUTE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/** endpoint data streams that are used for host isolation  */

/** for index patterns `.logs-endpoint.actions-* and .logs-endpoint.action.responses-*`*/

const ENDPOINT_ACTIONS_DS = '.logs-endpoint.actions';
exports.ENDPOINT_ACTIONS_DS = ENDPOINT_ACTIONS_DS;
const ENDPOINT_ACTIONS_INDEX = `${ENDPOINT_ACTIONS_DS}-default`;
exports.ENDPOINT_ACTIONS_INDEX = ENDPOINT_ACTIONS_INDEX;
const ENDPOINT_ACTION_RESPONSES_DS = '.logs-endpoint.action.responses';
exports.ENDPOINT_ACTION_RESPONSES_DS = ENDPOINT_ACTION_RESPONSES_DS;
const ENDPOINT_ACTION_RESPONSES_INDEX = `${ENDPOINT_ACTION_RESPONSES_DS}-default`;
exports.ENDPOINT_ACTION_RESPONSES_INDEX = ENDPOINT_ACTION_RESPONSES_INDEX;
const eventsIndexPattern = 'logs-endpoint.events.*';
exports.eventsIndexPattern = eventsIndexPattern;
const alertsIndexPattern = 'logs-endpoint.alerts-*';
/** index pattern for the data source index (data stream) that the Endpoint streams documents to */

exports.alertsIndexPattern = alertsIndexPattern;
const metadataIndexPattern = 'metrics-endpoint.metadata-*';
/** index that the metadata transform writes to (destination) and that is used by endpoint APIs */

exports.metadataIndexPattern = metadataIndexPattern;
const metadataCurrentIndexPattern = 'metrics-endpoint.metadata_current_*';
/** The metadata Transform Name prefix with NO (package) version) */

exports.metadataCurrentIndexPattern = metadataCurrentIndexPattern;
const metadataTransformPrefix = 'endpoint.metadata_current-default'; // metadata transforms pattern for matching all metadata transform ids

exports.metadataTransformPrefix = metadataTransformPrefix;
const METADATA_TRANSFORMS_PATTERN = 'endpoint.metadata_*'; // united metadata transform id

exports.METADATA_TRANSFORMS_PATTERN = METADATA_TRANSFORMS_PATTERN;
const METADATA_UNITED_TRANSFORM = 'endpoint.metadata_united-default'; // united metadata transform destination index

exports.METADATA_UNITED_TRANSFORM = METADATA_UNITED_TRANSFORM;
const METADATA_UNITED_INDEX = '.metrics-endpoint.metadata_united_default';
exports.METADATA_UNITED_INDEX = METADATA_UNITED_INDEX;
const policyIndexPattern = 'metrics-endpoint.policy-*';
exports.policyIndexPattern = policyIndexPattern;
const telemetryIndexPattern = 'metrics-endpoint.telemetry-*';
exports.telemetryIndexPattern = telemetryIndexPattern;
const LIMITED_CONCURRENCY_ENDPOINT_ROUTE_TAG = 'endpoint:limited-concurrency';
exports.LIMITED_CONCURRENCY_ENDPOINT_ROUTE_TAG = LIMITED_CONCURRENCY_ENDPOINT_ROUTE_TAG;
const LIMITED_CONCURRENCY_ENDPOINT_COUNT = 100;
exports.LIMITED_CONCURRENCY_ENDPOINT_COUNT = LIMITED_CONCURRENCY_ENDPOINT_COUNT;
const BASE_ENDPOINT_ROUTE = '/api/endpoint';
exports.BASE_ENDPOINT_ROUTE = BASE_ENDPOINT_ROUTE;
const HOST_METADATA_LIST_ROUTE = `${BASE_ENDPOINT_ROUTE}/metadata`;
exports.HOST_METADATA_LIST_ROUTE = HOST_METADATA_LIST_ROUTE;
const HOST_METADATA_GET_ROUTE = `${BASE_ENDPOINT_ROUTE}/metadata/{id}`;
exports.HOST_METADATA_GET_ROUTE = HOST_METADATA_GET_ROUTE;
const TRUSTED_APPS_GET_API = `${BASE_ENDPOINT_ROUTE}/trusted_apps/{id}`;
exports.TRUSTED_APPS_GET_API = TRUSTED_APPS_GET_API;
const TRUSTED_APPS_LIST_API = `${BASE_ENDPOINT_ROUTE}/trusted_apps`;
exports.TRUSTED_APPS_LIST_API = TRUSTED_APPS_LIST_API;
const TRUSTED_APPS_CREATE_API = `${BASE_ENDPOINT_ROUTE}/trusted_apps`;
exports.TRUSTED_APPS_CREATE_API = TRUSTED_APPS_CREATE_API;
const TRUSTED_APPS_UPDATE_API = `${BASE_ENDPOINT_ROUTE}/trusted_apps/{id}`;
exports.TRUSTED_APPS_UPDATE_API = TRUSTED_APPS_UPDATE_API;
const TRUSTED_APPS_DELETE_API = `${BASE_ENDPOINT_ROUTE}/trusted_apps/{id}`;
exports.TRUSTED_APPS_DELETE_API = TRUSTED_APPS_DELETE_API;
const TRUSTED_APPS_SUMMARY_API = `${BASE_ENDPOINT_ROUTE}/trusted_apps/summary`;
exports.TRUSTED_APPS_SUMMARY_API = TRUSTED_APPS_SUMMARY_API;
const BASE_POLICY_RESPONSE_ROUTE = `${BASE_ENDPOINT_ROUTE}/policy_response`;
exports.BASE_POLICY_RESPONSE_ROUTE = BASE_POLICY_RESPONSE_ROUTE;
const BASE_POLICY_ROUTE = `${BASE_ENDPOINT_ROUTE}/policy`;
exports.BASE_POLICY_ROUTE = BASE_POLICY_ROUTE;
const AGENT_POLICY_SUMMARY_ROUTE = `${BASE_POLICY_ROUTE}/summaries`;
/** Host Isolation Routes */

exports.AGENT_POLICY_SUMMARY_ROUTE = AGENT_POLICY_SUMMARY_ROUTE;
const ISOLATE_HOST_ROUTE = `${BASE_ENDPOINT_ROUTE}/isolate`;
exports.ISOLATE_HOST_ROUTE = ISOLATE_HOST_ROUTE;
const UNISOLATE_HOST_ROUTE = `${BASE_ENDPOINT_ROUTE}/unisolate`;
/** Endpoint Actions Log Routes */

exports.UNISOLATE_HOST_ROUTE = UNISOLATE_HOST_ROUTE;
const ENDPOINT_ACTION_LOG_ROUTE = `/api/endpoint/action_log/{agent_id}`;
exports.ENDPOINT_ACTION_LOG_ROUTE = ENDPOINT_ACTION_LOG_ROUTE;
const ACTION_STATUS_ROUTE = `/api/endpoint/action_status`;
exports.ACTION_STATUS_ROUTE = ACTION_STATUS_ROUTE;
const failedFleetActionErrorCode = '424';
exports.failedFleetActionErrorCode = failedFleetActionErrorCode;