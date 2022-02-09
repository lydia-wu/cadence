"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cypressOpenTests = cypressOpenTests;
exports.cypressRunTests = cypressRunTests;

var _url = _interopRequireDefault(require("url"));

var _cypress = _interopRequireDefault(require("cypress"));

var _archives_metadata = _interopRequireDefault(require("./cypress/fixtures/es_archiver/archives_metadata"));

var _create_apm_users_and_roles = require("../scripts/create-apm-users-and-roles/create_apm_users_and_roles");

var _es_archiver = require("./cypress/tasks/es_archiver");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable no-console */


function cypressRunTests(spec) {
  return async ({
    getService
  }) => {
    const result = await cypressStart(getService, _cypress.default.run, spec);

    if (result && (result.status === 'failed' || result.totalFailed > 0)) {
      throw new Error(`APM Cypress tests failed`);
    }
  };
}

async function cypressOpenTests({
  getService
}) {
  await cypressStart(getService, _cypress.default.open);
}

async function cypressStart(getService, cypressExecution, spec) {
  const config = getService('config');
  const archiveName = 'apm_8.0.0';
  const {
    start,
    end
  } = _archives_metadata.default[archiveName];

  const kibanaUrl = _url.default.format({
    protocol: config.get('servers.kibana.protocol'),
    hostname: config.get('servers.kibana.hostname'),
    port: config.get('servers.kibana.port')
  }); // Creates APM users


  await (0, _create_apm_users_and_roles.createApmUsersAndRoles)({
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
  await (0, _es_archiver.esArchiverLoad)('apm_8.0.0');
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
  await (0, _es_archiver.esArchiverUnload)('apm_8.0.0');
  return res;
}