"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleStatusSavedObjectsClientFactory = void 0;

var _lodash = require("lodash");

var _legacy_rule_status_saved_object_mappings = require("../../rules/legacy_rule_status/legacy_rule_status_saved_object_mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line no-restricted-imports

/**
 * @deprecated Use RuleExecutionLogClient instead
 */


const ruleStatusSavedObjectsClientFactory = savedObjectsClient => ({
  find: async options => {
    const references = {
      id: options.ruleId,
      type: 'alert'
    };
    const result = await savedObjectsClient.find({ ...options,
      type: _legacy_rule_status_saved_object_mappings.legacyRuleStatusSavedObjectType,
      hasReference: references
    });
    return result.saved_objects;
  },
  findBulk: async (ids, statusesPerId) => {
    if (ids.length === 0) {
      return {};
    }

    const references = ids.map(alertId => ({
      id: alertId,
      type: 'alert'
    }));
    const order = 'desc'; // NOTE: Once https://github.com/elastic/kibana/issues/115153 is resolved
    // ${legacyRuleStatusSavedObjectType}.statusDate will need to be updated to
    // ${legacyRuleStatusSavedObjectType}.attributes.statusDate

    const aggs = {
      references: {
        nested: {
          path: `${_legacy_rule_status_saved_object_mappings.legacyRuleStatusSavedObjectType}.references`
        },
        aggs: {
          alertIds: {
            terms: {
              field: `${_legacy_rule_status_saved_object_mappings.legacyRuleStatusSavedObjectType}.references.id`,
              size: ids.length
            },
            aggs: {
              rule_status: {
                reverse_nested: {},
                aggs: {
                  most_recent_statuses: {
                    top_hits: {
                      sort: [{
                        [`${_legacy_rule_status_saved_object_mappings.legacyRuleStatusSavedObjectType}.statusDate`]: {
                          order
                        }
                      }],
                      size: statusesPerId
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    const results = await savedObjectsClient.find({
      hasReference: references,
      aggs,
      type: _legacy_rule_status_saved_object_mappings.legacyRuleStatusSavedObjectType,
      perPage: 0
    });
    const buckets = (0, _lodash.get)(results, 'aggregations.references.alertIds.buckets');
    return buckets.reduce((acc, bucket) => {
      const key = (0, _lodash.get)(bucket, 'key');
      const hits = (0, _lodash.get)(bucket, 'rule_status.most_recent_statuses.hits.hits'); // eslint-disable-next-line @typescript-eslint/no-explicit-any

      acc[key] = hits.map(hit => hit._source[_legacy_rule_status_saved_object_mappings.legacyRuleStatusSavedObjectType]);
      return acc;
    }, {});
  },
  create: (attributes, options) => {
    return savedObjectsClient.create(_legacy_rule_status_saved_object_mappings.legacyRuleStatusSavedObjectType, attributes, options);
  },
  update: (id, attributes, options) => savedObjectsClient.update(_legacy_rule_status_saved_object_mappings.legacyRuleStatusSavedObjectType, id, attributes, options),
  delete: id => savedObjectsClient.delete(_legacy_rule_status_saved_object_mappings.legacyRuleStatusSavedObjectType, id)
});

exports.ruleStatusSavedObjectsClientFactory = ruleStatusSavedObjectsClientFactory;