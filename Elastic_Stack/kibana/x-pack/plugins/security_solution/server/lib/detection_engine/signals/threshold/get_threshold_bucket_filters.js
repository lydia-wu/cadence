"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThresholdBucketFilters = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Returns a filter to exclude events that have already been included in a
 * previous threshold signal. Uses the threshold signal history to achieve this.
 */

const getThresholdBucketFilters = async ({
  signalHistory,
  timestampOverride
}) => {
  const filters = Object.values(signalHistory).reduce((acc, bucket) => {
    const filter = {
      bool: {
        filter: [{
          range: {
            [timestampOverride !== null && timestampOverride !== void 0 ? timestampOverride : '@timestamp']: {
              // Timestamp of last event signaled on for this set of terms.
              lte: new Date(bucket.lastSignalTimestamp).toISOString()
            }
          }
        }]
      }
    }; // Terms to filter events older than `lastSignalTimestamp`.

    bucket.terms.forEach(term => {
      if (term.field != null) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        filter.bool.filter.push({
          term: {
            [term.field]: `${term.value}`
          }
        });
      }
    });
    return [...acc, filter];
  }, []);
  return [{
    bool: {
      must_not: filters
    }
  }];
};

exports.getThresholdBucketFilters = getThresholdBucketFilters;