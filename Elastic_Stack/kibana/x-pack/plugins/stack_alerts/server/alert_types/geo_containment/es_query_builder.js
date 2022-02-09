"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OTHER_CATEGORY = void 0;
exports.executeEsQueryFactory = executeEsQueryFactory;
exports.getEsFormattedQuery = void 0;
exports.getShapesFilters = getShapesFilters;

var _esQuery = require("@kbn/es-query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const OTHER_CATEGORY = 'other'; // Consider dynamically obtaining from config?

exports.OTHER_CATEGORY = OTHER_CATEGORY;
const MAX_TOP_LEVEL_QUERY_SIZE = 0;
const MAX_SHAPES_QUERY_SIZE = 10000;
const MAX_BUCKETS_LIMIT = 65535;

const getEsFormattedQuery = (query, indexPattern) => {
  let esFormattedQuery;
  const queryLanguage = query.language;

  if (queryLanguage === 'kuery') {
    const ast = (0, _esQuery.fromKueryExpression)(query.query);
    esFormattedQuery = (0, _esQuery.toElasticsearchQuery)(ast, indexPattern);
  } else {
    esFormattedQuery = (0, _esQuery.luceneStringToDsl)(query.query);
  }

  return esFormattedQuery;
};

exports.getEsFormattedQuery = getEsFormattedQuery;

async function getShapesFilters(boundaryIndexTitle, boundaryGeoField, geoField, esClient, log, alertId, boundaryNameField, boundaryIndexQuery) {
  const filters = {};
  const shapesIdsNamesMap = {}; // Get all shapes in index
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const {
    body: boundaryData
  } = await esClient.search({
    index: boundaryIndexTitle,
    body: {
      size: MAX_SHAPES_QUERY_SIZE,
      ...(boundaryIndexQuery ? {
        query: getEsFormattedQuery(boundaryIndexQuery)
      } : {})
    }
  });
  boundaryData.hits.hits.forEach(({
    _index,
    _id
  }) => {
    filters[_id] = {
      geo_shape: {
        [geoField]: {
          indexed_shape: {
            index: _index,
            id: _id,
            path: boundaryGeoField
          }
        }
      }
    };
  });

  if (boundaryNameField) {
    boundaryData.hits.hits.forEach(({
      _source,
      _id
    }) => {
      shapesIdsNamesMap[_id] = _source[boundaryNameField];
    });
  }

  return {
    shapesFilters: filters,
    shapesIdsNamesMap
  };
}

async function executeEsQueryFactory({
  entity,
  index,
  dateField,
  boundaryGeoField,
  geoField,
  boundaryIndexTitle,
  indexQuery
}, esClient, log, shapesFilters) {
  return async (gteDateTime, ltDateTime) => {
    let esFormattedQuery;

    if (indexQuery) {
      const gteEpochDateTime = gteDateTime ? new Date(gteDateTime).getTime() : null;
      const ltEpochDateTime = ltDateTime ? new Date(ltDateTime).getTime() : null;
      const dateRangeUpdatedQuery = indexQuery.language === 'kuery' ? `(${dateField} >= "${gteEpochDateTime}" and ${dateField} < "${ltEpochDateTime}") and (${indexQuery.query})` : `(${dateField}:[${gteDateTime} TO ${ltDateTime}]) AND (${indexQuery.query})`;
      esFormattedQuery = getEsFormattedQuery({
        query: dateRangeUpdatedQuery,
        language: indexQuery.language
      });
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any


    const esQuery = {
      index,
      body: {
        size: MAX_TOP_LEVEL_QUERY_SIZE,
        aggs: {
          shapes: {
            filters: {
              other_bucket_key: OTHER_CATEGORY,
              filters: shapesFilters
            },
            aggs: {
              entitySplit: {
                terms: {
                  size: MAX_BUCKETS_LIMIT / ((Object.keys(shapesFilters).length || 1) * 2),
                  field: entity
                },
                aggs: {
                  entityHits: {
                    top_hits: {
                      size: 1,
                      sort: [{
                        [dateField]: {
                          order: 'desc'
                        }
                      }],
                      docvalue_fields: [entity, {
                        field: dateField,
                        format: 'strict_date_optional_time'
                      }, geoField],
                      _source: false
                    }
                  }
                }
              }
            }
          }
        },
        query: esFormattedQuery ? esFormattedQuery : {
          bool: {
            must: [],
            filter: [{
              match_all: {}
            }, {
              range: {
                [dateField]: { ...(gteDateTime ? {
                    gte: gteDateTime
                  } : {}),
                  lt: ltDateTime,
                  // 'less than' to prevent overlap between intervals
                  format: 'strict_date_optional_time'
                }
              }
            }],
            should: [],
            must_not: []
          }
        },
        stored_fields: ['*'],
        docvalue_fields: [{
          field: dateField,
          format: 'date_time'
        }]
      }
    };
    let esResult;

    try {
      ({
        body: esResult
      } = await esClient.search(esQuery));
    } catch (err) {
      log.warn(`${err.message}`);
    }

    return esResult;
  };
}