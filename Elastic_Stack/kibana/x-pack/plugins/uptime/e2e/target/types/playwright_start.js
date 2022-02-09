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
exports.playwrightRunTests = void 0;

const tslib_1 = require("tslib");
/* eslint-disable no-console */


const url_1 = tslib_1.__importDefault(require("url"));

const synthetics_1 = require("@elastic/synthetics");

const es_archiver_1 = require("./tasks/es_archiver");

require("./journeys");

function playwrightRunTests() {
  return async ({
    getService
  }) => {
    const result = await playwrightStart(getService);

    if (result && result.uptime.status !== 'succeeded') {
      throw new Error('Tests failed');
    }
  };
}

exports.playwrightRunTests = playwrightRunTests;

async function playwrightStart(getService) {
  console.log('Loading esArchiver...');
  await es_archiver_1.esArchiverLoad('full_heartbeat');
  const config = getService('config');
  const kibanaUrl = url_1.default.format({
    protocol: config.get('servers.kibana.protocol'),
    hostname: config.get('servers.kibana.hostname'),
    port: config.get('servers.kibana.port')
  });
  const res = await synthetics_1.run({
    params: {
      kibanaUrl
    },
    playwrightOptions: {
      headless: true,
      chromiumSandbox: false,
      timeout: 60 * 1000
    }
  });
  console.log('Removing esArchiver...');
  await es_archiver_1.esArchiverUnload('full_heartbeat');
  return res;
}