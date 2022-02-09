"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisualizeLocatorDefinition = exports.VISUALIZE_APP_LOCATOR = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _queryString = require("query-string");

var _risonNode = _interopRequireDefault(require("rison-node"));

var _common = require("../../data/common");

var _common2 = require("../../kibana_utils/common");

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const removeEmptyKeys = o => (0, _lodash.omitBy)(o, v => v == null); // eslint-disable-next-line @typescript-eslint/consistent-type-definitions


const VISUALIZE_APP_LOCATOR = 'VISUALIZE_APP_LOCATOR';
exports.VISUALIZE_APP_LOCATOR = VISUALIZE_APP_LOCATOR;

class VisualizeLocatorDefinition {
  constructor() {
    (0, _defineProperty2.default)(this, "id", VISUALIZE_APP_LOCATOR);
  }

  async getLocation({
    visId,
    timeRange,
    filters,
    refreshInterval,
    linked,
    uiState,
    query,
    vis,
    savedSearchId,
    indexPattern
  }) {
    let path = visId ? `#${_constants.VisualizeConstants.EDIT_PATH}/${visId}` : `#${_constants.VisualizeConstants.CREATE_PATH}`;
    const urlState = {
      [_constants.GLOBAL_STATE_STORAGE_KEY]: _risonNode.default.encode(removeEmptyKeys({
        time: timeRange,
        filters: filters === null || filters === void 0 ? void 0 : filters.filter(f => (0, _common.isFilterPinned)(f)),
        refreshInterval
      })),
      [_constants.STATE_STORAGE_KEY]: _risonNode.default.encode(removeEmptyKeys({
        linked,
        filters: filters === null || filters === void 0 ? void 0 : filters.filter(f => !(0, _common.isFilterPinned)(f)),
        uiState,
        query,
        vis
      }))
    };
    path += `?${(0, _queryString.stringify)(_common2.url.encodeQuery(urlState), {
      encode: false,
      sort: false
    })}`;
    const otherParams = (0, _queryString.stringify)({
      type: vis === null || vis === void 0 ? void 0 : vis.type,
      savedSearchId,
      indexPattern
    });
    if (otherParams) path += `&${otherParams}`;
    return {
      app: _constants.VisualizeConstants.APP_ID,
      path,
      state: {}
    };
  }

}

exports.VisualizeLocatorDefinition = VisualizeLocatorDefinition;