"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMlJobsUsage = exports.initialMlJobsUsage = exports.getMlJobMetrics = void 0;

var _helpers = require("../../../common/machine_learning/helpers");

var _is_security_job = require("../../../common/machine_learning/is_security_job");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Default ml job usage count
 */


const initialMlJobsUsage = {
  custom: {
    enabled: 0,
    disabled: 0
  },
  elastic: {
    enabled: 0,
    disabled: 0
  }
};
exports.initialMlJobsUsage = initialMlJobsUsage;

const updateMlJobsUsage = (jobMetric, usage) => {
  const {
    isEnabled,
    isElastic
  } = jobMetric;

  if (isEnabled && isElastic) {
    return { ...usage,
      elastic: { ...usage.elastic,
        enabled: usage.elastic.enabled + 1
      }
    };
  } else if (!isEnabled && isElastic) {
    return { ...usage,
      elastic: { ...usage.elastic,
        disabled: usage.elastic.disabled + 1
      }
    };
  } else if (isEnabled && !isElastic) {
    return { ...usage,
      custom: { ...usage.custom,
        enabled: usage.custom.enabled + 1
      }
    };
  } else if (!isEnabled && !isElastic) {
    return { ...usage,
      custom: { ...usage.custom,
        disabled: usage.custom.disabled + 1
      }
    };
  } else {
    return usage;
  }
};

exports.updateMlJobsUsage = updateMlJobsUsage;

const getMlJobMetrics = async (ml, savedObjectClient) => {
  let jobsUsage = initialMlJobsUsage;

  if (ml) {
    try {
      const fakeRequest = {
        headers: {}
      };
      const modules = await ml.modulesProvider(fakeRequest, savedObjectClient).listModules();
      const moduleJobs = modules.flatMap(module => module.jobs);
      const jobs = await ml.jobServiceProvider(fakeRequest, savedObjectClient).jobsSummary();
      jobsUsage = jobs.filter(_is_security_job.isSecurityJob).reduce((usage, job) => {
        const isElastic = moduleJobs.some(moduleJob => moduleJob.id === job.id);
        const isEnabled = (0, _helpers.isJobStarted)(job.jobState, job.datafeedState);
        return updateMlJobsUsage({
          isElastic,
          isEnabled
        }, usage);
      }, initialMlJobsUsage);
      const jobsType = 'security';
      const securityJobStats = await ml.anomalyDetectorsProvider(fakeRequest, savedObjectClient).jobStats(jobsType);
      const jobDetails = await ml.anomalyDetectorsProvider(fakeRequest, savedObjectClient).jobs(jobsType);
      const jobDetailsCache = new Map();
      jobDetails.jobs.forEach(detail => jobDetailsCache.set(detail.job_id, detail));
      const datafeedStats = await ml.anomalyDetectorsProvider(fakeRequest, savedObjectClient).datafeedStats();
      const datafeedStatsCache = new Map();
      datafeedStats.datafeeds.forEach(datafeedStat => datafeedStatsCache.set(`${datafeedStat.datafeed_id}`, datafeedStat));
      const jobMetrics = securityJobStats.jobs.map(stat => {
        const jobId = stat.job_id;
        const jobDetail = jobDetailsCache.get(stat.job_id);
        const datafeed = datafeedStatsCache.get(`datafeed-${jobId}`);
        return {
          job_id: jobId,
          open_time: stat.open_time,
          create_time: jobDetail === null || jobDetail === void 0 ? void 0 : jobDetail.create_time,
          finished_time: jobDetail === null || jobDetail === void 0 ? void 0 : jobDetail.finished_time,
          state: stat.state,
          data_counts: {
            bucket_count: stat.data_counts.bucket_count,
            empty_bucket_count: stat.data_counts.empty_bucket_count,
            input_bytes: stat.data_counts.input_bytes,
            input_record_count: stat.data_counts.input_record_count,
            last_data_time: stat.data_counts.last_data_time,
            processed_record_count: stat.data_counts.processed_record_count
          },
          model_size_stats: {
            bucket_allocation_failures_count: stat.model_size_stats.bucket_allocation_failures_count,
            memory_status: stat.model_size_stats.memory_status,
            model_bytes: stat.model_size_stats.model_bytes,
            model_bytes_exceeded: stat.model_size_stats.model_bytes_exceeded,
            model_bytes_memory_limit: stat.model_size_stats.model_bytes_memory_limit,
            peak_model_bytes: stat.model_size_stats.peak_model_bytes
          },
          timing_stats: {
            average_bucket_processing_time_ms: stat.timing_stats.average_bucket_processing_time_ms,
            bucket_count: stat.timing_stats.bucket_count,
            exponential_average_bucket_processing_time_ms: stat.timing_stats.exponential_average_bucket_processing_time_ms,
            exponential_average_bucket_processing_time_per_hour_ms: stat.timing_stats.exponential_average_bucket_processing_time_per_hour_ms,
            maximum_bucket_processing_time_ms: stat.timing_stats.maximum_bucket_processing_time_ms,
            minimum_bucket_processing_time_ms: stat.timing_stats.minimum_bucket_processing_time_ms,
            total_bucket_processing_time_ms: stat.timing_stats.total_bucket_processing_time_ms
          },
          datafeed: {
            datafeed_id: datafeed === null || datafeed === void 0 ? void 0 : datafeed.datafeed_id,
            state: datafeed === null || datafeed === void 0 ? void 0 : datafeed.state,
            timing_stats: {
              bucket_count: datafeed === null || datafeed === void 0 ? void 0 : datafeed.timing_stats.bucket_count,
              exponential_average_search_time_per_hour_ms: datafeed === null || datafeed === void 0 ? void 0 : datafeed.timing_stats.exponential_average_search_time_per_hour_ms,
              search_count: datafeed === null || datafeed === void 0 ? void 0 : datafeed.timing_stats.search_count,
              total_search_time_ms: datafeed === null || datafeed === void 0 ? void 0 : datafeed.timing_stats.total_search_time_ms
            }
          }
        };
      });
      return {
        ml_job_usage: jobsUsage,
        ml_job_metrics: jobMetrics
      };
    } catch (e) {// ignore failure, usage will be zeroed
    }
  }

  return {
    ml_job_usage: initialMlJobsUsage,
    ml_job_metrics: []
  };
};

exports.getMlJobMetrics = getMlJobMetrics;