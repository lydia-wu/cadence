"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HostIsolationExceptionGenerator = void 0;

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

var _base_data_generator = require("./base_data_generator");

var _create_exception_list_item_schema = require("../../../../lists/common/schemas/request/create_exception_list_item_schema.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class HostIsolationExceptionGenerator extends _base_data_generator.BaseDataGenerator {
  generate() {
    const overrides = {
      name: `generator exception ${this.randomString(5)}`,
      list_id: _securitysolutionListConstants.ENDPOINT_HOST_ISOLATION_EXCEPTIONS_LIST_ID,
      item_id: `generator_endpoint_host_isolation_exception_${this.randomUUID()}`,
      os_types: ['windows', 'linux', 'macos'],
      tags: ['policy:all'],
      namespace_type: 'agnostic',
      meta: undefined,
      description: `Description ${this.randomString(5)}`,
      entries: [{
        field: 'destination.ip',
        operator: 'included',
        type: 'match',
        value: this.randomIP()
      }]
    };
    return Object.assign((0, _create_exception_list_item_schema.getCreateExceptionListItemSchemaMock)(), overrides);
  }

}

exports.HostIsolationExceptionGenerator = HostIsolationExceptionGenerator;