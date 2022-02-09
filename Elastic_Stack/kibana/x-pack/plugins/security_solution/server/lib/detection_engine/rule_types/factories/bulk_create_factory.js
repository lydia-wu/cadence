"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkCreateFactory = void 0;

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _perf_hooks = require("perf_hooks");

var _lodash = require("lodash");

var _utils = require("../../signals/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bulkCreateFactory = (logger, alertWithPersistence, buildRuleMessage, refreshForBulkCreate) => async wrappedDocs => {
  if (wrappedDocs.length === 0) {
    return {
      errors: [],
      success: true,
      bulkCreateDuration: '0',
      createdItemsCount: 0,
      createdItems: []
    };
  }

  const start = _perf_hooks.performance.now();

  const response = await alertWithPersistence(wrappedDocs.map(doc => {
    var _ref, _doc$fields;

    return {
      id: doc._id,
      fields: (_ref = (_doc$fields = doc.fields) !== null && _doc$fields !== void 0 ? _doc$fields : doc._source) !== null && _ref !== void 0 ? _ref : {}
    };
  }), refreshForBulkCreate);

  const end = _perf_hooks.performance.now();

  logger.debug(buildRuleMessage(`individual bulk process time took: ${(0, _utils.makeFloatString)(end - start)} milliseconds`));

  if (response == null) {
    return {
      errors: ['alertWithPersistence returned undefined response. Alerts as Data write flag may be disabled.'],
      success: false,
      bulkCreateDuration: (0, _utils.makeFloatString)(end - start),
      createdItemsCount: 0,
      createdItems: []
    };
  }

  logger.debug(buildRuleMessage(`took property says bulk took: ${response.body.took} milliseconds`));
  const createdItems = wrappedDocs.map((doc, index) => {
    var _responseIndex$_id, _responseIndex$_index, _responseIndex$_id2;

    const responseIndex = response.body.items[index].index;
    return {
      _id: (_responseIndex$_id = responseIndex === null || responseIndex === void 0 ? void 0 : responseIndex._id) !== null && _responseIndex$_id !== void 0 ? _responseIndex$_id : '',
      _index: (_responseIndex$_index = responseIndex === null || responseIndex === void 0 ? void 0 : responseIndex._index) !== null && _responseIndex$_index !== void 0 ? _responseIndex$_index : '',
      [_ruleDataUtils.ALERT_INSTANCE_ID]: (_responseIndex$_id2 = responseIndex === null || responseIndex === void 0 ? void 0 : responseIndex._id) !== null && _responseIndex$_id2 !== void 0 ? _responseIndex$_id2 : '',
      ...doc._source
    };
  }).filter((_, index) => {
    var _response$body$items$;

    return ((_response$body$items$ = response.body.items[index].index) === null || _response$body$items$ === void 0 ? void 0 : _response$body$items$.status) === 201;
  });
  const createdItemsCount = createdItems.length;
  const duplicateSignalsCount = (0, _lodash.countBy)(response.body.items, 'create.status')['409'];
  const errorCountByMessage = (0, _utils.errorAggregator)(response.body, [409]);
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
      createdItemsCount: createdItems.length,
      createdItems
    };
  } else {
    return {
      errors: [],
      success: true,
      bulkCreateDuration: (0, _utils.makeFloatString)(end - start),
      createdItemsCount: createdItems.length,
      createdItems
    };
  }
};

exports.bulkCreateFactory = bulkCreateFactory;