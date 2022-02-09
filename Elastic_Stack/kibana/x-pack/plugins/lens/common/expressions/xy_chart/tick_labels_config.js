"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tickLabelsConfig = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const tickLabelsConfig = {
  name: 'lens_xy_tickLabelsConfig',
  aliases: [],
  type: 'lens_xy_tickLabelsConfig',
  help: `Configure the xy chart's tick labels appearance`,
  inputTypes: ['null'],
  args: {
    x: {
      types: ['boolean'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.xAxisTickLabels.help', {
        defaultMessage: 'Specifies whether or not the tick labels of the x-axis are visible.'
      })
    },
    yLeft: {
      types: ['boolean'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.yLeftAxisTickLabels.help', {
        defaultMessage: 'Specifies whether or not the tick labels of the left y-axis are visible.'
      })
    },
    yRight: {
      types: ['boolean'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.yRightAxisTickLabels.help', {
        defaultMessage: 'Specifies whether or not the tick labels of the right y-axis are visible.'
      })
    }
  },
  fn: function fn(input, args) {
    return {
      type: 'lens_xy_tickLabelsConfig',
      ...args
    };
  }
};
exports.tickLabelsConfig = tickLabelsConfig;