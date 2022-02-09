"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.math = exports.errors = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _tinymath = require("@kbn/tinymath");

var _expression_types = require("../../expression_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const TINYMATH = '`TinyMath`';
const TINYMATH_URL = 'https://www.elastic.co/guide/en/kibana/current/canvas-tinymath-functions.html';

function pivotObjectArray(rows, columns) {
  const columnNames = columns || Object.keys(rows[0]);

  if (!columnNames.every(_lodash.isString)) {
    throw new Error('Columns should be an array of strings');
  }

  const columnValues = (0, _lodash.map)(columnNames, name => (0, _lodash.map)(rows, name));
  return (0, _lodash.zipObject)(columnNames, columnValues);
}

const errors = {
  emptyExpression: () => new Error(_i18n.i18n.translate('expressions.functions.math.emptyExpressionErrorMessage', {
    defaultMessage: 'Empty expression'
  })),
  tooManyResults: () => new Error(_i18n.i18n.translate('expressions.functions.math.tooManyResultsErrorMessage', {
    defaultMessage: 'Expressions must return a single number. Try wrapping your expression in {mean} or {sum}',
    values: {
      mean: 'mean()',
      sum: 'sum()'
    }
  })),
  executionFailed: () => new Error(_i18n.i18n.translate('expressions.functions.math.executionFailedErrorMessage', {
    defaultMessage: 'Failed to execute math expression. Check your column names'
  })),
  emptyDatatable: () => new Error(_i18n.i18n.translate('expressions.functions.math.emptyDatatableErrorMessage', {
    defaultMessage: 'Empty datatable'
  }))
};
exports.errors = errors;
const fallbackValue = {
  null: null,
  zero: 0,
  false: false
};
const math = {
  name: 'math',
  type: undefined,
  inputTypes: ['number', 'datatable'],
  help: _i18n.i18n.translate('expressions.functions.mathHelpText', {
    defaultMessage: 'Interprets a {TINYMATH} math expression using a {TYPE_NUMBER} or {DATATABLE} as {CONTEXT}. ' + 'The {DATATABLE} columns are available by their column name. ' + 'If the {CONTEXT} is a number it is available as {value}.',
    values: {
      TINYMATH,
      CONTEXT: '_context_',
      DATATABLE: '`datatable`',
      value: '`value`',
      TYPE_NUMBER: '`number`'
    }
  }),
  args: {
    expression: {
      aliases: ['_'],
      types: ['string'],
      help: _i18n.i18n.translate('expressions.functions.math.args.expressionHelpText', {
        defaultMessage: 'An evaluated {TINYMATH} expression. See {TINYMATH_URL}.',
        values: {
          TINYMATH,
          TINYMATH_URL
        }
      })
    },
    onError: {
      types: ['string'],
      options: ['throw', 'false', 'zero', 'null'],
      help: _i18n.i18n.translate('expressions.functions.math.args.onErrorHelpText', {
        defaultMessage: "In case the {TINYMATH} evaluation fails or returns NaN, the return value is specified by onError. When `'throw'`, it will throw an exception, terminating expression execution (default).",
        values: {
          TINYMATH
        }
      })
    }
  },
  fn: (input, args) => {
    const {
      expression,
      onError
    } = args;
    const onErrorValue = onError !== null && onError !== void 0 ? onError : 'throw';

    if (!expression || expression.trim() === '') {
      throw errors.emptyExpression();
    } // Use unique ID if available, otherwise fall back to names


    const mathContext = (0, _expression_types.isDatatable)(input) ? pivotObjectArray(input.rows, input.columns.map(col => col.id)) : {
      value: input
    };

    try {
      const result = (0, _tinymath.evaluate)(expression, mathContext);

      if (Array.isArray(result)) {
        if (result.length === 1) {
          return result[0];
        }

        throw errors.tooManyResults();
      }

      if (isNaN(result)) {
        // make TS happy
        if (onErrorValue !== 'throw' && onErrorValue in fallbackValue) {
          return fallbackValue[onErrorValue];
        }

        throw errors.executionFailed();
      }

      return result;
    } catch (e) {
      if (onErrorValue !== 'throw' && onErrorValue in fallbackValue) {
        return fallbackValue[onErrorValue];
      }

      if ((0, _expression_types.isDatatable)(input) && input.rows.length === 0) {
        throw errors.emptyDatatable();
      } else {
        throw e;
      }
    }
  }
};
exports.math = math;