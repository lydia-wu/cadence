"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseNdjsonStrings = exports.filterExportedCounts = exports.filterExceptions = exports.createLimitStream = void 0;

var _stream = require("stream");

var _fp = require("lodash/fp");

var _utils = require("@kbn/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const parseNdjsonStrings = () => {
  return (0, _utils.createMapStream)(ndJsonStr => {
    if ((0, _fp.isString)(ndJsonStr) && ndJsonStr.trim() !== '') {
      try {
        return JSON.parse(ndJsonStr);
      } catch (err) {
        return err;
      }
    }
  });
};

exports.parseNdjsonStrings = parseNdjsonStrings;

const filterExportedCounts = () => {
  return (0, _utils.createFilterStream)(obj => obj != null && !(0, _fp.has)('exported_count', obj));
};

exports.filterExportedCounts = filterExportedCounts;

const filterExceptions = () => {
  return (0, _utils.createFilterStream)(obj => obj != null && !(0, _fp.has)('list_id', obj));
}; // Adaptation from: saved_objects/import/create_limit_stream.ts


exports.filterExceptions = filterExceptions;

const createLimitStream = limit => {
  let counter = 0;
  return new _stream.Transform({
    objectMode: true,

    async transform(obj, _, done) {
      if (counter >= limit) {
        return done(new Error(`Can't import more than ${limit} rules`));
      }

      counter++;
      done(undefined, obj);
    }

  });
};

exports.createLimitStream = createLimitStream;