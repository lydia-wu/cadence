"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilter = exports.findRules = void 0;

var _constants = require("../../../../common/constants");

var _utils = require("../signals/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getFilter = (filter, isRuleRegistryEnabled = false) => {
  const alertTypeFilter = isRuleRegistryEnabled ? `(${Object.values(_utils.ruleTypeMappings).map(type => type !== _constants.SIGNALS_ID ? `alert.attributes.alertTypeId: ${type}` : undefined).filter(type => type != null).join(' OR ')})` : `alert.attributes.alertTypeId: ${_constants.SIGNALS_ID}`;

  if (filter == null) {
    return alertTypeFilter;
  } else {
    return `${alertTypeFilter} AND ${filter}`;
  }
};

exports.getFilter = getFilter;

const findRules = ({
  rulesClient,
  perPage,
  page,
  fields,
  filter,
  sortField,
  sortOrder,
  isRuleRegistryEnabled
}) => {
  return rulesClient.find({
    options: {
      fields,
      page,
      perPage,
      filter: getFilter(filter, isRuleRegistryEnabled),
      sortOrder,
      sortField
    }
  });
};

exports.findRules = findRules;