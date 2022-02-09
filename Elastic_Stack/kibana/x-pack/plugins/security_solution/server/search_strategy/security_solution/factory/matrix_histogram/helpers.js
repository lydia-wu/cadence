"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGenericData = exports.getEntitiesParser = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getGenericData = (data, keyBucket) => {
  let result = [];
  data.forEach(bucketData => {
    const group = (0, _fp.get)('key', bucketData);
    const histData = (0, _fp.getOr)([], keyBucket, bucketData).map( // eslint-disable-next-line @typescript-eslint/naming-convention
    ({
      key,
      doc_count
    }) => ({
      x: key,
      y: doc_count,
      g: group
    }));
    result = [...result, ...histData];
  });
  return result;
};

exports.getGenericData = getGenericData;

const getEntitiesParser = (data, keyBucket) => {
  let result = [];
  data.forEach(bucketData => {
    const successValue = (0, _fp.get)('success.value', bucketData);
    const failureValue = (0, _fp.get)('failure.value', bucketData);
    const key = (0, _fp.get)('key', bucketData);
    const histDataSuccess = {
      x: key,
      y: successValue,
      g: 'success'
    };
    const histDataFailure = {
      x: key,
      y: failureValue,
      g: 'failure'
    };
    result = [...result, histDataFailure, histDataSuccess];
  });
  return result;
};

exports.getEntitiesParser = getEntitiesParser;