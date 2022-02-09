"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBundleRoutes = registerBundleRoutes;

var _path = require("path");

var _utils = require("@kbn/utils");

var _uiSharedDepsNpm = _interopRequireDefault(require("@kbn/ui-shared-deps-npm"));

var _uiSharedDepsSrc = _interopRequireDefault(require("@kbn/ui-shared-deps-src"));

var _file_hash_cache = require("./file_hash_cache");

var _bundles_route = require("./bundles_route");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 *  Creates the routes that serves files from `bundlesPath`.
 *
 *  @param {Object} options
 *  @property {Array<{id,path}>} options.npUiPluginPublicDirs array of ids and paths that should be served for new platform plugins
 *  @property {string} options.regularBundlesPath
 *  @property {string} options.basePublicPath
 *
 *  @return Array.of({Hapi.Route})
 */
function registerBundleRoutes({
  router,
  serverBasePath,
  uiPlugins,
  packageInfo
}) {
  const {
    dist: isDist,
    buildNum
  } = packageInfo; // rather than calculate the fileHash on every request, we
  // provide a cache object to `resolveDynamicAssetResponse()` that
  // will store the most recently used hashes.

  const fileHashCache = new _file_hash_cache.FileHashCache();
  (0, _bundles_route.registerRouteForBundle)(router, {
    publicPath: `${serverBasePath}/${buildNum}/bundles/kbn-ui-shared-deps-npm/`,
    routePath: `/${buildNum}/bundles/kbn-ui-shared-deps-npm/`,
    bundlesPath: _uiSharedDepsNpm.default.distDir,
    fileHashCache,
    isDist
  });
  (0, _bundles_route.registerRouteForBundle)(router, {
    publicPath: `${serverBasePath}/${buildNum}/bundles/kbn-ui-shared-deps-src/`,
    routePath: `/${buildNum}/bundles/kbn-ui-shared-deps-src/`,
    bundlesPath: _uiSharedDepsSrc.default.distDir,
    fileHashCache,
    isDist
  });
  (0, _bundles_route.registerRouteForBundle)(router, {
    publicPath: `${serverBasePath}/${buildNum}/bundles/core/`,
    routePath: `/${buildNum}/bundles/core/`,
    bundlesPath: (0, _utils.fromRoot)((0, _path.join)('src', 'core', 'target', 'public')),
    fileHashCache,
    isDist
  });
  [...uiPlugins.internal.entries()].forEach(([id, {
    publicTargetDir,
    version
  }]) => {
    (0, _bundles_route.registerRouteForBundle)(router, {
      publicPath: `${serverBasePath}/${buildNum}/bundles/plugin/${id}/${version}/`,
      routePath: `/${buildNum}/bundles/plugin/${id}/${version}/`,
      bundlesPath: publicTargetDir,
      fileHashCache,
      isDist
    });
  });
}