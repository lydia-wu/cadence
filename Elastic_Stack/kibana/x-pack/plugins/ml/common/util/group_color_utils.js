"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabColor = tabColor;

var _theme = require("@kbn/ui-shared-deps-src/theme");

var _string_utils = require("./string_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const COLORS = [_theme.euiDarkVars.euiColorVis0, _theme.euiDarkVars.euiColorVis1, _theme.euiDarkVars.euiColorVis2, _theme.euiDarkVars.euiColorVis3, _theme.euiDarkVars.euiColorVis4, _theme.euiDarkVars.euiColorVis5, _theme.euiDarkVars.euiColorVis6, _theme.euiDarkVars.euiColorVis7, _theme.euiDarkVars.euiColorVis8, _theme.euiDarkVars.euiColorVis9, _theme.euiDarkVars.euiColorDarkShade, _theme.euiDarkVars.euiColorPrimary];
const colorMap = {};

function tabColor(name) {
  if (colorMap[name] === undefined) {
    const n = (0, _string_utils.stringHash)(name);
    const color = COLORS[n % COLORS.length];
    colorMap[name] = color;
    return color;
  } else {
    return colorMap[name];
  }
}