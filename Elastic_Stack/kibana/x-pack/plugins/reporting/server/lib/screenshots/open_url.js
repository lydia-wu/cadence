"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openUrl = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const openUrl = async (timeout, browser, index, urlOrUrlLocatorTuple, conditionalHeaders, layout, logger) => {
  // If we're moving to another page in the app, we'll want to wait for the app to tell us
  // it's loaded the next page.
  const page = index + 1;
  const waitForSelector = page > 1 ? `[data-shared-page="${page}"]` : _constants.DEFAULT_PAGELOAD_SELECTOR;
  const endTrace = (0, _.startTrace)('open_url', 'wait');
  let url;
  let locator;

  if (typeof urlOrUrlLocatorTuple === 'string') {
    url = urlOrUrlLocatorTuple;
  } else {
    [url, locator] = urlOrUrlLocatorTuple;
  }

  try {
    await browser.open(url, {
      conditionalHeaders,
      waitForSelector,
      timeout,
      locator,
      layout
    }, logger);
  } catch (err) {
    logger.error(err);
    throw new Error(_i18n.i18n.translate('xpack.reporting.screencapture.couldntLoadKibana', {
      defaultMessage: `An error occurred when trying to open the Kibana URL: {error}`,
      values: {
        error: err
      }
    }));
  }

  endTrace();
};

exports.openUrl = openUrl;