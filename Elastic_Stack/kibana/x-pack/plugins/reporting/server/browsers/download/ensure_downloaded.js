"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureBrowserDownloaded = ensureBrowserDownloaded;

var _fs = require("fs");

var _del = _interopRequireDefault(require("del"));

var _ = require("../");

var _checksum = require("./checksum");

var _download = require("./download");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Check for the downloaded archive of each requested browser type and
 * download them if they are missing or their checksum is invalid
 */


async function ensureBrowserDownloaded(logger) {
  await ensureDownloaded([_.chromium], logger);
}
/**
 * Clears the unexpected files in the browsers archivesPath
 * and ensures that all packages/archives are downloaded and
 * that their checksums match the declared value
 */


async function ensureDownloaded(browsers, logger) {
  await Promise.all(browsers.map(async ({
    paths: pSet
  }) => {
    const removedFiles = await (0, _del.default)(`${pSet.archivesPath}/**/*`, {
      force: true,
      onlyFiles: true,
      ignore: pSet.getAllArchiveFilenames()
    });
    removedFiles.forEach(path => {
      logger.warning(`Deleting unexpected file ${path}`);
    });
    const invalidChecksums = [];
    await Promise.all(pSet.packages.map(async p => {
      const {
        archiveFilename,
        archiveChecksum
      } = p;

      if (archiveFilename && archiveChecksum) {
        const path = pSet.resolvePath(p);
        const pathExists = (0, _fs.existsSync)(path);
        let foundChecksum;

        try {
          foundChecksum = await (0, _checksum.md5)(path).catch();
        } catch {
          foundChecksum = 'MISSING';
        }

        if (pathExists && foundChecksum === archiveChecksum) {
          logger.debug(`Browser archive for ${p.platform}/${p.architecture} found in ${path} `);
          return;
        }

        if (!pathExists) {
          logger.warning(`Browser archive for ${p.platform}/${p.architecture} not found in ${path}.`);
        }

        if (foundChecksum !== archiveChecksum) {
          logger.warning(`Browser archive checksum for ${p.platform}/${p.architecture} ` + `is ${foundChecksum} but ${archiveChecksum} was expected.`);
        }

        const url = pSet.getDownloadUrl(p);

        try {
          const downloadedChecksum = await (0, _download.download)(url, path, logger);

          if (downloadedChecksum !== archiveChecksum) {
            logger.warning(`Invalid checksum for ${p.platform}/${p.architecture}: ` + `expected ${archiveChecksum} got ${downloadedChecksum}`);
            invalidChecksums.push(`${url} => ${path}`);
          }
        } catch (err) {
          throw new Error(`Failed to download ${url}: ${err}`);
        }
      }
    }));

    if (invalidChecksums.length) {
      const err = new Error(`Error downloading browsers, checksums incorrect for:\n    - ${invalidChecksums.join('\n    - ')}`);
      logger.error(err);
      throw err;
    }
  }));
}