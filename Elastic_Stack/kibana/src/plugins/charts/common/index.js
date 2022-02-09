"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COLOR_MAPPING_SETTING = void 0;
Object.defineProperty(exports, "ColorMode", {
  enumerable: true,
  get: function () {
    return _static.ColorMode;
  }
});
Object.defineProperty(exports, "ColorSchemas", {
  enumerable: true,
  get: function () {
    return _static.ColorSchemas;
  }
});
Object.defineProperty(exports, "LabelRotation", {
  enumerable: true,
  get: function () {
    return _static.LabelRotation;
  }
});
Object.defineProperty(exports, "colorSchemas", {
  enumerable: true,
  get: function () {
    return _static.colorSchemas;
  }
});
Object.defineProperty(exports, "defaultCountLabel", {
  enumerable: true,
  get: function () {
    return _static.defaultCountLabel;
  }
});
Object.defineProperty(exports, "defaultCustomColors", {
  enumerable: true,
  get: function () {
    return _palette.defaultCustomColors;
  }
});
Object.defineProperty(exports, "getHeatmapColors", {
  enumerable: true,
  get: function () {
    return _static.getHeatmapColors;
  }
});
Object.defineProperty(exports, "palette", {
  enumerable: true,
  get: function () {
    return _palette.palette;
  }
});
Object.defineProperty(exports, "paletteIds", {
  enumerable: true,
  get: function () {
    return _constants.paletteIds;
  }
});
Object.defineProperty(exports, "systemPalette", {
  enumerable: true,
  get: function () {
    return _palette.systemPalette;
  }
});
Object.defineProperty(exports, "truncatedColorMaps", {
  enumerable: true,
  get: function () {
    return _static.truncatedColorMaps;
  }
});
Object.defineProperty(exports, "truncatedColorSchemas", {
  enumerable: true,
  get: function () {
    return _static.truncatedColorSchemas;
  }
});
Object.defineProperty(exports, "vislibColorMaps", {
  enumerable: true,
  get: function () {
    return _static.vislibColorMaps;
  }
});

var _palette = require("./palette");

var _constants = require("./constants");

var _static = require("./static");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const COLOR_MAPPING_SETTING = 'visualization:colorMapping';
exports.COLOR_MAPPING_SETTING = COLOR_MAPPING_SETTING;