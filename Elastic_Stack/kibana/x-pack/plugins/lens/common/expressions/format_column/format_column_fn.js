"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatColumnFn = void 0;

var _supported_formats = require("./supported_formats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isNestedFormat(params) {
  var _params$params; // if there is a nested params object with an id, it's a nested format


  return !!(params !== null && params !== void 0 && (_params$params = params.params) !== null && _params$params !== void 0 && _params$params.id);
}

function withParams(col, params) {
  return { ...col,
    meta: { ...col.meta,
      params
    }
  };
}

const formatColumnFn = (input, {
  format,
  columnId,
  decimals,
  parentFormat
}) => ({ ...input,
  columns: input.columns.map(col => {
    if (col.id === columnId) {
      var _parsedParentFormat$p;

      if (!parentFormat) {
        if (_supported_formats.supportedFormats[format]) {
          return withParams(col, {
            id: format,
            params: {
              pattern: _supported_formats.supportedFormats[format].decimalsToPattern(decimals)
            }
          });
        } else if (format) {
          return withParams(col, {
            id: format
          });
        } else {
          return col;
        }
      }

      const parsedParentFormat = JSON.parse(parentFormat);
      const parentFormatId = parsedParentFormat.id;
      const parentFormatParams = (_parsedParentFormat$p = parsedParentFormat.params) !== null && _parsedParentFormat$p !== void 0 ? _parsedParentFormat$p : {};

      if (!parentFormatId) {
        return col;
      }

      if (format && _supported_formats.supportedFormats[format]) {
        return withParams(col, {
          id: parentFormatId,
          params: {
            id: format,
            params: {
              pattern: _supported_formats.supportedFormats[format].decimalsToPattern(decimals)
            },
            ...parentFormatParams
          }
        });
      }

      if (parentFormatParams) {
        var _col$meta$params, _col$meta$params2, _col$meta$params3, _col$meta$params4; // if original format is already a nested one, we are just replacing the wrapper params
        // otherwise wrapping it inside parentFormatId/parentFormatParams


        const isNested = isNestedFormat(col.meta.params);
        const innerParams = isNested ? (_col$meta$params = col.meta.params) === null || _col$meta$params === void 0 ? void 0 : _col$meta$params.params : {
          id: (_col$meta$params2 = col.meta.params) === null || _col$meta$params2 === void 0 ? void 0 : _col$meta$params2.id,
          params: (_col$meta$params3 = col.meta.params) === null || _col$meta$params3 === void 0 ? void 0 : _col$meta$params3.params
        };
        const formatId = isNested ? (_col$meta$params4 = col.meta.params) === null || _col$meta$params4 === void 0 ? void 0 : _col$meta$params4.id : parentFormatId;
        return withParams(col, { ...col.meta.params,
          id: formatId,
          params: { ...innerParams,
            ...parentFormatParams
          }
        });
      }
    }

    return col;
  })
});

exports.formatColumnFn = formatColumnFn;