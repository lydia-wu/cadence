"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lruCache = _interopRequireDefault(require("lru-cache"));

var _server = require("../../../../src/core/server");

var _assets = require("../../rule_registry/common/assets");

var _mapping_from_field_map = require("../../rule_registry/common/mapping_from_field_map");

var _server2 = require("../../rule_registry/server");

var _rule_types = require("./lib/detection_engine/rule_types");

var _routes = require("./routes");

var _types = require("./lib/detection_engine/signals/types");

var _signal_rule_alert_type = require("./lib/detection_engine/signals/signal_rule_alert_type");

var _artifacts = require("./endpoint/lib/artifacts");

var _metadata = require("./endpoint/lib/metadata");

var _saved_objects = require("./saved_objects");

var _client = require("./client");

var _config = require("./config");

var _ui_settings = require("./ui_settings");

var _constants = require("../common/constants");

var _metadata2 = require("./endpoint/routes/metadata");

var _limited_concurrency = require("./endpoint/routes/limited_concurrency");

var _resolver = require("./endpoint/routes/resolver");

var _policy = require("./endpoint/routes/policy");

var _actions = require("./endpoint/routes/actions");

var _services = require("./endpoint/services");

var _endpoint_app_context_services = require("./endpoint/endpoint_app_context_services");

var _usage = require("./usage");

var _trusted_apps = require("./endpoint/routes/trusted_apps");

var _security_solution = require("./search_strategy/security_solution");

var _sender = require("./lib/telemetry/sender");

var _receiver = require("./lib/telemetry/receiver");

var _license = require("./lib/license");

var _license_watch = require("./endpoint/lib/policy/license_watch");

var _migrate_artifacts_to_fleet = require("./endpoint/lib/artifacts/migrate_artifacts_to_fleet");

var _signal_aad_mapping = _interopRequireDefault(require("./lib/detection_engine/routes/index/signal_aad_mapping.json"));

var _alerts = require("./lib/detection_engine/rule_types/field_maps/alerts");

var _rules = require("./lib/detection_engine/rule_types/field_maps/rules");

var _register_event_log_provider = require("./lib/detection_engine/rule_execution_log/event_log_adapter/register_event_log_provider");

var _features = require("./features");

var _metadata3 = require("./endpoint/services/metadata");

var _cti = require("./lib/detection_engine/rule_types/field_maps/cti");

var _deprecation_privileges = require("./deprecation_privileges");

var _deprecations = require("./deprecations");

var _legacy_rules_notification_alert_type = require("./lib/detection_engine/notifications/legacy_rules_notification_alert_type");

var _legacy_types = require("./lib/detection_engine/notifications/legacy_types");

var _create_security_rule_type_wrapper = require("./lib/detection_engine/rule_types/create_security_rule_type_wrapper");

