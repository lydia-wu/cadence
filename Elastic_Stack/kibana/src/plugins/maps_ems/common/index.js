"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_EMS_TILE_API_URL = exports.DEFAULT_EMS_ROADMAP_ID = exports.DEFAULT_EMS_ROADMAP_DESATURATED_ID = exports.DEFAULT_EMS_LANDING_PAGE_URL = exports.DEFAULT_EMS_FONT_LIBRARY_URL = exports.DEFAULT_EMS_FILE_API_URL = exports.DEFAULT_EMS_DARKMAP_ID = void 0;
Object.defineProperty(exports, "ORIGIN", {
  enumerable: true,
  get: function () {
    return _origin.ORIGIN;
  }
});
exports.TMS_IN_YML_ID = void 0;

var _origin = require("./origin");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const TMS_IN_YML_ID = 'TMS in config/kibana.yml';
exports.TMS_IN_YML_ID = TMS_IN_YML_ID;
const DEFAULT_EMS_FILE_API_URL = 'https://vector.maps.elastic.co';
exports.DEFAULT_EMS_FILE_API_URL = DEFAULT_EMS_FILE_API_URL;
const DEFAULT_EMS_TILE_API_URL = 'https://tiles.maps.elastic.co';
exports.DEFAULT_EMS_TILE_API_URL = DEFAULT_EMS_TILE_API_URL;
const DEFAULT_EMS_LANDING_PAGE_URL = 'https://maps.elastic.co/v7.16';
exports.DEFAULT_EMS_LANDING_PAGE_URL = DEFAULT_EMS_LANDING_PAGE_URL;
const DEFAULT_EMS_FONT_LIBRARY_URL = 'https://tiles.maps.elastic.co/fonts/{fontstack}/{range}.pbf';
exports.DEFAULT_EMS_FONT_LIBRARY_URL = DEFAULT_EMS_FONT_LIBRARY_URL;
const DEFAULT_EMS_ROADMAP_ID = 'road_map';
exports.DEFAULT_EMS_ROADMAP_ID = DEFAULT_EMS_ROADMAP_ID;
const DEFAULT_EMS_ROADMAP_DESATURATED_ID = 'road_map_desaturated';
exports.DEFAULT_EMS_ROADMAP_DESATURATED_ID = DEFAULT_EMS_ROADMAP_DESATURATED_ID;
const DEFAULT_EMS_DARKMAP_ID = 'dark_map';
exports.DEFAULT_EMS_DARKMAP_ID = DEFAULT_EMS_DARKMAP_ID;