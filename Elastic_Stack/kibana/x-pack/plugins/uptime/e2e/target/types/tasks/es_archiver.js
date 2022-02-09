"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esArchiverResetKibana = exports.esArchiverUnload = exports.esArchiverLoad = void 0;

const tslib_1 = require("tslib");

const path_1 = tslib_1.__importDefault(require("path"));

const child_process_1 = require("child_process");

const ES_ARCHIVE_DIR = './fixtures/es_archiver'; // Otherwise execSync would inject NODE_TLS_REJECT_UNAUTHORIZED=0 and node would abort if used over https

const NODE_TLS_REJECT_UNAUTHORIZED = '1';

const esArchiverLoad = folder => {
  const path = path_1.default.join(ES_ARCHIVE_DIR, folder);
  child_process_1.execSync(`node ../../../../scripts/es_archiver load "${path}" --config ../../../test/functional/config.js`, {
    env: { ...process.env,
      NODE_TLS_REJECT_UNAUTHORIZED
    },
    stdio: 'inherit'
  });
};

exports.esArchiverLoad = esArchiverLoad;

const esArchiverUnload = folder => {
  const path = path_1.default.join(ES_ARCHIVE_DIR, folder);
  child_process_1.execSync(`node ../../../../scripts/es_archiver unload "${path}" --config ../../../test/functional/config.js`, {
    env: { ...process.env,
      NODE_TLS_REJECT_UNAUTHORIZED
    },
    stdio: 'inherit'
  });
};

exports.esArchiverUnload = esArchiverUnload;

const esArchiverResetKibana = () => {
  child_process_1.execSync(`node ../../../../scripts/es_archiver empty-kibana-index --config ../../../test/functional/config.js`, {
    env: { ...process.env,
      NODE_TLS_REJECT_UNAUTHORIZED
    },
    stdio: 'inherit'
  });
};

exports.esArchiverResetKibana = esArchiverResetKibana;