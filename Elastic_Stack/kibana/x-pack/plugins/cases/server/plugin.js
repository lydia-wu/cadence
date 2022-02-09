"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CasePlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _common = require("../common");

var _api = require("./routes/api");

var _saved_object_types = require("./saved_object_types");

var _connectors = require("./connectors");

var _factory = require("./client/factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createConfig(context) {
  return context.config.get();
}

class CasePlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "clientFactory", void 0);
    (0, _defineProperty2.default)(this, "securityPluginSetup", void 0);
    (0, _defineProperty2.default)(this, "lensEmbeddableFactory", void 0);
    (0, _defineProperty2.default)(this, "createRouteHandlerContext", ({
      core
    }) => {
      return async (context, request, response) => {
        return {
          getCasesClient: async () => {
            const [{
              savedObjects
            }] = await core.getStartServices();
            return this.clientFactory.create({
              request,
              scopedClusterClient: context.core.elasticsearch.client.asCurrentUser,
              savedObjectsService: savedObjects
            });
          }
        };
      };
    });
    this.initializerContext = initializerContext;
    this.log = this.initializerContext.logger.get();
    this.clientFactory = new _factory.CasesClientFactory(this.log);
  }

  setup(core, plugins) {
    const config = createConfig(this.initializerContext);

    if (!config.enabled) {
      return;
    }

    this.securityPluginSetup = plugins.security;
    this.lensEmbeddableFactory = plugins.lens.lensEmbeddableFactory;
    core.savedObjects.registerType((0, _saved_object_types.createCaseCommentSavedObjectType)({
      migrationDeps: {
        lensEmbeddableFactory: this.lensEmbeddableFactory
      }
    }));
    core.savedObjects.registerType(_saved_object_types.caseConfigureSavedObjectType);
    core.savedObjects.registerType(_saved_object_types.caseConnectorMappingsSavedObjectType);
    core.savedObjects.registerType((0, _saved_object_types.createCaseSavedObjectType)(core, this.log));
    core.savedObjects.registerType(_saved_object_types.caseUserActionSavedObjectType);
    this.log.debug(`Setting up Case Workflow with core contract [${Object.keys(core)}] and plugins [${Object.keys(plugins)}]`);
    core.http.registerRouteHandlerContext(_common.APP_ID, this.createRouteHandlerContext({
      core
    }));
    const router = core.http.createRouter();
    (0, _api.initCaseApi)({
      logger: this.log,
      router
    });

    if (_common.ENABLE_CASE_CONNECTOR) {
      core.savedObjects.registerType(_saved_object_types.subCaseSavedObjectType);
      (0, _connectors.registerConnectors)({
        registerActionType: plugins.actions.registerType,
        logger: this.log,
        factory: this.clientFactory
      });
    }
  }

  start(core, plugins) {
    this.log.debug(`Starting Case Workflow`);
    this.clientFactory.initialize({
      securityPluginSetup: this.securityPluginSetup,
      securityPluginStart: plugins.security,
      getSpace: async request => {
        var _plugins$spaces;

        return (_plugins$spaces = plugins.spaces) === null || _plugins$spaces === void 0 ? void 0 : _plugins$spaces.spacesService.getActiveSpace(request);
      },
      featuresPluginStart: plugins.features,
      actionsPluginStart: plugins.actions,
      lensEmbeddableFactory: this.lensEmbeddableFactory
    });
    const client = core.elasticsearch.client;

    const getCasesClientWithRequest = async request => {
      return this.clientFactory.create({
        request,
        scopedClusterClient: client.asScoped(request).asCurrentUser,
        savedObjectsService: core.savedObjects
      });
    };

    return {
      getCasesClientWithRequest
    };
  }

  stop() {
    this.log.debug(`Stopping Case Workflow`);
  }

}

exports.CasePlugin = CasePlugin;