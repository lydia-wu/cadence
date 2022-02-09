"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasLayout = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ = require("./");

var _layout = require("./layout");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// FIXME - should use zoom from capture config


const ZOOM = 2;
/*
 * This class provides a Layout definition. The PdfMaker class uses this to
 * define a document layout that includes no margins or branding or added logos.
 * The single image that was captured should be the only structural part of the
 * PDF document definition
 */

class CanvasLayout extends _layout.Layout {
  constructor(size) {
    super(_.LayoutTypes.CANVAS);
    (0, _defineProperty2.default)(this, "selectors", (0, _.getDefaultLayoutSelectors)());
    (0, _defineProperty2.default)(this, "groupCount", 1);
    (0, _defineProperty2.default)(this, "height", void 0);
    (0, _defineProperty2.default)(this, "width", void 0);
    (0, _defineProperty2.default)(this, "scaledHeight", void 0);
    (0, _defineProperty2.default)(this, "scaledWidth", void 0);
    (0, _defineProperty2.default)(this, "hasHeader", false);
    (0, _defineProperty2.default)(this, "hasFooter", false);
    (0, _defineProperty2.default)(this, "useReportingBranding", false);
    this.height = size.height;
    this.width = size.width;
    this.scaledHeight = size.height * ZOOM;
    this.scaledWidth = size.width * ZOOM;
  }

  getPdfPageOrientation() {
    return undefined;
  }

  getCssOverridesPath() {
    return undefined;
  }

  getBrowserViewport() {
    return {
      height: this.scaledHeight,
      width: this.scaledWidth
    };
  }

  getBrowserZoom() {
    return ZOOM;
  }

  getViewport() {
    return {
      height: this.height,
      width: this.width,
      zoom: ZOOM
    };
  }

  getPdfImageSize() {
    return {
      height: this.height,
      width: this.width
    };
  }

  getPdfPageSize(pageSizeParams) {
    return {
      height: this.height,
      width: this.width
    };
  }

}

exports.CanvasLayout = CanvasLayout;