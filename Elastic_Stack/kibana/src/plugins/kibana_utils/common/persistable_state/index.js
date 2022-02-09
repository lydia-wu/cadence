"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  migrateToLatest: true,
  mergeMigrationFunctionMaps: true
};
Object.defineProperty(exports, "mergeMigrationFunctionMaps", {
  enumerable: true,
  get: function () {
    return _merge_migration_function_map.mergeMigrationFunctionMaps;
  }
});
Object.defineProperty(exports, "migrateToLatest", {
  enumerable: true,
  get: function () {
    return _migrate_to_latest.migrateToLatest;
  }
});

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _migrate_to_latest = require("./migrate_to_latest");

var _merge_migration_function_map = require("./merge_migration_function_map");