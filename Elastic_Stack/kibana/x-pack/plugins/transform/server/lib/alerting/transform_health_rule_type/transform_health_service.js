"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformHealthServiceProvider = transformHealthServiceProvider;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _constants = require("../../../../common/constants");

var _alerts = require("../../../../common/utils/alerts");

var _transform = require("../../../../common/types/transform");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function transformHealthServiceProvider(esClient, rulesClient) {
  const transformsDict = new Map();
  /**
   * Resolves result transform selection.
   * @param includeTransforms
   * @param excludeTransforms
   * @param skipIDsCheck
   */

  const getResultsTransformIds = async (includeTransforms, excludeTransforms, skipIDsCheck = false) => {
    const includeAll = includeTransforms.some(id => id === _constants.ALL_TRANSFORMS_SELECTION);
    let resultTransformIds = [];

    if (skipIDsCheck) {
      resultTransformIds = includeTransforms;
    } else {
      // Fetch transforms to make sure assigned transforms exists.
      const transformsResponse = (await esClient.transform.getTransform({ ...(includeAll ? {} : {
          transform_id: includeTransforms.join(',')
        }),
        allow_no_match: true,
        size: 1000
      })).body.transforms;
      transformsResponse.forEach(t => {
        transformsDict.set(t.id, t);

        if (t.sync) {
          resultTransformIds.push(t.id);
        }
      });
    }

    if (excludeTransforms && excludeTransforms.length > 0) {
      const excludeIdsSet = new Set(excludeTransforms);
      resultTransformIds = resultTransformIds.filter(id => !excludeIdsSet.has(id));
    }

    return resultTransformIds;
  };

  return {
    /**
     * Returns report about not started transform
     * @param transformIds
     */
    async getNotStartedTransformsReport(transformIds) {
      const transformsStats = (await esClient.transform.getTransformStats({
        transform_id: transformIds.join(',')
      })).body.transforms;
      return transformsStats.filter(t => t.state !== 'started' && t.state !== 'indexing').map(t => {
        var _transformsDict$get, _t$node;

        return {
          transform_id: t.id,
          description: (_transformsDict$get = transformsDict.get(t.id)) === null || _transformsDict$get === void 0 ? void 0 : _transformsDict$get.description,
          transform_state: t.state,
          node_name: (_t$node = t.node) === null || _t$node === void 0 ? void 0 : _t$node.name
        };
      });
    },

    /**
     * Returns results of the transform health checks
     * @param params
     */
    async getHealthChecksResults(params) {
      const transformIds = await getResultsTransformIds(params.includeTransforms, params.excludeTransforms);
      const testsConfig = (0, _alerts.getResultTestConfig)(params.testsConfig);
      const result = [];

      if (testsConfig.notStarted.enabled) {
        const response = await this.getNotStartedTransformsReport(transformIds);

        if (response.length > 0) {
          const count = response.length;
          const transformsString = response.map(t => t.transform_id).join(', ');
          result.push({
            name: _constants.TRANSFORM_HEALTH_CHECK_NAMES.notStarted.name,
            context: {
              results: response,
              message: _i18n.i18n.translate('xpack.transform.alertTypes.transformHealth.notStartedMessage', {
                defaultMessage: '{count, plural, one {Transform} other {Transforms}} {transformsString} {count, plural, one {is} other {are}} not started.',
                values: {
                  count,
                  transformsString
                }
              })
            }
          });
        }
      }

      return result;
    },

    /**
     * Updates transform list with associated alerting rules.
     */
    async populateTransformsWithAssignedRules(transforms) {
      const newList = transforms.filter(_transform.isContinuousTransform);

      if (!rulesClient) {
        throw new Error('Rules client is missing');
      }

      const transformMap = (0, _lodash.keyBy)(newList, 'id');
      const transformAlertingRules = await rulesClient.find({
        options: {
          perPage: 1000,
          filter: `alert.attributes.alertTypeId:${_constants.TRANSFORM_RULE_TYPE.TRANSFORM_HEALTH}`
        }
      });

      for (const ruleInstance of transformAlertingRules.data) {
        // Retrieve result transform IDs
        const resultTransformIds = await getResultsTransformIds(ruleInstance.params.includeTransforms.includes(_constants.ALL_TRANSFORMS_SELECTION) ? Object.keys(transformMap) : ruleInstance.params.includeTransforms, ruleInstance.params.excludeTransforms, true);
        resultTransformIds.forEach(transformId => {
          const transformRef = transformMap[transformId];

          if (transformRef) {
            if (Array.isArray(transformRef.alerting_rules)) {
              transformRef.alerting_rules.push(ruleInstance);
            } else {
              transformRef.alerting_rules = [ruleInstance];
            }
          }
        });
      }

      return newList;
    }

  };
}