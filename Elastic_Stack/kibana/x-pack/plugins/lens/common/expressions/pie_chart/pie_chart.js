"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pie = void 0;

var _charts = require("@elastic/charts");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const pie = {
  name: 'lens_pie',
  type: 'render',
  help: _i18n.i18n.translate('xpack.lens.pie.expressionHelpLabel', {
    defaultMessage: 'Pie renderer'
  }),
  args: {
    title: {
      types: ['string'],
      help: 'The chart title.'
    },
    description: {
      types: ['string'],
      help: ''
    },
    groups: {
      types: ['string'],
      multi: true,
      help: ''
    },
    metric: {
      types: ['string'],
      help: ''
    },
    shape: {
      types: ['string'],
      options: ['pie', 'donut', 'treemap'],
      help: ''
    },
    hideLabels: {
      types: ['boolean'],
      help: ''
    },
    numberDisplay: {
      types: ['string'],
      options: ['hidden', 'percent', 'value'],
      help: ''
    },
    categoryDisplay: {
      types: ['string'],
      options: ['default', 'inside', 'hide'],
      help: ''
    },
    legendDisplay: {
      types: ['string'],
      options: ['default', 'show', 'hide'],
      help: ''
    },
    nestedLegend: {
      types: ['boolean'],
      help: ''
    },
    legendMaxLines: {
      types: ['number'],
      help: ''
    },
    truncateLegend: {
      types: ['boolean'],
      help: ''
    },
    legendPosition: {
      types: ['string'],
      options: [_charts.Position.Top, _charts.Position.Right, _charts.Position.Bottom, _charts.Position.Left],
      help: ''
    },
    percentDecimals: {
      types: ['number'],
      help: ''
    },
    palette: {
      default: `{theme "palette" default={system_palette name="default"} }`,
      help: '',
      types: ['palette']
    }
  },
  inputTypes: ['lens_multitable'],

  fn(data, args) {
    return {
      type: 'render',
      as: 'lens_pie_renderer',
      value: {
        data,
        args
      }
    };
  }

};
exports.pie = pie;