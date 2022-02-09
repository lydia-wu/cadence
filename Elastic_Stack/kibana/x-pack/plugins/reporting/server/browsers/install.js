"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installBrowser = installBrowser;

var _del = _interopRequireDefault(require("del"));

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _chromium = require("./chromium");

var _download = require("./download");

var _checksum = require("./download/checksum");

var _extract = require("./extract");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * "install" a browser by type into installs path by extracting the downloaded
 * archive. If there is an error extracting the archive an `ExtractError` is thrown
 */


function installBrowser(logger, chromiumPath = _path.default.resolve(__dirname, '../../chromium'), platform = process.platform, architecture = _os.default.arch()) {
  const binaryPath$ = new Rx.Subject();
  const paths = new _chromium.ChromiumArchivePaths();
  const pkg = paths.find(platform, architecture);

  if (!pkg) {
    throw new Error(`Unsupported platform: ${platform}-${architecture}`);
  }

  const backgroundInstall = async () => {
    const binaryPath = paths.getBinaryPath(pkg);
    const binaryChecksum = await (0, _checksum.md5)(binaryPath).catch(() => '');

    if (binaryChecksum !== pkg.binaryChecksum) {
      logger.warning(`Found browser binary checksum for ${pkg.platform}/${pkg.architecture} ` + `is ${binaryChecksum} but ${pkg.binaryChecksum} was expected. Re-installing...`);

      try {
        await (0, _del.default)(chromiumPath);
      } catch (err) {
        logger.error(err);
      }

      try {
        await (0, _download.ensureBrowserDownloaded)(logger);

        const archive = _path.default.join(paths.archivesPath, pkg.architecture, pkg.archiveFilename);

        logger.info(`Extracting [${archive}] to [${chromiumPath}]`);
        await (0, _extract.extract)(archive, chromiumPath);
      } catch (err) {
        logger.error(err);
      }
    }

    logger.info(`Browser executable: ${binaryPath}`);
    binaryPath$.next(binaryPath); // subscribers wait for download and extract to complete
  };

  backgroundInstall();
  return {
    binaryPath$
  };
}