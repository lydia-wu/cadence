"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrintLayout = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _constants = require("../../../common/constants");

var _ = require("./");

var _layout = require("./layout");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class PrintLayout extends _layout.Layout {
  constructor(captureConfig) {
    super(_constants.LAYOUT_TYPES.PRINT);
    (0, _defineProperty2.default)(this, "selectors", { ...(0, _.getDefaultLayoutSelectors)(),
      screenshot: '[data-shared-item]' // override '[data-shared-items-container]'

    });
    (0, _defineProperty2.default)(this, "groupCount", 2);
    (0, _defineProperty2.default)(this, "captureConfig", void 0);
    (0, _defineProperty2.default)(this, "viewport", _constants.DEFAULT_VIEWPORT);
    this.captureConfig = captureConfig;
  }

  getCssOverridesPath() {
    return undefined;
  }

  getBrowserViewport() {
    return this.viewport;
  }

  getBrowserZoom() {
    return this.captureConfig.zoom;
  }

  getViewport(itemsCount) {
    return {
      zoom: this.captureConfig.zoom,
      width: this.viewport.width,
      height: this.viewport.height * itemsCount
    };
  }

  getPdfImageSize() {
    return {
      width: 500
    };
  }

  getPdfPageOrientation() {
    return 'portrait';
  }

  getPdfPageSize() {
    return 'A4';
  }

}

exports.PrintLayout = PrintLayout;