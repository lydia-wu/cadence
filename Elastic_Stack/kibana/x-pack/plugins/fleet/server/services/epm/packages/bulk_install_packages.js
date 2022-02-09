"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkInstallPackages = bulkInstallPackages;
exports.isBulkInstallError = isBulkInstallError;

var _app_context = require("../../app_context");

var Registry = _interopRequireWildcard(require("../registry"));

var _install = require("../kibana/index_pattern/install");

var _install2 = require("./install");

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


async function bulkInstallPackages({
  savedObjectsClient,
  packagesToInstall,
  esClient,
  force
}) {
  const logger = _app_context.appContextService.getLogger();

  const installSource = 'registry';
  const packagesResults = await Promise.allSettled(packagesToInstall.map(pkg => {
    if (typeof pkg === 'string') return Registry.fetchFindLatestPackage(pkg);
    return Promise.resolve(pkg);
  }));
  logger.debug(`kicking off bulk install of ${packagesToInstall.join(', ')} from registry`);
  const bulkInstallResults = await Promise.allSettled(packagesResults.map(async (result, index) => {
    const packageName = getNameFromPackagesToInstall(packagesToInstall, index);

    if (result.status === 'fulfilled') {
      const pkgKeyProps = result.value;
      const installedPackageResult = await (0, _install2.isPackageVersionOrLaterInstalled)({
        savedObjectsClient,
        pkgName: pkgKeyProps.name,
        pkgVersion: pkgKeyProps.version
      });

      if (installedPackageResult) {
        const {
          name,
          version,
          installed_es: installedEs,
          installed_kibana: installedKibana
        } = installedPackageResult.package;
        return {
          name,
          version,
          result: {
            assets: [...installedEs, ...installedKibana],
            status: 'already_installed',
            installType: installedPackageResult.installType
          }
        };
      }

      const installResult = await (0, _install2.installPackage)({
        savedObjectsClient,
        esClient,
        pkgkey: Registry.pkgToPkgKey(pkgKeyProps),
        installSource,
        skipPostInstall: true,
        force
      });

      if (installResult.error) {
        return {
          name: packageName,
          error: installResult.error,
          installType: installResult.installType
        };
      } else {
        return {
          name: packageName,
          version: pkgKeyProps.version,
          result: installResult
        };
      }
    }

    return {
      name: packageName,
      error: result.reason
    };
  })); // only install index patterns if we completed install for any package-version for the
  // first time, aka fresh installs or upgrades

  if (bulkInstallResults.find(result => {
    var _result$value$result, _result$value$result2;

    return result.status === 'fulfilled' && !((_result$value$result = result.value.result) !== null && _result$value$result !== void 0 && _result$value$result.error) && ((_result$value$result2 = result.value.result) === null || _result$value$result2 === void 0 ? void 0 : _result$value$result2.status) === 'installed';
  })) {
    await (0, _install.installIndexPatterns)({
      savedObjectsClient,
      esClient,
      installSource
    });
  }

  return bulkInstallResults.map((result, index) => {
    const packageName = getNameFromPackagesToInstall(packagesToInstall, index);

    if (result.status === 'fulfilled') {
      if (result.value && result.value.error) {
        return {
          name: packageName,
          error: result.value.error,
          installType: result.value.installType
        };
      } else {
        return result.value;
      }
    } else {
      return {
        name: packageName,
        error: result.reason
      };
    }
  });
}

function isBulkInstallError(installResponse) {
  return 'error' in installResponse && installResponse.error instanceof Error;
}

function getNameFromPackagesToInstall(packagesToInstall, index) {
  const entry = packagesToInstall[index];
  if (typeof entry === 'string') return entry;
  return entry.name;
}