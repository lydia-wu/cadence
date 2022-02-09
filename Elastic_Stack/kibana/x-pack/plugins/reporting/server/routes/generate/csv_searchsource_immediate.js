"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGenerateCsvFromSavedObjectImmediate = registerGenerateCsvFromSavedObjectImmediate;

var _configSchema = require("@kbn/config-schema");

var _stream = require("stream");

var _execute_job = require("../../export_types/csv_searchsource_immediate/execute_job");

var _authorized_user_pre_routing = require("../lib/authorized_user_pre_routing");

var _request_handler = require("../lib/request_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const API_BASE_URL_V1 = '/api/reporting/v1';
const API_BASE_GENERATE_V1 = `${API_BASE_URL_V1}/generate`;
/*
 * This function registers API Endpoints for immediate Reporting jobs. The API inputs are:
 * - saved object type and ID
 * - time range and time zone
 * - application state:
 *     - filters
 *     - query bar
 *     - local (transient) changes the user made to the saved object
 */

function registerGenerateCsvFromSavedObjectImmediate(reporting, parentLogger) {
  const setupDeps = reporting.getPluginSetupDeps();
  const {
    router
  } = setupDeps; // TODO: find a way to abstract this using ExportTypeRegistry: it needs a new
  // public method to return this array
  // const registry = reporting.getExportTypesRegistry();
  // const kibanaAccessControlTags = registry.getAllAccessControlTags();

  const useKibanaAccessControl = reporting.getDeprecatedAllowedRoles() === false; // true if deprecated config is turned off

  const kibanaAccessControlTags = useKibanaAccessControl ? ['access:downloadCsv'] : []; // This API calls run the SearchSourceImmediate export type's runTaskFn directly

  router.post({
    path: `${API_BASE_GENERATE_V1}/immediate/csv_searchsource`,
    validate: {
      body: _configSchema.schema.object({
        columns: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        searchSource: _configSchema.schema.object({}, {
          unknowns: 'allow'
        }),
        browserTimezone: _configSchema.schema.string({
          defaultValue: 'UTC'
        }),
        title: _configSchema.schema.string(),
        version: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    },
    options: {
      tags: kibanaAccessControlTags
    }
  }, (0, _authorized_user_pre_routing.authorizedUserPreRouting)(reporting, async (user, context, req, res) => {
    const logger = parentLogger.clone(['csv_searchsource_immediate']);
    const runTaskFn = (0, _execute_job.runTaskFnFactory)(reporting, logger);
    const requestHandler = new _request_handler.RequestHandler(reporting, user, context, req, res, logger);

    try {
      let buffer = Buffer.from('');
      const stream = new _stream.Writable({
        write(chunk, encoding, callback) {
          buffer = Buffer.concat([buffer, Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding)]);
          callback();
        }

      });
      const {
        content_type: jobOutputContentType
      } = await runTaskFn(null, req.body, context, stream, req);
      stream.end();
      const jobOutputContent = buffer.toString();
      const jobOutputSize = buffer.byteLength;
      logger.info(`Job output size: ${jobOutputSize} bytes.`); // convert null to undefined so the value can be sent to h.response()

      if (jobOutputContent === null) {
        logger.warn('CSV Job Execution created empty content result');
      }

      return res.ok({
        body: jobOutputContent || '',
        headers: {
          'content-type': jobOutputContentType ? jobOutputContentType : [],
          'accept-ranges': 'none'
        }
      });
    } catch (err) {
      logger.error(err);
      return requestHandler.handleError(err);
    }
  }));
}