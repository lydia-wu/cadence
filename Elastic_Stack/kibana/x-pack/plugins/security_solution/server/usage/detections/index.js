"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isElasticRule = exports.fetchDetectionsMetrics = void 0;

var _detection_rule_helpers = require("./detection_rule_helpers");

var _detection_ml_helpers = require("./detection_ml_helpers");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isElasticRule = (tags = []) => tags.includes(`${_constants.INTERNAL_IMMUTABLE_KEY}:true`);

exports.isElasticRule = isElasticRule;

const fetchDetectionsMetrics = async (kibanaIndex, signalsIndex, esClient, soClient, mlClient) => {
  const [mlJobMetrics, detectionRuleMetrics] = await Promise.allSettled([(0, _detection_ml_helpers.getMlJobMetrics)(mlClient, soClient), (0, _detection_rule_helpers.getDetectionRuleMetrics)(kibanaIndex, signalsIndex, esClient, soClient)]);
  return {
    ml_jobs: mlJobMetrics.status === 'fulfilled' ? mlJobMetrics.value : {
      ml_job_metrics: [],
      ml_job_usage: _detection_ml_helpers.initialMlJobsUsage
    },
    detection_rules: detectionRuleMetrics.status === 'fulfilled' ? detectionRuleMetrics.value : {
      detection_rule_detail: [],
      detection_rule_usage: _detection_rule_helpers.initialDetectionRulesUsage
    }
  };
};

exports.fetchDetectionsMetrics = fetchDetectionsMetrics;