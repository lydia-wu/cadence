"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnnotationRequestParams = getAnnotationRequestParams;

var _build_request_body = require("./build_request_body");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function getAnnotationRequestParams(req, panel, annotation, {
  esShardTimeout,
  esQueryConfig,
  capabilities,
  uiSettings,
  cachedIndexPatternFetcher
}) {
  var _annotationIndex$inde, _annotationIndex$inde2;

  const annotationIndex = await cachedIndexPatternFetcher(annotation.index_pattern);
  const request = await (0, _build_request_body.buildAnnotationRequest)({
    req,
    panel,
    annotation,
    esQueryConfig,
    annotationIndex,
    capabilities,
    uiSettings
  });
  return {
    index: annotationIndex.indexPatternString,
    body: { ...request,
      runtime_mappings: (_annotationIndex$inde = (_annotationIndex$inde2 = annotationIndex.indexPattern) === null || _annotationIndex$inde2 === void 0 ? void 0 : _annotationIndex$inde2.getComputedFields().runtimeFields) !== null && _annotationIndex$inde !== void 0 ? _annotationIndex$inde : {},
      timeout: esShardTimeout > 0 ? `${esShardTimeout}ms` : undefined
    }
  };
}