var _request_context_factory = require("./request_context_factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line no-restricted-imports
// eslint-disable-next-line no-restricted-imports


class Plugin {
  // TODO: can we create ListPluginStart?
  constructor(context) {
    (0, _defineProperty2.default)(this, "pluginContext", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "appClientFactory", void 0);
    (0, _defineProperty2.default)(this, "endpointAppContextService", new _endpoint_app_context_services.EndpointAppContextService());
    (0, _defineProperty2.default)(this, "telemetryReceiver", void 0);
    (0, _defineProperty2.default)(this, "telemetryEventsSender", void 0);
    (0, _defineProperty2.default)(this, "lists", void 0);
    (0, _defineProperty2.default)(this, "licensing$", void 0);
    (0, _defineProperty2.default)(this, "policyWatcher", void 0);
    (0, _defineProperty2.default)(this, "manifestTask", void 0);
    (0, _defineProperty2.default)(this, "checkMetadataTransformsTask", void 0);
    (0, _defineProperty2.default)(this, "artifactsCache", void 0);
    (0, _defineProperty2.default)(this, "telemetryUsageCounter", void 0);
    this.pluginContext = context;
    this.config = (0, _config.createConfig)(context);
    this.logger = context.logger.get();
    this.appClientFactory = new _client.AppClientFactory(); // Cache up to three artifacts with a max retention of 5 mins each

    this.artifactsCache = new _lruCache.default({
      max: 3,
      maxAge: 1000 * 60 * 5
    });
    this.telemetryEventsSender = new _sender.TelemetryEventsSender(this.logger);
    this.telemetryReceiver = new _receiver.TelemetryReceiver(this.logger);
    this.logger.debug('plugin initialized');
  }

  setup(core, plugins) {
    var _plugins$usageCollect, _plugins$encryptedSav, _plugins$security, _plugins$security2;

    this.logger.debug('plugin setup');
    const {
      appClientFactory,
      pluginContext,
      config,
      logger
    } = this;
    const experimentalFeatures = config.experimentalFeatures;
    (0, _saved_objects.initSavedObjects)(core.savedObjects);
    (0, _ui_settings.initUiSettings)(core.uiSettings, experimentalFeatures);
    const eventLogService = plugins.eventLog;
    (0, _register_event_log_provider.registerEventLogProvider)(eventLogService);
    const requestContextFactory = new _request_context_factory.RequestContextFactory({
      config,
      core,
      plugins
    });
    const router = core.http.createRouter();
    core.http.registerRouteHandlerContext(_constants.APP_ID, (context, request) => requestContextFactory.create(context, request));
    const endpointContext = {
      logFactory: pluginContext.logger,
      service: this.endpointAppContextService,
      config: () => Promise.resolve(config),
      experimentalFeatures
    };
    this.endpointAppContextService.setup({
      securitySolutionRequestContextFactory: requestContextFactory
    });
    (0, _usage.initUsageCollectors)({
      core,
      kibanaIndex: config.kibanaIndex,
      signalsIndex: config.signalsIndex,
      ml: plugins.ml,
      usageCollection: plugins.usageCollection
    });
    this.telemetryUsageCounter = (_plugins$usageCollect = plugins.usageCollection) === null || _plugins$usageCollect === void 0 ? void 0 : _plugins$usageCollect.createUsageCounter(_constants.APP_ID); // TODO: Once we are past experimental phase this check can be removed along with legacy registration of rules

    const isRuleRegistryEnabled = experimentalFeatures.ruleRegistryEnabled;
    const {
      ruleDataService
    } = plugins.ruleRegistry;
    let ruleDataClient = null;

    if (isRuleRegistryEnabled) {
      // NOTE: this is not used yet
      // TODO: convert the aliases to FieldMaps. Requires enhancing FieldMap to support alias path.
      // Split aliases by component template since we need to alias some fields in technical field mappings,
      // some fields in security solution specific component template.
      const aliases = {};
      Object.entries(_signal_aad_mapping.default).forEach(([key, value]) => {
        aliases[key] = {
          type: 'alias',
          path: value
        };
      });
      ruleDataClient = ruleDataService.initializeIndex({
        feature: _constants.SERVER_APP_ID,
        registrationContext: 'security',
        dataset: _server2.Dataset.alerts,
        componentTemplateRefs: [_assets.ECS_COMPONENT_TEMPLATE_NAME],
        componentTemplates: [{
          name: 'mappings',
          mappings: (0, _mapping_from_field_map.mappingFromFieldMap)({ ..._alerts.alertsFieldMap,
            ..._rules.rulesFieldMap,
            ..._cti.ctiFieldMap
          }, false)
        }],
        secondaryAlias: config.signalsIndex
      }); // Register rule types via rule-registry

      const createRuleOptions = {
        experimentalFeatures,
        logger,
        ml: plugins.ml,
        version: pluginContext.env.packageInfo.version
      };
      const securityRuleTypeWrapper = (0, _create_security_rule_type_wrapper.createSecurityRuleTypeWrapper)({
        lists: plugins.lists,
        logger: this.logger,
        config: this.config,
        ruleDataClient,
        eventLogService
      });
      plugins.alerting.registerType(securityRuleTypeWrapper((0, _rule_types.createEqlAlertType)(createRuleOptions)));
      plugins.alerting.registerType(securityRuleTypeWrapper((0, _rule_types.createIndicatorMatchAlertType)(createRuleOptions)));
      plugins.alerting.registerType(securityRuleTypeWrapper((0, _rule_types.createMlAlertType)(createRuleOptions)));
      plugins.alerting.registerType(securityRuleTypeWrapper((0, _rule_types.createQueryAlertType)(createRuleOptions)));
      plugins.alerting.registerType(securityRuleTypeWrapper((0, _rule_types.createThresholdAlertType)(createRuleOptions)));
    } // TODO We need to get the endpoint routes inside of initRoutes


    (0, _routes.initRoutes)(router, config, ((_plugins$encryptedSav = plugins.encryptedSavedObjects) === null || _plugins$encryptedSav === void 0 ? void 0 : _plugins$encryptedSav.canEncrypt) === true, plugins.security, this.telemetryEventsSender, plugins.ml, logger, isRuleRegistryEnabled);
    (0, _metadata2.registerEndpointRoutes)(router, endpointContext);
    (0, _limited_concurrency.registerLimitedConcurrencyRoutes)(core);
    (0, _resolver.registerResolverRoutes)(router);
    (0, _policy.registerPolicyRoutes)(router, endpointContext);
    (0, _trusted_apps.registerTrustedAppsRoutes)(router, endpointContext);
    (0, _actions.registerActionRoutes)(router, endpointContext);
    const racRuleTypes = [_constants.EQL_RULE_TYPE_ID, _constants.QUERY_RULE_TYPE_ID, _constants.INDICATOR_RULE_TYPE_ID, _constants.ML_RULE_TYPE_ID];
    const ruleTypes = [_constants.SIGNALS_ID, _constants.LEGACY_NOTIFICATIONS_ID, ...(isRuleRegistryEnabled ? racRuleTypes : [])];
    plugins.features.registerKibanaFeature((0, _features.getKibanaPrivilegesFeaturePrivileges)(ruleTypes)); // Continue to register legacy rules against alerting client exposed through rule-registry

    if (plugins.alerting != null) {
      const signalRuleType = (0, _signal_rule_alert_type.signalRulesAlertType)({
        logger,
        eventsTelemetry: this.telemetryEventsSender,
        version: pluginContext.env.packageInfo.version,
        ml: plugins.ml,
        lists: plugins.lists,
        config,
        experimentalFeatures,
        eventLogService
      });
      const ruleNotificationType = (0, _legacy_rules_notification_alert_type.legacyRulesNotificationAlertType)({
        logger
      });

      if ((0, _types.isAlertExecutor)(signalRuleType)) {
        plugins.alerting.registerType(signalRuleType);
      }

      if ((0, _legacy_types.legacyIsNotificationAlertExecutor)(ruleNotificationType)) {
        plugins.alerting.registerType(ruleNotificationType);
      }
    }

    const exceptionListsSetupEnabled = () => {
      return plugins.taskManager && plugins.lists;
    };

    if (exceptionListsSetupEnabled()) {
      this.lists = plugins.lists;
      this.manifestTask = new _artifacts.ManifestTask({
        endpointAppContext: endpointContext,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        taskManager: plugins.taskManager
      });
    }

    core.getStartServices().then(([_, depsStart]) => {
      var _depsStart$spaces, _depsStart$spaces$spa;

      appClientFactory.setup({
        getSpaceId: (_depsStart$spaces = depsStart.spaces) === null || _depsStart$spaces === void 0 ? void 0 : (_depsStart$spaces$spa = _depsStart$spaces.spacesService) === null || _depsStart$spaces$spa === void 0 ? void 0 : _depsStart$spaces$spa.getSpaceId,
        config
      });
      const securitySolutionSearchStrategy = (0, _security_solution.securitySolutionSearchStrategyProvider)(depsStart.data, endpointContext);
      plugins.data.search.registerSearchStrategy('securitySolutionSearchStrategy', securitySolutionSearchStrategy);
    });
    this.telemetryEventsSender.setup(this.telemetryReceiver, plugins.telemetry, plugins.taskManager, this.telemetryUsageCounter);
    this.checkMetadataTransformsTask = new _metadata.CheckMetadataTransformsTask({
      endpointAppContext: endpointContext,
      core,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      taskManager: plugins.taskManager
    });
    (0, _deprecation_privileges.registerPrivilegeDeprecations)({
      deprecationsService: core.deprecations,
      getKibanaRoles: (_plugins$security = plugins.security) === null || _plugins$security === void 0 ? void 0 : _plugins$security.privilegeDeprecationsService.getKibanaRoles,
      logger: this.logger.get('deprecations')
    });
    (0, _deprecations.registerRulePreviewPrivilegeDeprecations)({
      deprecationsService: core.deprecations,
      getKibanaRoles: (_plugins$security2 = plugins.security) === null || _plugins$security2 === void 0 ? void 0 : _plugins$security2.privilegeDeprecationsService.getKibanaRoles,
      packageInfo: this.pluginContext.env.packageInfo
    });
    return {};
  }

  start(core, plugins) {
    var _plugins$fleet, _plugins$fleet2, _plugins$fleet3, _plugins$fleet4, _plugins$fleet5, _plugins$fleet6, _plugins$fleet7, _this$checkMetadataTr;

    const {
      config,
      logger
    } = this;
    const savedObjectsClient = new _server.SavedObjectsClient(core.savedObjects.createInternalRepository());
    const registerIngestCallback = (_plugins$fleet = plugins.fleet) === null || _plugins$fleet === void 0 ? void 0 : _plugins$fleet.registerExternalCallback;
    let manifestManager;
    this.licensing$ = plugins.licensing.license$;

    if (this.lists && plugins.taskManager && plugins.fleet) {
      // Exceptions, Artifacts and Manifests start
      const taskManager = plugins.taskManager;
      const exceptionListClient = this.lists.getExceptionListClient(savedObjectsClient, 'kibana');
      const artifactClient = new _services.EndpointArtifactClient(plugins.fleet.createArtifactsClient('endpoint'));
      manifestManager = new _services.ManifestManager({
        savedObjectsClient,
        artifactClient,
        exceptionListClient,
        packagePolicyService: plugins.fleet.packagePolicyService,
        logger,
        cache: this.artifactsCache,
        experimentalFeatures: config.experimentalFeatures
      }); // Migrate artifacts to fleet and then start the minifest task after that is done

      plugins.fleet.fleetSetupCompleted().then(() => {
        (0, _migrate_artifacts_to_fleet.migrateArtifactsToFleet)(savedObjectsClient, artifactClient, logger).finally(() => {
          logger.info('Dependent plugin setup complete - Starting ManifestTask');

          if (this.manifestTask) {
            this.manifestTask.start({
              taskManager
            });
          } else {
            logger.error(new Error('User artifacts task not available.'));
          }
        });
      }); // License related start

      _license.licenseService.start(this.licensing$);

      this.policyWatcher = new _license_watch.PolicyWatcher(plugins.fleet.packagePolicyService, core.savedObjects, core.elasticsearch, logger);
      this.policyWatcher.start(_license.licenseService);
    } // eslint-disable-next-line @typescript-eslint/no-non-null-assertion


    const exceptionListClient = this.lists.getExceptionListClient(savedObjectsClient, 'kibana');
    this.endpointAppContextService.start({
      agentService: (_plugins$fleet2 = plugins.fleet) === null || _plugins$fleet2 === void 0 ? void 0 : _plugins$fleet2.agentService,
      packageService: (_plugins$fleet3 = plugins.fleet) === null || _plugins$fleet3 === void 0 ? void 0 : _plugins$fleet3.packageService,
      packagePolicyService: (_plugins$fleet4 = plugins.fleet) === null || _plugins$fleet4 === void 0 ? void 0 : _plugins$fleet4.packagePolicyService,
      agentPolicyService: (_plugins$fleet5 = plugins.fleet) === null || _plugins$fleet5 === void 0 ? void 0 : _plugins$fleet5.agentPolicyService,
      endpointMetadataService: new _metadata3.EndpointMetadataService(core.savedObjects, // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (_plugins$fleet6 = plugins.fleet) === null || _plugins$fleet6 === void 0 ? void 0 : _plugins$fleet6.agentService, // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (_plugins$fleet7 = plugins.fleet) === null || _plugins$fleet7 === void 0 ? void 0 : _plugins$fleet7.agentPolicyService, logger),
      security: plugins.security,
      alerting: plugins.alerting,
      config: this.config,
      cases: plugins.cases,
      logger,
      manifestManager,
      registerIngestCallback,
      licenseService: _license.licenseService,
      exceptionListsClient: exceptionListClient
    });
    this.telemetryReceiver.start(core, config.kibanaIndex, this.endpointAppContextService, exceptionListClient);
    this.telemetryEventsSender.start(plugins.telemetry, plugins.taskManager, this.telemetryReceiver);
    (_this$checkMetadataTr = this.checkMetadataTransformsTask) === null || _this$checkMetadataTr === void 0 ? void 0 : _this$checkMetadataTr.start({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      taskManager: plugins.taskManager
    });
    return {};
  }

  stop() {
    var _this$policyWatcher;

    this.logger.debug('Stopping plugin');
    this.telemetryEventsSender.stop();
    this.endpointAppContextService.stop();
    (_this$policyWatcher = this.policyWatcher) === null || _this$policyWatcher === void 0 ? void 0 : _this$policyWatcher.stop();

    _license.licenseService.stop();
  }

}

exports.Plugin = Plugin;