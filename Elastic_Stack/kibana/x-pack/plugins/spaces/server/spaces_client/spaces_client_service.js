"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpacesClientService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _spaces_client = require("./spaces_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class SpacesClientService {
  constructor(debugLogger) {
    (0, _defineProperty2.default)(this, "repositoryFactory", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "clientWrapper", void 0);
    this.debugLogger = debugLogger;
  }

  setup({
    config$
  }) {
    config$.subscribe(nextConfig => {
      this.config = nextConfig;
    });
    return {
      setClientRepositoryFactory: repositoryFactory => {
        if (this.repositoryFactory) {
          throw new Error(`Repository factory has already been set`);
        }

        this.repositoryFactory = repositoryFactory;
      },
      registerClientWrapper: wrapper => {
        if (this.clientWrapper) {
          throw new Error(`Client wrapper has already been set`);
        }

        this.clientWrapper = wrapper;
      }
    };
  }

  start(coreStart) {
    if (!this.repositoryFactory) {
      this.repositoryFactory = (request, savedObjectsStart) => savedObjectsStart.createScopedRepository(request, ['space']);
    }

    return {
      createSpacesClient: request => {
        if (!this.config) {
          throw new Error('Initialization error: spaces config is not available');
        }

        const baseClient = new _spaces_client.SpacesClient(this.debugLogger, this.config, this.repositoryFactory(request, coreStart.savedObjects));

        if (this.clientWrapper) {
          return this.clientWrapper(request, baseClient);
        }

        return baseClient;
      }
    };
  }

}

exports.SpacesClientService = SpacesClientService;