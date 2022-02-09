"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmapLegendConfig = exports.HEATMAP_LEGEND_FUNCTION = void 0;

var _charts = require("@elastic/charts");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const HEATMAP_LEGEND_FUNCTION = 'lens_heatmap_legendConfig';
exports.HEATMAP_LEGEND_FUNCTION = HEATMAP_LEGEND_FUNCTION;
/**
 * TODO check if it's possible to make a shared function
 * based on the XY chart
 */

const heatmapLegendConfig = {
  name: HEATMAP_LEGEND_FUNCTION,
  aliases: [],
  type: HEATMAP_LEGEND_FUNCTION,
  help: `Configure the heatmap chart's legend`,
  inputTypes: ['null'],
  args: {
    isVisible: {
      types: ['boolean'],
      help: _i18n.i18n.translate('xpack.lens.heatmapChart.legend.isVisible.help', {
        defaultMessage: 'Specifies whether or not the legend is visible.'
      })
    },
    position: {
      types: ['string'],
      options: [_charts.Position.Top, _charts.Position.Right, _charts.Position.Bottom, _charts.Position.Left],
      help: _i18n.i18n.translate('xpack.lens.heatmapChart.legend.position.help', {
        defaultMessage: 'Specifies the legend position.'
      })
    },
    maxLines: {
      types: ['number'],
      help: _i18n.i18n.translate('xpack.lens.heatmapChart.legend.maxLines.help', {
        defaultMessage: 'Specifies the number of lines per legend item.'
      })
    },
    shouldTruncate: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('xpack.lens.heatmapChart.legend.shouldTruncate.help', {
        defaultMessage: 'Specifies whether or not the legend items should be truncated.'
      })
    }
  },

  fn(input, args) {
    return {
      type: HEATMAP_LEGEND_FUNCTION,
      ...args
    };
  }

};
exports.heatmapLegendConfig = heatmapLegendConfig;