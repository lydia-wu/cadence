"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluckCategoryFieldMeta = pluckCategoryFieldMeta;
exports.trimCategories = trimCategories;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function pluckCategoryFieldMeta(features, name, size) {
  const counts = new Map();

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    const term = feature.properties ? feature.properties[name] : undefined; // properties object may be sparse, so need to check if the field is effectively present

    if (typeof term !== undefined) {
      if (counts.has(term)) {
        counts.set(term, counts.get(term) + 1);
      } else {
        counts.set(term, 1);
      }
    }
  }

  return trimCategories(counts, size);
}

function trimCategories(counts, size) {
  const ordered = [];

  for (const [key, value] of counts) {
    ordered.push({
      key,
      count: value
    });
  }

  ordered.sort((a, b) => {
    return b.count - a.count;
  });
  const truncated = ordered.slice(0, size);
  return {
    categories: truncated
  };
}