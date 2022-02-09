"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flattenWithPrefix = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const flattenWithPrefix = (prefix, maybeObj) => {
  if (maybeObj != null && (0, _lodash.isPlainObject)(maybeObj)) {
    return Object.keys(maybeObj).reduce((acc, key) => {
      return { ...acc,
        ...flattenWithPrefix(`${prefix}.${key}`, maybeObj[key])
      };
    }, {});
  } else {
    return {
      [prefix]: maybeObj
    };
  }
};

exports.flattenWithPrefix = flattenWithPrefix;