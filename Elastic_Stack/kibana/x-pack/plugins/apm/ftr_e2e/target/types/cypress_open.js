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

const cypress_start_1 = require("./cypress_start");

async function openE2ETests({
  readConfigFile
}) {
  const kibanaConfig = await readConfigFile(require.resolve('./config.ts'));
  return { ...kibanaConfig.getAll(),
    testRunner: cypress_start_1.cypressOpenTests
  };
} // eslint-disable-next-line import/no-default-export


exports.default = openE2ETests;
module.exports = exports.default;