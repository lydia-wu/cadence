"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpgradeStatusRoute = registerUpgradeStatusRoute;

var _i18n = require("@kbn/i18n");

var _constants = require("../../common/constants");

var _es_deprecations_status = require("../lib/es_deprecations_status");

var _es_version_precheck = require("../lib/es_version_precheck");

var _kibana_status = require("../lib/kibana_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Note that this route is primarily intended for consumption by Cloud.
 */


function registerUpgradeStatusRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: `${_constants.API_BASE_PATH}/status`,
    validate: false
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core: {
      elasticsearch: {
        client: esClient
      },
      deprecations: {
        client: deprecationsClient
      }
    }
  }, request, response) => {
    try {
      // Fetch ES upgrade status
      const {
        totalCriticalDeprecations: esTotalCriticalDeps
      } = await (0, _es_deprecations_status.getESUpgradeStatus)(esClient); // Fetch Kibana upgrade status

      const {
        totalCriticalDeprecations: kibanaTotalCriticalDeps
      } = await (0, _kibana_status.getKibanaUpgradeStatus)(deprecationsClient);
      const readyForUpgrade = esTotalCriticalDeps === 0 && kibanaTotalCriticalDeps === 0;

      const getStatusMessage = () => {
        if (readyForUpgrade) {
          return _i18n.i18n.translate('xpack.upgradeAssistant.status.allDeprecationsResolvedMessage', {
            defaultMessage: 'All deprecation warnings have been resolved.'
          });
        }

        return _i18n.i18n.translate('xpack.upgradeAssistant.status.deprecationsUnresolvedMessage', {
          defaultMessage: 'You have {esTotalCriticalDeps} Elasticsearch deprecation {esTotalCriticalDeps, plural, one {issue} other {issues}} and {kibanaTotalCriticalDeps} Kibana deprecation {kibanaTotalCriticalDeps, plural, one {issue} other {issues}} that must be resolved before upgrading.',
          values: {
            esTotalCriticalDeps,
            kibanaTotalCriticalDeps
          }
        });
      };

      return response.ok({
        body: {
          readyForUpgrade,
          details: getStatusMessage()
        }
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}