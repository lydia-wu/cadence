"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validEventFields = exports.isValidEventField = exports.CtiQueries = void 0;

var _constants = require("../../../cti/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let CtiQueries;
exports.CtiQueries = CtiQueries;

(function (CtiQueries) {
  CtiQueries["eventEnrichment"] = "eventEnrichment";
})(CtiQueries || (exports.CtiQueries = CtiQueries = {}));

const validEventFields = Object.keys(_constants.EVENT_ENRICHMENT_INDICATOR_FIELD_MAP);
exports.validEventFields = validEventFields;

const isValidEventField = field => validEventFields.includes(field);

exports.isValidEventField = isValidEventField;