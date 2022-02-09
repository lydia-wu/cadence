"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPaginatedPipelines = getPaginatedPipelines;

var _lodash = require("lodash");

var _filter = require("../pagination/filter");

var _get_pipeline_ids = require("./get_pipeline_ids");

var _sort_pipelines = require("./sort_pipelines");

var _paginate = require("../pagination/paginate");

var _get_metrics = require("../details/get_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getPaginatedPipelines({
  req,
  lsIndexPattern,
  clusterUuid,
  logstashUuid,
  metrics,
  pagination,
  sort = {
    field: '',
    direction: 'desc'
  },
  queryText
}) {
  const {
    throughputMetric,
    nodesCountMetric
  } = metrics;
  const sortField = sort.field;
  const config = req.server.config(); // TODO type config

  const size = config.get('monitoring.ui.max_bucket_size');
  let pipelines = await (0, _get_pipeline_ids.getLogstashPipelineIds)({
    req,
    lsIndexPattern,
    clusterUuid,
    logstashUuid,
    size
  }); // this is needed for sorting

  if (sortField === throughputMetric) {
    pipelines = await getPaginatedThroughputData(pipelines, req, lsIndexPattern, throughputMetric);
  } else if (sortField === nodesCountMetric) {
    pipelines = await getPaginatedNodesData(pipelines, req, lsIndexPattern, nodesCountMetric);
  }

  const filteredPipelines = (0, _filter.filter)(pipelines, queryText, ['id']); // We only support filtering by id right now

  const sortedPipelines = (0, _sort_pipelines.sortPipelines)(filteredPipelines, sort);
  const pageOfPipelines = (0, _paginate.paginate)(pagination, sortedPipelines);
  const response = {
    pipelines: await getPipelines({
      req,
      lsIndexPattern,
      pipelines: pageOfPipelines,
      throughputMetric,
      nodesCountMetric
    }),
    totalPipelineCount: filteredPipelines.length
  };
  return processPipelinesAPIResponse(response, throughputMetric, nodesCountMetric);
}

function processPipelinesAPIResponse(response, throughputMetricKey, nodeCountMetricKey) {
  // Normalize metric names for shared component code
  // Calculate latest throughput and node count for each pipeline
  const processedResponse = response.pipelines.reduce((acc, pipeline) => {
    var _pipeline$metrics$thr, _pipeline$metrics$nod;

    acc.pipelines.push({ ...pipeline,
      metrics: {
        throughput: pipeline.metrics[throughputMetricKey],
        nodesCount: pipeline.metrics[nodeCountMetricKey]
      },
      latestThroughput: ((0, _lodash.last)((_pipeline$metrics$thr = pipeline.metrics[throughputMetricKey]) === null || _pipeline$metrics$thr === void 0 ? void 0 : _pipeline$metrics$thr.data) || [])[1],
      latestNodesCount: ((0, _lodash.last)((_pipeline$metrics$nod = pipeline.metrics[nodeCountMetricKey]) === null || _pipeline$metrics$nod === void 0 ? void 0 : _pipeline$metrics$nod.data) || [])[1]
    });
    return acc;
  }, {
    totalPipelineCount: response.totalPipelineCount,
    pipelines: []
  });
  return processedResponse;
}

async function getPaginatedThroughputData(pipelines, req, lsIndexPattern, throughputMetric) {
  const metricSeriesData = Object.values(await Promise.all(pipelines.map(pipeline => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await (0, _get_metrics.getMetrics)(req, lsIndexPattern, [throughputMetric], [{
          bool: {
            should: [{
              term: {
                type: 'logstash_stats'
              }
            }, {
              term: {
                'metricset.name': 'stats'
              }
            }]
          }
        }], {
          pipeline
        }, 2);
        resolve(reduceData(pipeline, data));
      } catch (error) {
        reject(error);
      }
    });
  })));
  return pipelines.reduce((acc, pipeline) => {
    const match = metricSeriesData.find(metric => metric.id === pipeline.id);

    if (match) {
      const dataSeries = (0, _lodash.get)(match, `metrics.${throughputMetric}.data`, [[]]);

      if (dataSeries.length) {
        const newPipeline = { ...pipeline,
          [throughputMetric]: dataSeries.pop()[1]
        };
        acc.push(newPipeline);
      } else {
        acc.push(pipeline);
      }
    } else {
      acc.push(pipeline);
    }

    return acc;
  }, []);
}

