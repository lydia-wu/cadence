"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.layerConfig = void 0;

var _constants = require("../../constants");

var _axis_config = require("./axis_config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const layerConfig = {
  name: 'lens_xy_layer',
  aliases: [],
  type: 'lens_xy_layer',
  help: `Configure a layer in the xy chart`,
  inputTypes: ['null'],
  args: { ..._axis_config.axisConfig,
    layerId: {
      types: ['string'],
      help: ''
    },
    xAccessor: {
      types: ['string'],
      help: ''
    },
    layerType: {
      types: ['string'],
      options: Object.values(_constants.layerTypes),
      help: ''
    },
    seriesType: {
      types: ['string'],
      options: ['bar', 'line', 'area', 'bar_stacked', 'area_stacked', 'bar_percentage_stacked', 'area_percentage_stacked'],
      help: 'The type of chart to display.'
    },
    xScaleType: {
      options: ['ordinal', 'linear', 'time'],
      help: 'The scale type of the x axis',
      default: 'ordinal'
    },
    isHistogram: {
      types: ['boolean'],
      default: false,
      help: 'Whether to layout the chart as a histogram'
    },
    yScaleType: {
      options: ['log', 'sqrt', 'linear', 'time'],
      help: 'The scale type of the y axes',
      default: 'linear'
    },
    splitAccessor: {
      types: ['string'],
      help: 'The column to split by',
      multi: false
    },
    accessors: {
      types: ['string'],
      help: 'The columns to display on the y axis.',
      multi: true
    },
    yConfig: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      types: ['lens_xy_yConfig'],
      help: 'Additional configuration for y axes',
      multi: true
    },
    columnToLabel: {
      types: ['string'],
      help: 'JSON key-value pairs of column ID to label'
    },
    palette: {
      default: `{theme "palette" default={system_palette name="default"} }`,
      help: '',
      types: ['palette']
    }
  },
  fn: function fn(input, args) {
    return {
      type: 'lens_xy_layer',
      ...args
    };
  }
};
exports.layerConfig = layerConfig;