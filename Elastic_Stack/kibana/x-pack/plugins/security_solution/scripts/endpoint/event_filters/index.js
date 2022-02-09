"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cli = void 0;

var _devUtils = require("@kbn/dev-utils");

var _test = require("@kbn/test");

var _bluebird = _interopRequireDefault(require("bluebird"));

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

var _event_filter_generator = require("../../../common/endpoint/data_generators/event_filter_generator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const cli = () => {
  (0, _devUtils.run)(async options => {
    try {
      await createEventFilters(options);
      options.log.success(`${options.flags.count} endpoint event filters created`);
    } catch (e) {
      options.log.error(e);
      throw (0, _devUtils.createFailError)(e.message);
    }
  }, {
    description: 'Load Endpoint Event Filters',
    flags: {
      string: ['kibana'],
      default: {
        count: 10,
        kibana: 'http://elastic:changeme@localhost:5601'
      },
      help: `
        --count            Number of event filters to create. Default: 10
        --kibana           The URL to kibana including credentials. Default: http://elastic:changeme@localhost:5601
      `
    }
  });
};

exports.cli = cli;

class EventFilterDataLoaderError extends Error {
  constructor(message, meta) {
    super(message);
    this.meta = meta;
  }

}

const handleThrowAxiosHttpError = err => {
  let message = err.message;

  if (err.response) {
    var _err$response$data$me;

    message = `[${err.response.status}] ${(_err$response$data$me = err.response.data.message) !== null && _err$response$data$me !== void 0 ? _err$response$data$me : err.message} [ ${String(err.response.config.method).toUpperCase()} ${err.response.config.url} ]`;
  }

  throw new EventFilterDataLoaderError(message, err.toJSON());
};

const createEventFilters = async ({
  flags,
  log
}) => {
  const eventGenerator = new _event_filter_generator.EventFilterGenerator();
  const kbn = new _test.KbnClient({
    log,
    url: flags.kibana
  });
  await ensureCreateEndpointEventFiltersList(kbn);
  await _bluebird.default.map(Array.from({
    length: flags.count
  }), () => kbn.request({
    method: 'POST',
    path: _securitysolutionListConstants.EXCEPTION_LIST_ITEM_URL,
    body: eventGenerator.generate()
  }).catch(e => handleThrowAxiosHttpError(e)), {
    concurrency: 10
  });
};

const ensureCreateEndpointEventFiltersList = async kbn => {
  const newListDefinition = {
    description: _securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_DESCRIPTION,
    list_id: _securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_ID,
    meta: undefined,
    name: _securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_NAME,
    os_types: [],
    tags: [],
    type: 'endpoint',
    namespace_type: 'agnostic'
  };
  await kbn.request({
    method: 'POST',
    path: _securitysolutionListConstants.EXCEPTION_LIST_URL,
    body: newListDefinition
  }).catch(e => {
    // Ignore if list was already created
    if (e.response.status !== 409) {
      handleThrowAxiosHttpError(e);
    }
  });
};