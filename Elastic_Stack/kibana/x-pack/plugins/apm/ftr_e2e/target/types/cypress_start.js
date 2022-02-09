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
exports.cypressOpenTests = exports.cypressRunTests = void 0;

const tslib_1 = require("tslib");
/* eslint-disable no-console */


const url_1 = tslib_1.__importDefault(require("url"));

const cypress_1 = tslib_1.__importDefault(require("cypress"));

const archives_metadata_1 = tslib_1.__importDefault(require("./cypress/fixtures/es_archiver/archives_metadata"));

const create_apm_users_and_roles_1 = require("../scripts/create-apm-users-and-roles/create_apm_users_and_roles");

const es_archiver_1 = require("./cypress/tasks/es_archiver");

function cypressRunTests(spec) {
  return async ({
    getService
  }) => {
    const result = await cypressStart(getService, cypress_1.default.run, spec);

    if (result && (result.status === 'failed' || result.totalFailed > 0)) {
      throw new Error(`APM Cypress tests failed`);
    }
  };
}

exports.cypressRunTests = cypressRunTests;

async function cypressOpenTests({
  getService
}) {
  await cypressStart(getService, cypress_1.default.open);
}

exports.cypressOpenTests = cypressOpenTests;

async function cypressStart(getService, cypressExecution, spec) {
  const config = getService('config');
  const archiveName = 'apm_8.0.0';
  const {
    start,
    end
  } = archives_metadata_1.default[archiveName];
  const kibanaUrl = url_1.default.format({
    protocol: config.get('servers.kibana.protocol'),
    hostname: config.get('servers.kibana.hostname'),
    port: config.get('servers.kibana.port')
  }); // Creates APM users

  await create_apm_users_and_roles_1.createApmUsersAndRoles({
    elasticsearch: {
      username: config.get('servers.elasticsearch.username'),
      password: config.get('servers.elasticsearch.password')
    },
    kibana: {
      hostname: kibanaUrl,
      roleSuffix: 'e2e_tests'
    }
  });
  console.log('Loading esArchiver...');
  await es_archiver_1.esArchiverLoad('apm_8.0.0');
  const res = await cypressExecution({ ...(spec !== undefined ? {
      spec
    } : {}),
    config: {
      baseUrl: kibanaUrl
    },
    env: {
      START_DATE: start,
      END_DATE: end,
      KIBANA_URL: kibanaUrl
    }
  });
  console.log('Removing esArchiver...');
  await es_archiver_1.esArchiverUnload('apm_8.0.0');
  return res;
}