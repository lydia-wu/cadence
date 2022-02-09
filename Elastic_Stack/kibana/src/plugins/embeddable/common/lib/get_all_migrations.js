"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllMigrations = void 0;

var _migrate_base_input = require("./migrate_base_input");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getAllMigrations = (factories, enhancements, migrateFn) => {
  const uniqueVersions = new Set();

  for (const baseMigrationVersion of Object.keys(_migrate_base_input.baseEmbeddableMigrations)) {
    uniqueVersions.add(baseMigrationVersion);
  }

  for (const factory of factories) {
    Object.keys(factory.migrations).forEach(version => uniqueVersions.add(version));
  }

  for (const enhancement of enhancements) {
    Object.keys(enhancement.migrations).forEach(version => uniqueVersions.add(version));
  }

  const migrations = {};
  uniqueVersions.forEach(version => {
    migrations[version] = state => ({ ...migrateFn(state, version)
    });
  });
  return migrations;
};

exports.getAllMigrations = getAllMigrations;