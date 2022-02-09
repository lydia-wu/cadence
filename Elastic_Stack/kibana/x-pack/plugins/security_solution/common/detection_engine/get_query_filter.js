"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQueryFilter = exports.getAllFilters = exports.buildEqlSearchRequest = void 0;

var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");

var _esQuery = require("@kbn/es-query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getQueryFilter = (query, language, filters, index, lists, excludeExceptions = true) => {
  const indexPattern = {
    fields: [],
    title: index.join()
  };
  const config = {
    allowLeadingWildcards: true,
    queryStringOptions: {
      analyze_wildcard: true
    },
    ignoreFilterIfFieldNotInIndex: false,
    dateFormatTZ: 'Zulu'
  }; // Assume that `indices.query.bool.max_clause_count` is at least 1024 (the default value),
  // allowing us to make 1024-item chunks of exception list items.
  // Discussion at https://issues.apache.org/jira/browse/LUCENE-4835 indicates that 1024 is a
  // very conservative value.

  const exceptionFilter = (0, _securitysolutionListUtils.buildExceptionFilter)({
    lists,
    excludeExceptions,
    chunkSize: 1024
  });
  const initialQuery = {
    query,
    language
  };
  const allFilters = getAllFilters(filters, exceptionFilter);
  return (0, _esQuery.buildEsQuery)(indexPattern, initialQuery, allFilters, config);
};

exports.getQueryFilter = getQueryFilter;

const getAllFilters = (filters, exceptionFilter) => {
  if (exceptionFilter != null) {
    return [...filters, exceptionFilter];
  } else {
    return [...filters];
  }
};

exports.getAllFilters = getAllFilters;

const buildEqlSearchRequest = (query, index, from, to, size, timestampOverride, exceptionLists, eventCategoryOverride) => {
  const timestamp = timestampOverride !== null && timestampOverride !== void 0 ? timestampOverride : '@timestamp';
  const defaultTimeFields = ['@timestamp'];
  const timestamps = timestampOverride != null ? [timestampOverride, ...defaultTimeFields] : defaultTimeFields;
  const docFields = timestamps.map(tstamp => ({
    field: tstamp,
    format: 'strict_date_optional_time'
  })); // Assume that `indices.query.bool.max_clause_count` is at least 1024 (the default value),
  // allowing us to make 1024-item chunks of exception list items.
  // Discussion at https://issues.apache.org/jira/browse/LUCENE-4835 indicates that 1024 is a
  // very conservative value.

  const exceptionFilter = (0, _securitysolutionListUtils.buildExceptionFilter)({
    lists: exceptionLists,
    excludeExceptions: true,
    chunkSize: 1024
  });
  const indexString = index.join();
  const requestFilter = [{
    range: {
      [timestamp]: {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];

  if (exceptionFilter !== undefined) {
    var _exceptionFilter$quer;

    requestFilter.push({
      bool: {
        must_not: {
          bool: (_exceptionFilter$quer = exceptionFilter.query) === null || _exceptionFilter$quer === void 0 ? void 0 : _exceptionFilter$quer.bool
        }
      }
    });
  }

  return {
    method: 'POST',
    path: `/${indexString}/_eql/search?allow_no_indices=true`,
    body: {
      size,
      query,
      filter: {
        bool: {
          filter: requestFilter
        }
      },
      event_category_field: eventCategoryOverride,
      fields: [{
        field: '*',
        include_unmapped: true
      }, ...docFields]
    }
  };
};

exports.buildEqlSearchRequest = buildEqlSearchRequest;