"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telemetrySavedObjectMigrations = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const v716RemoveUnusedTelemetry = doc => {
  // Dynamically defined in 6.7 (https://github.com/elastic/kibana/pull/28878)
  // and then statically defined in 7.8 (https://github.com/elastic/kibana/pull/64332).
  const attributesBlocklist = ['ui_open.cluster', 'ui_open.indices', 'ui_open.overview', 'ui_reindex.close', 'ui_reindex.open', 'ui_reindex.start', 'ui_reindex.stop'];
  const isDocEligible = (0, _lodash.some)(attributesBlocklist, attribute => {
    return (0, _lodash.get)(doc, 'attributes', attribute);
  });

  if (isDocEligible) {
    return { ...doc,
      attributes: (0, _lodash.omit)(doc.attributes, attributesBlocklist)
    };
  }

  return doc;
};

const telemetrySavedObjectMigrations = {
  '7.16.0': (0, _lodash.flow)(v716RemoveUnusedTelemetry)
};
exports.telemetrySavedObjectMigrations = telemetrySavedObjectMigrations;