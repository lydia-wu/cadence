"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJobFnFactory = void 0;

var _common = require("../../common");

var _compatibility_shim = require("./compatibility_shim");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Incoming job params can be `JobParamsPDF` or `JobParamsPDFLegacy` depending
 * on the version that the POST URL was copied from.
 */


const createJobFnFactory = function createJobFactoryFn(_reporting, logger) {
  return (0, _compatibility_shim.compatibilityShim)(async function createJobFn({
    relativeUrls,
    ...jobParams
  }) {
    (0, _common.validateUrls)(relativeUrls); // return the payload

    return { ...jobParams,
      forceNow: new Date().toISOString(),
      objects: relativeUrls.map(u => ({
        relativeUrl: u
      }))
    };
  }, logger);
};

exports.createJobFnFactory = createJobFnFactory;