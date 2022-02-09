"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCasesClient = exports.CasesClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _client = require("./cases/client");

var _client2 = require("./attachments/client");

var _client3 = require("./user_actions/client");

var _client_internal = require("./client_internal");

var _client4 = require("./sub_cases/client");

var _common = require("../../common");

var _client5 = require("./configure/client");

var _client6 = require("./stats/client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Client wrapper that contains accessor methods for individual entities within the cases system.
 */


class CasesClient {
  constructor(args) {
    (0, _defineProperty2.default)(this, "_casesClientInternal", void 0);
    (0, _defineProperty2.default)(this, "_cases", void 0);
    (0, _defineProperty2.default)(this, "_attachments", void 0);
    (0, _defineProperty2.default)(this, "_userActions", void 0);
    (0, _defineProperty2.default)(this, "_subCases", void 0);
    (0, _defineProperty2.default)(this, "_configure", void 0);
    (0, _defineProperty2.default)(this, "_stats", void 0);
    this._casesClientInternal = (0, _client_internal.createCasesClientInternal)(args);
    this._cases = (0, _client.createCasesSubClient)(args, this, this._casesClientInternal);
    this._attachments = (0, _client2.createAttachmentsSubClient)(args, this, this._casesClientInternal);
    this._userActions = (0, _client3.createUserActionsSubClient)(args);
    this._subCases = (0, _client4.createSubCasesClient)(args, this._casesClientInternal);
    this._configure = (0, _client5.createConfigurationSubClient)(args, this._casesClientInternal);
    this._stats = (0, _client6.createStatsSubClient)(args);
  }
  /**
   * Retrieves an interface for interacting with cases entities.
   */


  get cases() {
    return this._cases;
  }
  /**
   * Retrieves an interface for interacting with attachments (comments) entities.
   */


  get attachments() {
    return this._attachments;
  }
  /**
   * Retrieves an interface for interacting with the user actions associated with the plugin entities.
   */


  get userActions() {
    return this._userActions;
  }
  /**
   * Retrieves an interface for interacting with the case as a connector entities.
   *
   * Currently this functionality is disabled and will throw an error if this function is called.
   */


  get subCases() {
    if (!_common.ENABLE_CASE_CONNECTOR) {
      throw new Error('The case connector feature is disabled');
    }

    return this._subCases;
  }
  /**
   * Retrieves an interface for interacting with the configuration of external connectors for the plugin entities.
   */


  get configure() {
    return this._configure;
  }
  /**
   * Retrieves an interface for retrieving statistics related to the cases entities.
   */


  get stats() {
    return this._stats;
  }

}
/**
 * Creates a {@link CasesClient} for interacting with the cases entities
 *
 * @param args arguments for initializing the cases client
 * @returns a {@link CasesClient}
 *
 * @ignore
 */


exports.CasesClient = CasesClient;

const createCasesClient = args => {
  return new CasesClient(args);
};

exports.createCasesClient = createCasesClient;