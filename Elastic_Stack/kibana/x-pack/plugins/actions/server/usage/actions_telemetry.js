"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInUseByAlertingTotalCounts = getInUseByAlertingTotalCounts;
exports.getInUseTotalCount = getInUseTotalCount;
exports.getTotalCount = getTotalCount;

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getTotalCount(esClient, kibanaIndex, preconfiguredActions) {
  var _searchResult$aggrega, _searchResult$aggrega2, _preconfiguredActions;

  const scriptedMetric = {
    scripted_metric: {
      init_script: 'state.types = [:]',
      map_script: `
        String actionType = doc['action.actionTypeId'].value;
        state.types.put(actionType, state.types.containsKey(actionType) ? state.types.get(actionType) + 1 : 1);
      `,
      // Combine script is executed per cluster, but we already have a key-value pair per cluster.
      // Despite docs that say this is optional, this script can't be blank.
      combine_script: 'return state',
      // Reduce script is executed across all clusters, so we need to add up all the total from each cluster
      // This also needs to account for having no data
      reduce_script: `
        Map result = [:];
        for (Map m : states.toArray()) {
          if (m !== null) {
            for (String k : m.keySet()) {
              result.put(k, result.containsKey(k) ? result.get(k) + m.get(k) : m.get(k));
            }
          }
        }
        return result;
      `
    }
  };
  const {
    body: searchResult
  } = await esClient.search({
    index: kibanaIndex,
    size: 0,
    body: {
      query: {
        bool: {
          filter: [{
            term: {
              type: 'action'
            }
          }]
        }
      },
      aggs: {
        byActionTypeId: scriptedMetric
      }
    }
  }); // @ts-expect-error aggegation type is not specified

  const aggs = (_searchResult$aggrega = searchResult.aggregations) === null || _searchResult$aggrega === void 0 ? void 0 : (_searchResult$aggrega2 = _searchResult$aggrega.byActionTypeId.value) === null || _searchResult$aggrega2 === void 0 ? void 0 : _searchResult$aggrega2.types;
  const countByType = Object.keys(aggs).reduce( // ES DSL aggregations are returned as `any` by esClient.search
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (obj, key) => ({ ...obj,
    [replaceFirstAndLastDotSymbols(key)]: aggs[key]
  }), {});

  if (preconfiguredActions && preconfiguredActions.length) {
    for (const preconfiguredAction of preconfiguredActions) {
      const actionTypeId = replaceFirstAndLastDotSymbols(preconfiguredAction.actionTypeId);
      countByType[actionTypeId] = countByType[actionTypeId] || 0;
      countByType[actionTypeId]++;
    }
  }

  return {
    countTotal: Object.keys(aggs).reduce((total, key) => parseInt(aggs[key], 10) + total, 0) + ((_preconfiguredActions = preconfiguredActions === null || preconfiguredActions === void 0 ? void 0 : preconfiguredActions.length) !== null && _preconfiguredActions !== void 0 ? _preconfiguredActions : 0),
    countByType
  };
}

