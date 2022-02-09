"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePngObservableFactory = generatePngObservableFactory;

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _operators = require("rxjs/operators");

var _layouts = require("../../lib/layouts");

var _screenshots = require("../../lib/screenshots");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function generatePngObservableFactory(reporting) {
  const config = reporting.getConfig();
  const captureConfig = config.get('capture');
  const {
    browserDriverFactory
  } = await reporting.getPluginStartDeps();
  return function generatePngObservable(logger, urlOrUrlLocatorTuple, browserTimezone, conditionalHeaders, layoutParams) {
    const apmTrans = _elasticApmNode.default.startTransaction('reporting generate_png', 'reporting');

    const apmLayout = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('create_layout', 'setup');

    if (!layoutParams || !layoutParams.dimensions) {
      throw new Error(`LayoutParams.Dimensions is undefined.`);
    }

    const layout = new _layouts.PreserveLayout(layoutParams.dimensions, layoutParams.selectors);
    if (apmLayout) apmLayout.end();
    const apmScreenshots = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('screenshots_pipeline', 'setup');
    let apmBuffer;
    const screenshots$ = (0, _screenshots.getScreenshots$)(captureConfig, browserDriverFactory, {
      logger,
      urlsOrUrlLocatorTuples: [urlOrUrlLocatorTuple],
      conditionalHeaders,
      layout,
      browserTimezone
    }).pipe((0, _operators.tap)(() => {
      var _apmTrans$startSpan;

      apmScreenshots === null || apmScreenshots === void 0 ? void 0 : apmScreenshots.end();
      apmBuffer = (_apmTrans$startSpan = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('get_buffer', 'output')) !== null && _apmTrans$startSpan !== void 0 ? _apmTrans$startSpan : null;
    }), (0, _operators.map)(results => ({
      buffer: results[0].screenshots[0].data,
      warnings: results.reduce((found, current) => {
        if (current.error) {
          found.push(current.error.message);
        }

        if (current.renderErrors) {
          found.push(...current.renderErrors);
        }

        return found;
      }, [])
    })), (0, _operators.tap)(({
      buffer
    }) => {
      logger.debug(`PNG buffer byte length: ${buffer.byteLength}`);
      apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.setLabel('byte_length', buffer.byteLength, false);
    }), (0, _operators.finalize)(() => {
      var _apmBuffer;

      (_apmBuffer = apmBuffer) === null || _apmBuffer === void 0 ? void 0 : _apmBuffer.end();
      apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.end();
    }));
    return screenshots$;
  };
}