"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timelineFieldsMigrator = void 0;

var _constants = require("../../constants");

var _migrator = require("../../utils/migrator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A migrator to handle moving specific fields that reference other saved objects to the references field within a saved
 * object.
 */


const timelineFieldsMigrator = new _migrator.FieldMigrator([{
  path: 'savedQueryId',
  type: _constants.SAVED_QUERY_TYPE,
  name: _constants.SAVED_QUERY_ID_REF_NAME
}]);
exports.timelineFieldsMigrator = timelineFieldsMigrator;