"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePdfObservableFactory = generatePdfObservableFactory;

var _lodash = require("lodash");

var _operators = require("rxjs/operators");

var _layouts = require("../../../lib/layouts");

var _screenshots = require("../../../lib/screenshots");

var _pdf = require("../../common/pdf");

var _tracker = require("./tracker");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTimeRange = urlScreenshots => {
  const grouped = (0, _lodash.groupBy)(urlScreenshots.map(u => u.timeRange));
  const values = Object.values(grouped);

  if (values.length === 1) {
    return values[0][0];
  }

  return null;
};

async function generatePdfObservableFactory(reporting) {
  const config = reporting.getConfig();
  const captureConfig = config.get('capture');
  const {
    browserDriverFactory
  } = await reporting.getPluginStartDeps();
  return function generatePdfObservable(logger, title, urls, browserTimezone, conditionalHeaders, layoutParams, logo) {
    const tracker = (0, _tracker.getTracker)();
    tracker.startLayout();
    const layout = (0, _layouts.createLayout)(captureConfig, layoutParams);
    logger.debug(`Layout: width=${layout.width} height=${layout.height}`);
    tracker.endLayout();
    tracker.startScreenshots();
    const screenshots$ = (0, _screenshots.getScreenshots$)(captureConfig, browserDriverFactory, {
      logger,
      urlsOrUrlLocatorTuples: urls,
      conditionalHeaders,
      layout,
      browserTimezone
    }).pipe((0, _operators.mergeMap)(async results => {
      tracker.endScreenshots();
      tracker.startSetup();
      const pdfOutput = new _pdf.PdfMaker(layout, logo);

      if (title) {
        const timeRange = getTimeRange(results);
        title += timeRange ? ` - ${timeRange}` : '';
        pdfOutput.setTitle(title);
      }

      tracker.endSetup();
      results.forEach(r => {
        r.screenshots.forEach(screenshot => {
          var _screenshot$title, _screenshot$descripti;

          logger.debug(`Adding image to PDF. Image size: ${screenshot.data.byteLength}`); // prettier-ignore

          tracker.startAddImage();
          tracker.endAddImage();
          pdfOutput.addImage(screenshot.data, {
            title: (_screenshot$title = screenshot.title) !== null && _screenshot$title !== void 0 ? _screenshot$title : undefined,
            description: (_screenshot$descripti = screenshot.description) !== null && _screenshot$descripti !== void 0 ? _screenshot$descripti : undefined
          });
        });
      });
      let buffer = null;

      try {
        var _buffer$byteLength, _buffer;

        tracker.startCompile();
        logger.debug(`Compiling PDF using "${layout.id}" layout...`);
        pdfOutput.generate();
        tracker.endCompile();
        tracker.startGetBuffer();
        logger.debug(`Generating PDF Buffer...`);
        buffer = await pdfOutput.getBuffer();
        const byteLength = (_buffer$byteLength = (_buffer = buffer) === null || _buffer === void 0 ? void 0 : _buffer.byteLength) !== null && _buffer$byteLength !== void 0 ? _buffer$byteLength : 0;
        logger.debug(`PDF buffer byte length: ${byteLength}`);
        tracker.setByteLength(byteLength);
        tracker.endGetBuffer();
      } catch (err) {
        logger.error(`Could not generate the PDF buffer!`);
        logger.error(err);
      }

      tracker.end();
      return {
        buffer,
        warnings: results.reduce((found, current) => {
          if (current.error) {
            found.push(current.error.message);
          }

          if (current.renderErrors) {
            found.push(...current.renderErrors);
          }

          return found;
        }, [])
      };
    }));
    return screenshots$;
  };
}