"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readIndexRoute = void 0;

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _experimental_features = require("../../../../../common/experimental_features");

var _constants = require("../../../../../common/constants");

var _utils = require("../utils");

var _get_signals_template = require("./get_signals_template");

var _get_index_version = require("./get_index_version");

var _helpers = require("../../migrations/helpers");

var _check_template_version = require("./check_template_version");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const readIndexRoute = (router, config) => {
  router.get({
    path: _constants.DETECTION_ENGINE_INDEX_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      var _context$securitySolu;

      const esClient = context.core.elasticsearch.client.asCurrentUser;
      const siemClient = (_context$securitySolu = context.securitySolution) === null || _context$securitySolu === void 0 ? void 0 : _context$securitySolu.getAppClient();

      if (!siemClient) {
        return siemResponse.error({
          statusCode: 404
        });
      } // TODO: Once we are past experimental phase this code should be removed


      const {
        ruleRegistryEnabled
      } = (0, _experimental_features.parseExperimentalConfigValue)(config.enableExperimental);
      const index = siemClient.getSignalsIndex();
      const indexExists = await (0, _securitysolutionEsUtils.getBootstrapIndexExists)(context.core.elasticsearch.client.asInternalUser, index);

      if (indexExists) {
        let mappingOutdated = null;
        let aliasesOutdated = null;

        try {
          const indexVersion = await (0, _get_index_version.getIndexVersion)(esClient, index);
          mappingOutdated = (0, _helpers.isOutdated)({
            current: indexVersion,
            target: _get_signals_template.SIGNALS_TEMPLATE_VERSION
          });
          aliasesOutdated = await (0, _check_template_version.fieldAliasesOutdated)(esClient, index);
        } catch (err) {
          const error = (0, _securitysolutionEsUtils.transformError)(err); // Some users may not have the view_index_metadata permission necessary to check the index mapping version
          // so just continue and return null for index_mapping_outdated if the error is a 403

          if (error.statusCode !== 403) {
            return siemResponse.error({
              body: error.message,
              statusCode: error.statusCode
            });
          }
        }

        return response.ok({
          body: {
            name: ruleRegistryEnabled ? _constants.DEFAULT_ALERTS_INDEX : index,
            index_mapping_outdated: mappingOutdated || aliasesOutdated
          }
        });
      } else {
        if (ruleRegistryEnabled) {
          return response.ok({
            body: {
              name: _constants.DEFAULT_ALERTS_INDEX,
              index_mapping_outdated: false
            }
          });
        } else {
          return siemResponse.error({
            statusCode: 404,
            body: 'index for this space does not exist'
          });
        }
      }
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.readIndexRoute = readIndexRoute;