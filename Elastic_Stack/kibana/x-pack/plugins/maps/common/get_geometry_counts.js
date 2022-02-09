"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.countVectorShapeTypes = countVectorShapeTypes;

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function countVectorShapeTypes(features) {
  const vectorShapeTypeCounts = {
    [_constants.VECTOR_SHAPE_TYPE.POINT]: 0,
    [_constants.VECTOR_SHAPE_TYPE.LINE]: 0,
    [_constants.VECTOR_SHAPE_TYPE.POLYGON]: 0
  };

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];

    if (feature.geometry.type === _constants.GEO_JSON_TYPE.POINT || feature.geometry.type === _constants.GEO_JSON_TYPE.MULTI_POINT) {
      vectorShapeTypeCounts[_constants.VECTOR_SHAPE_TYPE.POINT] += 1;
    } else if (feature.geometry.type === _constants.GEO_JSON_TYPE.LINE_STRING || feature.geometry.type === _constants.GEO_JSON_TYPE.MULTI_LINE_STRING) {
      vectorShapeTypeCounts[_constants.VECTOR_SHAPE_TYPE.LINE] += 1;
    } else if (feature.geometry.type === _constants.GEO_JSON_TYPE.POLYGON || feature.geometry.type === _constants.GEO_JSON_TYPE.MULTI_POLYGON) {
      vectorShapeTypeCounts[_constants.VECTOR_SHAPE_TYPE.POLYGON] += 1;
    }
  }

  return vectorShapeTypeCounts;
}