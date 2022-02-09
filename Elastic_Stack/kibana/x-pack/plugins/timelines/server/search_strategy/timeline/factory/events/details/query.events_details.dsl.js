"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTimelineDetailsQuery = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildTimelineDetailsQuery = (indexName, id, docValueFields, authFilter) => {
  const basicFilter = {
    terms: {
      _id: [id]
    }
  };
  const query = authFilter != null ? {
    bool: {
      filter: [basicFilter, authFilter]
    }
  } : {
    terms: {
      _id: [id]
    }
  };
  return {
    allow_no_indices: true,
    index: indexName,
    ignore_unavailable: true,
    body: {
      docvalue_fields: docValueFields,
      query,
      fields: [{
        field: '*',
        include_unmapped: true
      }],
      _source: true
    },
    size: 1
  };
};

exports.buildTimelineDetailsQuery = buildTimelineDetailsQuery;