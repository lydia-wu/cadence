"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestContextFactory = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _server = require("../../lists/server");

var _constants = require("../common/constants");

var _client = require("./client");

var _rule_execution_log_client = require("./lib/detection_engine/rule_execution_log/rule_execution_log_client");

var _common = require("./lib/timeline/utils/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class RequestContextFactory {
  constructor(options) {
    (0, _defineProperty2.default)(this, "appClientFactory", void 0);
    this.options = options;
    this.appClientFactory = new _client.AppClientFactory();
  }

  async create(context, request) {
    var _startPlugins$spaces, _startPlugins$spaces$;

    const {
      options,
      appClientFactory
    } = this;
    const {
      config,
      core,
      plugins
    } = options;
    const {
      lists,
      ruleRegistry,
      security
    } = plugins;
    const [, startPlugins] = await core.getStartServices();
    const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
    appClientFactory.setup({
      getSpaceId: (_startPlugins$spaces = startPlugins.spaces) === null || _startPlugins$spaces === void 0 ? void 0 : (_startPlugins$spaces$ = _startPlugins$spaces.spacesService) === null || _startPlugins$spaces$ === void 0 ? void 0 : _startPlugins$spaces$.getSpaceId,
      config
    });
    return {
      core: context.core,
      getConfig: () => config,
      getFrameworkRequest: () => frameworkRequest,
      getAppClient: () => appClientFactory.create(request),
      getSpaceId: () => {
        var _startPlugins$spaces2, _startPlugins$spaces3;

        return ((_startPlugins$spaces2 = startPlugins.spaces) === null || _startPlugins$spaces2 === void 0 ? void 0 : (_startPlugins$spaces3 = _startPlugins$spaces2.spacesService) === null || _startPlugins$spaces3 === void 0 ? void 0 : _startPlugins$spaces3.getSpaceId(request)) || _constants.DEFAULT_SPACE_ID;
      },
      getRuleDataService: () => ruleRegistry.ruleDataService,
      getExecutionLogClient: () => new _rule_execution_log_client.RuleExecutionLogClient({
        savedObjectsClient: context.core.savedObjects.client,
        eventLogService: plugins.eventLog,
        underlyingClient: config.ruleExecutionLog.underlyingClient
      }),
      getExceptionListClient: () => {
        var _security$authc$getCu;

        if (!lists) {
          return null;
        }

        const username = (security === null || security === void 0 ? void 0 : (_security$authc$getCu = security.authc.getCurrentUser(request)) === null || _security$authc$getCu === void 0 ? void 0 : _security$authc$getCu.username) || 'elastic';
        return new _server.ExceptionListClient({
          savedObjectsClient: context.core.savedObjects.client,
          user: username
        });
      }
    };
  }

}

exports.RequestContextFactory = RequestContextFactory;