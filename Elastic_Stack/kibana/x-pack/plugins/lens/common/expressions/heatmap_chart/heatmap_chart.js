"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmap = exports.HEATMAP_FUNCTION_RENDERER = exports.HEATMAP_FUNCTION = void 0;

var _i18n = require("@kbn/i18n");

var _heatmap_grid = require("./heatmap_grid");

var _heatmap_legend = require("./heatmap_legend");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const HEATMAP_FUNCTION = 'lens_heatmap';
exports.HEATMAP_FUNCTION = HEATMAP_FUNCTION;
const HEATMAP_FUNCTION_RENDERER = 'lens_heatmap_renderer';
exports.HEATMAP_FUNCTION_RENDERER = HEATMAP_FUNCTION_RENDERER;
const heatmap = {
  name: HEATMAP_FUNCTION,
  type: 'render',
  help: _i18n.i18n.translate('xpack.lens.heatmap.expressionHelpLabel', {
    defaultMessage: 'Heatmap renderer'
  }),
  args: {
    title: {
      types: ['string'],
      help: _i18n.i18n.translate('xpack.lens.heatmap.titleLabel', {
        defaultMessage: 'Title'
      })
    },
    description: {
      types: ['string'],
      help: ''
    },
    xAccessor: {
      types: ['string'],
      help: ''
    },
    yAccessor: {
      types: ['string'],
      help: ''
    },
    valueAccessor: {
      types: ['string'],
      help: ''
    },
    shape: {
      types: ['string'],
      help: ''
    },
    palette: {
      default: `{theme "palette" default={system_palette name="default"} }`,
      help: '',
      types: ['palette']
    },
    legend: {
      types: [_heatmap_legend.HEATMAP_LEGEND_FUNCTION],
      help: _i18n.i18n.translate('xpack.lens.heatmapChart.legend.help', {
        defaultMessage: 'Configure the chart legend.'
      })
    },
    gridConfig: {
      types: [_heatmap_grid.HEATMAP_GRID_FUNCTION],
      help: _i18n.i18n.translate('xpack.lens.heatmapChart.gridConfig.help', {
        defaultMessage: 'Configure the heatmap layout.'
      })
    }
  },
  inputTypes: ['lens_multitable'],

  fn(data, args) {
    return {
      type: 'render',
      as: HEATMAP_FUNCTION_RENDERER,
      value: {
        data,
        args
      }
    };
  }

};
exports.heatmap = heatmap;