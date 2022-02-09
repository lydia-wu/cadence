"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRenderErrors = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getRenderErrors = async (browser, layout, logger) => {
  const endTrace = (0, _.startTrace)('get_render_errors', 'read');
  logger.debug('reading render errors');
  const errorsFound = await browser.evaluate({
    fn: (errorSelector, errorAttribute) => {
      const visualizations = Array.from(document.querySelectorAll(errorSelector));
      const errors = [];
      visualizations.forEach(visualization => {
        const errorMessage = visualization.getAttribute(errorAttribute);

        if (errorMessage) {
          errors.push(errorMessage);
        }
      });
      return errors.length ? errors : undefined;
    },
    args: [layout.selectors.renderError, layout.selectors.renderErrorAttribute]
  }, {
    context: _constants.CONTEXT_GETRENDERERRORS
  }, logger);
  endTrace();

  if (errorsFound !== null && errorsFound !== void 0 && errorsFound.length) {
    logger.warning(_i18n.i18n.translate('xpack.reporting.screencapture.renderErrorsFound', {
      defaultMessage: 'Found {count} error messages. See report object for more information.',
      values: {
        count: errorsFound.length
      }
    }));
  }

  return errorsFound;
};

exports.getRenderErrors = getRenderErrors;