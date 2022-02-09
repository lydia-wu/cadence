"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureClient = void 0;

var _elasticsearch = require("@elastic/elasticsearch");

var _client_config = require("./client_config");

var _log_query_and_deprecation = require("./log_query_and_deprecation");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const noop = () => undefined;

const configureClient = (config, {
  logger,
  type,
  scoped = false,
  getExecutionContext = noop
}) => {
  const clientOptions = (0, _client_config.parseClientOptions)(config, scoped);

  class KibanaTransport extends _elasticsearch.Transport {
    request(params, options) {
      const opts = options || {};
      const opaqueId = getExecutionContext();

      if (opaqueId && !opts.opaqueId) {
        // rewrites headers['x-opaque-id'] if it presents
        opts.opaqueId = opaqueId;
      }

      return super.request(params, opts);
    }

  }

  const client = new _elasticsearch.Client({ ...clientOptions,
    Transport: KibanaTransport
  }); // --------------------------------------------------------------------------------- //
  // Hack to disable the "Product check" only in the scoped clients while we           //
  // come up with a better approach in https://github.com/elastic/kibana/issues/110675 //

  if (scoped) skipProductCheck(client); // --------------------------------------------------------------------------------- //

  (0, _log_query_and_deprecation.instrumentEsQueryAndDeprecationLogger)({
    logger,
    client,
    type
  });
  return client;
};
/**
 * Hack to skip the Product Check performed by the Elasticsearch-js client.
 * We noticed that the scoped clients are always performing this check because
 * of the way we initialize the clients. We'll discuss changing this in the issue
 * https://github.com/elastic/kibana/issues/110675. In the meanwhile, let's skip
 * it for the scoped clients.
 *
 * The hack is copied from the test/utils in the elasticsearch-js repo
 * (https://github.com/elastic/elasticsearch-js/blob/master/test/utils/index.js#L45-L56)
 */


exports.configureClient = configureClient;

function skipProductCheck(client) {
  const tSymbol = Object.getOwnPropertySymbols(client.transport || client).filter(symbol => symbol.description === 'product check')[0]; // @ts-expect-error `tSymbol` is missing in the index signature of Transport

  (client.transport || client)[tSymbol] = 2;
}