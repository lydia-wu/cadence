"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerReindexIndicesRoutes = registerReindexIndicesRoutes;

var _configSchema = require("@kbn/config-schema");

var _errors = require("@elastic/elasticsearch/lib/errors");

var _constants = require("../../../common/constants");

var _es_version_precheck = require("../../lib/es_version_precheck");

var _reindexing = require("../../lib/reindexing");

var _reindex_actions = require("../../lib/reindexing/reindex_actions");

var _map_any_error_to_kibana_http_response = require("./map_any_error_to_kibana_http_response");

var _reindex_handler = require("./reindex_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerReindexIndicesRoutes({
  credentialStore,
  router,
  licensing,
  log,
  getSecurityPlugin,
  lib: {
    handleEsError
  }
}, getWorker) {
  const BASE_PATH = `${_constants.API_BASE_PATH}/reindex`; // Start reindex for an index

  router.post({
    path: `${BASE_PATH}/{indexName}`,
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core: {
      savedObjects: {
        client: savedObjectsClient
      },
      elasticsearch: {
        client: esClient
      }
    }
  }, request, response) => {
    const {
      indexName
    } = request.params;

    try {
      const result = await (0, _reindex_handler.reindexHandler)({
        savedObjects: savedObjectsClient,
        dataClient: esClient,
        indexName,
        log,
        licensing,
        request,
        credentialStore,
        security: getSecurityPlugin()
      }); // Kick the worker on this node to immediately pickup the new reindex operation.

      getWorker().forceRefresh();
      return response.ok({
        body: result
      });
    } catch (error) {
      if (error instanceof _errors.ResponseError) {
        return handleEsError({
          error,
          response
        });
      }

      return (0, _map_any_error_to_kibana_http_response.mapAnyErrorToKibanaHttpResponse)(error);
    }
  })); // Get status

  router.get({
    path: `${BASE_PATH}/{indexName}`,
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core: {
      savedObjects,
      elasticsearch: {
        client: esClient
      }
    }
  }, request, response) => {
    const {
      client
    } = savedObjects;
    const {
      indexName
    } = request.params;
    const asCurrentUser = esClient.asCurrentUser;
    const reindexActions = (0, _reindex_actions.reindexActionsFactory)(client, asCurrentUser);
    const reindexService = (0, _reindexing.reindexServiceFactory)(asCurrentUser, reindexActions, log, licensing);

    try {
      const hasRequiredPrivileges = await reindexService.hasRequiredPrivileges(indexName);
      const reindexOp = await reindexService.findReindexOperation(indexName); // If the user doesn't have privileges than querying for warnings is going to fail.

      const warnings = hasRequiredPrivileges ? await reindexService.detectReindexWarnings(indexName) : [];
      return response.ok({
        body: {
          reindexOp: reindexOp ? reindexOp.attributes : null,
          warnings,
          hasRequiredPrivileges
        }
      });
    } catch (error) {
      if (error instanceof _errors.ResponseError) {
        return handleEsError({
          error,
          response
        });
      }

      return (0, _map_any_error_to_kibana_http_response.mapAnyErrorToKibanaHttpResponse)(error);
    }
  })); // Cancel reindex

  router.post({
    path: `${BASE_PATH}/{indexName}/cancel`,
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core: {
      savedObjects,
      elasticsearch: {
        client: esClient
      }
    }
  }, request, response) => {
    const {
      indexName
    } = request.params;
    const {
      client
    } = savedObjects;
    const callAsCurrentUser = esClient.asCurrentUser;
    const reindexActions = (0, _reindex_actions.reindexActionsFactory)(client, callAsCurrentUser);
    const reindexService = (0, _reindexing.reindexServiceFactory)(callAsCurrentUser, reindexActions, log, licensing);

    try {
      await reindexService.cancelReindexing(indexName);
      return response.ok({
        body: {
          acknowledged: true
        }
      });
    } catch (error) {
      if (error instanceof _errors.ResponseError) {
        return handleEsError({
          error,
          response
        });
      }

      return (0, _map_any_error_to_kibana_http_response.mapAnyErrorToKibanaHttpResponse)(error);
    }
  }));
}