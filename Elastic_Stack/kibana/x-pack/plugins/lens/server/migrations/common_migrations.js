"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commonUpdateVisLayerType = exports.commonRenameOperationsForFormula = exports.commonRemoveTimezoneDateHistogramParam = exports.commonMakeReversePaletteAsCustom = void 0;

var _lodash = require("lodash");

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const commonRenameOperationsForFormula = attributes => {
  const renameMapping = {
    avg: 'average',
    cardinality: 'unique_count',
    derivative: 'differences'
  };

  function shouldBeRenamed(op) {
    return op in renameMapping;
  }

  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  const datasourceLayers = newAttributes.state.datasourceStates.indexpattern.layers || {};
  newAttributes.state.datasourceStates.indexpattern.layers = Object.fromEntries(Object.entries(datasourceLayers).map(([layerId, layer]) => {
    return [layerId, { ...layer,
      columns: Object.fromEntries(Object.entries(layer.columns).map(([columnId, column]) => {
        const copy = { ...column,
          operationType: shouldBeRenamed(column.operationType) ? renameMapping[column.operationType] : column.operationType
        };
        return [columnId, copy];
      }))
    }];
  }));
  return newAttributes;
};

exports.commonRenameOperationsForFormula = commonRenameOperationsForFormula;

const commonRemoveTimezoneDateHistogramParam = attributes => {
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  const datasourceLayers = newAttributes.state.datasourceStates.indexpattern.layers || {};
  newAttributes.state.datasourceStates.indexpattern.layers = Object.fromEntries(Object.entries(datasourceLayers).map(([layerId, layer]) => {
    return [layerId, { ...layer,
      columns: Object.fromEntries(Object.entries(layer.columns).map(([columnId, column]) => {
        if (column.operationType === 'date_histogram' && 'params' in column) {
          const copy = { ...column,
            params: { ...column.params
            }
          };
          delete copy.params.timeZone;
          return [columnId, copy];
        }

        return [columnId, column];
      }))
    }];
  }));
  return newAttributes;
};

exports.commonRemoveTimezoneDateHistogramParam = commonRemoveTimezoneDateHistogramParam;

const commonUpdateVisLayerType = attributes => {
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  const visState = newAttributes.state.visualization;

  if ('layerId' in visState) {
    visState.layerType = _common.layerTypes.DATA;
  }

  if ('layers' in visState) {
    for (const layer of visState.layers) {
      layer.layerType = _common.layerTypes.DATA;
    }
  }

  return newAttributes;
};

exports.commonUpdateVisLayerType = commonUpdateVisLayerType;

function moveDefaultPaletteToPercentCustomInPlace(palette) {
  var _palette$params;

  if (palette !== null && palette !== void 0 && (_palette$params = palette.params) !== null && _palette$params !== void 0 && _palette$params.reverse && palette.params.name !== 'custom' && palette.params.stops) {
    // change to palette type to custom and migrate to a percentage type of mode
    palette.name = 'custom';
    palette.params.name = 'custom'; // we can make strong assumptions here:
    // because it was a default palette reversed it means that stops were the default ones
    // so when migrating, because there's no access to active data, we could leverage the
    // percent rangeType to define colorStops in percent.
    //
    // Stops should be defined, but reversed, as the previous code was rewriting them on reverse.
    //
    // The only change the user should notice should be the mode changing from number to percent
    // but the final result *must* be identical

    palette.params.rangeType = 'percent';
    const steps = palette.params.stops.length;
    palette.params.rangeMin = 0;
    palette.params.rangeMax = 80;
    palette.params.steps = steps;
    palette.params.colorStops = palette.params.stops.map(({
      color
    }, index) => ({
      color,
      stop: index * 100 / steps
    }));
    palette.params.stops = palette.params.stops.map(({
      color
    }, index) => ({
      color,
      stop: (1 + index) * 100 / steps
    }));
  }
}

const commonMakeReversePaletteAsCustom = attributes => {
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  const vizState = newAttributes.state.visualization;

  if (attributes.visualizationType !== 'lnsDatatable' && attributes.visualizationType !== 'lnsHeatmap') {
    return newAttributes;
  }

  if ('columns' in vizState) {
    for (const column of vizState.columns) {
      if (column.colorMode && column.colorMode !== 'none') {
        moveDefaultPaletteToPercentCustomInPlace(column.palette);
      }
    }
  } else {
    moveDefaultPaletteToPercentCustomInPlace(vizState.palette);
  }

  return newAttributes;
};

exports.commonMakeReversePaletteAsCustom = commonMakeReversePaletteAsCustom;