"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOldestIdleActionTask = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns the millisecond timestamp of the oldest action task that may still be executed (with a 24 hour delay).
 * Useful for cleaning up related objects that may no longer be needed.
 * @internal
 */

const getOldestIdleActionTask = async (client, taskManagerIndex) => {
  var _error, _response$body, _response$body$hits, _response$body$hits$h; // Default is now - 24h


  const oneDayAgo = `now-24h`;
  const response = await client.search({
    size: 1,
    index: taskManagerIndex,
    body: {
      sort: [{
        'task.runAt': {
          order: 'asc'
        }
      }],
      query: {
        bool: {
          filter: {
            bool: {
              must: [{
                terms: {
                  'task.taskType': ['actions:.email', 'actions:.index', 'actions:.pagerduty', 'actions:.swimlane', 'actions:.server-log', 'actions:.slack', 'actions:.webhook', 'actions:.servicenow', 'actions:.servicenow-sir', 'actions:.jira', 'actions:.resilient', 'actions:.teams']
                }
              }, {
                term: {
                  type: 'task'
                }
              }, {
                term: {
                  'task.status': 'idle'
                }
              }]
            }
          }
        }
      }
    }
  }, {
    ignore: [404]
  });

  if (((_error = response.body.error) === null || _error === void 0 ? void 0 : _error.status) === 404) {
    // If the index doesn't exist, fallback to default
    return oneDayAgo;
  } else if (((_response$body = response.body) === null || _response$body === void 0 ? void 0 : (_response$body$hits = _response$body.hits) === null || _response$body$hits === void 0 ? void 0 : (_response$body$hits$h = _response$body$hits.hits) === null || _response$body$hits$h === void 0 ? void 0 : _response$body$hits$h.length) > 0) {
    var _response$body$hits$h2, _response$body$hits$h3; // If there is a search result, return it's task.runAt field
    // If there is a search result but it has no task.runAt, assume something has gone very wrong and return 0 as a safe value
    // 0 should be safest since no docs should get filtered out


    const runAt = (_response$body$hits$h2 = response.body.hits.hits[0]._source) === null || _response$body$hits$h2 === void 0 ? void 0 : (_response$body$hits$h3 = _response$body$hits$h2.task) === null || _response$body$hits$h3 === void 0 ? void 0 : _response$body$hits$h3.runAt;
    return runAt ? `${runAt}||-24h` : `0`;
  } else {
    // If no results, fallback to default
    return oneDayAgo;
  }
};

exports.getOldestIdleActionTask = getOldestIdleActionTask;