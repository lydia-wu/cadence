"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _devUtils = require("@kbn/dev-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function config({
  readConfigFile
}) {
  const kibanaCommonTestsConfig = await readConfigFile(require.resolve('../../../../test/common/config.js'));
  const xpackFunctionalTestsConfig = await readConfigFile(require.resolve('../../../test/functional/config.js'));
  return { ...kibanaCommonTestsConfig.getAll(),
    esTestCluster: { ...xpackFunctionalTestsConfig.get('esTestCluster'),
      serverArgs: [...xpackFunctionalTestsConfig.get('esTestCluster.serverArgs'), // define custom es server here
      // API Keys is enabled at the top level
      'xpack.security.enabled=true']
    },
    kbnTestServer: { ...xpackFunctionalTestsConfig.get('kbnTestServer'),
      sourceArgs: [...xpackFunctionalTestsConfig.get('kbnTestServer.sourceArgs'), '--no-watch'],
      serverArgs: [...xpackFunctionalTestsConfig.get('kbnTestServer.serverArgs'), '--csp.strict=false', '--home.disableWelcomeScreen=true', '--csp.warnLegacyBrowsers=false', // define custom kibana server args here
      `--elasticsearch.ssl.certificateAuthorities=${_devUtils.CA_CERT_PATH}`, `--elasticsearch.ignoreVersionMismatch=${process.env.CI ? 'false' : 'true'}`, `--uiSettings.overrides.theme:darkMode=true`, `--elasticsearch.username=kibana_system`, `--elasticsearch.password=changeme`, '--xpack.reporting.enabled=false']
    }
  };
} // eslint-disable-next-line import/no-default-export


var _default = config;
exports.default = _default;
module.exports = exports.default;