"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventFilterGenerator = void 0;

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

var _base_data_generator = require("./base_data_generator");

var _create_exception_list_item_schema = require("../../../../lists/common/schemas/request/create_exception_list_item_schema.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class EventFilterGenerator extends _base_data_generator.BaseDataGenerator {
  generate() {
    const overrides = {
      name: `generator event ${this.randomString(5)}`,
      list_id: _securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_ID,
      item_id: `generator_endpoint_event_filter_${this.randomUUID()}`,
      os_types: [this.randomOSFamily()],
      tags: ['policy:all'],
      namespace_type: 'agnostic',
      meta: undefined
    };
    return Object.assign((0, _create_exception_list_item_schema.getCreateExceptionListItemSchemaMock)(), overrides);
  }

}

exports.EventFilterGenerator = EventFilterGenerator;