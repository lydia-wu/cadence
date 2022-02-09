"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doesLogsEndpointActionsIndexExist = exports.doLogsEndpointActionDsExists = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const doLogsEndpointActionDsExists = async ({
  context,
  logger,
  dataStreamName
}) => {
  try {
    const esClient = context.core.elasticsearch.client.asInternalUser;
    const doesIndexTemplateExist = await esClient.indices.existsIndexTemplate({
      name: dataStreamName
    });
    return doesIndexTemplateExist.statusCode === 404 ? false : true;
  } catch (error) {
    var _error$type;

    const errorType = (_error$type = error === null || error === void 0 ? void 0 : error.type) !== null && _error$type !== void 0 ? _error$type : '';

    if (errorType !== 'resource_not_found_exception') {
      logger.error(error);
      throw error;
    }

    return false;
  }
};

exports.doLogsEndpointActionDsExists = doLogsEndpointActionDsExists;

const doesLogsEndpointActionsIndexExist = async ({
  context,
  logger,
  indexName
}) => {
  try {
    const esClient = context.core.elasticsearch.client.asInternalUser;
    const doesIndexExist = await esClient.indices.exists({
      index: indexName
    });
    return doesIndexExist.statusCode === 404 ? false : true;
  } catch (error) {
    var _error$type2;

    const errorType = (_error$type2 = error === null || error === void 0 ? void 0 : error.type) !== null && _error$type2 !== void 0 ? _error$type2 : '';

    if (errorType !== 'index_not_found_exception') {
      logger.error(error);
      throw error;
    }

    return false;
  }
};

exports.doesLogsEndpointActionsIndexExist = doesLogsEndpointActionsIndexExist;