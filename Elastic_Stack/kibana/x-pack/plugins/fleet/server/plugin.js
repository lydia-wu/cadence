"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FleetPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _server = require("../../../../src/core/server");

var _common = require("../common");

var _constants = require("./constants");

var _saved_objects = require("./saved_objects");

var _routes = require("./routes");

var _services = require("./services");

var _agents = require("./services/agents");

var _register = require("./collectors/register");

var _packages = require("./services/epm/packages");

var _security = require("./routes/security");

var _fleet_server = require("./services/fleet_server");

var _artifacts = require("./services/artifacts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const allSavedObjectTypes = [_constants.OUTPUT_SAVED_OBJECT_TYPE, _constants.AGENT_POLICY_SAVED_OBJECT_TYPE, _constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE, _constants.PACKAGES_SAVED_OBJECT_TYPE, _constants.ASSETS_SAVED_OBJECT_TYPE, _constants.AGENT_SAVED_OBJECT_TYPE, _constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE, _constants.PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE];
/**
 * Describes public Fleet plugin contract returned at the `startup` stage.
 */

class FleetPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "licensing$", void 0);
    (0, _defineProperty2.default)(this, "config$", void 0);
    (0, _defineProperty2.default)(this, "configInitialValue", void 0);
    (0, _defineProperty2.default)(this, "cloud", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "isProductionMode", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "kibanaBranch", void 0);
    (0, _defineProperty2.default)(this, "httpSetup", void 0);
    (0, _defineProperty2.default)(this, "securitySetup", void 0);
    (0, _defineProperty2.default)(this, "encryptedSavedObjectsSetup", void 0);
    this.initializerContext = initializerContext;
    this.config$ = this.initializerContext.config.create();
    this.isProductionMode = this.initializerContext.env.mode.prod;
    this.kibanaVersion = this.initializerContext.env.packageInfo.version;
    this.kibanaBranch = this.initializerContext.env.packageInfo.branch;
    this.logger = this.initializerContext.logger.get();
    this.configInitialValue = this.initializerContext.config.get();
  }

  setup(core, deps) {
    this.httpSetup = core.http;
    this.licensing$ = deps.licensing.license$;
    this.encryptedSavedObjectsSetup = deps.encryptedSavedObjects;
    this.cloud = deps.cloud;
    this.securitySetup = deps.security;
    const config = this.configInitialValue;
    (0, _saved_objects.registerSavedObjects)(core.savedObjects, deps.encryptedSavedObjects);
    (0, _saved_objects.registerEncryptedSavedObjects)(deps.encryptedSavedObjects); // Register feature
    // TODO: Flesh out privileges

    if (deps.features) {
      deps.features.registerKibanaFeature({
        id: _constants.PLUGIN_ID,
        name: 'Fleet and Integrations',
        category: _server.DEFAULT_APP_CATEGORIES.management,
        app: [_constants.PLUGIN_ID, _common.INTEGRATIONS_PLUGIN_ID, 'kibana'],
        catalogue: ['fleet'],
        reserved: {
          description: 'Privilege to setup Fleet packages and configured policies. Intended for use by the elastic/fleet-server service account only.',
          privileges: [{
            id: 'fleet-setup',
            privilege: {
              excludeFromBasePrivileges: true,
              api: ['fleet-setup'],
              savedObject: {
                all: [],
                read: []
              },
              ui: []
            }
          }]
        },
        privileges: {
          all: {
            api: [`${_constants.PLUGIN_ID}-read`, `${_constants.PLUGIN_ID}-all`],
            app: [_constants.PLUGIN_ID, _common.INTEGRATIONS_PLUGIN_ID, 'kibana'],
            catalogue: ['fleet'],
            savedObject: {
              all: allSavedObjectTypes,
              read: []
            },
            ui: ['show', 'read', 'write']
          },
          read: {
            api: [`${_constants.PLUGIN_ID}-read`],
            app: [_constants.PLUGIN_ID, _common.INTEGRATIONS_PLUGIN_ID, 'kibana'],
            catalogue: ['fleet'],
            // TODO: check if this is actually available to read user
            savedObject: {
              all: [],
              read: allSavedObjectTypes
            },
            ui: ['show', 'read']
          }
        }
      });
    }

    core.http.registerRouteHandlerContext('fleet', (coreContext, request) => ({
      epm: {
        // Use a lazy getter to avoid constructing this client when not used by a request handler
        get internalSoClient() {
          return _services.appContextService.getSavedObjects().getScopedClient(request, {
            excludedWrappers: ['security']
          });
        }

      }
    }));
    const router = core.http.createRouter(); // Register usage collection

    (0, _register.registerFleetUsageCollector)(core, config, deps.usageCollection); // Always register app routes for permissions checking

    (0, _routes.registerAppRoutes)(router); // Allow read-only users access to endpoints necessary for Integrations UI
    // Only some endpoints require superuser so we pass a raw IRouter here
    // For all the routes we enforce the user to have role superuser

    const superuserRouter = _security.RouterWrappers.require.superuser(router);

    const fleetSetupRouter = _security.RouterWrappers.require.fleetSetupPrivilege(router); // Some EPM routes use regular rbac to support integrations app


    (0, _routes.registerEPMRoutes)({
      rbac: router,
      superuser: superuserRouter
    }); // Register rest of routes only if security is enabled

    if (deps.security) {
      (0, _routes.registerSetupRoutes)(fleetSetupRouter, config);
      (0, _routes.registerAgentPolicyRoutes)({
        fleetSetup: fleetSetupRouter,
        superuser: superuserRouter
      });
      (0, _routes.registerPackagePolicyRoutes)(superuserRouter);
      (0, _routes.registerOutputRoutes)(superuserRouter);
      (0, _routes.registerSettingsRoutes)(superuserRouter);
      (0, _routes.registerDataStreamRoutes)(superuserRouter);
      (0, _routes.registerPreconfigurationRoutes)(superuserRouter); // Conditional config routes

      if (config.agents.enabled) {
        (0, _routes.registerAgentAPIRoutes)(superuserRouter, config);
        (0, _routes.registerEnrollmentApiKeyRoutes)({
          fleetSetup: fleetSetupRouter,
          superuser: superuserRouter
        });
      }
    }
  }

  start(core, plugins) {
    _services.appContextService.start({
      elasticsearch: core.elasticsearch,
      data: plugins.data,
      encryptedSavedObjectsStart: plugins.encryptedSavedObjects,
      encryptedSavedObjectsSetup: this.encryptedSavedObjectsSetup,
      securitySetup: this.securitySetup,
      securityStart: plugins.security,
      configInitialValue: this.configInitialValue,
      config$: this.config$,
      savedObjects: core.savedObjects,
      isProductionMode: this.isProductionMode,
      kibanaVersion: this.kibanaVersion,
      kibanaBranch: this.kibanaBranch,
      httpSetup: this.httpSetup,
      cloud: this.cloud,
      logger: this.logger
    });

    _services.licenseService.start(this.licensing$);

    const fleetServerSetup = (0, _fleet_server.startFleetServerSetup)();
    return {
      fleetSetupCompleted: () => new Promise(resolve => {
        Promise.all([fleetServerSetup]).finally(() => resolve());
      }),
      esIndexPatternService: new _services.ESIndexPatternSavedObjectService(),
      packageService: {
        getInstallation: _packages.getInstallation,
        ensureInstalledPackage: _packages.ensureInstalledPackage
      },
      agentService: {
        getAgent: _agents.getAgentById,
        listAgents: _agents.getAgentsByKuery,
        getAgentStatusById: _agents.getAgentStatusById,
        getAgentStatusForAgentPolicy: _agents.getAgentStatusForAgentPolicy,
        authenticateAgentWithAccessToken: _agents.authenticateAgentWithAccessToken
      },
      agentPolicyService: {
        get: _services.agentPolicyService.get,
        list: _services.agentPolicyService.list,
        getDefaultAgentPolicyId: _services.agentPolicyService.getDefaultAgentPolicyId,
        getFullAgentPolicy: _services.agentPolicyService.getFullAgentPolicy,
        getByIds: _services.agentPolicyService.getByIDs
      },
      packagePolicyService: _services.packagePolicyService,
      registerExternalCallback: (type, callback) => {
        return _services.appContextService.addExternalCallback(type, callback);
      },

      createArtifactsClient(packageName) {
        return new _artifacts.FleetArtifactsClient(core.elasticsearch.client.asInternalUser, packageName);
      }

    };
  }

  async stop() {
    _services.appContextService.stop();

    _services.licenseService.stop();
  }

}

exports.FleetPlugin = FleetPlugin;