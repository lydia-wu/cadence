"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkCreateFactory = void 0;

var _perf_hooks = require("perf_hooks");

var _lodash = require("lodash");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bulkCreateFactory = (logger, esClient, buildRuleMessage, refreshForBulkCreate) => async wrappedDocs => {
  if (wrappedDocs.length === 0) {
    return {
      errors: [],
      success: true,
      bulkCreateDuration: '0',
      createdItemsCount: 0,
      createdItems: []
    };
  }

  const bulkBody = wrappedDocs.flatMap(wrappedDoc => [{
    create: {
      _index: wrappedDoc._index,
      _id: wrappedDoc._id
    }
  }, wrappedDoc._source]);

  const start = _perf_hooks.performance.now();

  const {
    body: response
  } = await esClient.bulk({
    refresh: refreshForBulkCreate,
    body: bulkBody
  });

  const end = _perf_hooks.performance.now();

  logger.debug(buildRuleMessage(`individual bulk process time took: ${(0, _utils.makeFloatString)(end - start)} milliseconds`));
  logger.debug(buildRuleMessage(`took property says bulk took: ${response.took} milliseconds`));
  const createdItems = wrappedDocs.map((doc, index) => {
    var _response$items$index, _response$items$index2, _response$items$index3, _response$items$index4;

    return {
      _id: (_response$items$index = (_response$items$index2 = response.items[index].create) === null || _response$items$index2 === void 0 ? void 0 : _response$items$index2._id) !== null && _response$items$index !== void 0 ? _response$items$index : '',
      _index: (_response$items$index3 = (_response$items$index4 = response.items[index].create) === null || _response$items$index4 === void 0 ? void 0 : _response$items$index4._index) !== null && _response$items$index3 !== void 0 ? _response$items$index3 : '',
      ...doc._source
    };
  }).filter((_, index) => (0, _lodash.get)(response.items[index], 'create.status') === 201);
  const createdItemsCount = createdItems.length;
  const duplicateSignalsCount = (0, _lodash.countBy)(response.items, 'create.status')['409'];
  const errorCountByMessage = (0, _utils.errorAggregator)(response, [409]);
  logger.debug(buildRuleMessage(`bulk created ${createdItemsCount} signals`));

  if (duplicateSignalsCount > 0) {
    logger.debug(buildRuleMessage(`ignored ${duplicateSignalsCount} duplicate signals`));
  }

  if (!(0, _lodash.isEmpty)(errorCountByMessage)) {
    logger.error(buildRuleMessage(`[-] bulkResponse had errors with responses of: ${JSON.stringify(errorCountByMessage)}`));
    return {
      errors: Object.keys(errorCountByMessage),
      success: false,
      bulkCreateDuration: (0, _utils.makeFloatString)(end - start),
      createdItemsCount,
      createdItems
    };
  } else {
    return {
      errors: [],
      success: true,
      bulkCreateDuration: (0, _utils.makeFloatString)(end - start),
      createdItemsCount,
      createdItems
    };
  }
};

exports.bulkCreateFactory = bulkCreateFactory;