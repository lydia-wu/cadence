"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const yargs_1 = require("yargs");

const cypress_start_1 = require("./cypress_start");

const specArg = yargs_1.argv.spec;

async function runE2ETests({
  readConfigFile
}) {
  const kibanaConfig = await readConfigFile(require.resolve('./config.ts'));
  return { ...kibanaConfig.getAll(),
    testRunner: cypress_start_1.cypressRunTests(specArg)
  };
} // eslint-disable-next-line import/no-default-export


exports.default = runE2ETests;
module.exports = exports.default;