"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xyChart = void 0;

var _i18n = require("@kbn/i18n");

var _fitting_function = require("./fitting_function");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const xyChart = {
  name: 'lens_xy_chart',
  type: 'render',
  inputTypes: ['lens_multitable', 'kibana_context', 'null'],
  help: _i18n.i18n.translate('xpack.lens.xyChart.help', {
    defaultMessage: 'An X/Y chart'
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
    xTitle: {
      types: ['string'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.xTitle.help', {
        defaultMessage: 'X axis title'
      })
    },
    yTitle: {
      types: ['string'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.yLeftTitle.help', {
        defaultMessage: 'Y left axis title'
      })
    },
    yRightTitle: {
      types: ['string'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.yRightTitle.help', {
        defaultMessage: 'Y right axis title'
      })
    },
    yLeftExtent: {
      types: ['lens_xy_axisExtentConfig'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.yLeftExtent.help', {
        defaultMessage: 'Y left axis extents'
      })
    },
    yRightExtent: {
      types: ['lens_xy_axisExtentConfig'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.yRightExtent.help', {
        defaultMessage: 'Y right axis extents'
      })
    },
    legend: {
      types: ['lens_xy_legendConfig'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.legend.help', {
        defaultMessage: 'Configure the chart legend.'
      })
    },
    fittingFunction: {
      types: ['string'],
      options: [..._fitting_function.fittingFunctionDefinitions.map(({
        id
      }) => id)],
      help: _i18n.i18n.translate('xpack.lens.xyChart.fittingFunction.help', {
        defaultMessage: 'Define how missing values are treated'
      })
    },
    valueLabels: {
      types: ['string'],
      options: ['hide', 'inside'],
      help: ''
    },
    tickLabelsVisibilitySettings: {
      types: ['lens_xy_tickLabelsConfig'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.tickLabelsSettings.help', {
        defaultMessage: 'Show x and y axes tick labels'
      })
    },
    labelsOrientation: {
      types: ['lens_xy_labelsOrientationConfig'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.labelsOrientation.help', {
        defaultMessage: 'Defines the rotation of the axis labels'
      })
    },
    gridlinesVisibilitySettings: {
      types: ['lens_xy_gridlinesConfig'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.gridlinesSettings.help', {
        defaultMessage: 'Show x and y axes gridlines'
      })
    },
    axisTitlesVisibilitySettings: {
      types: ['lens_xy_axisTitlesVisibilityConfig'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.axisTitlesSettings.help', {
        defaultMessage: 'Show x and y axes titles'
      })
    },
    layers: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      types: ['lens_xy_layer'],
      help: 'Layers of visual series',
      multi: true
    },
    curveType: {
      types: ['string'],
      options: ['LINEAR', 'CURVE_MONOTONE_X'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.curveType.help', {
        defaultMessage: 'Define how curve type is rendered for a line chart'
      })
    },
    fillOpacity: {
      types: ['number'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.fillOpacity.help', {
        defaultMessage: 'Define the area chart fill opacity'
      })
    },
    hideEndzones: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('xpack.lens.xyChart.hideEndzones.help', {
        defaultMessage: 'Hide endzone markers for partial data'
      })
    },
    valuesInLegend: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('xpack.lens.xyChart.valuesInLegend.help', {
        defaultMessage: 'Show values in legend'
      })
    }
  },

  fn(data, args) {
    return {
      type: 'render',
      as: 'lens_xy_chart_renderer',
      value: {
        data,
        args
      }
    };
  }

};
exports.xyChart = xyChart;