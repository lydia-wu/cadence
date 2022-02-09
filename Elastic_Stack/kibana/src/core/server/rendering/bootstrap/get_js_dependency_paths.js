"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJsDependencyPaths = void 0;

var _uiSharedDepsNpm = _interopRequireDefault(require("@kbn/ui-shared-deps-npm"));

var _uiSharedDepsSrc = _interopRequireDefault(require("@kbn/ui-shared-deps-src"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getJsDependencyPaths = (regularBundlePath, bundlePaths) => {
  return [`${regularBundlePath}/kbn-ui-shared-deps-npm/${_uiSharedDepsNpm.default.dllFilename}`, `${regularBundlePath}/kbn-ui-shared-deps-src/${_uiSharedDepsSrc.default.jsFilename}`, `${regularBundlePath}/core/core.entry.js`, ...[...bundlePaths.values()].map(plugin => plugin.bundlePath)];
};

exports.getJsDependencyPaths = getJsDependencyPaths;