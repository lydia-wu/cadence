"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legendConfig = void 0;

var _charts = require("@elastic/charts");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const legendConfig = {
  name: 'lens_xy_legendConfig',
  aliases: [],
  type: 'lens_xy_legendConfig',
  help: `Configure the xy chart's legend`,
  inputTypes: ['null'],
  args: {
    isVisible: {
      types: ['boolean'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.isVisible.help', {
        defaultMessage: 'Specifies whether or not the legend is visible.'
      })
    },
    position: {
      types: ['string'],
      options: [_charts.Position.Top, _charts.Position.Right, _charts.Position.Bottom, _charts.Position.Left],
      help: _i18n.i18n.translate('xpack.lens.xyChart.position.help', {
        defaultMessage: 'Specifies the legend position.'
      })
    },
    showSingleSeries: {
      types: ['boolean'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.showSingleSeries.help', {
        defaultMessage: 'Specifies whether a legend with just a single entry should be shown'
      })
    },
    isInside: {
      types: ['boolean'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.isInside.help', {
        defaultMessage: 'Specifies whether a legend is inside the chart'
      })
    },
    horizontalAlignment: {
      types: ['string'],
      options: [_charts.HorizontalAlignment.Right, _charts.HorizontalAlignment.Left],
      help: _i18n.i18n.translate('xpack.lens.xyChart.horizontalAlignment.help', {
        defaultMessage: 'Specifies the horizontal alignment of the legend when it is displayed inside chart.'
      })
    },
    verticalAlignment: {
      types: ['string'],
      options: [_charts.VerticalAlignment.Top, _charts.VerticalAlignment.Bottom],
      help: _i18n.i18n.translate('xpack.lens.xyChart.verticalAlignment.help', {
        defaultMessage: 'Specifies the vertical alignment of the legend when it is displayed inside chart.'
      })
    },
    floatingColumns: {
      types: ['number'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.floatingColumns.help', {
        defaultMessage: 'Specifies the number of columns when legend is displayed inside chart.'
      })
    },
    maxLines: {
      types: ['number'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.maxLines.help', {
        defaultMessage: 'Specifies the number of lines per legend item.'
      })
    },
    shouldTruncate: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('xpack.lens.xyChart.shouldTruncate.help', {
        defaultMessage: 'Specifies whether the legend items will be truncated or not'
      })
    }
  },
  fn: function fn(input, args) {
    return {
      type: 'lens_xy_legendConfig',
      ...args
    };
  }
};
exports.legendConfig = legendConfig;