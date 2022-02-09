"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = exports.cli = void 0;

var _minimist = _interopRequireDefault(require("minimist"));

var _devUtils = require("@kbn/dev-utils");

var _test = require("@kbn/test");

var _bluebird = _interopRequireDefault(require("bluebird"));

var _path = require("path");

var _constants = require("../../../common/endpoint/constants");

var _trusted_app_generator = require("../../../common/endpoint/data_generators/trusted_app_generator");

var _index_fleet_endpoint_policy = require("../../../common/endpoint/data_loaders/index_fleet_endpoint_policy");

var _setup_fleet_for_endpoint = require("../../../common/endpoint/data_loaders/setup_fleet_for_endpoint");

var _common = require("../../../../fleet/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const defaultLogger = new _devUtils.ToolingLog({
  level: 'info',
  writeTo: process.stdout
});
const separator = '----------------------------------------';
const trustedAppGenerator = new _trusted_app_generator.TrustedAppGenerator();

const cli = async () => {
  const cliDefaults = {
    string: ['kibana'],
    default: {
      count: 10,
      kibana: 'http://elastic:changeme@localhost:5601'
    }
  };
  const options = (0, _minimist.default)(process.argv.slice(2), cliDefaults);

  if ('help' in options) {
    defaultLogger.write(`
node ${(0, _path.basename)(process.argv[1])} [options]

Options:${Object.keys(cliDefaults.default).reduce((out, option) => {
      // @ts-expect-error TS7053
      return `${out}\n  --${option}=${cliDefaults.default[option]}`;
    }, '')}
`);
    return;
  }

  const runLogger = createRunLogger();
  defaultLogger.write(`${separator}
Loading ${options.count} Trusted App Entries`);
  await run({ ...options,
    logger: runLogger
  });
  defaultLogger.write(`
Done!
${separator}`);
};

exports.cli = cli;

const run = async ({
  count = 10,
  kibana = 'http://elastic:changeme@localhost:5601',
  logger = defaultLogger
} = {}) => {
  const kbnClient = new _test.KbnClient({
    log: logger,
    url: kibana
  }); // touch the Trusted Apps List so it can be created
  // and
  // setup fleet with endpoint integrations

  logger.info('setting up Fleet with endpoint and creating trusted apps list');
  const [installedEndpointPackage] = await Promise.all([(0, _setup_fleet_for_endpoint.setupFleetForEndpoint)(kbnClient).then(response => response.endpointPackage), kbnClient.request({
    method: 'GET',
    path: _constants.TRUSTED_APPS_LIST_API
  })]); // Setup a list of real endpoint policies and return a method to randomly select one

  const randomPolicyId = await (async () => {
    const randomN = max => Math.floor(Math.random() * max);

    const policyIds = (await fetchEndpointPolicies(kbnClient)).data.items.map(policy => policy.id) || []; // If the number of existing policies is less than 5, then create some more policies

    if (policyIds.length < 5) {
      for (let i = 0, t = 5 - policyIds.length; i < t; i++) {
        policyIds.push((await (0, _index_fleet_endpoint_policy.indexFleetEndpointPolicy)(kbnClient, `Policy for Trusted App assignment ${i + 1}`, installedEndpointPackage.version)).integrationPolicies[0].id);
      }
    }

    return () => policyIds[randomN(policyIds.length)];
  })();
  return _bluebird.default.map(Array.from({
    length: count
  }), async () => {
    const body = trustedAppGenerator.generateTrustedAppForCreate();

    if (body.effectScope.type === 'policy') {
      body.effectScope.policies = [randomPolicyId(), randomPolicyId()];
    }

    return kbnClient.request({
      method: 'POST',
      path: _constants.TRUSTED_APPS_CREATE_API,
      body
    }).then(({
      data
    }) => {
      logger.write(data.id);
      return data;
    });
  }, {
    concurrency: 10
  });
};

exports.run = run;

const createRunLogger = () => {
  let groupCount = 1;
  let itemCount = 0;
  return new _devUtils.ToolingLog({
    level: 'info',
    writeTo: {
      write: msg => {
        process.stdout.write('.');
        itemCount++;

        if (itemCount === 5) {
          itemCount = 0;

          if (groupCount === 5) {
            process.stdout.write('\n');
            groupCount = 1;
          } else {
            process.stdout.write('  ');
            groupCount++;
          }
        }
      }
    }
  });
};

const fetchEndpointPolicies = kbnClient => {
  return kbnClient.request({
    method: 'GET',
    path: _common.PACKAGE_POLICY_API_ROUTES.LIST_PATTERN,
    query: {
      perPage: 100,
      kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name: endpoint`
    }
  });
};