async function getPaginatedNodesData(pipelines, req, lsIndexPattern, nodesCountMetric) {
  const pipelineWithMetrics = (0, _lodash.cloneDeep)(pipelines);
  const metricSeriesData = await (0, _get_metrics.getMetrics)(req, lsIndexPattern, [nodesCountMetric], [{
    bool: {
      should: [{
        term: {
          type: 'logstash_stats'
        }
      }, {
        term: {
          'metricset.name': 'stats'
        }
      }]
    }
  }], {
    pageOfPipelines: pipelineWithMetrics
  }, 2);
  const {
    data
  } = metricSeriesData[nodesCountMetric][0] || [[]];
  const pipelinesMap = (data.pop() || [])[1] || {};

  if (!Object.keys(pipelinesMap).length) {
    return pipelineWithMetrics;
  }

  return pipelineWithMetrics.map(pipeline => ({ ...pipeline,
    [nodesCountMetric]: pipelinesMap[pipeline.id]
  }));
}

async function getPipelines({
  req,
  lsIndexPattern,
  pipelines,
  throughputMetric,
  nodesCountMetric
}) {
  const throughputPipelines = await getThroughputPipelines(req, lsIndexPattern, pipelines, throughputMetric);
  const nodeCountPipelines = await getNodePipelines(req, lsIndexPattern, pipelines, nodesCountMetric);
  const finalPipelines = pipelines.map(({
    id
  }) => {
    const matchThroughputPipeline = throughputPipelines.find(p => p.id === id);
    const matchNodesCountPipeline = nodeCountPipelines.find(p => p.id === id);
    return {
      id,
      metrics: {
        [throughputMetric]: matchThroughputPipeline && throughputMetric in matchThroughputPipeline.metrics ? matchThroughputPipeline.metrics[throughputMetric] : undefined,
        [nodesCountMetric]: matchNodesCountPipeline && nodesCountMetric in matchNodesCountPipeline.metrics ? matchNodesCountPipeline.metrics[nodesCountMetric] : undefined
      }
    };
  });
  return finalPipelines;
}

async function getThroughputPipelines(req, lsIndexPattern, pipelines, throughputMetric) {
  const metricsResponse = await Promise.all(pipelines.map(pipeline => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await (0, _get_metrics.getMetrics)(req, lsIndexPattern, [throughputMetric], [{
          bool: {
            should: [{
              term: {
                type: 'logstash_stats'
              }
            }, {
              term: {
                'metricset.name': 'stats'
              }
            }]
          }
        }], {
          pipeline
        });
        resolve(reduceData(pipeline, data));
      } catch (error) {
        reject(error);
      }
    });
  }));
  return Object.values(metricsResponse);
}

async function getNodePipelines(req, lsIndexPattern, pipelines, nodesCountMetric) {
  const metricData = await (0, _get_metrics.getMetrics)(req, lsIndexPattern, [nodesCountMetric], [{
    bool: {
      should: [{
        term: {
          type: 'logstash_stats'
        }
      }, {
        term: {
          'metricset.name': 'stats'
        }
      }]
    }
  }], {
    pageOfPipelines: pipelines
  });
  const metricObject = metricData[nodesCountMetric][0];
  const pipelinesData = pipelines.map(({
    id
  }) => {
    return {
      id,
      metrics: {
        [nodesCountMetric]: { ...metricObject,
          data: metricObject.data.map(([timestamp, valueMap]) => [timestamp, valueMap[id]])
        }
      }
    };
  });
  return pipelinesData;
}

function reduceData(pipeline, data) {
  return {
    id: pipeline.id,
    metrics: Object.keys(data).reduce((accum, metricName) => {
      accum[metricName] = data[metricName][0];
      return accum;
    }, {})
  };
}