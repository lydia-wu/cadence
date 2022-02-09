"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unremovablePackages = exports.monitoringTypes = exports.installationStatuses = exports.defaultPackages = exports.dataTypes = exports.autoUpdatePackages = exports.agentAssetTypes = exports.STANDALONE_RUN_INSTRUCTIONS = exports.PACKAGES_SAVED_OBJECT_TYPE = exports.MAX_TIME_COMPLETE_INSTALL = exports.KUBERNETES_RUN_INSTRUCTIONS = exports.FLEET_SYSTEM_PACKAGE = exports.FLEET_SYNTHETICS_PACKAGE = exports.FLEET_SERVER_PACKAGE = exports.FLEET_KUBERNETES_PACKAGE = exports.FLEET_ENDPOINT_PACKAGE = exports.FLEET_ELASTIC_AGENT_PACKAGE = exports.FLEET_APM_PACKAGE = exports.ASSETS_SAVED_OBJECT_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PACKAGES_SAVED_OBJECT_TYPE = 'epm-packages';
exports.PACKAGES_SAVED_OBJECT_TYPE = PACKAGES_SAVED_OBJECT_TYPE;
const ASSETS_SAVED_OBJECT_TYPE = 'epm-packages-assets';
exports.ASSETS_SAVED_OBJECT_TYPE = ASSETS_SAVED_OBJECT_TYPE;
const MAX_TIME_COMPLETE_INSTALL = 60000;
exports.MAX_TIME_COMPLETE_INSTALL = MAX_TIME_COMPLETE_INSTALL;
const FLEET_SYSTEM_PACKAGE = 'system';
exports.FLEET_SYSTEM_PACKAGE = FLEET_SYSTEM_PACKAGE;
const FLEET_ELASTIC_AGENT_PACKAGE = 'elastic_agent';
exports.FLEET_ELASTIC_AGENT_PACKAGE = FLEET_ELASTIC_AGENT_PACKAGE;
const FLEET_SERVER_PACKAGE = 'fleet_server';
exports.FLEET_SERVER_PACKAGE = FLEET_SERVER_PACKAGE;
const FLEET_ENDPOINT_PACKAGE = 'endpoint';
exports.FLEET_ENDPOINT_PACKAGE = FLEET_ENDPOINT_PACKAGE;
const FLEET_APM_PACKAGE = 'apm';
exports.FLEET_APM_PACKAGE = FLEET_APM_PACKAGE;
const FLEET_SYNTHETICS_PACKAGE = 'synthetics';
exports.FLEET_SYNTHETICS_PACKAGE = FLEET_SYNTHETICS_PACKAGE;
const FLEET_KUBERNETES_PACKAGE = 'kubernetes';
exports.FLEET_KUBERNETES_PACKAGE = FLEET_KUBERNETES_PACKAGE;
const KUBERNETES_RUN_INSTRUCTIONS = 'kubectl apply -f elastic-agent-standalone-kubernetes.yaml';
exports.KUBERNETES_RUN_INSTRUCTIONS = KUBERNETES_RUN_INSTRUCTIONS;
const STANDALONE_RUN_INSTRUCTIONS = './elastic-agent install';
/*
 Package rules:
|               | unremovablePackages | defaultPackages | autoUpdatePackages |
|---------------|:---------------------:|:---------------:|:------------------:|
| Removable     |         ❌             |        ✔️        |          ✔️         |
| Auto-installs |         ❌             |        ✔️        |          ❌         |
| Auto-updates  |         ❌             |        ✔️        |          ✔️         |

`endpoint` is a special package. It needs to autoupdate, it needs to _not_ be
removable, but it doesn't install by default. Following the table, it needs to
be in `unremovablePackages` and in `autoUpdatePackages`, but not in
`defaultPackages`.
*/

exports.STANDALONE_RUN_INSTRUCTIONS = STANDALONE_RUN_INSTRUCTIONS;
const unremovablePackages = [FLEET_SYSTEM_PACKAGE, FLEET_ELASTIC_AGENT_PACKAGE, FLEET_SERVER_PACKAGE, FLEET_ENDPOINT_PACKAGE];
exports.unremovablePackages = unremovablePackages;
const defaultPackages = unremovablePackages.filter(p => p !== FLEET_ENDPOINT_PACKAGE);
exports.defaultPackages = defaultPackages;
const autoUpdatePackages = [FLEET_ENDPOINT_PACKAGE, FLEET_APM_PACKAGE, FLEET_SYNTHETICS_PACKAGE];
exports.autoUpdatePackages = autoUpdatePackages;
const agentAssetTypes = {
  Input: 'input'
};
exports.agentAssetTypes = agentAssetTypes;
const dataTypes = {
  Logs: 'logs',
  Metrics: 'metrics'
}; // currently identical but may be a subset or otherwise different some day

exports.dataTypes = dataTypes;
const monitoringTypes = Object.values(dataTypes);
exports.monitoringTypes = monitoringTypes;
const installationStatuses = {
  Installed: 'installed',
  Installing: 'installing',
  InstallFailed: 'install_failed',
  NotInstalled: 'not_installed'
};
exports.installationStatuses = installationStatuses;