async function getInUseTotalCount(esClient, kibanaIndex, referenceType, preconfiguredActions) {
  var _actionResults$aggreg, _preconfiguredActions5;

  const scriptedMetric = {
    scripted_metric: {
      init_script: 'state.connectorIds = new HashMap(); state.total = 0;',
      map_script: `
        String connectorId = doc['references.id'].value;
        String actionRef = doc['references.name'].value;
        if (state.connectorIds[connectorId] === null) {
          state.connectorIds[connectorId] = actionRef;
          state.total++;
        }
      `,
      // Combine script is executed per cluster, but we already have a key-value pair per cluster.
      // Despite docs that say this is optional, this script can't be blank.
      combine_script: 'return state',
      // Reduce script is executed across all clusters, so we need to add up all the total from each cluster
      // This also needs to account for having no data
      reduce_script: `
          Map connectorIds = [:];
          long total = 0;
          for (state in states) {
            if (state !== null) {
              total += state.total;
              for (String k : state.connectorIds.keySet()) {
                connectorIds.put(k, connectorIds.containsKey(k) ? connectorIds.get(k) + state.connectorIds.get(k) : state.connectorIds.get(k));
              }
            }
          }
          Map result = new HashMap();
          result.total = total;
          result.connectorIds = connectorIds;
          return result;
      `
    }
  };
  const preconfiguredActionsScriptedMetric = {
    scripted_metric: {
      init_script: 'state.actionRefs = new HashMap(); state.total = 0;',
      map_script: `
        String actionRef = doc['alert.actions.actionRef'].value;
        String actionTypeId = doc['alert.actions.actionTypeId'].value;
        if (actionRef.startsWith('preconfigured:') && state.actionRefs[actionRef] === null) {
          HashMap map = new HashMap();
          map.actionRef = actionRef;
          map.actionTypeId = actionTypeId;
          state.actionRefs[actionRef] = map;
          state.total++;
        }
      `,
      // Combine script is executed per cluster, but we already have a key-value pair per cluster.
      // Despite docs that say this is optional, this script can't be blank.
      combine_script: 'return state',
      // Reduce script is executed across all clusters, so we need to add up all the total from each cluster
      // This also needs to account for having no data
      reduce_script: `
          Map actionRefs = [:];
          long total = 0;
          for (state in states) {
            if (state !== null) {
              total += state.total;
              for (String k : state.actionRefs.keySet()) {
                actionRefs.put(k, state.actionRefs.get(k));
              }
            }
          }
          Map result = new HashMap();
          result.total = total;
          result.actionRefs = actionRefs;
          return result;
      `
    }
  };
  const mustQuery = [{
    bool: {
      should: [{
        nested: {
          path: 'references',
          query: {
            bool: {
              filter: {
                bool: {
                  must: [{
                    term: {
                      'references.type': 'action'
                    }
                  }]
                }
              }
            }
          }
        }
      }, {
        nested: {
          path: 'alert.actions',
          query: {
            bool: {
              filter: {
                bool: {
                  must: [{
                    prefix: {
                      'alert.actions.actionRef': {
                        value: 'preconfigured:'
                      }
                    }
                  }]
                }
              }
            }
          }
        }
      }]
    }
  }];

  if (!!referenceType) {
    mustQuery.push({
      term: {
        type: referenceType
      }
    });
  }

  const {
    body: actionResults
  } = await esClient.search({
    index: kibanaIndex,
    size: 0,
    body: {
      query: {
        bool: {
          filter: {
            bool: {
              must_not: {
                term: {
                  type: 'action_task_params'
                }
              },
              must: mustQuery
            }
          }
        }
      },
      aggs: {
        refs: {
          nested: {
            path: 'references'
          },
          aggs: {
            actionRefIds: scriptedMetric
          }
        },
        preconfigured_actions: {
          nested: {
            path: 'alert.actions'
          },
          aggs: {
            preconfiguredActionRefIds: preconfiguredActionsScriptedMetric
          }
        }
      }
    }
  }); // @ts-expect-error aggegation type is not specified

  const aggs = actionResults.aggregations.refs.actionRefIds.value;
  const preconfiguredActionsAggs = // @ts-expect-error aggegation type is not specified
  (_actionResults$aggreg = actionResults.aggregations.preconfigured_actions) === null || _actionResults$aggreg === void 0 ? void 0 : _actionResults$aggreg.preconfiguredActionRefIds.value;
  const {
    body: {
      hits: actions
    }
  } = await esClient.search({
    index: kibanaIndex,
    _source_includes: ['action', 'namespaces'],
    body: {
      query: {
        bool: {
          must: [{
            term: {
              type: 'action'
            }
          }, {
            terms: {
              _id: Object.entries(aggs.connectorIds).map(([key]) => `action:${key}`)
            }
          }]
        }
      }
    }
  });
  const countByActionTypeId = actions.hits.reduce((actionTypeCount, action) => {
    const actionSource = action._source;
    const alertTypeId = replaceFirstAndLastDotSymbols(actionSource.action.actionTypeId);
    const currentCount = actionTypeCount[alertTypeId] !== undefined ? actionTypeCount[alertTypeId] : 0;
    actionTypeCount[alertTypeId] = currentCount + 1;
    return actionTypeCount;
  }, {});
  const namespacesList = actions.hits.reduce((_namespaces, action) => {
    var _action$_source$names, _action$_source;

    const namespaces = (_action$_source$names = (_action$_source = action._source) === null || _action$_source === void 0 ? void 0 : _action$_source.namespaces) !== null && _action$_source$names !== void 0 ? _action$_source$names : ['default'];
    namespaces.forEach(namespace => {
      if (!_namespaces.has(namespace)) {
        _namespaces.add(namespace);
      }
    });
    return _namespaces;
  }, new Set());
  const countEmailByService = actions.hits.filter(action => action._source.action.actionTypeId === '.email').reduce((emailServiceCount, action) => {
    var _action$config$servic, _action$config;

    const service = (_action$config$servic = (_action$config = action._source.action.config) === null || _action$config === void 0 ? void 0 : _action$config.service) !== null && _action$config$servic !== void 0 ? _action$config$servic : 'other';
    const currentCount = emailServiceCount[service] !== undefined ? emailServiceCount[service] : 0;
    emailServiceCount[service] = currentCount + 1;
    return emailServiceCount;
  }, {});
  let preconfiguredAlertHistoryConnectors = 0;
  const preconfiguredActionsRefs = preconfiguredActionsAggs ? Object.values(preconfiguredActionsAggs === null || preconfiguredActionsAggs === void 0 ? void 0 : preconfiguredActionsAggs.actionRefs) : [];

  for (const {
    actionRef,
    actionTypeId: rawActionTypeId
  } of preconfiguredActionsRefs) {
    const actionTypeId = replaceFirstAndLastDotSymbols(rawActionTypeId);
    countByActionTypeId[actionTypeId] = countByActionTypeId[actionTypeId] || 0;
    countByActionTypeId[actionTypeId]++;

    if (actionRef === `preconfigured:${_common.AlertHistoryEsIndexConnectorId}`) {
      preconfiguredAlertHistoryConnectors++;
    }

    if (preconfiguredActions && actionTypeId === '__email') {
      var _preconfiguredActions2, _preconfiguredActions3, _preconfiguredActions4;

      const preconfiguredConnectorId = actionRef.split(':')[1];
      const service = (_preconfiguredActions2 = (_preconfiguredActions3 = preconfiguredActions.find(preconfConnector => preconfConnector.id === preconfiguredConnectorId)) === null || _preconfiguredActions3 === void 0 ? void 0 : (_preconfiguredActions4 = _preconfiguredActions3.config) === null || _preconfiguredActions4 === void 0 ? void 0 : _preconfiguredActions4.service) !== null && _preconfiguredActions2 !== void 0 ? _preconfiguredActions2 : 'other';
      const currentCount = countEmailByService[service] !== undefined ? countEmailByService[service] : 0;
      countEmailByService[service] = currentCount + 1;
    }
  }

  return {
    countTotal: aggs.total + ((_preconfiguredActions5 = preconfiguredActionsAggs === null || preconfiguredActionsAggs === void 0 ? void 0 : preconfiguredActionsAggs.total) !== null && _preconfiguredActions5 !== void 0 ? _preconfiguredActions5 : 0),
    countByType: countByActionTypeId,
    countByAlertHistoryConnectorType: preconfiguredAlertHistoryConnectors,
    countEmailByService,
    countNamespaces: namespacesList.size
  };
}

async function getInUseByAlertingTotalCounts(esClient, kibanaIndex, preconfiguredActions) {
  return await getInUseTotalCount(esClient, kibanaIndex, 'alert', preconfiguredActions);
}

function replaceFirstAndLastDotSymbols(strToReplace) {
  const hasFirstSymbolDot = strToReplace.startsWith('.');
  const appliedString = hasFirstSymbolDot ? strToReplace.replace('.', '__') : strToReplace;
  const hasLastSymbolDot = strToReplace.endsWith('.');
  return hasLastSymbolDot ? `${appliedString.slice(0, -1)}__` : appliedString;
} // TODO: Implement executions count telemetry with eventLog, when it will write to index