"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.config = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _i18n = require("@kbn/i18n");

var _plugin = require("./plugin");

var _config = require("../config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  // exposeToBrowser specifies kibana.yml settings to expose to the browser
  // the value `true` in this context signals configuration is exposed to browser
  exposeToBrowser: {
    enabled: true,
    showMapVisualizationTypes: true,
    showMapsInspectorAdapter: true,
    preserveDrawingBuffer: true
  },
  schema: _config.configSchema,
  deprecations: ({
    deprecate
  }) => [deprecate('enabled', '8.0.0', {
    level: 'critical'
  }), (completeConfig, rootPath, addDeprecation) => {
    if (_lodash.default.get(completeConfig, 'xpack.maps.showMapVisualizationTypes') === undefined) {
      return completeConfig;
    }

    addDeprecation({
      configPath: 'xpack.maps.showMapVisualizationTypes',
      level: 'critical',
      message: _i18n.i18n.translate('xpack.maps.deprecation.showMapVisualizationTypes.message', {
        defaultMessage: 'xpack.maps.showMapVisualizationTypes is deprecated and is no longer used'
      }),
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.maps.deprecation.showMapVisualizationTypes.step1', {
          defaultMessage: 'Remove "xpack.maps.showMapVisualizationTypes" in the Kibana config file, CLI flag, or environment variable (in Docker only).'
        })]
      }
    });
    return completeConfig;
  }, (completeConfig, rootPath, addDeprecation, {
    branch
  }) => {
    if (_lodash.default.get(completeConfig, 'map.proxyElasticMapsServiceInMaps') === undefined) {
      return completeConfig;
    }

    addDeprecation({
      configPath: 'map.proxyElasticMapsServiceInMaps',
      level: 'critical',
      documentationUrl: `https://www.elastic.co/guide/en/kibana/${branch}/maps-connect-to-ems.html#elastic-maps-server`,
      message: _i18n.i18n.translate('xpack.maps.deprecation.proxyEMS.message', {
        defaultMessage: 'map.proxyElasticMapsServiceInMaps is deprecated and is no longer used'
      }),
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.maps.deprecation.proxyEMS.step1', {
          defaultMessage: 'Remove "map.proxyElasticMapsServiceInMaps" in the Kibana config file, CLI flag, or environment variable (in Docker only).'
        }), _i18n.i18n.translate('xpack.maps.deprecation.proxyEMS.step2', {
          defaultMessage: 'Host Elastic Maps Service locally.'
        })]
      }
    });
    return completeConfig;
  }, (completeConfig, rootPath, addDeprecation) => {
    if (_lodash.default.get(completeConfig, 'map.regionmap') === undefined) {
      return completeConfig;
    }

    addDeprecation({
      configPath: 'map.regionmap',
      level: 'critical',
      message: _i18n.i18n.translate('xpack.maps.deprecation.regionmap.message', {
        defaultMessage: 'map.regionmap is deprecated and is no longer used'
      }),
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.maps.deprecation.regionmap.step1', {
          defaultMessage: 'Remove "map.regionmap" in the Kibana config file, CLI flag, or environment variable (in Docker only).'
        }), _i18n.i18n.translate('xpack.maps.deprecation.regionmap.step2', {
          defaultMessage: 'Use "Upload GeoJSON" to upload each layer defined by "map.regionmap.layers".'
        }), _i18n.i18n.translate('xpack.maps.deprecation.regionmap.step3', {
          defaultMessage: 'Update all maps with "Configured GeoJSON" layers. Use Choropleth layer wizard to build a replacement layer. Delete "Configured GeoJSON" layer from your map.'
        })]
      }
    });
    return completeConfig;
  }]
};
exports.config = config;

const plugin = initializerContext => new _plugin.MapsPlugin(initializerContext);

exports.plugin = plugin;