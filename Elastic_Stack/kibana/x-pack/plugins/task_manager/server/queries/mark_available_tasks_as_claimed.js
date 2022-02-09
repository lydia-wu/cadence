"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortByRunAtAndRetryAt = exports.RunningOrClaimingTaskWithExpiredRetryAt = exports.InactiveTasks = exports.IdleTaskWithExpiredRunAt = void 0;
exports.taskWithLessThanMaxAttempts = taskWithLessThanMaxAttempts;
exports.tasksClaimedByOwner = tasksClaimedByOwner;
exports.tasksOfType = tasksOfType;
exports.updateFieldsAndMarkAsFailed = void 0;

var _query_clauses = require("./query_clauses");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function taskWithLessThanMaxAttempts(type, maxAttempts) {
  return {
    bool: {
      must: [{
        term: {
          'task.taskType': type
        }
      }, {
        range: {
          'task.attempts': {
            lt: maxAttempts
          }
        }
      }]
    }
  };
}

function tasksOfType(taskTypes) {
  return {
    bool: {
      should: [...taskTypes].map(type => ({
        term: {
          'task.taskType': type
        }
      }))
    }
  };
}

function tasksClaimedByOwner(taskManagerId, ...taskFilters) {
  return (0, _query_clauses.mustBeAllOf)({
    term: {
      'task.ownerId': taskManagerId
    }
  }, {
    term: {
      'task.status': 'claiming'
    }
  }, ...taskFilters);
}

const IdleTaskWithExpiredRunAt = {
  bool: {
    must: [{
      term: {
        'task.status': 'idle'
      }
    }, {
      range: {
        'task.runAt': {
          lte: 'now'
        }
      }
    }]
  }
};
exports.IdleTaskWithExpiredRunAt = IdleTaskWithExpiredRunAt;
const InactiveTasks = {
  bool: {
    must_not: [{
      bool: {
        should: [{
          term: {
            'task.status': 'running'
          }
        }, {
          term: {
            'task.status': 'claiming'
          }
        }],
        must: {
          range: {
            'task.retryAt': {
              gt: 'now'
            }
          }
        }
      }
    }]
  }
};
exports.InactiveTasks = InactiveTasks;
const RunningOrClaimingTaskWithExpiredRetryAt = {
  bool: {
    must: [{
      bool: {
        should: [{
          term: {
            'task.status': 'running'
          }
        }, {
          term: {
            'task.status': 'claiming'
          }
        }]
      }
    }, {
      range: {
        'task.retryAt': {
          lte: 'now'
        }
      }
    }]
  }
};
exports.RunningOrClaimingTaskWithExpiredRetryAt = RunningOrClaimingTaskWithExpiredRetryAt;
const SortByRunAtAndRetryAtScript = {
  _script: {
    type: 'number',
    order: 'asc',
    script: {
      lang: 'painless',
      source: `
if (doc['task.retryAt'].size()!=0) {
  return doc['task.retryAt'].value.toInstant().toEpochMilli();
}
if (doc['task.runAt'].size()!=0) {
  return doc['task.runAt'].value.toInstant().toEpochMilli();
}
    `
    }
  }
};
const SortByRunAtAndRetryAt = SortByRunAtAndRetryAtScript;
exports.SortByRunAtAndRetryAt = SortByRunAtAndRetryAt;

const updateFieldsAndMarkAsFailed = (fieldUpdates, claimTasksById, claimableTaskTypes, skippedTaskTypes, taskMaxAttempts) => {
  const markAsClaimingScript = `ctx._source.task.status = "claiming"; ${Object.keys(fieldUpdates).map(field => `ctx._source.task.${field}=params.fieldUpdates.${field};`).join(' ')}`;
  return {
    source: `
    if (params.claimableTaskTypes.contains(ctx._source.task.taskType)) {
      if (ctx._source.task.schedule != null || ctx._source.task.attempts < params.taskMaxAttempts[ctx._source.task.taskType] || params.claimTasksById.contains(ctx._id)) {
        ${markAsClaimingScript}
      } else {
        ctx._source.task.status = "failed";
      }
    } else if (params.skippedTaskTypes.contains(ctx._source.task.taskType) && params.claimTasksById.contains(ctx._id)) {
      ${markAsClaimingScript}
    } else if (!params.skippedTaskTypes.contains(ctx._source.task.taskType)) {
      ctx._source.task.status = "unrecognized";
    } else {
      ctx.op = "noop";
    }`,
    lang: 'painless',
    params: {
      fieldUpdates,
      claimTasksById,
      claimableTaskTypes,
      skippedTaskTypes,
      taskMaxAttempts
    }
  };
};

exports.updateFieldsAndMarkAsFailed = updateFieldsAndMarkAsFailed;