"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.yAxisConfig = exports.axisTitlesVisibilityConfig = exports.axisExtentConfig = exports.axisConfig = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const axisTitlesVisibilityConfig = {
  name: 'lens_xy_axisTitlesVisibilityConfig',
  aliases: [],
  type: 'lens_xy_axisTitlesVisibilityConfig',
  help: `Configure the xy chart's axis titles appearance`,
  inputTypes: ['null'],
  args: {
    x: {
      types: ['boolean'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.xAxisTitle.help', {
        defaultMessage: 'Specifies whether or not the title of the x-axis are visible.'
      })
    },
    yLeft: {
      types: ['boolean'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.yLeftAxisTitle.help', {
        defaultMessage: 'Specifies whether or not the title of the left y-axis are visible.'
      })
    },
    yRight: {
      types: ['boolean'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.yRightAxisTitle.help', {
        defaultMessage: 'Specifies whether or not the title of the right y-axis are visible.'
      })
    }
  },
  fn: function fn(input, args) {
    return {
      type: 'lens_xy_axisTitlesVisibilityConfig',
      ...args
    };
  }
};
exports.axisTitlesVisibilityConfig = axisTitlesVisibilityConfig;
const axisExtentConfig = {
  name: 'lens_xy_axisExtentConfig',
  aliases: [],
  type: 'lens_xy_axisExtentConfig',
  help: `Configure the xy chart's axis extents`,
  inputTypes: ['null'],
  args: {
    mode: {
      types: ['string'],
      options: ['full', 'dataBounds', 'custom'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.extentMode.help', {
        defaultMessage: 'The extent mode'
      })
    },
    lowerBound: {
      types: ['number'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.extentMode.help', {
        defaultMessage: 'The extent mode'
      })
    },
    upperBound: {
      types: ['number'],
      help: _i18n.i18n.translate('xpack.lens.xyChart.extentMode.help', {
        defaultMessage: 'The extent mode'
      })
    }
  },
  fn: function fn(input, args) {
    return {
      type: 'lens_xy_axisExtentConfig',
      ...args
    };
  }
};
exports.axisExtentConfig = axisExtentConfig;
const axisConfig = {
  title: {
    types: ['string'],
    help: _i18n.i18n.translate('xpack.lens.xyChart.title.help', {
      defaultMessage: 'The axis title'
    })
  },
  hide: {
    types: ['boolean'],
    default: false,
    help: 'Show / hide axis'
  }
};
exports.axisConfig = axisConfig;
const yAxisConfig = {
  name: 'lens_xy_yConfig',
  aliases: [],
  type: 'lens_xy_yConfig',
  help: `Configure the behavior of a xy chart's y axis metric`,
  inputTypes: ['null'],
  args: {
    forAccessor: {
      types: ['string'],
      help: 'The accessor this configuration is for'
    },
    axisMode: {
      types: ['string'],
      options: ['auto', 'left', 'right'],
      help: 'The axis mode of the metric'
    },
    color: {
      types: ['string'],
      help: 'The color of the series'
    },
    lineStyle: {
      types: ['string'],
      options: ['solid', 'dotted', 'dashed'],
      help: 'The style of the reference line'
    },
    lineWidth: {
      types: ['number'],
      help: 'The width of the reference line'
    },
    icon: {
      types: ['string'],
      help: 'An optional icon used for reference lines'
    },
    iconPosition: {
      types: ['string'],
      options: ['auto', 'above', 'below', 'left', 'right'],
      help: 'The placement of the icon for the reference line'
    },
    textVisibility: {
      types: ['boolean'],
      help: 'Visibility of the label on the reference line'
    },
    fill: {
      types: ['string'],
      options: ['none', 'above', 'below'],
      help: ''
    }
  },
  fn: function fn(input, args) {
    return {
      type: 'lens_xy_yConfig',
      ...args
    };
  }
};
exports.yAxisConfig = yAxisConfig;