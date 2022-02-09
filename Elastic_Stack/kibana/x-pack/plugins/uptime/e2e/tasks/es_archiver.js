"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esArchiverUnload = exports.esArchiverResetKibana = exports.esArchiverLoad = void 0;

var _path = _interopRequireDefault(require("path"));

var _child_process = require("child_process");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ES_ARCHIVE_DIR = './fixtures/es_archiver'; // Otherwise execSync would inject NODE_TLS_REJECT_UNAUTHORIZED=0 and node would abort if used over https

const NODE_TLS_REJECT_UNAUTHORIZED = '1';

const esArchiverLoad = folder => {
  const path = _path.default.join(ES_ARCHIVE_DIR, folder);

  (0, _child_process.execSync)(`node ../../../../scripts/es_archiver load "${path}" --config ../../../test/functional/config.js`, {
    env: { ...process.env,
      NODE_TLS_REJECT_UNAUTHORIZED
    },
    stdio: 'inherit'
  });
};

exports.esArchiverLoad = esArchiverLoad;

const esArchiverUnload = folder => {
  const path = _path.default.join(ES_ARCHIVE_DIR, folder);

  (0, _child_process.execSync)(`node ../../../../scripts/es_archiver unload "${path}" --config ../../../test/functional/config.js`, {
    env: { ...process.env,
      NODE_TLS_REJECT_UNAUTHORIZED
    },
    stdio: 'inherit'
  });
};

exports.esArchiverUnload = esArchiverUnload;

const esArchiverResetKibana = () => {
  (0, _child_process.execSync)(`node ../../../../scripts/es_archiver empty-kibana-index --config ../../../test/functional/config.js`, {
    env: { ...process.env,
      NODE_TLS_REJECT_UNAUTHORIZED
    },
    stdio: 'inherit'
  });
};

exports.esArchiverResetKibana = esArchiverResetKibana;