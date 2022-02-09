"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mappingFromFieldMap = mappingFromFieldMap;

var _saferLodashSet = require("@elastic/safer-lodash-set");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function mappingFromFieldMap(fieldMap, dynamic) {
  const mappings = {
    dynamic,
    properties: {}
  };
  const fields = Object.keys(fieldMap).map(key => {
    const field = fieldMap[key];
    return {
      name: key,
      ...field
    };
  });
  fields.forEach(field => {
    const {
      name,
      required,
      array,
      ...rest
    } = field;
    (0, _saferLodashSet.set)(mappings.properties, field.name.split('.').join('.properties.'), rest);
  });
  return mappings;
}